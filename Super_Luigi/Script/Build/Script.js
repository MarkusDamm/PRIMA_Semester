"use strict";
var Script;
(function (Script) {
    class Luigi extends ƒ.Node {
        constructor() {
            super("LuigiPosition");
            this.ySpeed = 0;
            this.spriteSheedPath = "./Sprites/Luigi_Moves_Sheet2.png";
            this.moveSpeed = 7;
            this.jumpForce = 15;
            this.resolution = 16;
            this.animations = {};
            this.addComponent(new ƒ.ComponentTransform);
            this.node = new ƒAid.NodeSprite("Luigi");
            this.node.addComponent(new ƒ.ComponentTransform);
            this.node.mtxLocal.rotation = ƒ.Vector3.Y(180);
            this.node.mtxLocal.translateY(-0.05);
            this.appendChild(this.node);
            this.ctrSideways = new ƒ.Control("Sideways", this.moveSpeed, 0 /* PROPORTIONAL */, 15);
            this.isOnGround = false;
        }
        /**
         * initializes all animations from the given TextureImage
         */
        initializeAnimations(_texture) {
            let coat = new ƒ.CoatTextured(ƒ.Color.CSS("white"), _texture);
            // let animationFrames: number = 1;
            let origin = ƒ.ORIGIN2D.BOTTOMCENTER;
            let offsetNext = ƒ.Vector2.X(52);
            /// WIP
            let rectangles = {
                "idle": [21, 39, 15, 30], "lookUp": [72, 40, 15, 29], "duck": [124, 54, 16, 15],
                "jump": [72, 110, 16, 30], "fall": [124, 109, 16, 30], "runJump": [176, 109, 24, 32]
            };
            let threeFrameRecs = { "walk": [176, 39, 15, 30], "run": [332, 38, 18, 32] };
            this.initializeAnimationsByFrames(coat, rectangles, 1, origin, offsetNext);
            this.initializeAnimationsByFrames(coat, threeFrameRecs, 3, origin, offsetNext);
            this.node.setAnimation(this.animations.idle);
            this.animState = Script.Animation.Idle;
            this.node.setFrameDirection(1);
            this.node.framerate = 12;
        }
        /**
         * update
         */
        update() {
            let deltaTime = ƒ.Loop.timeFrameGame / 1000;
            this.fall(deltaTime);
            this.checkGrounded();
            this.move(deltaTime);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
                this.setAnimation(Script.Animation.LookUp);
            }
            if (this.ySpeed > 0) {
                this.setAnimation(Script.Animation.Jump);
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT])) {
                    this.setAnimation(Script.Animation.RunJump);
                }
            }
            if (this.ySpeed < 0) {
                this.setAnimation(Script.Animation.Fall);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
                this.setAnimation(Script.Animation.Duck);
            }
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
        }
        /**
         * jump
         */
        jump() {
            if (this.isOnGround) {
                this.ySpeed = this.jumpForce;
            }
        }
        /**
         * fall
         */
        fall(_deltaTime) {
            this.ySpeed -= Script.gravity * _deltaTime;
            let deltaY = this.ySpeed * _deltaTime;
            this.mtxLocal.translateY(deltaY);
        }
        /**
         * initializes multiple animation with the same amount of frames
         */
        initializeAnimationsByFrames(_coat, _rectangles, _frames, _orig, _offsetNext) {
            for (let key in _rectangles) {
                const rec = _rectangles[key];
                let anim = new ƒAid.SpriteSheetAnimation(key, _coat);
                let fRec = ƒ.Rectangle.GET(rec[0], rec[1], rec[2], rec[3]);
                anim.generateByGrid(fRec, _frames, this.resolution, _orig, _offsetNext);
                console.log(key);
                this.animations[key] = anim;
            }
        }
        /**
         * set current animation to given animationtype
         */
        setAnimation(_type) {
            switch (_type) {
                case Script.Animation.Idle:
                    if (this.animState == _type)
                        break;
                    this.node.setAnimation(this.animations.idle);
                    this.animState = Script.Animation.Idle;
                    break;
                case Script.Animation.Walk:
                    if (this.animState == _type)
                        break;
                    this.node.setAnimation(this.animations.walk);
                    this.animState = Script.Animation.Walk;
                    break;
                case Script.Animation.Run:
                    if (this.animState == _type)
                        break;
                    this.node.setAnimation(this.animations.run);
                    this.animState = Script.Animation.Run;
                    break;
                case Script.Animation.LookUp:
                    if (this.animState == _type)
                        break;
                    this.node.setAnimation(this.animations.lookUp);
                    this.animState = Script.Animation.LookUp;
                    break;
                case Script.Animation.Duck:
                    if (this.animState == _type)
                        break;
                    this.node.setAnimation(this.animations.duck);
                    this.animState = Script.Animation.Duck;
                    break;
                case Script.Animation.Jump:
                    if (this.animState == _type)
                        break;
                    this.node.setAnimation(this.animations.jump);
                    this.animState = Script.Animation.Jump;
                    break;
                case Script.Animation.Fall:
                    if (this.animState == _type)
                        break;
                    this.node.setAnimation(this.animations.fall);
                    this.animState = Script.Animation.Fall;
                    break;
                case Script.Animation.RunJump:
                    if (this.animState == _type)
                        break;
                    this.node.setAnimation(this.animations.runJump);
                    this.animState = Script.Animation.RunJump;
                    break;
                default:
                    console.log("No valid parameter");
                    break;
            }
        }
        /**
        * check if Luigi is on the Ground
        */
        checkGrounded() {
            let floorTiles = Script.viewport.getBranch().getChildrenByName("Floors")[0].getChildren();
            let blockSize;
            let lTrans = this.mtxLocal.translation;
            for (let blockPos of floorTiles) {
                let blockPosTrans = blockPos.mtxLocal.translation;
                blockSize = blockPos.getChild(0).mtxLocal.scaling;
                if (Math.abs(lTrans.x - blockPosTrans.x) <= blockSize.x / 2) {
                    if (lTrans.y < blockPosTrans.y + (blockSize.y / 2) && lTrans.y > blockPosTrans.y + ((blockSize.y / 5))) {
                        lTrans.y = blockPosTrans.y + (blockSize.y / 2);
                        this.mtxLocal.translation = lTrans;
                        this.isOnGround = true;
                        this.ySpeed = 0;
                        return;
                    }
                }
            }
            this.isOnGround = false;
        }
    }
    Script.Luigi = Luigi;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    // Mutation und Serelization genauer betrachten
    ƒ.Debug.info("Main Program Template running!");
    document.addEventListener("interactiveViewportStarted", start);
    // global variables
    let luigi;
    Script.gravity = 20;
    let Animation;
    (function (Animation) {
        Animation[Animation["Idle"] = 0] = "Idle";
        Animation[Animation["LookUp"] = 1] = "LookUp";
        Animation[Animation["Duck"] = 2] = "Duck";
        Animation[Animation["Walk"] = 3] = "Walk";
        Animation[Animation["Run"] = 4] = "Run";
        Animation[Animation["Jump"] = 5] = "Jump";
        Animation[Animation["Fall"] = 6] = "Fall";
        Animation[Animation["RunJump"] = 7] = "RunJump";
    })(Animation = Script.Animation || (Script.Animation = {}));
    async function start(_event) {
        Script.viewport = _event.detail;
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        // get Nodes
        let branch = Script.viewport.getBranch();
        let texture = new ƒ.TextureImage();
        await texture.load("./Sprites/Luigi_Moves_Sheet2.png");
        luigi = new Script.Luigi();
        luigi.initializeAnimations(texture);
        branch.appendChild(luigi);
        // Audio
        let cmpAudio = branch.getComponent(ƒ.ComponentAudio);
        console.log(cmpAudio);
        let downSound = new ƒ.Audio();
        await downSound.load("./Audio/PlayerDown.mp3");
        cmpAudio = new ƒ.ComponentAudio(downSound, true, true);
        branch.addComponent(cmpAudio);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
    }
    function update(_event) {
        luigi.update();
        // ƒ.Physics.simulate();  // if physics is included and used
        Script.viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class ScriptRotator extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "ScriptRotator added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        // ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.test);
                        this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.test);
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
            this.test = () => {
                // this.node.mtxLocal.rotateY(1);
                this.node.mtxLocal.rotateZ(2);
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
    ScriptRotator.iSubclass = ƒ.Component.registerSubclass(ScriptRotator);
    Script.ScriptRotator = ScriptRotator;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map