namespace L07_BreakOut_Final {
    import ƒ = FudgeCore;

    export class PowerUp extends Moveable {
        private static readonly meshSphere: ƒ.MeshSphere = new ƒ.MeshSphere("PowerUp", 10, 5);

        public constructor(_name: string, _position: ƒ.Vector2, _size: ƒ.Vector2) {
            super(_name, _position, _size);

            this.setVelocity(ƒ.Vector2.Y(-2));

            this.getComponent(ƒ.ComponentMesh).mesh = PowerUp.meshSphere;
        }

        public setVelocity(_velocity: ƒ.Vector2): void {
            this.velocity = _velocity;
        }

        public update(): void {
            super.update();
            // console.log(this.mtxLocal.translation);
        }
    }
}