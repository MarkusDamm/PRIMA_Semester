namespace L07_BreakOut_Final {
    import ƒ = FudgeCore;

    export abstract class Moveable extends GameObject {
        public velocity: ƒ.Vector2 = ƒ.Vector2.ZERO();

        abstract setVelocity(_velocity: ƒ.Vector2): void;

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

        protected move(): void {
            let frameTime: number = ƒ.Loop.timeFrameGame / 1000;
            let distance: ƒ.Vector2 = ƒ.Vector2.SCALE(this.velocity, frameTime);

            this.mtxLocal.translate(distance.toVector3());
            this.rect.position = this.mtxLocal.translation.toVector2();
            this.rect.position.add(new ƒ.Vector2(this.rect.size.x / -2, this.rect.size.y / -2));
        }

    }
}