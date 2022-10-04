"use strict";
var L09_Doom_Control;
(function (L09_Doom_Control) {
    class Avatar extends ƒ.Node {
        constructor() {
            super("Avatar");
            let cmpCamera = new ƒ.ComponentCamera();
            this.addComponent(cmpCamera);
            let cmpTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.ZERO()));
            this.addComponent(cmpTransform);
        }
    }
    L09_Doom_Control.Avatar = Avatar;
})(L09_Doom_Control || (L09_Doom_Control = {}));
//# sourceMappingURL=Avatar.js.map