"use strict";
var L09_Doom_Control;
(function (L09_Doom_Control) {
    class Prop extends L09_Doom_Control.GameObject {
        /**
         * Creates a new floor based on GameObject
         * @param _position The position of the floor in 3D space
         * @param _size The size of the floor
         */
        constructor(_name, _position, _size, _zRotation, _material) {
            super(`Prop-${_name}`, _position, _size, _material);
            this.mtxLocal.rotateX(_zRotation);
        }
    }
    L09_Doom_Control.Prop = Prop;
})(L09_Doom_Control || (L09_Doom_Control = {}));
//# sourceMappingURL=prop.js.map