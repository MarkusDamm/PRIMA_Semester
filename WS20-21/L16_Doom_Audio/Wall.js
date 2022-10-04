"use strict";
var L16_Doom_Audio;
(function (L16_Doom_Audio) {
    var ƒ = FudgeCore;
    class Wall extends L16_Doom_Audio.GameObject {
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
    L16_Doom_Audio.Wall = Wall;
})(L16_Doom_Audio || (L16_Doom_Audio = {}));
//# sourceMappingURL=Wall.js.map