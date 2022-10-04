namespace L09_Doom_Control {
    import f = FudgeCore;

    export class Prop extends GameObject {
        /**
         * Creates a new floor based on GameObject
         * @param _position The position of the floor in 3D space
         * @param _size The size of the floor
         */
        public constructor(_name: String, _position: f.Vector3, _size: f.Vector3, _zRotation: number, _material: f.Material) {
            super(`Prop-${_name}`, _position, _size, _material);
            this.mtxLocal.rotateX(_zRotation);
        }
    }
}