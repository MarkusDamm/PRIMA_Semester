namespace L04_BreakOut_Reflection {
    import ƒ = FudgeCore;

    export class Ball extends GameObject {

        public velocity: ƒ.Vector2;

        public constructor(_name: string) {
            super(_name);
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = ƒ.Color.CSS("ForestGreen");
            this.setVelocity(new ƒ.Vector2());
        }

        public setVelocity(_velocity: ƒ.Vector2): void {
            this.velocity = ƒ.Vector2.SCALE(_velocity, 2);
        }

        public update(): void {
            this.move();
        }

        public isColliding(_target: GameObject): boolean {
            let intersection: ƒ.Rectangle = this.rect.getIntersection(_target.rect);
            if (intersection == null) {
                return false;
            }
            return true;
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

        private move(): void {
            let frameTime: number = ƒ.Loop.timeFrameGame / 1000;
            let distance: ƒ.Vector2 = ƒ.Vector2.SCALE(this.velocity, frameTime);

            this.mtxLocal.translate(distance.toVector3());
            this.rect.position = this.mtxLocal.translation.toVector2();
            this.rect.position.add(new ƒ.Vector2(this.rect.size.x / -2, this.rect.size.y / -2));
        }

    }
}