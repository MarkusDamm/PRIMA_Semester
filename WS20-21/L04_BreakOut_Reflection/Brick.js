"use strict";
var L04_BreakOut_Reflection;
(function (L04_BreakOut_Reflection) {
    var ƒ = FudgeCore;
    class Brick extends L04_BreakOut_Reflection.GameObject {
        constructor(_name, _position, _size = new ƒ.Vector2(3, 1)) {
            super(_name, _position, _size);
            this.health = 1;
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = ƒ.Color.CSS("SteelBlue");
        }
        processCollision() {
            this.health--;
            console.log(this.health);
            if (this.health <= 0) {
                this.destroy();
            }
        }
        destroy() {
            console.log("Destroy this");
            this.getParent().removeChild(this);
        }
    }
    L04_BreakOut_Reflection.Brick = Brick;
})(L04_BreakOut_Reflection || (L04_BreakOut_Reflection = {}));
//# sourceMappingURL=Brick.js.map