"use strict";
var L09_Doom_Control;
(function (L09_Doom_Control) {
    var ƒ = FudgeCore;
    var ƒaid = FudgeAid;
    window.addEventListener("load", hndLoad);
    let viewport;
    let root;
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        root = new ƒ.Node("Root");
        let meshQuad = new ƒ.MeshQuad("Quad");
        let txtFloor = new ƒ.TextureImage("../DoomAssets/DEM1_5.png");
        let mtrFloor = new ƒ.Material("Floor", ƒ.ShaderTexture, new ƒ.CoatTextured(null, txtFloor));
        let floor = new ƒaid.Node("Floor", ƒ.Matrix4x4.ROTATION_X(-90), mtrFloor, meshQuad);
        floor.mtxLocal.scale(ƒ.Vector3.ONE(20));
        floor.getComponent(ƒ.ComponentMaterial).pivot.scale(ƒ.Vector2.ONE(10));
        root.appendChild(floor);
        let txtWall = new ƒ.TextureImage("../DoomAssets/CEMPOIS.png");
        let mtrWall = new ƒ.Material("Wall", ƒ.ShaderTexture, new ƒ.CoatTextured(null, txtWall));
        let wall = new ƒaid.Node("Wall", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(1)), mtrWall, meshQuad);
        wall.mtxLocal.scale(ƒ.Vector3.ONE(2));
        wall.getComponent(ƒ.ComponentMaterial).pivot.scale(ƒ.Vector2.ONE(1));
        root.appendChild(wall);
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(ƒ.Vector3.ONE(7));
        cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        cmpCamera.backgroundColor = ƒ.Color.CSS("darkblue");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", root, cmpCamera, canvas);
        viewport.draw();
    }
})(L09_Doom_Control || (L09_Doom_Control = {}));
//# sourceMappingURL=Main.js.map