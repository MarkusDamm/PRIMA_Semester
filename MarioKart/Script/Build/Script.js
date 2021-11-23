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
    let kart;
    let ctrForward = new ƒ.Control("Forward", 10, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(200);
    let ctrTurn = new ƒ.Control("Turn", 100, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(50);
    let meshRelief;
    let mtxRelief;
    // let hightMap: ƒ.TextureImage = new ƒ.TextureImage();
    window.addEventListener("load", init);
    async function init(_event) {
        let dialog = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", function (_event) {
            // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
            dialog.close();
            start();
        });
        //@ts-ignore
        dialog.showModal();
        // await hightMap.load("../../images/Kart-track.png");
    }
    async function start() {
        await ƒ.Project.loadResourcesFromHTML();
        root = ƒ.Project.resources[document.head.querySelector("meta[autoView]").getAttribute("autoView")];
        // let cmpCamera: ƒ.ComponentCamera = root.getComponent(ƒ.ComponentCamera);
        // root.removeComponent(cmpCamera);
        // cmpCamera = new ƒ.ComponentCamera();
        let cmpCamera = new ƒ.ComponentCamera();
        // cmpCamera.mtxPivot.translateZ(60);
        cmpCamera.mtxPivot.translateY(110);
        cmpCamera.mtxPivot.rotateY(180);
        cmpCamera.mtxPivot.rotateX(90);
        root.addComponent(cmpCamera);
        // root.getChildrenByName("Relief")[0].getComponent(ƒ.ComponentMesh).mesh.setTexture();
        let cmpMeshRelief = root.getChildrenByName("Relief")[0].getComponent(ƒ.ComponentMesh);
        meshRelief = cmpMeshRelief.mesh;
        mtxRelief = cmpMeshRelief.mtxWorld;
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", root, cmpCamera, canvas);
        ƒ.AudioManager.default.listenTo(root);
        ƒ.AudioManager.default.listenWith(root.getComponent(ƒ.ComponentAudioListener));
        kart = root.getChildrenByName("Kart")[0];
        // kart = <ƒ.Graph>ƒ.Project.resources["Graph|2021-11-18T12:47:22.918Z|78691"];
        // kart.mtxLocal.translateX(5);
        // root.appendChild(kart);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.world.simulate();  // if physics is included and used
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        controls(deltaTime);
        let terrainInfo = meshRelief.getTerrainInfo(kart.mtxWorld.translation, mtxRelief);
        kart.mtxLocal.translation = terrainInfo.position;
        kart.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, kart.mtxLocal.getZ()), terrainInfo.normal);
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function controls(_deltaTime) {
        let forward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        ctrForward.setInput(forward * _deltaTime);
        kart.mtxLocal.translateZ(ctrForward.getOutput());
        let velocity = ctrForward.getOutput();
        let turn = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        ctrTurn.setInput(turn * _deltaTime);
        if (velocity < -0.1 || velocity > 0.1) {
            kart.mtxLocal.rotateY(ctrTurn.getOutput());
        }
        // console.log(ctrTurn.getOutput());
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map