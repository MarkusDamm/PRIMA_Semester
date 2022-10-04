"use strict";
var L11_Doom;
(function (L11_Doom) {
    var ƒ = FudgeCore;
    class Wall extends L11_Doom.GameObject {
        constructor(_size, _position, _rotation, _material) {
            super("Wall", _position, _rotation);
            let cmpQuad = new ƒ.ComponentMesh(Wall.meshQuad);
            this.addComponent(cmpQuad);
            cmpQuad.pivot.scale(_size.toVector3(1));
            let cmpMaterial = new ƒ.ComponentMaterial(_material);
            cmpMaterial.pivot.scale(ƒ.Vector2.ONE(1));
            this.addComponent(cmpMaterial);
        }
    }
    Wall.meshQuad = new ƒ.MeshQuad();
    L11_Doom.Wall = Wall;
})(L11_Doom || (L11_Doom = {}));
//# sourceMappingURL=Wall.js.map