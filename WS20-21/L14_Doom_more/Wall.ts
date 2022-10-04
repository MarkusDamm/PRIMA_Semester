namespace L14_Doom {
  import ƒ = FudgeCore;

  export class Wall extends GameObject {
    private static readonly meshQuad: ƒ.MeshQuad = new ƒ.MeshQuad();

    public constructor(_size: ƒ.Vector2, _position: ƒ.Vector3, _rotation: ƒ.Vector3, _material: ƒ.Material) {
      super("Wall", _position, _rotation);

      let cmpQuad: ƒ.ComponentMesh = new ƒ.ComponentMesh(Wall.meshQuad);
      this.addComponent(cmpQuad);
      cmpQuad.pivot.scale(_size.toVector3(1));

      let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(_material);
      cmpMaterial.pivot.scale(ƒ.Vector2.ONE(1));
      this.addComponent(cmpMaterial);
    }
  }
}