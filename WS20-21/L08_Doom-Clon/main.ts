namespace L08_Doom_Start {
    import ƒ = FudgeCore;

    window.addEventListener("load", init);

    let root: ƒ.Node;
    let floor: ƒ.Node;
    let viewport: ƒ.Viewport;
    let camera: ƒ.ComponentCamera;



    function init(_event: Event): void {
        root = new ƒ.Node("Root");
        floor = new ƒ.Node("Floor");

        let tsfFloor: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-90, 0, 0)));
        floor.addComponent(tsfFloor);

        let meshFloor: ƒ.ComponentMesh = new ƒ.ComponentMesh(new ƒ.MeshQuad("Floor"));
        floor.addComponent(meshFloor);

        let matFloor: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(new ƒ.Material("FloorMat", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("orange"))));
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
}