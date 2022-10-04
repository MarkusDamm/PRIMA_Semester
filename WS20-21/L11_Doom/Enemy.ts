namespace L11_Doom {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export enum ANGLE {
    // N = 0, NE = 1, E = 2, SE = 3, S = 4, SW = 5, W = 6, NW = 7,
    _000 = 0, _045 = 1, _090 = 2, _135 = 3, _180 = 4, _225 = 5, _270 = 6, _315 = 7
  }

  export class Enemy extends GameObject {
    protected static readonly TXT_ENEMY: ƒ.TextureImage = new ƒ.TextureImage("../DoomAssets/Cyberdemon01.png");
    protected static readonly SIZE: ƒ.Vector2 = ƒ.Vector2.ONE(2);

    private static animations: ƒAid.SpriteSheetAnimations;

    protected show: ƒ.Node;
    protected sprite: ƒAid.NodeSprite;
    protected posTarget: ƒ.Vector3;

    protected health: number;
    protected speed: number = 0.1;
    protected angle: number;

    constructor(_position: ƒ.Vector3) {
      super("Enemy", _position, ƒ.Vector3.ZERO());

      this.show = new ƒAid.Node("Show", ƒ.Matrix4x4.IDENTITY());
      this.appendChild(this.show);

      this.sprite = new ƒAid.NodeSprite("Sprite");
      this.show.appendChild(this.sprite);

      this.sprite.setAnimation(<ƒAid.SpriteSheetAnimation>Enemy.animations["Idle_000"]);
      this.sprite.setFrameDirection(1);
      this.sprite.framerate = 2;

      this.posTarget = _position;

      // let mtrEnemy: ƒ.Material = new ƒ.Material("Enemy", ƒ.ShaderTexture, new ƒ.CoatTextured(null, Enemy.TXT_ENEMY));
      // let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrEnemy);
      // cmpMaterial.pivot.scale(ƒ.Vector2.ONE(1));

      // this.addComponent(cmpMaterial);
    }

    public static generateSprites(_spritesheet: ƒ.CoatTextured): void {
      Enemy.animations = {};
      for (let angle: number = 0; angle < 8; angle++) {
        let name: string = "Idle" + ANGLE[angle];
        let sprite: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation(name, _spritesheet);
        sprite.generateByGrid(ƒ.Rectangle.GET(44 + angle * 160, 33, 82, 108), 4, 32, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.Y(143));
        Enemy.animations[name] = sprite;
      }
    }

    public update(_avatarPosition: ƒ.Vector3): void {
      this.posTarget = _avatarPosition;
      if (this.checkVision()) {
        this.moveTowards();
      }
      this.show.mtxLocal.showTo(_avatarPosition, ƒ.Vector3.Y(), true);
      // console.log(this.show.mtxLocal.rotation.y - this.mtxLocal.rotation.y);
      this.adjustSprites();

      // this.angle = calculateAngle(this.mtxLocal.rotation, this.show.mtxLocal.rotation);
    }


    protected moveTowards(): void {
      // this.mtxLocal.showTo(this.posTarget, ƒ.Vector3.Y(), true);
      // this.mtxLocal.translateZ(this.speed);
    }

    protected checkVision(): boolean {

      return true;
    }

    protected adjustSprites(): void {
      let angle: number = this.show.mtxLocal.rotation.y;
      console.log(angle);

      if (-22 < angle && angle < 22)
        this.sprite.setAnimation(<ƒAid.SpriteSheetAnimation>Enemy.animations["Idle_000"]);
      else if (angle < 67)
        this.sprite.setAnimation(<ƒAid.SpriteSheetAnimation>Enemy.animations["Idle_045"]);
      else if (angle < 112)
        this.sprite.setAnimation(<ƒAid.SpriteSheetAnimation>Enemy.animations["Idle_090"]);
      else if (angle < 157)
        this.sprite.setAnimation(<ƒAid.SpriteSheetAnimation>Enemy.animations["Idle_135"]);
      else if (angle < 180 || angle < -157)
        this.sprite.setAnimation(<ƒAid.SpriteSheetAnimation>Enemy.animations["Idle_180"]);
      else if (angle < -112)
        this.sprite.setAnimation(<ƒAid.SpriteSheetAnimation>Enemy.animations["Idle_225"]);
      else if (angle < -67)
        this.sprite.setAnimation(<ƒAid.SpriteSheetAnimation>Enemy.animations["Idle_270"]);
      else if (angle < -22)
        this.sprite.setAnimation(<ƒAid.SpriteSheetAnimation>Enemy.animations["Idle_315"]);

      // this.sprite.setFrameDirection(1);
      // this.sprite.framerate = 2;

    }

    // bis Dienstag: Gegner bei Sichtkontakt zum Spieler auf ihn zu bewegen
    // -> Ray zum Spieler -> wenn der Ray eine Wand zw Figur und Spieler trifft
    // Spritesheet vom Hare-Beispiel versuchen für den Gegner zu nutzen
    // Winkel des Gegners berechnen => daraus die richtigen Sprites ableiten und verwenden

    // 17.12. Besprechung der Spielkonzepte
  }

}