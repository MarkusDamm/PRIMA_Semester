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
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let root;
    let rbCube = new ƒ.ComponentRigidbody(5, ƒ.BODY_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CUBE);
    let cube;
    let ctrForward = new ƒ.Control("Forward", 50, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(200);
    let ctrTurn = new ƒ.Control("Turn", 5, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(50);
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        viewport.camera.mtxPivot.translateZ(-10);
        root = viewport.getBranch();
        let plane = root.getChildrenByName("Plane")[0];
        plane.addComponent(new ƒ.ComponentTransform());
        let rbPlane = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
        plane.addComponent(rbPlane);
        rbPlane.initialization = ƒ.BODY_INIT.TO_MESH;
        console.log(rbPlane.friction);
        rbPlane.friction = 2;
        cube = root.getChildrenByName("Cube")[0];
        cube.addComponent(rbCube);
        rbCube.initialization = ƒ.BODY_INIT.TO_MESH;
        // document.addEventListener("keydown", hdlKeyDown);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        controls(deltaTime);
        ƒ.Physics.world.simulate(deltaTime); // if physics is included and used
        // console.log(rbCube.getVelocity().z);
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    // function hdlKeyDown(): void {
    //   rbCube.applyForce(new ƒ.Vector3(0, 5000, 0));
    //   console.log("KeyDown");
    // }
    function controls(_deltaTime) {
        let forward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        ctrForward.setInput(forward);
        rbCube.applyForce(ƒ.Vector3.SCALE(cube.mtxLocal.getZ(), ctrForward.getOutput()));
        // cube.mtxLocal.translateZ(ctrForward.getOutput());
        // let velocity: number = ctrForward.getOutput();
        let turn = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        ctrTurn.setInput(turn);
        rbCube.applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput()));
        // if (velocity > 0.1) {
        //   cube.mtxLocal.rotateY(ctrTurn.getOutput());
        // }
        // else if (velocity < -0.1) {
        //   cube.mtxLocal.rotateY(-ctrTurn.getOutput());
        // }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map