namespace L04_BreakOut_Reflection {
    import ƒ = FudgeCore;

    export class GameObject extends ƒ.Node {
        private static readonly meshQuad: ƒ.MeshQuad = new ƒ.MeshQuad();
        private static readonly mtrSolidWhite: ƒ.Material = new ƒ.Material("SolidWhite", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("White")));

        public rect: ƒ.Rectangle;

        public constructor(_name: string, _position: ƒ.Vector2 = new ƒ.Vector2(0, 0), _size: ƒ.Vector2 = new ƒ.Vector2(1, 1)) {
            super(_name);
            this.rect = new ƒ.Rectangle(_position.x, _position.y, _size.x, _size.y, ƒ.ORIGIN2D.CENTER);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position.toVector3(0))));

            let cmpQuad: ƒ.ComponentMesh = new ƒ.ComponentMesh(GameObject.meshQuad);
            this.addComponent(cmpQuad);
            cmpQuad.pivot.scale(_size.toVector3(0));

            let cmpMtr: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(GameObject.mtrSolidWhite);
            this.addComponent(cmpMtr);
        }

    }
}