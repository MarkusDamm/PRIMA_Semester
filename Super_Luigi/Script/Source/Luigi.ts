namespace Script {
  interface Rectangles { [label: string]: number[]; }
  export class Luigi extends ƒ.Node {

    public node: ƒAid.NodeSprite;

    public ySpeed: number = 0;

    ctrSideways: ƒ.Control;

    public animState: Animation;
    public spriteSheedPath: string = "./Sprites/Luigi_Moves_Sheet2.png";

    private readonly moveSpeed: number = 7;
    private readonly jumpForce: number = 15;
    private readonly resolution: number = 16;
    private animations: ƒAid.SpriteSheetAnimations = {};

    private isOnGround: boolean;

    constructor() {
      super("LuigiPosition");

      this.addComponent(new ƒ.ComponentTransform);

      this.node = new ƒAid.NodeSprite("Luigi");
      this.node.addComponent(new ƒ.ComponentTransform);

      this.node.mtxLocal.rotation = ƒ.Vector3.Y(180);
      this.node.mtxLocal.translateY(-0.05);
      this.appendChild(this.node);

      this.ctrSideways = new ƒ.Control("Sideways", this.moveSpeed, ƒ.CONTROL_TYPE.PROPORTIONAL, 15);

      this.isOnGround = false;
    }

    /**
     * initializes all animations from the given TextureImage
     */
    public initializeAnimations(_texture: ƒ.TextureImage): void {
      let coat: ƒ.CoatTextured = new ƒ.CoatTextured(ƒ.Color.CSS("white"), _texture);

      // let animationFrames: number = 1;
      let origin: ƒ.ORIGIN2D = ƒ.ORIGIN2D.BOTTOMCENTER;
      let offsetNext: ƒ.Vector2 = ƒ.Vector2.X(52);

      /// WIP
      let rectangles: Rectangles = {
        "idle": [21, 39, 15, 30], "lookUp": [72, 40, 15, 29], "duck": [124, 54, 16, 15],
        "jump": [72, 110, 16, 30], "fall": [124, 109, 16, 30], "runJump": [176, 109, 24, 32]
      };
      let threeFrameRecs: Rectangles = { "walk": [176, 39, 15, 30], "run": [332, 38, 18, 32] };

      this.initializeAnimationsByFrames(coat, rectangles, 1, origin, offsetNext);
      this.initializeAnimationsByFrames(coat, threeFrameRecs, 3, origin, offsetNext);

      this.node.setAnimation(<ƒAid.SpriteSheetAnimation>this.animations.idle);
      this.animState = Animation.Idle;
      this.node.setFrameDirection(1);
      this.node.framerate = 12;
    }

    /**
     * update
     */
    public update(): void {
      let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;

      this.fall(deltaTime);
      this.checkGrounded();
      this.move(deltaTime);

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
        this.setAnimation(Animation.LookUp);
      }

      if (this.ySpeed > 0) {
        this.setAnimation(Animation.Jump);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT])) {
          this.setAnimation(Animation.RunJump);
        }
      }
      if (this.ySpeed < 0) {
        this.setAnimation(Animation.Fall);
      }

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
        this.setAnimation(Animation.Duck);
      }

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
        this.jump();
      }

      // turn Luigi
      if (this.ctrSideways.getOutput() > 0) {
        this.node.mtxLocal.rotation = ƒ.Vector3.Y(180);
      }
      else if (this.ctrSideways.getOutput() < 0) {
        this.node.mtxLocal.rotation = ƒ.Vector3.Y(0);
      }
    }

    /**
     * move
     */
    private move(_deltaTime: number): void {
      let sidewaysSpeed: number = (
        ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) +
        ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])
      );

      // run when shift is pressed
      if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT])) {
        this.ctrSideways.setInput(sidewaysSpeed * _deltaTime);
        this.setAnimation(Animation.Walk);
      }
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT])) {
        this.setAnimation(Animation.Run);
        this.ctrSideways.setInput(sidewaysSpeed * 1.5 * _deltaTime);
      }

      if (this.ctrSideways.getOutput() == 0) {
        this.setAnimation(Animation.Idle);
      }

      this.mtxLocal.translateX(this.ctrSideways.getOutput());
    }

    /**
     * jump
     */
    private jump(): void {
      if (this.isOnGround) {
        this.ySpeed = this.jumpForce;
      }
    }

    /**
     * fall
     */
    private fall(_deltaTime: number): void {
      this.ySpeed -= gravity * _deltaTime;
      let deltaY: number = this.ySpeed * _deltaTime;
      this.mtxLocal.translateY(deltaY);
    }

    /**
     * initializes multiple animation with the same amount of frames
     */
     private initializeAnimationsByFrames(_coat: ƒ.CoatTextured, _rectangles: Rectangles, _frames: number, _orig: ƒ.ORIGIN2D, _offsetNext: ƒ.Vector2): void {
      for (let key in _rectangles) {
        const rec: number[] = _rectangles[key];
        let anim: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation(key, _coat);
        let fRec: ƒ.Rectangle = ƒ.Rectangle.GET(rec[0], rec[1], rec[2], rec[3]);
        anim.generateByGrid(fRec, _frames, this.resolution, _orig, _offsetNext);
        console.log(key);

        this.animations[key] = anim;
      }
    }

    /**
     * set current animation to given animationtype
     */
    private setAnimation(_type: Animation): void {
      switch (_type) {
        case Animation.Idle:
          if (this.animState == _type) break;

          this.node.setAnimation(<ƒAid.SpriteSheetAnimation>this.animations.idle);
          this.animState = Animation.Idle;
          break;

        case Animation.Walk:
          if (this.animState == _type) break;

          this.node.setAnimation(<ƒAid.SpriteSheetAnimation>this.animations.walk);
          this.animState = Animation.Walk;
          break;

        case Animation.Run:
          if (this.animState == _type) break;

          this.node.setAnimation(<ƒAid.SpriteSheetAnimation>this.animations.run);
          this.animState = Animation.Run;
          break;

        case Animation.LookUp:
          if (this.animState == _type) break;

          this.node.setAnimation(<ƒAid.SpriteSheetAnimation>this.animations.lookUp);
          this.animState = Animation.LookUp;
          break;

        case Animation.Duck:
          if (this.animState == _type) break;

          this.node.setAnimation(<ƒAid.SpriteSheetAnimation>this.animations.duck);
          this.animState = Animation.Duck;
          break;

        case Animation.Jump:
          if (this.animState == _type) break;

          this.node.setAnimation(<ƒAid.SpriteSheetAnimation>this.animations.jump);
          this.animState = Animation.Jump;
          break;

        case Animation.Fall:
          if (this.animState == _type) break;

          this.node.setAnimation(<ƒAid.SpriteSheetAnimation>this.animations.fall);
          this.animState = Animation.Fall;
          break;

        case Animation.RunJump:
          if (this.animState == _type) break;

          this.node.setAnimation(<ƒAid.SpriteSheetAnimation>this.animations.runJump);
          this.animState = Animation.RunJump;
          break;

        default:
          console.log("No valid parameter");
          break;
      }
    }

    /**
    * check if Luigi is on the Ground
    */
    private checkGrounded(): void {
      let floorTiles: ƒ.Node[] = viewport.getBranch().getChildrenByName("Floors")[0].getChildren();
      let blockSize: ƒ.Vector3;
      let lTrans: ƒ.Vector3 = this.mtxLocal.translation;

      for (let blockPos of floorTiles) {
        let blockPosTrans: ƒ.Vector3 = blockPos.mtxLocal.translation;
        blockSize = blockPos.getChild(0).mtxLocal.scaling;

        if (Math.abs(lTrans.x - blockPosTrans.x) <= blockSize.x / 2) {
          if (lTrans.y < blockPosTrans.y + (blockSize.y / 2) && lTrans.y > blockPosTrans.y + ((blockSize.y / 5))) {
            lTrans.y = blockPosTrans.y + (blockSize.y / 2);
            this.mtxLocal.translation = lTrans;
            this.isOnGround = true;
            this.ySpeed = 0;
            return;
          }
        }
      }
      this.isOnGround = false;
    }


  }
}
