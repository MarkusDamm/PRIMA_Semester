namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  let luigiPos: ƒ.Node;

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    console.log(viewport);

    // get Nodes
    let branch: ƒ.Node = viewport.getBranch();
    luigiPos = branch.getChildrenByName("LuigiPosition")[0];
    luigiPos.removeAllChildren();

    // create Luigi
    let luigiNode: ƒAid.NodeSprite = new ƒAid.NodeSprite("Luigi");
    luigiNode.addComponent(new ƒ.ComponentTransform());
    luigiNode.mtxLocal.rotateY(180);
    luigiNode.mtxLocal.translateY(-0.05);
    luigiPos.appendChild(luigiNode);

    // texture Luigi
    let texture: ƒ.TextureImage = new ƒ.TextureImage();
    await texture.load("./Sprites/Luigi_Moves_Sheet2.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(ƒ.Color.CSS("white"), texture);

    // animation
    // Walk
    let animWalk: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
    animWalk.generateByGrid(ƒ.Rectangle.GET(176, 38, 16, 32), 3, 32, ƒ.ORIGIN2D.TOPLEFT, ƒ.Vector2.X(52));
    // Run
    let animRun: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("Run", coat);
    animRun.generateByGrid(ƒ.Rectangle.GET(332, 38, 18, 32), 3, 32, ƒ.ORIGIN2D.TOPLEFT, ƒ.Vector2.X(52));

    luigiNode.setAnimation(animWalk);
    luigiNode.setFrameDirection(1);
    luigiNode.framerate = 12;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
  }

  function update(_event: Event): void {
    // move Luigi
    let cmpTransL: ƒ.ComponentTransform = luigiPos.getComponent(ƒ.ComponentTransform);
    cmpTransL.mtxLocal.translateX(0.01);

    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}