///<reference types="../FudgeCore/FudgeCore.js"/>
namespace ExampleSceneForest {
    import ƒ = FudgeCore;       // Alt + 159
    window.addEventListener("DOMContentLoaded", init);
    let node: ƒ.Node;
    let camera: ƒ.Node;
    let viewPort: ƒ.Viewport;

    function init(): void {
        ƒ.RenderManager.initialize();
        createForest();
        viewPort.draw();
        viewPort.showSceneGraph();
        addEventListener("keydown", handleKeyDown);
    }

    function createForest(): void {
        let forest: ƒ.Node = new ƒ.Node("Forest");

        let colorLeaves: ƒ.Color = new ƒ.Color(0.2, 0.6, 0.3, 1);
        let colorNeedles: ƒ.Color = new ƒ.Color(0.1, 0.5, 0.3, 1);
        let colorTreeTrunk: ƒ.Color = new ƒ.Color(0.5, 0.3, 0, 1);
        let colorMushroomCapBrown: ƒ.Color = new ƒ.Color(0.6, 0.4, 0, 1);
        let colorMushroomCapRed: ƒ.Color = new ƒ.Color(0.5, 0, 0, 1);
        let colorMushroomTrunk: ƒ.Color = new ƒ.Color(0.9, 0.8, 0.7, 1);
        let colorGround: ƒ.Color = new ƒ.Color(0.3, 0.6, 0.5, 1);

        // let groundPosition: ƒ.Matrix4x4 = new ƒ.Matrix4x4();
        // groundPosition.translateY(2);
        // console.log(groundPosition);
        let ground: ƒ.Node = createCompleteMeshNode("Ground", new ƒ.Material("Ground", ƒ.ShaderUniColor, new ƒ.CoatColored(colorGround)), new ƒ.MeshCube());
        let cmpGroundMesh: ƒ.ComponentMesh = ground.getComponent(ƒ.ComponentMesh);

        cmpGroundMesh.pivot.scale(new ƒ.Vector3(8.5, 0.05, 8.5));
        node = ground;
        createViewport();

        // let cmpCamera: ƒ.ComponentTransform = camera.getComponent(ƒ.ComponentTransform);
        let cmpTransformCamera: ƒ.ComponentTransform = camera.cmpTransform;
        cmpTransformCamera.local.translateY(2);
        // cmpCamera.local.translateZ(-2);
        // cmpTransformCamera.local.rotateX(8);
        // cmpCamera.local.rotateZ(2.8);
        node.addChild(camera);

        for (let i: number = 0; i < 5; i++) {
            let plusOrMinus: number = Math.random() < 0.5 ? -1 : 1;
            // console.log("create Broadleaf " + i);

            let broadleafe: ƒ.Node = createBroadleaf("BreadLeaf" + i, colorTreeTrunk
                , colorLeaves, new ƒ.Vector3(Math.random() * 4 * plusOrMinus, 0.2,
                    Math.random() * 4 * plusOrMinus), new ƒ.Vector3(0.2, 0.5, 0.2));
            forest.appendChild(broadleafe);
        }
        for (let i: number = 0; i < 7; i++) {
            let plusOrMinus: number = Math.random() < 0.5 ? -1 : 1;
            // console.log("create Conifer " + i);

            let conifer: ƒ.Node = createConifer("Conifer" + i, colorTreeTrunk
                , colorNeedles, new ƒ.Vector3(Math.random() * 3 * plusOrMinus, 0.2,
                    Math.random() * 3 * plusOrMinus), new ƒ.Vector3(0.2, 0.5, 0.2));
            forest.appendChild(conifer);
        }
        for (let i: number = 0; i < 6; i++) {
            let plusOrMinus: number = Math.random() < 0.5 ? -1 : 1;
            // console.log("create MushroomRed " + i);

            let mushroomRed: ƒ.Node = createMushroom("Mushroom" + i, colorMushroomTrunk
                , colorMushroomCapRed, new ƒ.Vector3(Math.random() * 2 * plusOrMinus, 0.2,
                    Math.random() * 2 * plusOrMinus), new ƒ.Vector3(0.1, 0.3, 0.1));

            let mushroomBrown: ƒ.Node = createMushroom("Mushroom" + i, colorMushroomTrunk
                , colorMushroomCapBrown, new ƒ.Vector3(Math.random() * 2 * plusOrMinus, 0.2,
                    Math.random() * 2 * plusOrMinus), new ƒ.Vector3(0.15, 0.4, 0.15));

            forest.appendChild(mushroomRed);
            forest.appendChild(mushroomBrown);
        }
        node.appendChild(forest);
    }

