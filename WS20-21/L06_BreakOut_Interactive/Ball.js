"use strict";
var L06_BreakOut_Interactive;
(function (L06_BreakOut_Interactive) {
    var ƒ = FudgeCore;
    class Ball extends L06_BreakOut_Interactive.Moveable {
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
    L06_BreakOut_Interactive.Ball = Ball;
})(L06_BreakOut_Interactive || (L06_BreakOut_Interactive = {}));
//# sourceMappingURL=Ball.js.map