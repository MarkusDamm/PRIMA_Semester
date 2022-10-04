"use strict";
var L14_Doom;
(function (L14_Doom) {
    var ƒ = FudgeCore;
    class GameObject extends ƒ.Node {
        // private static readonly meshQuad: ƒ.MeshQuad = new ƒ.MeshQuad();
        constructor(_name, _position, _rotation) {
            super(_name);
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translation = _position;
            this.mtxLocal.rotation = _rotation;
            // let cmpQuad: ƒ.ComponentMesh = new ƒ.ComponentMesh(GameObject.meshQuad);
            // this.addComponent(cmpQuad);
            // cmpQuad.pivot.scale(_size.toVector3(1));
        }
        calculateBounce(_posWith, _radius = 1) {
            let normal = this.mtxWorld.getZ();
            let posThis = this.mtxWorld.translation;
            let difference = ƒ.Vector3.DIFFERENCE(_posWith, posThis);
            let distance = ƒ.Vector3.DOT(difference, normal);
            if (distance < 0 || distance > _radius)
                return null;
            let size = this.getComponent(ƒ.ComponentMesh).pivot.scaling;
            let ray = new ƒ.Ray(normal, _posWith);
            let intersect = ray.intersectPlane(posThis, normal);
            let localIntersect = ƒ.Vector3.TRANSFORMATION(intersect, this.mtxWorldInverse, true);
            if (Math.abs(localIntersect.x) - _radius > 0.5 * size.x)
                return null;
            normal.scale(1.001);
            return ƒ.Vector3.SUM(intersect, normal);
        }
    }
    L14_Doom.GameObject = GameObject;
})(L14_Doom || (L14_Doom = {}));
//# sourceMappingURL=GameObject.js.map