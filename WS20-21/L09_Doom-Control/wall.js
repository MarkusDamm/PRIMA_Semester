"use strict";
var L09_Doom_Control;
(function (L09_Doom_Control) {
    var f = FudgeCore;
    // import utils = Utils;
    class Wall extends L09_Doom_Control.GameObject {
        /**
         * Creates a new wall based on GameObject
         * @param _position The position of the wall in 3D space
         * @param _size The size of the wall
         */
        constructor(_position, _size, _zRotation) {
            super(`Wall-${Wall.COUNTER++}`, _position, _size, Wall.TEXTURE_MATERIAL);
            this.mtxLocal.rotateY(90);
            this.mtxLocal.rotateX(_zRotation);
        }
    }
    Wall.COUNTER = 0;
    Wall.TEXTURE_MATERIAL = new f.Material("Texture", f.ShaderTexture, new f.CoatTextured(f.Color.CSS("WHITE"), new f.TextureImage("../DoomAssets/Doom_Wall01")));
    L09_Doom_Control.Wall = Wall;
})(L09_Doom_Control || (L09_Doom_Control = {}));
//# sourceMappingURL=wall.js.map