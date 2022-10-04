"use strict";
var L08_Doom_Start;
(function (L08_Doom_Start) {
    var ƒ = FudgeCore;
    window.addEventListener("load", init);
    let root;
    let floor;
    let viewport;
    let camera;
    function init(_event) {
        root = new ƒ.Node("Root");
        floor = new ƒ.Node("Floor");
        let tsfFloor = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-90, 0, 0)));
        floor.addComponent(tsfFloor);
        let meshFloor = new ƒ.ComponentMesh(new ƒ.MeshQuad("Floor"));
        floor.addComponent(meshFloor);
        let matFloor = new ƒ.ComponentMaterial(new ƒ.Material("FloorMat", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("orange"))));
        floor.addComponent(matFloor);
        root.appendChild(floor);
        floor.mtxLocal.translateY(-1);
        floor.mtxLocal.rotateX(-90);
        viewport = new ƒ.Viewport();
        camera = new ƒ.ComponentCamera();
        camera.pivot.translateZ(3);
        camera.pivot.rotateX(10);
        camera.pivot.rotateY(180);
        viewport.initialize("Viewport", root, camera, document.querySelector("canvas"));
        viewport.draw();
    }
})(L08_Doom_Start || (L08_Doom_Start = {}));
//# sourceMappingURL=main.js.map