    function createCompleteMeshNode(_name: string, _material: ƒ.Material, _mesh: ƒ.Mesh, _position?: ƒ.Matrix4x4): ƒ.Node {
        let node: ƒ.Node = new ƒ.Node(_name);

        let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(_mesh);
        let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(_material);

        let cmpTransform: ƒ.ComponentTransform;
        if (_position) {

            cmpTransform = new ƒ.ComponentTransform(_position);
        }
        else {
            cmpTransform = new ƒ.ComponentTransform();
        }
        node.addComponent(cmpMesh);
        node.addComponent(cmpMaterial);
        node.addComponent(cmpTransform);

        return node;
    }

    function createViewport(_canvas: HTMLCanvasElement = null): void {
        if (!_canvas) {
            _canvas = document.createElement("canvas");
            _canvas.width = 1000;
            _canvas.height = 650;
            document.body.appendChild(_canvas);
        }
        viewPort = new ƒ.Viewport();
        camera = createCamera();
        viewPort.initialize("viewport", node, camera.getComponent(ƒ.ComponentCamera), _canvas);
    }

    function createCamera(_translation: ƒ.Vector3 = new ƒ.Vector3(1, 1, 10), _lookAt: ƒ.Vector3 = new ƒ.Vector3()): ƒ.Node {
        let camera: ƒ.Node = new ƒ.Node("Camera");
        let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform();
        cmpTransform.local.translate(_translation);
        cmpTransform.local.lookAt(_lookAt);
        camera.addComponent(cmpTransform);

        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.projectCentral(1, 45, ƒ.FIELD_OF_VIEW.DIAGONAL);
        camera.addComponent(cmpCamera);

        return camera;
    }

    function createBroadleaf(_name: string, _clrTrunk: ƒ.Color, _clrTop: ƒ.Color, _pos: ƒ.Vector3, _scale: ƒ.Vector3): ƒ.Node {
        let tree: ƒ.Node = new ƒ.Node(_name);

        let treeTrunk: ƒ.Node = createCompleteMeshNode("TreeTrunk", new ƒ.Material("TreeTrunk", ƒ.ShaderUniColor, new ƒ.CoatColored(_clrTrunk)), new ƒ.MeshCube);

        let cmpMeshTrunk: ƒ.ComponentMesh = treeTrunk.getComponent(ƒ.ComponentMesh);
        cmpMeshTrunk.pivot.scale(_scale);
        cmpMeshTrunk.pivot.translateY(_scale.y / 2);

        let treeTop: ƒ.Node = createCompleteMeshNode("TreeTop", new ƒ.Material("TreeTop", ƒ.ShaderUniColor, new ƒ.CoatColored(_clrTop)), new ƒ.MeshCube);

        let cmpMeshTreeTop: ƒ.ComponentMesh = treeTop.getComponent(ƒ.ComponentMesh);
        cmpMeshTreeTop.pivot.scale(new ƒ.Vector3((_scale.x * 2), (_scale.y * 3), (_scale.z * 2)));
        cmpMeshTreeTop.pivot.translateY(_scale.y * 1.5);

        tree.appendChild(treeTop);
        tree.appendChild(treeTrunk);
        tree.addComponent(new ƒ.ComponentTransform);
        tree.cmpTransform.local.translate(_pos);
        // Warum hat Transform mit cmpTransform einen shortcut und z.B. ein Mesh nicht?
        // Maybe weil jeder Node ein Transform hat, aber nicht jeder ein Mesh?

        return tree;
    }

