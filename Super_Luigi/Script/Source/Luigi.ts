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
    private jumpForce: number = 5;
    private resolution: number = 16;
    private animWalk: ƒAid.SpriteSheetAnimation;
    private animRun: ƒAid.SpriteSheetAnimation;
    private animIdle: ƒAid.SpriteSheetAnimation;

    private isOnGround: boolean;

    constructor(_texture: ƒ.TextureImage) {
      super("LuigiPosition");

      this.addComponent(new ƒ.ComponentTransform);
      this.pos = this.mtxLocal;

      this.node = new ƒAid.NodeSprite("Luigi");
      this.node.addComponent(new ƒ.ComponentTransform);

      this.node.mtxLocal.rotation = ƒ.Vector3.Y(180);
      this.node.mtxLocal.translateY(-0.05);
      this.appendChild(this.node);

      let texture: ƒ.TextureImage = _texture;
      let coat: ƒ.CoatTextured = new ƒ.CoatTextured(ƒ.Color.CSS("white"), texture);

      this.ctrSideways = new ƒ.Control("Sideways", this.moveSpeed, ƒ.CONTROL_TYPE.PROPORTIONAL, 15);

      // animation
      // Walk
      this.animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
      this.animWalk.generateByGrid(ƒ.Rectangle.GET(176, 38, 16, 32), 3, this.resolution, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
      // Run
      this.animRun = new ƒAid.SpriteSheetAnimation("Run", coat);
      this.animRun.generateByGrid(ƒ.Rectangle.GET(332, 38, 18, 32), 3, this.resolution, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
      // Idle
      this.animIdle = new ƒAid.SpriteSheetAnimation("Idle", coat);
      this.animIdle.generateByGrid(ƒ.Rectangle.GET(20, 38, 16, 32), 1, this.resolution, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));

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

      this.move(deltaTime);
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
      this.fall(deltaTime);
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
      // rotateLuigi(ctrSideways.getOutput());
    }

    /**
     * jump
     */
    public jump(): void {
      this.ySpeed = this.jumpForce;
    }

    /**
     * fall
     */
    public fall(_deltaTime: number): void {
      let g: number = 9.81;
      this.ySpeed -= g * _deltaTime;
      let deltaY: number = this.ySpeed * _deltaTime;
      this.checkGrounded();
      if (!this.isOnGround) {
        this.mtxLocal.translateY(deltaY);
      }
    }

    /**
    * check if Luigi is on the Ground
    */
    private checkGrounded(): void {
      let floorTiles: ƒ.Node[] = viewport.getBranch().getChildrenByName("Floors")[0].getChildren();
      let blockSize: number = 1;

      let lTrans: ƒ.Vector3 = this.mtxLocal.translation;
      for (let block of floorTiles) {
        let blockTrans: ƒ.Vector3 = block.mtxLocal.translation;
        if (Math.abs(lTrans.x - blockTrans.x) < blockSize) {
          if (lTrans.y < blockTrans.y + blockSize && lTrans.x > blockTrans.x + (blockSize - 0.2)) {
            lTrans.y = blockTrans.y + blockSize;
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
