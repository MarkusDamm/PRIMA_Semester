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
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let luigiPos;
    let luigiNode;
    let coat;
    let animWalk;
    let animRun;
    let luigiMoveSpeed = 4;
    let ctrSideways = new ƒ.Control("Sideways", luigiMoveSpeed, 0 /* PROPORTIONAL */);
    async function start(_event) {
        viewport = _event.detail;
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        console.log(viewport);
        // get Nodes
        let branch = viewport.getBranch();
        luigiPos = branch.getChildrenByName("LuigiPosition")[0];
        luigiPos.removeAllChildren();
        // create Luigi
        luigiNode = new ƒAid.NodeSprite("Luigi");
        luigiNode.addComponent(new ƒ.ComponentTransform());
        luigiNode.mtxLocal.rotateY(180);
        luigiNode.mtxLocal.translateY(-0.05);
        luigiPos.appendChild(luigiNode);
        // texture Luigi
        let texture = new ƒ.TextureImage();
        await texture.load("./Sprites/Luigi_Moves_Sheet2.png");
        coat = new ƒ.CoatTextured(ƒ.Color.CSS("white"), texture);
        // animation
        // Walk
        animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
        animWalk.generateByGrid(ƒ.Rectangle.GET(176, 38, 16, 32), 3, 32, ƒ.ORIGIN2D.TOPLEFT, ƒ.Vector2.X(52));
        // Run
        animRun = new ƒAid.SpriteSheetAnimation("Run", coat);
        animRun.generateByGrid(ƒ.Rectangle.GET(332, 38, 18, 32), 3, 32, ƒ.ORIGIN2D.TOPLEFT, ƒ.Vector2.X(52));
        luigiNode.setAnimation(animWalk);
        luigiNode.setFrameDirection(1);
        luigiNode.framerate = 12;
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
    }
    let AnimationType;
    (function (AnimationType) {
        AnimationType[AnimationType["Walk"] = 0] = "Walk";
        AnimationType[AnimationType["Run"] = 1] = "Run";
        AnimationType[AnimationType["Idle"] = 2] = "Idle";
    })(AnimationType || (AnimationType = {}));
    function setAnimation(_type) {
        switch (_type) {
            case AnimationType.Walk:
                luigiNode.setAnimation(animWalk);
                break;
            case AnimationType.Run:
                // animRun = new ƒAid.SpriteSheetAnimation("Run", coat);
                // animRun.generateByGrid(ƒ.Rectangle.GET(332, 38, 18, 32), 3, 32, ƒ.ORIGIN2D.TOPLEFT, ƒ.Vector2.X(52));
                luigiNode.setAnimation(animRun);
                break;
            default:
                console.log("no Animation yet");
                break;
        }
    }
    function update(_event) {
        // move Luigi
        // let cmpTransL: ƒ.ComponentTransform = luigiPos.getComponent(ƒ.ComponentTransform);
        // cmpTransL.mtxLocal.translateX(0.01);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.D])) {
            moveLuigi();
        }
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function moveLuigi() {
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        let sidewaysSpeed = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D]) +
            ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A]));
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT])) {
            setAnimation(AnimationType.Run);
            ctrSideways.setInput(sidewaysSpeed * 1.5 * deltaTime);
        }
        else {
            ctrSideways.setInput(sidewaysSpeed * deltaTime);
            setAnimation(AnimationType.Walk);
        }
        luigiPos.mtxLocal.translateX(ctrSideways.getOutput());
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map