    function createConifer(_name: string, _clrTrunk: ƒ.Color, _clrTop: ƒ.Color, _pos: ƒ.Vector3, _scale: ƒ.Vector3): ƒ.Node {
        let tree: ƒ.Node = new ƒ.Node(_name);
        let treeTrunk: ƒ.Node = createCompleteMeshNode("TreeTrunk", new ƒ.Material("TreeTrunk", ƒ.ShaderUniColor, new ƒ.CoatColored(_clrTrunk)), new ƒ.MeshCube);
        let cmpMeshTrunk: ƒ.ComponentMesh = treeTrunk.getComponent(ƒ.ComponentMesh);
        cmpMeshTrunk.pivot.scale(_scale);
        cmpMeshTrunk.pivot.translateY(_scale.y / 2);

        let treeTop: ƒ.Node = createCompleteMeshNode("TreeTop", new ƒ.Material("TreeTop", ƒ.ShaderUniColor, new ƒ.CoatColored(_clrTop)), new ƒ.MeshPyramid);
        let cmpMeshTreeTop: ƒ.ComponentMesh = treeTop.getComponent(ƒ.ComponentMesh);
        cmpMeshTreeTop.pivot.scale(new ƒ.Vector3((_scale.x * 2), (_scale.y * 3), (_scale.z * 2)));
        cmpMeshTreeTop.pivot.translateY((_scale.y / 2));

        tree.appendChild(treeTop);
        tree.appendChild(treeTrunk);

        tree.addComponent(new ƒ.ComponentTransform);
        tree.cmpTransform.local.translate(_pos);

        return tree;
    }

    function createMushroom(_name: string, _clrTrunk: ƒ.Color, _clrCap: ƒ.Color, _pos: ƒ.Vector3, _scale: ƒ.Vector3): ƒ.Node {
        let mushroom: ƒ.Node = new ƒ.Node(_name);
        let mushroomTrunk: ƒ.Node = createCompleteMeshNode("MushroomTrunk", new ƒ.Material("MushroomTrunk", ƒ.ShaderUniColor, new ƒ.CoatColored(_clrTrunk)), new ƒ.MeshCube);
        let cmpMesh: ƒ.ComponentMesh = mushroomTrunk.getComponent(ƒ.ComponentMesh);
        cmpMesh.pivot.scale(_scale); cmpMesh.pivot.translateY(_scale.y / 2);

        let mushroomCap: ƒ.Node = createCompleteMeshNode("MushroomCapRed", new ƒ.Material("MushroomCapRed", ƒ.ShaderUniColor, new ƒ.CoatColored(_clrCap)), new ƒ.MeshCube);
        let cmpMeshCap: ƒ.ComponentMesh = mushroomCap.getComponent(ƒ.ComponentMesh); cmpMeshCap.pivot.scale(new ƒ.Vector3((_scale.x * 2), (_scale.y - 0.05), (_scale.z * 2)));
        cmpMeshCap.pivot.translateY((_scale.y));

        mushroom.appendChild(mushroomCap);
        mushroom.appendChild(mushroomTrunk);
        mushroom.addComponent(new ƒ.ComponentTransform);
        mushroom.cmpTransform.local.translate(_pos);

        return mushroom;
    }

    function handleKeyDown(_event: KeyboardEvent): void {
        let keyPressed: string = _event.key;
        console.log(keyPressed);

        switch (keyPressed) {
            case "w":
                camera.cmpTransform.local.translateZ(1);
                break;
            case "s":
                camera.cmpTransform.local.translateZ(-1);
                break;
            case "a":
                camera.cmpTransform.local.translateX(1);
                break;
            case "d":
                camera.cmpTransform.local.translateX(-1);
                break;
            case "Shift":
                camera.cmpTransform.local.translateY(1);
                break;
            case "Control":
                camera.cmpTransform.local.translateY(-1);
                break;
            case "q":
                camera.cmpTransform.local.rotateZ(-1);
                break;
            case "e":
                camera.cmpTransform.local.rotateZ(1);
                break;
            case "ArrowUp":
                camera.cmpTransform.local.rotateX(-1);
                break;
            case "ArrowDown":
                camera.cmpTransform.local.rotateX(1);
                break;
            case "ArrowLeft":
                camera.cmpTransform.local.rotateY(1);
                break;
            case "ArrowRight":
                camera.cmpTransform.local.rotateY(-1);
                break;
        }
        viewPort.draw();
    }
}