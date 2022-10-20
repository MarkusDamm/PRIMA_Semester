namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  let luigiPos: ƒ.Node;

  let luigiNode: ƒAid.NodeSprite;
  let coat: ƒ.CoatTextured;
  let animWalk: ƒAid.SpriteSheetAnimation;
  let animRun: ƒAid.SpriteSheetAnimation;

  let luigiMoveSpeed: number = 4;
  let ctrSideways: ƒ.Control = new ƒ.Control("Sideways", luigiMoveSpeed, ƒ.CONTROL_TYPE.PROPORTIONAL);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    console.log(viewport);

    // get Nodes
    let branch: ƒ.Node = viewport.getBranch();
    luigiPos = branch.getChildrenByName("LuigiPosition")[0];
    luigiPos.removeAllChildren();

    // create Luigi
    luigiNode = new ƒAid.NodeSprite("Luigi");
    luigiNode.addComponent(new ƒ.ComponentTransform());
    luigiNode.mtxLocal.rotateY(180);
    luigiNode.mtxLocal.translateY(-0.05);
    luigiPos.appendChild(luigiNode);

    // texture Luigi
    let texture: ƒ.TextureImage = new ƒ.TextureImage();
    await texture.load("./Sprites/Luigi_Moves_Sheet2.png");
    coat = new ƒ.CoatTextured(ƒ.Color.CSS("white"), texture);

    // animation
    // Walk
    animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
    animWalk.generateByGrid(ƒ.Rectangle.GET(176, 38, 16, 32), 3, 32, ƒ.ORIGIN2D.TOPLEFT, ƒ.Vector2.X(52));
    // Run
    animRun = new ƒAid.SpriteSheetAnimation("Run", coat);
    animRun.generateByGrid(ƒ.Rectangle.GET(332, 38, 18, 32), 3, 32, ƒ.ORIGIN2D.TOPLEFT, ƒ.Vector2.X(52));
    
    luigiNode.setAnimation(animWalk);
    luigiNode.setFrameDirection(1);
    luigiNode.framerate = 12;
    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
  }
  
  enum AnimationType {
    Walk, Run, Idle
  }
  
  function setAnimation(_type: AnimationType): void {
    switch (_type) {
      case AnimationType.Walk:
        luigiNode.setAnimation(animWalk);
        break;
      case AnimationType.Run:
        // animRun = new ƒAid.SpriteSheetAnimation("Run", coat);
        // animRun.generateByGrid(ƒ.Rectangle.GET(332, 38, 18, 32), 3, 32, ƒ.ORIGIN2D.TOPLEFT, ƒ.Vector2.X(52));
        luigiNode.setAnimation(animRun);
        break;
      default:
        console.log("no Animation yet");
        break;
    }
  }

  function update(_event: Event): void {
    // move Luigi
    // let cmpTransL: ƒ.ComponentTransform = luigiPos.getComponent(ƒ.ComponentTransform);
    // cmpTransL.mtxLocal.translateX(0.01);
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.D])) {
      moveLuigi();
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
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT])) {
      setAnimation(AnimationType.Run);
      ctrSideways.setInput(sidewaysSpeed * 1.5 * deltaTime);
    }
    else {
      ctrSideways.setInput(sidewaysSpeed * deltaTime);
      setAnimation(AnimationType.Walk);
    }
    luigiPos.mtxLocal.translateX(ctrSideways.getOutput());
  }
}