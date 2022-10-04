"use strict";
var L09_Doom_Control_Copy;
(function (L09_Doom_Control_Copy) {
    var ƒ = FudgeCore;
    class Wall extends L09_Doom_Control_Copy.GameObject {
        // private static readonly meshQuad: ƒ.MeshQuad = new ƒ.MeshQuad();
        constructor(_size, _position, _rotation, _material) {
            super("Wall", _size, _position, _rotation);
            // let floor: ƒaid.Node = new ƒaid.Node("Floor", ƒ.Matrix4x4.ROTATION_X(-90), mtrFloor, meshQuad);
            let cmpMaterial = new ƒ.ComponentMaterial(_material);
            cmpMaterial.pivot.scale(ƒ.Vector2.ONE(1));
            this.addComponent(cmpMaterial);
        }
    }
    L09_Doom_Control_Copy.Wall = Wall;
})(L09_Doom_Control_Copy || (L09_Doom_Control_Copy = {}));
//# sourceMappingURL=Wall.js.map