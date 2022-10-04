"use strict";
var L16_Doom_Audio;
(function (L16_Doom_Audio) {
    class Avatar extends ƒ.Node {
        constructor() {
            super("Avatar");
            this.ctrSideways = new ƒ.Control("AvatarRotation", 0.5, 0 /* PROPORTIONAL */);
            this.ctrForward = new ƒ.Control("AvatarSpeed", 0.5, 0 /* PROPORTIONAL */);
            this.yAcc = -0.025;
            this.hdlJump = (_event) => {
                console.log(_event.code);
                if (_event.code == ƒ.KEYBOARD_CODE.SPACE && this.isGrounded) {
                    console.log("Jump");
                    this.ySpeed = 0.4;
                    this.isGrounded = false;
                }
            };
            this.head = new ƒ.Node("Head");
            this.addChild(this.head);
            this.head.addComponent(new ƒ.ComponentTransform());
            this.head.mtxLocal.translateY(1.7);
            let cmpCamera = new ƒ.ComponentCamera();
            cmpCamera.projectCentral(1, 45, ƒ.FIELD_OF_VIEW.DIAGONAL, 0.2, 100);
            cmpCamera.backgroundColor = ƒ.Color.CSS("darkblue");
            this.head.addComponent(cmpCamera);
            let cmpAListener = new ƒ.ComponentAudioListener();
            this.head.addComponent(cmpAListener);
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translateZ(15);
            this.mtxLocal.rotateY(180);
            this.ctrForward.setDelay(100);
            this.ctrSideways.setDelay(50);
            this.isGrounded = true;
        }
        update() {
            // console.log(this.mtxLocal.translation.y);
            this.verticalMove();
            this.move();
        }
        rotate(_event) {
            this.mtxLocal.rotateY(_event.movementX * -0.15);
        }
        verticalMove() {
            if (this.isGrounded) {
                return;
            }
            let yPosition = this.mtxLocal.translation.y;
            yPosition += this.ySpeed;
            if (yPosition < 0) {
                yPosition = 0;
                this.ySpeed = 0;
                this.mtxLocal.translateY(-this.mtxLocal.translation.y);
                this.isGrounded = true;
                return;
            }
            this.mtxLocal.translateY(this.ySpeed);
            this.ySpeed += this.yAcc;
        }
        move() {
            let posOld = this.mtxLocal.translation;
            this.ctrForward.setInput(ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
                + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]));
            this.ctrSideways.setInput(ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])
                + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]));
            this.mtxLocal.translateZ(this.ctrForward.getOutput());
            this.mtxLocal.translateX(this.ctrSideways.getOutput());
            // this.mtxLocal.rotateY(this.ctrRotation.getOutput());
            let bouncedOff = L16_Doom_Audio.bounceOffWalls(L16_Doom_Audio.walls.getChildren());
            if (bouncedOff.length < 2)
                return;
            bouncedOff = L16_Doom_Audio.bounceOffWalls(bouncedOff);
            if (bouncedOff.length == 0)
                return;
            console.log("Stuck!");
            this.mtxLocal.translation = posOld;
        }
    }
    L16_Doom_Audio.Avatar = Avatar;
})(L16_Doom_Audio || (L16_Doom_Audio = {}));
//# sourceMappingURL=Avatar.js.map