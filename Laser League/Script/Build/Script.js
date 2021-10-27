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
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    CustomComponentScript.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    // Don't forget to compile: Strg + Shift + B
    var ƒ = FudgeCore; // ALT+159
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let root;
    let agent;
    let laserformation;
    let laserPrefab;
    let copy;
    let fps = 60;
    let avatarMoveSpeed = 8;
    let avatarRotateSpeed = 160;
    let ctrForward = new ƒ.Control("Forward", avatarMoveSpeed, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(50);
    let ctrSideways = new ƒ.Control("Sideways", avatarMoveSpeed, 0 /* PROPORTIONAL */);
    ctrSideways.setDelay(50);
    let ctrRotation = new ƒ.Control("Rotation", avatarRotateSpeed, 0 /* PROPORTIONAL */);
    ctrRotation.setDelay(20);
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        viewport = _event.detail;
        root = viewport.getBranch();
        // console.log(root);
        laserformation = root.getChildrenByName("Laserformations")[0].getChildrenByName("Laserformation")[0];
        laserPrefab = laserformation.getChildrenByName("Laser01")[0];
        await placeLaser(new ƒ.Vector3(-10, -5, 0));
        await placeLaser(new ƒ.Vector3(10, -5, 0));
        await placeLaser(new ƒ.Vector3(10, 5, 0));
        agent = root.getChildrenByName("Agents")[0].getChildrenByName("Agent01")[0];
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, fps); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        // Adjust Camera Position
        viewport.camera.mtxPivot.translateZ(-30);
    }
    async function placeLaser(_translation) {
        copy = await copyGraph(laserPrefab);
        copy.mtxLocal.translation = _translation;
        laserformation.appendChild(copy);
    }
    async function copyGraph(_copy) {
        let graph = await ƒ.Project.registerAsGraph(_copy, false);
        let graphInstance = await ƒ.Project.createGraphInstance(graph);
        return graphInstance;
    }
    function update(_event) {
        // ƒ.Physics.world.simulate();  // if physics is included and used
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        let forwardSpeed = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) +
            ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]));
        ctrForward.setInput(forwardSpeed * deltaTime);
        agent.mtxLocal.translateY(ctrForward.getOutput());
        let sidewaysSpeed = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D]) +
            ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A]));
        ctrSideways.setInput(sidewaysSpeed * deltaTime);
        agent.mtxLocal.translateX(ctrSideways.getOutput());
        let rotationSpeed = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.ARROW_LEFT]) +
            ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.ARROW_RIGHT]));
        ctrRotation.setInput(rotationSpeed * deltaTime);
        agent.mtxLocal.rotateZ(ctrRotation.getOutput());
        let laserRotationSpeed = 120;
        let lasers = laserformation.getChildren();
        for (let laser of lasers) {
            laser.getComponent(ƒ.ComponentTransform).mtxLocal.rotateZ(laserRotationSpeed * deltaTime);
        }
        for (let laser of lasers) {
            let beams = laser.getChildrenByName("Beam");
            for (let beam of beams) {
                if (collisionTest(agent, beam))
                    console.log("hit");
            }
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function collisionTest(_agent, _beam) {
        let testPosition = ƒ.Vector3.TRANSFORMATION(_agent.mtxWorld.translation, _beam.mtxWorldInverse);
        let distance = ƒ.Vector2.DIFFERENCE(testPosition.toVector2(), _beam.mtxLocal.translation.toVector2());
        if (distance.x < -1 || distance.x > 1 || distance.y < -0.5 || distance.y > 6.5)
            return false;
        else
            return true;
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map