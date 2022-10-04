namespace L16_Doom_Audio {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export enum FACES {
    _IDLE = 0, _IDLE_DAMAGED1 = 1, _IDLE_DAMAGED2 = 2, _IDLE_DAMAGED3 = 3, _IDLE_DAMAGED4 = 4,
    _ANGRY_FRONT = 5, _ANGRY_LEFT = 6, _ANGRY_RIGHT = 7, _SURPRISED = 8, _MAD = 9, _MOREMAD = 10
  }

  export class UI {

    private static faceAnimations: ƒAid.SpriteSheetAnimations;

    private uiDiv: HTMLDivElement;
    private uiViewport: ƒ.Viewport;
    private uiRoot: ƒ.Node = new ƒ.Node("UIRoot");
    private faceSprite: ƒAid.NodeSprite;
    private currentFace: FACES;
    private health: number;
    private curAmmo: number;
    private maxAmmo: number;


    public constructor(_startHealth: number, _startAmmo: number, _startMaxAmmo: number) {
      this.uiDiv = document.querySelector(".UI");

      this.faceSprite = new ƒAid.NodeSprite("Face");
      this.uiRoot.appendChild(this.faceSprite);

      this.uiViewport = new ƒ.Viewport();
      this.uiViewport.initialize("UI", this.uiRoot, new ƒ.ComponentCamera(), document.querySelector(".Doom-Guy"));
      this.uiViewport.camera.backgroundColor = ƒ.Color.CSS("aqua");
      this.uiViewport.camera.pivot.translateZ(1);
      this.uiViewport.camera.pivot.rotateY(180);

      this.changeFace(FACES._IDLE);
      // this.face.setAnimation(<ƒAid.SpriteSheetAnimation>UI.faceAnimations["Face_MOREMAD"]);
      this.faceSprite.setFrameDirection(1);
      this.faceSprite.framerate = 0.5;
      this.uiViewport.draw();

      this.setHealth(_startHealth);
      this.curAmmo = _startAmmo;
      this.maxAmmo = _startMaxAmmo;
    }

    public static generateSprites(_spritesheet: ƒ.CoatTextured): void {
      UI.faceAnimations = {};
      for (let faceStyle: number = 0; faceStyle < 11; faceStyle++) {
        let name: string = "Face" + FACES[faceStyle];
        let sprite: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation(name, _spritesheet);
        sprite.generateByGrid(ƒ.Rectangle.GET(14, 13 + faceStyle * 32, 24, 29), 3, 32, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(26));
        UI.faceAnimations[name] = sprite;
      }
    }

    public update(): void {
      this.uiViewport.draw();
    }

    public changeFace(_face: FACES): void {
      if (_face == this.currentFace)
        return;
      let name: string = "Face" + FACES[_face];
      this.faceSprite.setAnimation(<ƒAid.SpriteSheetAnimation>UI.faceAnimations[name]);
      this.currentFace = _face;
    }

    private setHealth(_health: number): void {
      this.health = _health;
    }
  }
}