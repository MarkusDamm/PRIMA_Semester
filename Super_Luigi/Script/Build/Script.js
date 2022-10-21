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
    let ySpeed = 0;
    let fallTime = 0;
    // global variables for animation
    let luigiNode;
    let animWalk;
    let animRun;
    let animIdle;
    let luigiAnimState;
    let AnimationType;
    (function (AnimationType) {
        AnimationType[AnimationType["Walk"] = 0] = "Walk";
        AnimationType[AnimationType["Run"] = 1] = "Run";
        AnimationType[AnimationType["Idle"] = 2] = "Idle";
    })(AnimationType || (AnimationType = {}));
    let luigiMoveSpeed = 4;
    let ctrSideways = new ƒ.Control("Sideways", luigiMoveSpeed, 0 /* PROPORTIONAL */);
    async function start(_event) {
        viewport = _event.detail;
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        // get Nodes
        let branch = viewport.getBranch();
        luigiPos = branch.getChildrenByName("LuigiPosition")[0];
        luigiPos.removeAllChildren();
        // create Luigi
        luigiNode = new ƒAid.NodeSprite("Luigi");
        luigiNode.addComponent(new ƒ.ComponentTransform());
        // set mesh to 2 y
        luigiNode.mtxLocal.rotateY(180);
        luigiNode.mtxLocal.translateY(-0.05);
        luigiPos.appendChild(luigiNode);
        // texture Luigi
        let texture = new ƒ.TextureImage();
        await texture.load("./Sprites/Luigi_Moves_Sheet2.png");
        let coat = new ƒ.CoatTextured(ƒ.Color.CSS("white"), texture);
        // animation
        // Walk
        animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
        animWalk.generateByGrid(ƒ.Rectangle.GET(176, 38, 16, 32), 3, 32, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
        // Run
        animRun = new ƒAid.SpriteSheetAnimation("Run", coat);
        animRun.generateByGrid(ƒ.Rectangle.GET(332, 38, 18, 32), 3, 32, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
        // Idle
        animIdle = new ƒAid.SpriteSheetAnimation("Idle", coat);
        animIdle.generateByGrid(ƒ.Rectangle.GET(20, 38, 16, 32), 1, 32, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
        setAnimation(AnimationType.Idle);
        luigiAnimState = AnimationType.Idle;
        luigiNode.setFrameDirection(1);
        luigiNode.framerate = 12;
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
    }
    function setAnimation(_type) {
        switch (_type) {
            case AnimationType.Walk:
                if (luigiAnimState == _type)
                    break;
                luigiNode.setAnimation(animWalk);
                luigiAnimState = AnimationType.Walk;
                break;
            case AnimationType.Run:
                if (luigiAnimState == _type)
                    break;
                luigiNode.setAnimation(animRun);
                luigiAnimState = AnimationType.Run;
                break;
            default:
                if (luigiAnimState == _type)
                    break;
                luigiNode.setAnimation(animIdle);
                luigiAnimState = AnimationType.Idle;
                break;
        }
    }
    function update(_event) {
        // move Luigi when pressing move-keys
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.D])) {
            moveLuigi();
        }
        else
            setAnimation(AnimationType.Idle);
        fall();
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            jump();
        }
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function moveLuigi() {
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        let sidewaysSpeed = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D]) +
            ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A]));
        // run when shift is pressed
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT])) {
            setAnimation(AnimationType.Run);
            ctrSideways.setInput(sidewaysSpeed * 1.5 * deltaTime);
        }
        else {
            ctrSideways.setInput(sidewaysSpeed * deltaTime);
            setAnimation(AnimationType.Walk);
        }
        luigiPos.mtxLocal.translateX(ctrSideways.getOutput());
        rotateLuigi(ctrSideways.getOutput());
    }
    function fall() {
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        //fall
        let g = 9.81;
        ySpeed -= g * deltaTime;
        let deltaY = ySpeed * deltaTime;
        if (luigiPos.mtxLocal.translation.y + deltaY > -2) {
            luigiPos.mtxLocal.translateY(deltaY);
        }
    }
    function jump() {
        ySpeed = 5;
    }
    function rotateLuigi(_move) {
        if (_move > 0) {
            luigiNode.mtxLocal.rotation = ƒ.Vector3.Y(180);
            return;
        }
        luigiNode.mtxLocal.rotation = ƒ.Vector3.Y(0);
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map