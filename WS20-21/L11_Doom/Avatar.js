"use strict";
var L11_Doom;
(function (L11_Doom) {
    class Avatar extends ƒ.Node {
        constructor() {
            super("Avatar");
            // private ctrRotation: ƒ.Control = new ƒ.Control("AvatarRotation", -0.3, ƒ.CONTROL_TYPE.PROPORTIONAL);
            this.ctrSideways = new ƒ.Control("AvatarRotation", 0.5, 0 /* PROPORTIONAL */);
            this.ctrForward = new ƒ.Control("AvatarSpeed", 0.5, 0 /* PROPORTIONAL */);
            let cmpCamera = new ƒ.ComponentCamera();
            cmpCamera.projectCentral(1, 45, ƒ.FIELD_OF_VIEW.DIAGONAL, 0.2, 10000);
            cmpCamera.pivot.translate(ƒ.Vector3.Y(1.7));
            cmpCamera.backgroundColor = ƒ.Color.CSS("darkblue");
            this.addComponent(cmpCamera);
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translateZ(15);
            this.mtxLocal.rotateY(180);
            this.ctrForward.setDelay(100);
            this.ctrSideways.setDelay(50);
        }
        update() {
            this.move();
        }
        rotate(_event) {
            this.mtxLocal.rotateY(_event.movementX * -0.15);
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
            let bouncedOff = L11_Doom.bounceOffWalls(L11_Doom.walls.getChildren());
            if (bouncedOff.length < 2)
                return;
            bouncedOff = L11_Doom.bounceOffWalls(bouncedOff);
            if (bouncedOff.length == 0)
                return;
            console.log("Stuck!");
            this.mtxLocal.translation = posOld;
        }
    }
    L11_Doom.Avatar = Avatar;
})(L11_Doom || (L11_Doom = {}));
//# sourceMappingURL=Avatar.js.map