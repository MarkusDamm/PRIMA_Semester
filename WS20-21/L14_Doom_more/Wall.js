"use strict";
var L14_Doom;
(function (L14_Doom) {
    var ƒ = FudgeCore;
    class Wall extends L14_Doom.GameObject {
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
    L14_Doom.Wall = Wall;
})(L14_Doom || (L14_Doom = {}));
//# sourceMappingURL=Wall.js.map