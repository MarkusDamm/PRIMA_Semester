"use strict";
var L09_Doom_Control;
(function (L09_Doom_Control) {
    var f = FudgeCore;
    class Floor extends L09_Doom_Control.GameObject {
        /**
         * Creates a new floor based on GameObject
         * @param _position The position of the floor in 3D space
         * @param _size The size of the floor
         */
        constructor(_position, _size) {
            super(`Floor-${Floor.COUNTER++}`, _position, _size, Floor.MATERIAL);
        }
    }
    Floor.COUNTER = 0;
    Floor.MATERIAL = new f.Material("SolidWhite", f.ShaderTexture, new f.CoatTextured(f.Color.CSS("WHITE"), new f.TextureImage("../DoomAssets/Doom_Floor01")));
    L09_Doom_Control.Floor = Floor;
})(L09_Doom_Control || (L09_Doom_Control = {}));
//# sourceMappingURL=floor.js.map