"use strict";
var L09_Doom_Control;
(function (L09_Doom_Control) {
    var f = FudgeCore;
    class GameObject extends f.Node {
        /**
         * The constructor constructs a new GameObject. If the object should be moveable,
         * refer to Moveable
         * @param _name The name of the GameObject
         * @param _position The fixed position of the GameObject
         * @param _size The initial size of the GameObject
         */
        constructor(_name, _position, _size, _material) {
            super(_name);
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(_position)));
            this.mtxLocal.rotateX(-90);
            let cmpQuad = new f.ComponentMesh(GameObject.MESH_QUAD);
            this.addComponent(cmpQuad);
            cmpQuad.pivot.scale(_size);
            let cmpMaterial = new f.ComponentMaterial(_material);
            this.addComponent(cmpMaterial);
        }
    }
    GameObject.MESH_QUAD = new f.MeshQuad();
    L09_Doom_Control.GameObject = GameObject;
})(L09_Doom_Control || (L09_Doom_Control = {}));
//# sourceMappingURL=gameobject.js.map