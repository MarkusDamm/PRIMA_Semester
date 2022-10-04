namespace L04_BreakOut_Reflection {
    import ƒ = FudgeCore;

    export class Brick extends GameObject {
        private health: number = 1;

        public constructor(_name: string, _position: ƒ.Vector2, _size: ƒ.Vector2 = new ƒ.Vector2(3, 1)) {
            super(_name, _position, _size);
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = ƒ.Color.CSS("SteelBlue");
        }

        public processCollision(): void {
            this.health--;
            console.log(this.health);
            
            if (this.health <= 0) {
                this.destroy();
            }
        }

        private destroy(): void {
            console.log("Destroy this");
            this.getParent().removeChild(this);
        }
    }
}