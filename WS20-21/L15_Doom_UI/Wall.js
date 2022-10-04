"use strict";
var L15_Doom_UI;
(function (L15_Doom_UI) {
    var ƒ = FudgeCore;
    class Wall extends L15_Doom_UI.GameObject {
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
    L15_Doom_UI.Wall = Wall;
})(L15_Doom_UI || (L15_Doom_UI = {}));
//# sourceMappingURL=Wall.js.map