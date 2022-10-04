namespace L02_Fudge {
    import ƒ = FudgeCore;

    window.addEventListener("load", hndLoad);
    window.addEventListener("click", hndRotate);

    let canvas: HTMLCanvasElement;
    let root: ƒ.Node;
    let viewport: ƒ.Viewport;
    let cmpCamera: ƒ.ComponentCamera;

    function hndLoad(_event: Event): void {
        canvas = document.querySelector("canvas");

        root = new ƒ.Node("Root");
        root.addComponent(new ƒ.ComponentTransform());

        let quad: ƒ.Node = new ƒ.Node("Quad");

        let meshQuad: ƒ.MeshQuad = new ƒ.MeshQuad();
        let cmpMeshQuad: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshQuad);
        quad.addComponent(cmpMeshQuad);

        let mtrSolidWhite: ƒ.Material = new ƒ.Material("SolidWhite", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")));
        let cmpMaterialQuad: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidWhite);
        quad.addComponent(cmpMaterialQuad);
        root.addChild(quad);

        //#region Torus
        let torus: ƒ.Node = new ƒ.Node("Torus");
        let meshTorus: ƒ.MeshTorus = new ƒ.MeshTorus("Torus", 1, 10, 3);
        let cmpMeshTorus: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshTorus);

        cmpMeshTorus.pivot.translateX(0);
        cmpMeshTorus.pivot.rotateZ(90);
        cmpMeshTorus.pivot.rotateX(90);
        torus.addComponent(cmpMeshTorus);

        let matOrange: ƒ.Material = new ƒ.Material("Orange", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("ORANGE")));
        let cmpMatTorus: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(matOrange);
        torus.addComponent(cmpMatTorus);
        root.appendChild(torus);
        //#endregion
        //#region Cube
        let cube: ƒ.Node = new ƒ.Node("Cube");
        let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
        let cmpMeshCube: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
        let matRed: ƒ.Material = new ƒ.Material("Red", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("RED")));
        let cmpMatCube: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(matRed);

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

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, hndLoop);
        
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", root, cmpCamera, canvas);
        ƒ.Debug.log(viewport);
        
        viewport.draw();
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
    }
    
    function hndRotate(_event: MouseEvent): void {
        ƒ.Time.game.setScale(); // testing
    }
    
    function hndLoop(_event: Event): void {
        console.log("tick");
        // cmpCamera.pivot.rotateZ(0.5);
        
        // viewport.getGraph().mtxLocal.rotateZ(1); 
        root.mtxLocal.rotateZ(1);
        // mtxLocal ist der shortcut für die locale Transform-Componente

        viewport.draw();
    }
}