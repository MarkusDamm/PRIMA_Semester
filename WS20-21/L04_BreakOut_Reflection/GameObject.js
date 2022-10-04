"use strict";
var L04_BreakOut_Reflection;
(function (L04_BreakOut_Reflection) {
    var ƒ = FudgeCore;
    class GameObject extends ƒ.Node {
        constructor(_name, _position = new ƒ.Vector2(0, 0), _size = new ƒ.Vector2(1, 1)) {
            super(_name);
            this.rect = new ƒ.Rectangle(_position.x, _position.y, _size.x, _size.y, ƒ.ORIGIN2D.CENTER);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position.toVector3(0))));
            let cmpQuad = new ƒ.ComponentMesh(GameObject.meshQuad);
            this.addComponent(cmpQuad);
            cmpQuad.pivot.scale(_size.toVector3(0));
            let cmpMtr = new ƒ.ComponentMaterial(GameObject.mtrSolidWhite);
            this.addComponent(cmpMtr);
        }
    }
    GameObject.meshQuad = new ƒ.MeshQuad();
    GameObject.mtrSolidWhite = new ƒ.Material("SolidWhite", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("White")));
    L04_BreakOut_Reflection.GameObject = GameObject;
})(L04_BreakOut_Reflection || (L04_BreakOut_Reflection = {}));
//# sourceMappingURL=GameObject.js.map