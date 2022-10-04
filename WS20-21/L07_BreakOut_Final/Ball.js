"use strict";
var L07_BreakOut_Final;
(function (L07_BreakOut_Final) {
    var ƒ = FudgeCore;
    class Ball extends L07_BreakOut_Final.Moveable {
        constructor(_name) {
            super(_name);
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = ƒ.Color.CSS("ForestGreen");
        }
        setVelocity(_velocity) {
            this.velocity = ƒ.Vector2.SCALE(_velocity, 2);
        }
        hdlCollision(_colliderGO) {
            let intersection = this.rect.getIntersection(_colliderGO.rect);
            if (intersection.size.x > intersection.size.y) {
                this.velocity.y = this.velocity.y * -1;
                document.querySelector("div").dispatchEvent(new Event("adjust"));
            }
            else {
                this.velocity.x = this.velocity.x * -1;
                document.querySelector("div").dispatchEvent(new Event("adjust"));
            }
        }
    }
    L07_BreakOut_Final.Ball = Ball;
})(L07_BreakOut_Final || (L07_BreakOut_Final = {}));
//# sourceMappingURL=Ball.js.map