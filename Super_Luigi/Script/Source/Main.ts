namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  let luigiPos: ƒ.Node;
  let ySpeed: number = 0;
  let fallTime: number = 0;

  // global variables for animation
  let luigiNode: ƒAid.NodeSprite;
  let animWalk: ƒAid.SpriteSheetAnimation;
  let animRun: ƒAid.SpriteSheetAnimation;
  let animIdle: ƒAid.SpriteSheetAnimation;
  let luigiAnimState: AnimationType;

  enum AnimationType {
    Walk, Run, Idle
  }

  let luigiMoveSpeed: number = 4;
  let ctrSideways: ƒ.Control = new ƒ.Control("Sideways", luigiMoveSpeed, ƒ.CONTROL_TYPE.PROPORTIONAL);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    // get Nodes
    let branch: ƒ.Node = viewport.getBranch();
    luigiPos = branch.getChildrenByName("LuigiPosition")[0];
    luigiPos.removeAllChildren();

    // create Luigi
    luigiNode = new ƒAid.NodeSprite("Luigi");
    luigiNode.addComponent(new ƒ.ComponentTransform());
    // set mesh to 2 y
    luigiNode.mtxLocal.rotateY(180);
    luigiNode.mtxLocal.translateY(-0.05);
    luigiPos.appendChild(luigiNode);

    // texture Luigi
    let texture: ƒ.TextureImage = new ƒ.TextureImage();
    await texture.load("./Sprites/Luigi_Moves_Sheet2.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(ƒ.Color.CSS("white"), texture);

    // animation
    // Walk
    animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
    animWalk.generateByGrid(ƒ.Rectangle.GET(176, 38, 16, 32), 3, 32, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
    // Run
    animRun = new ƒAid.SpriteSheetAnimation("Run", coat);
    animRun.generateByGrid(ƒ.Rectangle.GET(332, 38, 18, 32), 3, 32, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));
    // Idle
    animIdle = new ƒAid.SpriteSheetAnimation("Idle", coat);
    animIdle.generateByGrid(ƒ.Rectangle.GET(20, 38, 16, 32), 1, 32, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(52));

    setAnimation(AnimationType.Idle);
    luigiAnimState = AnimationType.Idle;
    luigiNode.setFrameDirection(1);
    luigiNode.framerate = 12;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
  }

  function setAnimation(_type: AnimationType): void {
    switch (_type) {
      case AnimationType.Walk:
        if (luigiAnimState == _type)
          break;
        luigiNode.setAnimation(animWalk);
        luigiAnimState = AnimationType.Walk;
        break;
      case AnimationType.Run:
        if (luigiAnimState == _type)
          break;
        luigiNode.setAnimation(animRun);
        luigiAnimState = AnimationType.Run;
        break;
      default:
        if (luigiAnimState == _type)
          break;
        luigiNode.setAnimation(animIdle);
        luigiAnimState = AnimationType.Idle;
        break;
    }
  }

  function update(_event: Event): void {
    // move Luigi when pressing move-keys
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.D])) {
      moveLuigi();
    }
    else
      setAnimation(AnimationType.Idle);

    fall();
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
      jump();
    }

    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function moveLuigi(): void {
    let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;

    let sidewaysSpeed: number = (
      ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D]) +
      ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A])
    );

    // run when shift is pressed
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT])) {
      setAnimation(AnimationType.Run);
      ctrSideways.setInput(sidewaysSpeed * 1.5 * deltaTime);
    }
    else {
      ctrSideways.setInput(sidewaysSpeed * deltaTime);
      setAnimation(AnimationType.Walk);
    }
    luigiPos.mtxLocal.translateX(ctrSideways.getOutput());
    rotateLuigi(ctrSideways.getOutput());
  }

  function fall(): void {
    let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
    //fall
    let g: number = 9.81;
    ySpeed -= g * deltaTime;
    let deltaY: number = ySpeed * deltaTime;
    if (luigiPos.mtxLocal.translation.y + deltaY > -2) {
      luigiPos.mtxLocal.translateY(deltaY);
    }
  }

  function jump(): void {
    ySpeed = 5;
  }

  function rotateLuigi(_move: number): void {
    if (_move > 0) {
      luigiNode.mtxLocal.rotation = ƒ.Vector3.Y(180);
      return;
    }
    luigiNode.mtxLocal.rotation = ƒ.Vector3.Y(0);
  }
}
