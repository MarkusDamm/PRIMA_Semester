namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export class Luigi extends ƒ.Node {
    public pos: ƒ.Matrix4x4;
    public node: ƒAid.NodeSprite;

    public ySpeed: number = 0;

    ctrSideways: ƒ.Control;

    public animState: Animation;
    public spriteSheedPath: string = "./Sprites/Luigi_Moves_Sheet2.png";

    private moveSpeed: number = 4;
    private jumpForce: number = 10;
    private resolution: number = 16;
    private animIdle: ƒAid.SpriteSheetAnimation;
    private animLookUp: ƒAid.SpriteSheetAnimation;
    private animDuck: ƒAid.SpriteSheetAnimation;
    private animWalk: ƒAid.SpriteSheetAnimation;
    private animRun: ƒAid.SpriteSheetAnimation;
    private animJump: ƒAid.SpriteSheetAnimation;
    private animFall: ƒAid.SpriteSheetAnimation;
    private animRunJump: ƒAid.SpriteSheetAnimation;


    private isOnGround: boolean;

    constructor(_texture: ƒ.TextureImage) {
      super("LuigiPosition");

      this.addComponent(new ƒ.ComponentTransform);
      this.pos = this.mtxLocal;

      this.node = new ƒAid.NodeSprite("Luigi");
      this.node.addComponent(new ƒ.ComponentTransform);

      // scaling doesn't work as expected
      // this.node.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(2);

      this.node.mtxLocal.rotation = ƒ.Vector3.Y(180);
      this.node.mtxLocal.translateY(-0.05);
      this.appendChild(this.node);

      let texture: ƒ.TextureImage = _texture;
      // let texture: ƒ.TextureImage = new ƒ.TextureImage();
      // texture.load(this.spriteSheedPath);
      let coat: ƒ.CoatTextured = new ƒ.CoatTextured(ƒ.Color.CSS("white"), texture);

      this.ctrSideways = new ƒ.Control("Sideways", this.moveSpeed, ƒ.CONTROL_TYPE.PROPORTIONAL, 15);

      // animation
      // Idle
      this.animIdle = new ƒAid.SpriteSheetAnimation("Idle", coat);
      this.animIdle.generateByGrid(ƒ.Rectangle.GET(21, 39, 15, 30), 1, this.resolution, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
      // LookUp
      this.animLookUp = new ƒAid.SpriteSheetAnimation("LookUp", coat);
      this.animLookUp.generateByGrid(ƒ.Rectangle.GET(72, 40, 15, 29), 1, this.resolution, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
      // Duck
      this.animDuck = new ƒAid.SpriteSheetAnimation("Duck", coat);
      this.animDuck.generateByGrid(ƒ.Rectangle.GET(124, 54, 16, 15), 1, this.resolution, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
      // Walk
      this.animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
      this.animWalk.generateByGrid(ƒ.Rectangle.GET(176, 39, 15, 32), 3, this.resolution, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
      // Run
      this.animRun = new ƒAid.SpriteSheetAnimation("Run", coat);
      this.animRun.generateByGrid(ƒ.Rectangle.GET(332, 38, 18, 32), 3, this.resolution, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
      // Jump
      this.animJump = new ƒAid.SpriteSheetAnimation("Jump", coat);
      this.animJump.generateByGrid(ƒ.Rectangle.GET(72, 109, 16, 32), 1, this.resolution, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
      // Fall
      this.animFall = new ƒAid.SpriteSheetAnimation("Fall", coat);
      this.animFall.generateByGrid(ƒ.Rectangle.GET(124, 109, 16, 32), 1, this.resolution, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
      // RunJump
      this.animRunJump = new ƒAid.SpriteSheetAnimation("RunJump", coat);
      this.animRunJump.generateByGrid(ƒ.Rectangle.GET(176, 109, 24, 32), 1, this.resolution, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));



      this.node.setAnimation(this.animIdle);
      this.animState = Animation.Idle;
      this.node.setFrameDirection(1);
      this.node.framerate = 12;

      this.isOnGround = false;
    }

    /**
     * setAnimation to given animationtype
     */
    public setAnimation(_type: Animation): void {
      switch (_type) {
        case Animation.Idle:
          if (this.animState == _type) break;

          this.node.setAnimation(this.animIdle);
          this.animState = Animation.Idle;
          break;

        case Animation.Walk:
          if (this.animState == _type) break;

          this.node.setAnimation(this.animWalk);
          this.animState = Animation.Walk;
          break;

        case Animation.Run:
          if (this.animState == _type) break;

          this.node.setAnimation(this.animRun);
          this.animState = Animation.Run;
          break;

        case Animation.LookUp:
          if (this.animState == _type) break;

          this.node.setAnimation(this.animLookUp);
          this.animState = Animation.LookUp;
          break;

        case Animation.Duck:
          if (this.animState == _type) break;

          this.node.setAnimation(this.animDuck);
          this.animState = Animation.Duck;
          break;

        case Animation.Jump:
          if (this.animState == _type) break;

          this.node.setAnimation(this.animJump);
          this.animState = Animation.Jump;
          break;

        case Animation.Fall:
          if (this.animState == _type) break;

          this.node.setAnimation(this.animFall);
          this.animState = Animation.Fall;
          break;

        case Animation.RunJump:
          if (this.animState == _type) break;

          this.node.setAnimation(this.animRunJump);
          this.animState = Animation.RunJump;
          break;

        default:
          console.log("No valid parameter");
          break;
      }
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
    public move(_deltaTime: number): void {
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
    public jump(): void {
      if (this.isOnGround) {
        this.ySpeed = this.jumpForce;
      }
    }

    /**
     * fall
     */
    public fall(_deltaTime: number): void {
      this.ySpeed -= gravity * _deltaTime;
      let deltaY: number = this.ySpeed * _deltaTime;
      this.mtxLocal.translateY(deltaY);
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
          if (lTrans.y < blockPosTrans.y + (blockSize.y / 2) && lTrans.y > blockPosTrans.y + ((blockSize.y / 2) - 0.2)) {
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
