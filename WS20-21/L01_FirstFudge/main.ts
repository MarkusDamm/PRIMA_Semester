
namespace L01 {
    console.log("Hello World");
    import ƒ = FudgeCore;

    let viewPort: ƒ.Viewport;
    let cmpCamera: ƒ.ComponentCamera;
    let node: ƒ.Node;

    window.addEventListener("DOMContentLoaded", init);

    function init(): void {
        // X Rechts; Y Hoch, Z zu mir (rechtshändiges Koordinatensystem)
        // Ein Kopf mit Nase bei positivem Z schaut mich bei Fudge an
        let cubeColor: ƒ.Color = new ƒ.Color(0.2, 0.7, 0.1); 
        node = createCube(cubeColor);

        // care for viewport at the end of init
        if (document.querySelector("canvas")) {
            createViewport(document.querySelector("canvas"));
        }
        else createViewport();
        viewPort.showSceneGraph();
        viewPort.draw();
    }

    function createCube(_color: ƒ.Color): ƒ.Node {
        let cube: ƒ.Node = new ƒ.Node("Cube");
        let meshCube: ƒ.MeshCube = new ƒ.MeshCube("CubeMesh");
        let cmpMeshCube: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);

        let matCube: ƒ.Material = new ƒ.Material("CubeMat", ƒ.ShaderUniColor, new ƒ.CoatColored(_color));
        let cmpMatCube: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(matCube);

        let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform();

        cube.addComponent(cmpMeshCube);
        cube.addComponent(cmpMatCube);
        cube.addComponent(cmpTransform);

        return cube;
    }

    function createViewport(_canvas: HTMLCanvasElement = null): void {
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
}