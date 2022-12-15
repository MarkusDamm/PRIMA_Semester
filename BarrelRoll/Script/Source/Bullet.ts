namespace Script {
  import ƒ = FudgeCore;

  export class Bullet extends ƒ.Node {
    static bulletResource: string = "Graph|2022-12-12T15:53:18.076Z|03469";
    private static speed: number = 1.5;
    private static livetime: number = 3000;

    constructor(_transl: ƒ.Matrix4x4) {
      super("Bullet");
      let bulletGraph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources[Bullet.bulletResource];
      let newBullet: ƒ.GraphInstance = new ƒ.GraphInstance(bulletGraph);
      newBullet.reset();

      let mtx: ƒ.Matrix4x4 = new ƒ.Matrix4x4();
      mtx.translation = _transl.translation;
      mtx.rotation = _transl.rotation;
      this.addComponent(new ƒ.ComponentTransform(mtx));
      this.mtxLocal.translateZ(5);
      // this.mtxLocal.rotateX(90, false);

      this.appendChild(newBullet);
      this.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.update);

      setTimeout(this.delete, Bullet.livetime);
    }

    /**
     * update
     */
    public update = (): void => {
      this.move();
    }

    private move(): void {
      this.mtxLocal.translateZ(Bullet.speed);
    }

    private delete = (): void => {
      this.getParent().removeChild(this);
    }
  }
}