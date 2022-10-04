"use strict";
var L06_BreakOut_Interactive;
(function (L06_BreakOut_Interactive) {
    var ƒ = FudgeCore;
    class Paddle extends L06_BreakOut_Interactive.Moveable {
        constructor(_name, _position, _size = new ƒ.Vector2(3, 1)) {
            super(_name, _position, _size);
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = ƒ.Color.CSS("Orange");
        }
        setVelocity(_velocity = Paddle.MOVE_VECTOR_RIGHT) {
            this.velocity = _velocity;
        }
    }
    Paddle.MOVE_VECTOR_RIGHT = ƒ.Vector2.X(10);
    Paddle.MOVE_VECTOR_LEFT = ƒ.Vector2.X(-10);
    L06_BreakOut_Interactive.Paddle = Paddle;
})(L06_BreakOut_Interactive || (L06_BreakOut_Interactive = {}));
//# sourceMappingURL=Paddle.js.map