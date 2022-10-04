"use strict";
var L07_BreakOut_Final;
(function (L07_BreakOut_Final) {
    var ƒ = FudgeCore;
    class Paddle extends L07_BreakOut_Final.Moveable {
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
    L07_BreakOut_Final.Paddle = Paddle;
})(L07_BreakOut_Final || (L07_BreakOut_Final = {}));
//# sourceMappingURL=Paddle.js.map