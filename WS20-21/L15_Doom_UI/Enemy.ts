namespace L15_Doom_UI {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export enum ANGLE {
    // N = 0, NE = 1, E = 2, SE = 3, S = 4, SW = 5, W = 6, NW = 7,
    _000 = 0, _045 = 1, _090 = 2, _135 = 3, _180 = 4, _225 = 5, _270 = 6, _315 = 7
  }

  export enum STATE {
    IDLE, STOP, MOVE, ATTACK, DIE
  }

  export class Enemy extends GameObject {
    protected static readonly TXT_ENEMY: ƒ.TextureImage = new ƒ.TextureImage("../DoomAssets/Cyberdemon01.png");
    protected static readonly SIZE: ƒ.Vector2 = ƒ.Vector2.ONE(2);

    private static animations: ƒAid.SpriteSheetAnimations;

    protected show: ƒ.Node;
    protected sprite: ƒAid.NodeSprite;
    protected posTarget: ƒ.Vector3;

    protected health: number;
    protected speed: number = 2;
    protected angle: number;
    protected angleView: number = 0;

    protected state: STATE = STATE.IDLE;

    constructor(_position: ƒ.Vector3) {
      super("Enemy", _position, ƒ.Vector3.ZERO());

      this.show = new ƒAid.Node("Show", ƒ.Matrix4x4.IDENTITY());
      this.appendChild(this.show);

      this.sprite = new ƒAid.NodeSprite("Sprite");
      this.sprite.addComponent(new ƒ.ComponentTransform());
      this.show.appendChild(this.sprite);

      this.sprite.setAnimation(<ƒAid.SpriteSheetAnimation>Enemy.animations["Idle_000"]);
      this.sprite.setFrameDirection(1);
      this.sprite.framerate = 2;

      this.chooseTargetPosition();
      this.changeState(STATE.MOVE);
    }

    public static generateSprites(_spritesheet: ƒ.CoatTextured): void {
      Enemy.animations = {};
      for (let angle: number = 0; angle < 8; angle++) {
        let name: string = "Idle" + ANGLE[angle];
        let sprite: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation(name, _spritesheet);
        sprite.generateByGrid(ƒ.Rectangle.GET(44 + angle * 130, 33, 82, 108), 4, 32, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.Y(143));
        Enemy.animations[name] = sprite;
      }
    }

    public update(_avatarPosition: ƒ.Vector3): void {
      this.show.mtxLocal.showTo(ƒ.Vector3.TRANSFORMATION(_avatarPosition, this.mtxWorldInverse, true), ƒ.Vector3.Y(), true);
      this.adjustSprite();

      switch (this.state) {
        case STATE.MOVE:
          if (this.mtxLocal.translation.equals(this.posTarget, 0.1))
            this.changeState(STATE.STOP);
          else
            this.move();
          break;
        case STATE.STOP:
          this.changeState(STATE.IDLE);
          this.sprite.framerate = 0.2;
          setTimeout(this.changeState, 3000);
          // console.log("Stoped; change to idle, then to Move");
          break;
        case STATE.IDLE:
        default:
          break;
        case STATE.ATTACK:
          // attack
          break;
        case STATE.DIE:
          // change animation to dying
          break;
      }
    }

    protected changeState = (_state: STATE = STATE.MOVE): void => {
      this.state = _state;
      this.sprite.framerate = 2;
      if (_state == STATE.MOVE) {
        this.chooseTargetPosition();
      }
    }

    protected move(): void {
      this.mtxLocal.showTo(this.posTarget, ƒ.Vector3.Y(), true);
      this.mtxLocal.translateZ(this.speed * ƒ.Loop.timeFrameGame / 1000);
    }

    protected checkVision(): boolean {

      return true;
    }

    protected adjustSprite(): void {
      let rotation: number = this.show.mtxLocal.rotation.y;
      rotation = (rotation + 360 + 22.5) % 360;
      rotation = Math.floor(rotation / 45);

      if (this.angleView == rotation)
        return;

      this.angleView = rotation;

      if (rotation > 4) {
        rotation = 8 - rotation;
        this.flip(true);
      }
      else
        this.flip(false);

      let section: string = ANGLE[rotation]; // .padStart(3, "0");
      console.log(section);
      this.sprite.setAnimation(<ƒAid.SpriteSheetAnimation>Enemy.animations["Idle" + section]);
    }

    protected flip(_reverse: boolean): void {
      this.sprite.mtxLocal.rotation = ƒ.Vector3.Y(_reverse ? 180 : 0);
    }

    protected chooseTargetPosition(): void {
      let range: number = sizeWall * numWalls / 2 - 2;
      this.posTarget = new ƒ.Vector3(ƒ.Random.default.getRange(-range, range), 0, ƒ.Random.default.getRange(-range, range));
    }

    // bis Donnerstag: Gegner bei Sichtkontakt zum Spieler auf ihn zu bewegen
    // -> Ray zum Spieler -> wenn der Ray eine Wand zw Figur und Spieler trifft
    // UI einbinden und flexibel/ veränderbar machen
    // Schüsse mit Raycast auf die Gegner einbinden (ähnlich zur colission)
    // Audio einbinden

    // 17.12. Besprechung der Spielkonzepte
  }

}