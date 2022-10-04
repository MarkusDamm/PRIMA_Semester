"use strict";
var L07_BreakOut_Final;
(function (L07_BreakOut_Final) {
    var ƒ = FudgeCore;
    class GameObject extends ƒ.Node {
        constructor(_name, _position = new ƒ.Vector2(0, 0), _size = new ƒ.Vector2(1, 1)) {
            super(_name);
            this.size = _size;
            this.rect = new ƒ.Rectangle(_position.x, _position.y, this.size.x, this.size.y, ƒ.ORIGIN2D.CENTER);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position.toVector3(0))));
            let cmpQuad = new ƒ.ComponentMesh(GameObject.meshQuad);
            this.addComponent(cmpQuad);
            cmpQuad.pivot.scale(this.size.toVector3());
            let cmpMtr = new ƒ.ComponentMaterial(GameObject.mtrSolidWhite);
            this.addComponent(cmpMtr);
        }
        increaseSize(_v2ToAddToScale) {
            this.size.add(_v2ToAddToScale);
            this.rect.setPositionAndSize(this.rect.position.x, this.rect.position.y, this.size.x, this.size.y, ƒ.ORIGIN2D.CENTER);
            this.getComponent(ƒ.ComponentMesh).pivot.scaling.set(this.size.x, this.size.y);
            // this.cmpTransform.local.scaling = this.size.toVector3();
        }
    }
    GameObject.meshQuad = new ƒ.MeshQuad();
    GameObject.mtrSolidWhite = new ƒ.Material("SolidWhite", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("White")));
    L07_BreakOut_Final.GameObject = GameObject;
})(L07_BreakOut_Final || (L07_BreakOut_Final = {}));
//# sourceMappingURL=GameObject.js.map