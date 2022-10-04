namespace L06_BreakOut_Interactive {
    import ƒ = FudgeCore;

    export class Ball extends Moveable {

        public constructor(_name: string) {
            super(_name);
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = ƒ.Color.CSS("ForestGreen");
        }

        public setVelocity(_velocity: ƒ.Vector2): void {
            this.velocity = ƒ.Vector2.SCALE(_velocity, 2);
        }

        public hdlCollision(_colliderGO: GameObject): void {
            let intersection: ƒ.Rectangle = this.rect.getIntersection(_colliderGO.rect);
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
}