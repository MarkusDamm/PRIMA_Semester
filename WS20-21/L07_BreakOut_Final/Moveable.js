"use strict";
var L07_BreakOut_Final;
(function (L07_BreakOut_Final) {
    var ƒ = FudgeCore;
    class Moveable extends L07_BreakOut_Final.GameObject {
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
    L07_BreakOut_Final.Moveable = Moveable;
})(L07_BreakOut_Final || (L07_BreakOut_Final = {}));
//# sourceMappingURL=Moveable.js.map