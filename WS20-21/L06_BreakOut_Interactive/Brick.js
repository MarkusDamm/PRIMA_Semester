"use strict";
var L06_BreakOut_Interactive;
(function (L06_BreakOut_Interactive) {
    var ƒ = FudgeCore;
    class Brick extends L06_BreakOut_Interactive.GameObject {
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
            L06_BreakOut_Interactive.addPoints(this.reward);
            this.getParent().removeChild(this);
        }
    }
    L06_BreakOut_Interactive.Brick = Brick;
})(L06_BreakOut_Interactive || (L06_BreakOut_Interactive = {}));
//# sourceMappingURL=Brick.js.map