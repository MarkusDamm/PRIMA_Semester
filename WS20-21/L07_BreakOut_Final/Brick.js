"use strict";
var L07_BreakOut_Final;
(function (L07_BreakOut_Final) {
    var ƒ = FudgeCore;
    class Brick extends L07_BreakOut_Final.GameObject {
        constructor(_name, _position, _size = new ƒ.Vector2(3, 1)) {
            super(_name, _position, _size);
            this.health = 3;
            this.reward = 5;
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = ƒ.Color.CSS("SteelBlue");
        }
        processCollision() {
            this.health--;
            if (this.health == 2)
                this.getComponent(ƒ.ComponentMaterial).clrPrimary = ƒ.Color.CSS("GoldenRod");
            else if (this.health == 1)
                this.getComponent(ƒ.ComponentMaterial).clrPrimary = ƒ.Color.CSS("Maroon");
            else if (this.health <= 0)
                this.destroy();
        }
        destroy() {
            L07_BreakOut_Final.addPoints(this.reward);
            this.getParent().removeChild(this);
        }
    }
    L07_BreakOut_Final.Brick = Brick;
})(L07_BreakOut_Final || (L07_BreakOut_Final = {}));
//# sourceMappingURL=Brick.js.map