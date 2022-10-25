"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    CustomComponentScript.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Luigi extends ƒ.Node {
        constructor(_texture) {
            super("LuigiPosition");
            this.ySpeed = 0;
            this.spriteSheedPath = "./Sprites/Luigi_Moves_Sheet2.png";
            this.moveSpeed = 4;
            this.jumpForce = 5;
            this.resolution = 16;
            this.addComponent(new ƒ.ComponentTransform);
            this.pos = this.mtxLocal;
            this.node = new ƒAid.NodeSprite("Luigi");
            this.node.addComponent(new ƒ.ComponentTransform);
            // scaling doesn't work as expected
            // this.node.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(2);
            this.node.mtxLocal.rotation = ƒ.Vector3.Y(180);
            this.node.mtxLocal.translateY(-0.05);
            this.appendChild(this.node);
            let texture = _texture;
            // let texture: ƒ.TextureImage = new ƒ.TextureImage();
            // texture.load(this.spriteSheedPath);
            let coat = new ƒ.CoatTextured(ƒ.Color.CSS("white"), texture);
            this.ctrSideways = new ƒ.Control("Sideways", this.moveSpeed, 0 /* PROPORTIONAL */, 15);
            // animation
            // Walk
            this.animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
            this.animWalk.generateByGrid(ƒ.Rectangle.GET(176, 38, 16, 32), 3, this.resolution, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
            // Run
            this.animRun = new ƒAid.SpriteSheetAnimation("Run", coat);
            this.animRun.generateByGrid(ƒ.Rectangle.GET(332, 38, 18, 32), 3, this.resolution, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
            // Idle
            this.animIdle = new ƒAid.SpriteSheetAnimation("Idle", coat);
            this.animIdle.generateByGrid(ƒ.Rectangle.GET(20, 38, 16, 32), 1, this.resolution, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
            this.node.setAnimation(this.animIdle);
            this.animState = Script.Animation.Idle;
            this.node.setFrameDirection(1);
            this.node.framerate = 12;
            this.isOnGround = false;
        }
        /**
         * setAnimation to given animationtype
         */
        setAnimation(_type) {
            switch (_type) {
                case Script.Animation.Idle:
                    if (this.animState == _type)
                        break;
                    this.node.setAnimation(this.animIdle);
                    this.animState = Script.Animation.Idle;
                    break;
                case Script.Animation.Walk:
                    if (this.animState == _type)
                        break;
                    this.node.setAnimation(this.animWalk);
                    this.animState = Script.Animation.Walk;
                    break;
                case Script.Animation.Run:
                    if (this.animState == _type)
                        break;
                    this.node.setAnimation(this.animRun);
                    this.animState = Script.Animation.Run;
                    break;
                default:
                    console.log("No valid parameter");
                    break;
            }
        }
        /**
         * update
         */
        update() {
            let deltaTime = ƒ.Loop.timeFrameGame / 1000;
            this.move(deltaTime);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
                this.jump();
            }
            // turn Luigi
            if (this.ctrSideways.getOutput() > 0) {
                this.node.mtxLocal.rotation = ƒ.Vector3.Y(180);
            }
            else if (this.ctrSideways.getOutput() < 0) {
                this.node.mtxLocal.rotation = ƒ.Vector3.Y(0);
            }
            // if (!this.checkGrounded()) {
            this.fall(deltaTime);
            // }
        }
        /**
         * move
         */
        move(_deltaTime) {
            let sidewaysSpeed = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) +
                ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]));
            // run when shift is pressed
            if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT])) {
                this.ctrSideways.setInput(sidewaysSpeed * _deltaTime);
                this.setAnimation(Script.Animation.Walk);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT])) {
                this.setAnimation(Script.Animation.Run);
                this.ctrSideways.setInput(sidewaysSpeed * 1.5 * _deltaTime);
            }
            if (this.ctrSideways.getOutput() == 0) {
                this.setAnimation(Script.Animation.Idle);
            }
            this.mtxLocal.translateX(this.ctrSideways.getOutput());
            // rotateLuigi(ctrSideways.getOutput());
        }
        /**
         * jump
         */
        jump() {
            this.ySpeed = this.jumpForce;
        }
        /**
         * fall
         */
        fall(_deltaTime) {
            let g = 9.81;
            this.ySpeed -= g * _deltaTime;
            let deltaY = this.ySpeed * _deltaTime;
            this.checkGrounded();
            if (!this.isOnGround) {
                this.mtxLocal.translateY(deltaY);
            }
            // this.mtxLocal.translation.y = groundHight;
            // this.isOnGround = true;
        }
        /**
        * check if Luigi is on the Ground
        */
        checkGrounded() {
            let floorTiles = Script.branch.getChildrenByName("Floors")[0].getChildren();
            let blockSize = 1;
            // let blockSize: ƒ.Vector3;
            let lTrans = this.mtxLocal.translation;
            // let floorTile: ƒ.Node;
            // floorTiles.forEach(block => {
            for (let block of floorTiles) {
                let blockTrans = block.mtxLocal.translation;
                // blockSize = block.mtxLocal.scaling;
                if (Math.abs(lTrans.x - blockTrans.x) < blockSize) {
                    if (lTrans.y < blockTrans.y + blockSize && lTrans.x > blockTrans.x + (blockSize - 0.2)) {
                        // groundHight = blockTrans.y + blockSize;
                        lTrans.y = blockTrans.y + blockSize;
                        this.mtxLocal.translation = lTrans;
                        this.isOnGround = true;
                        this.ySpeed = 0;
                        return;
                        // return this.isOnGround;
                    }
                }
            }
            this.isOnGround = false;
            // );
            // console.log("not on ground");
            // if (this.mtxLocal.translation.y <= groundHight) {
            //   this.isOnGround = true;
            // }
            // return this.isOnGround;
        }
    }
    Script.Luigi = Luigi;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    // import ƒAid = FudgeAid;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    // global variables
    let luigi;
    // export let groundHight: number = -3;
    let Animation;
    (function (Animation) {
        Animation[Animation["Idle"] = 0] = "Idle";
        Animation[Animation["Walk"] = 1] = "Walk";
        Animation[Animation["Run"] = 2] = "Run";
    })(Animation = Script.Animation || (Script.Animation = {}));
    async function start(_event) {
        viewport = _event.detail;
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        // get Nodes
        Script.branch = viewport.getBranch();
        let texture = new ƒ.TextureImage();
        await texture.load("./Sprites/Luigi_Moves_Sheet2.png");
        luigi = new Script.Luigi(texture);
        Script.branch.appendChild(luigi);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
    }
    function update(_event) {
        luigi.update();
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map