namespace L09_Doom_Control {
    import f = FudgeCore;

    export class Floor extends GameObject {
        private static COUNTER: number = 0;
        private static readonly MATERIAL: f.Material = new f.Material("SolidWhite", f.ShaderTexture, new f.CoatTextured(f.Color.CSS("WHITE"), new f.TextureImage("../DoomAssets/Doom_Floor01")));
        /**
         * Creates a new floor based on GameObject
         * @param _position The position of the floor in 3D space
         * @param _size The size of the floor
         */
        public constructor(_position: f.Vector3, _size: f.Vector3) {
            super(`Floor-${Floor.COUNTER++}`, _position, _size, Floor.MATERIAL);
        }
    }
}