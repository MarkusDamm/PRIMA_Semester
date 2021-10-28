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
                        ƒ.Debug.log("Custom component script added", this.message, this.node);
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
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class LaserScript extends ƒ.ComponentScript {
        constructor() {
            super();
            this.message = "Laser Script added to ";
            this.laserRotationSpeed = 120;
            // use arrow-structure to make hndEvent an Attribute of LaserScript, so that *this* references this script
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        console.log("add listener for hdlRotation");
                        this.laserRotationSpeed = Math.random() * 80 + 40;
                        if (Math.random() - 0.5 < 0) {
                            this.laserRotationSpeed *= -1;
                        }
                        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.hndRotation);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.hndRotation);
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                }
            };
            this.hndRotation = (_event) => {
                let deltaTime = ƒ.Loop.timeFrameReal / 1000;
                this.node.getComponent(ƒ.ComponentTransform).mtxLocal.rotateZ(this.laserRotationSpeed * deltaTime);
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
    }
    Script.LaserScript = LaserScript;
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
        let graphLaser = FudgeCore.Project.resources["Graph|2021-10-28T13:13:43.242Z|36118"];
        laserPrefab = await ƒ.Project.createGraphInstance(graphLaser);
        // laserPrefab = laserformation.getChildrenByName("Laser01")[0];
        let laserPlacementPosition = new ƒ.Vector3(-10, 5, 0);
        let xPosition = -10;
        let yPosition = 5;
        let amount = 6;
        for (let i = 0; i < amount; i++) {
            if (i == amount / 2) {
                laserPlacementPosition = new ƒ.Vector3(xPosition, yPosition, 0);
                yPosition = -5;
            }
            await placeLaser(laserPlacementPosition);
            laserPlacementPosition.x - xPosition;
        }
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
        hdlAvatarMovement(deltaTime);
        let lasers = laserformation.getChildren();
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
    function hdlAvatarMovement(_deltaTime) {
        let forwardSpeed = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) +
            ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]));
        ctrForward.setInput(forwardSpeed * _deltaTime);
        agent.mtxLocal.translateY(ctrForward.getOutput());
        let sidewaysSpeed = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D]) +
            ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A]));
        ctrSideways.setInput(sidewaysSpeed * _deltaTime);
        agent.mtxLocal.translateX(ctrSideways.getOutput());
        let rotationSpeed = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.ARROW_LEFT]) +
            ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.ARROW_RIGHT]));
        ctrRotation.setInput(rotationSpeed * _deltaTime);
        agent.mtxLocal.rotateZ(ctrRotation.getOutput());
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