"use strict";
var L06_BreakOut_Interactive;
(function (L06_BreakOut_Interactive) {
    var ƒ = FudgeCore;
    class Moveable extends L06_BreakOut_Interactive.GameObject {
        constructor() {
            super(...arguments);
            this.velocity = ƒ.Vector2.ZERO();
        }
        update() {
            this.move();
        }
        isColliding(_target) {
            let intersection = this.rect.getIntersection(_target.rect);
            if (intersection == null) {
                return false;
            }
            return true;
        }
        move() {
            let frameTime = ƒ.Loop.timeFrameGame / 1000;
            let distance = ƒ.Vector2.SCALE(this.velocity, frameTime);
            this.mtxLocal.translate(distance.toVector3());
            this.rect.position = this.mtxLocal.translation.toVector2();
            this.rect.position.add(new ƒ.Vector2(this.rect.size.x / -2, this.rect.size.y / -2));
        }
    }
    L06_BreakOut_Interactive.Moveable = Moveable;
})(L06_BreakOut_Interactive || (L06_BreakOut_Interactive = {}));
//# sourceMappingURL=Moveable.js.map