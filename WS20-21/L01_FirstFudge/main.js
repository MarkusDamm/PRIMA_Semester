"use strict";
var L01;
(function (L01) {
    console.log("Hello World");
    var ƒ = FudgeCore;
    let viewPort;
    let cmpCamera;
    let node;
    window.addEventListener("DOMContentLoaded", init);
    function init() {
        // X Rechts; Y Hoch, Z zu mir (rechtshändiges Koordinatensystem)
        // Ein Kopf mit Nase bei positivem Z schaut mich bei Fudge an
        let cubeColor = new ƒ.Color(0.2, 0.7, 0.1);
        node = createCube(cubeColor);
        // care for viewport at the end of init
        if (document.querySelector("canvas")) {
            createViewport(document.querySelector("canvas"));
        }
        else
            createViewport();
        viewPort.showSceneGraph();
        viewPort.draw();
    }
    function createCube(_color) {
        let cube = new ƒ.Node("Cube");
        let meshCube = new ƒ.MeshCube("CubeMesh");
        let cmpMeshCube = new ƒ.ComponentMesh(meshCube);
        let matCube = new ƒ.Material("CubeMat", ƒ.ShaderUniColor, new ƒ.CoatColored(_color));
        let cmpMatCube = new ƒ.ComponentMaterial(matCube);
        let cmpTransform = new ƒ.ComponentTransform();
        cube.addComponent(cmpMeshCube);
        cube.addComponent(cmpMatCube);
        cube.addComponent(cmpTransform);
        return cube;
    }
    function createViewport(_canvas = null) {
        if (!_canvas) {
            _canvas = document.createElement("canvas");
            _canvas.width = 1000;
            _canvas.height = 650;
            document.body.appendChild(_canvas);
        }
        viewPort = new ƒ.Viewport();
        cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translateZ(3); // Kamera zu mir bewegen; schaut auf mich und vom Ursprung weg
        cmpCamera.pivot.rotateY(180); // Kamera zum Ursprung drehen
        cmpCamera.pivot.translateY(1.5);
        cmpCamera.pivot.rotateX(25);
        viewPort.initialize("viewport", node, cmpCamera, _canvas);
    }
})(L01 || (L01 = {}));
//# sourceMappingURL=main.js.map