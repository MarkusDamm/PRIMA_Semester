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
    let laser1;
    let fps = 60;
    let moveSpeed = 8;
    let ctrForward = new ƒ.Control("Forward", moveSpeed, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(50);
    let rotateSpeed = 60;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        root = viewport.getBranch();
        // console.log(root);
        laserformation = root.getChildrenByName("Laserformations")[0].getChildrenByName("Laserformation")[0];
        laser1 = laserformation.getChildrenByName("Laser01")[0];
        agent = root.getChildrenByName("Agents")[0].getChildrenByName("Agent01")[0];
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, fps); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        // Adjust Camera Position
        viewport.camera.mtxPivot.translateZ(-30);
    }
    function update(_event) {
        // ƒ.Physics.world.simulate();  // if physics is included and used
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        // Sideways
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
            agent.mtxLocal.translateX(moveSpeed * deltaTime);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
            agent.mtxLocal.translateX(-moveSpeed * deltaTime);
        }
        // Rotation
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            agent.mtxLocal.rotateZ(rotateSpeed * deltaTime);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            agent.mtxLocal.rotateZ(-rotateSpeed * deltaTime);
        }
        let forwardSpeed = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) +
            ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]));
        ctrForward.setInput(forwardSpeed * deltaTime);
        // console.log(ctrForward.getOutput());
        agent.mtxLocal.translateY(ctrForward.getOutput());
        let laserRotationSpeed = 120;
        let lasers = laserformation.getChildren();
        for (let laser of lasers) {
            laser.getComponent(ƒ.ComponentTransform).mtxLocal.rotateZ(laserRotationSpeed * deltaTime);
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
        for (let laser of lasers) {
            let beams = laser.getChildrenByName("Beam");
            for (let beam of beams) {
                collisionTest(agent, beam);
            }
        }
    }
    function collisionTest(_agent, _beam) {
        let testPosition = ƒ.Vector3.TRANSFORMATION(_agent.mtxWorld.translation, _beam.mtxWorldInverse);
        let distance = ƒ.Vector2.DIFFERENCE(testPosition.toVector2(), _beam.mtxLocal.translation.toVector2());
        // if (distance.x < 1 && distance.x > -1 && distance.y < 7 && distance.y > -1) {
        //   console.log("hit");
        // }
        // auf negative Abfrage umgestellt mit || ( || ist schneller als && )
        if (distance.x < -1 || distance.x > 1 || distance.y < -0.5 || distance.y > 6.5)
            return;
        else
            console.log("hit");
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map