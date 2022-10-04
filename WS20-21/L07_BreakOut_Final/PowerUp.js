"use strict";
var L07_BreakOut_Final;
(function (L07_BreakOut_Final) {
    var ƒ = FudgeCore;
    class PowerUp extends L07_BreakOut_Final.Moveable {
        constructor(_name, _position, _size) {
            super(_name, _position, _size);
            this.setVelocity(ƒ.Vector2.Y(-2));
            this.getComponent(ƒ.ComponentMesh).mesh = PowerUp.meshSphere;
        }
        setVelocity(_velocity) {
            this.velocity = _velocity;
        }
        update() {
            super.update();
            // console.log(this.mtxLocal.translation);
        }
    }
    PowerUp.meshSphere = new ƒ.MeshSphere("PowerUp", 10, 5);
    L07_BreakOut_Final.PowerUp = PowerUp;
})(L07_BreakOut_Final || (L07_BreakOut_Final = {}));
//# sourceMappingURL=PowerUp.js.map