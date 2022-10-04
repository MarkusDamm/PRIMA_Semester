"use strict";
var L02_Fudge;
(function (L02_Fudge) {
    var ƒ = FudgeCore;
    window.addEventListener("load", hndLoad);
    window.addEventListener("click", hndRotate);
    let canvas;
    let root;
    let viewport;
    let cmpCamera;
    function hndLoad(_event) {
        canvas = document.querySelector("canvas");
        root = new ƒ.Node("Root");
        root.addComponent(new ƒ.ComponentTransform());
        let quad = new ƒ.Node("Quad");
        let meshQuad = new ƒ.MeshQuad();
        let cmpMeshQuad = new ƒ.ComponentMesh(meshQuad);
        quad.addComponent(cmpMeshQuad);
        let mtrSolidWhite = new ƒ.Material("SolidWhite", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")));
        let cmpMaterialQuad = new ƒ.ComponentMaterial(mtrSolidWhite);
        quad.addComponent(cmpMaterialQuad);
        root.addChild(quad);
        //#region Torus
        let torus = new ƒ.Node("Torus");
        let meshTorus = new ƒ.MeshTorus("Torus", 1, 10, 3);
        let cmpMeshTorus = new ƒ.ComponentMesh(meshTorus);
        cmpMeshTorus.pivot.translateX(0);
        cmpMeshTorus.pivot.rotateZ(90);
        cmpMeshTorus.pivot.rotateX(90);
        torus.addComponent(cmpMeshTorus);
        let matOrange = new ƒ.Material("Orange", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("ORANGE")));
        let cmpMatTorus = new ƒ.ComponentMaterial(matOrange);
        torus.addComponent(cmpMatTorus);
        root.appendChild(torus);
        //#endregion
        //#region Cube
        let cube = new ƒ.Node("Cube");
        let meshCube = new ƒ.MeshCube();
        let cmpMeshCube = new ƒ.ComponentMesh(meshCube);
        let matRed = new ƒ.Material("Red", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("RED")));
        let cmpMatCube = new ƒ.ComponentMaterial(matRed);
        cmpMeshCube.pivot.scaleX(0.5);
        cmpMeshCube.pivot.scaleY(0.5);
        cmpMeshCube.pivot.rotateZ(-45);
        //#endregion
        torus.addComponent(cmpMatTorus);
        cube.addComponent(cmpMeshCube);
        cube.addComponent(cmpMatCube);
        root.appendChild(cube);
        cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translateZ(4);
        cmpCamera.pivot.rotateY(180);
        cmpCamera.pivot.rotateZ(30);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", root, cmpCamera, canvas);
        ƒ.Debug.log(viewport);
        viewport.draw();
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
    }
    function hndRotate(_event) {
        ƒ.Time.game.setScale(); // testing
    }
    function hndLoop(_event) {
        console.log("tick");
        // cmpCamera.pivot.rotateZ(0.5);
        // viewport.getGraph().mtxLocal.rotateZ(1); 
        root.mtxLocal.rotateZ(1);
        // mtxLocal ist der shortcut für die locale Transform-Componente
        viewport.draw();
    }
})(L02_Fudge || (L02_Fudge = {}));
//# sourceMappingURL=main.js.map