namespace Script {
  // Don't forget to compile: Strg + Shift + B
  import ƒ = FudgeCore; // ALT+159
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let root: ƒ.Node;
  let agent: ƒ.Node;
  let laserformation: ƒ.Node;
  let laser1: ƒ.Node;

  let fps: number = 60;
  let moveSpeed: number = 8;
  let ctrForward: ƒ.Control = new ƒ.Control("Forward", moveSpeed, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(50);
  let rotateSpeed: number = 60;
  
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  
  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    root = viewport.getBranch();
    // console.log(root);
    laserformation = root.getChildrenByName("Laserformations")[0].getChildrenByName("Laserformation")[0];
    laser1 = laserformation.getChildrenByName("Laser01")[0];

    agent = root.getChildrenByName("Agents")[0].getChildrenByName("Agent01")[0];
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, fps);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    
    // Adjust Camera Position
    viewport.camera.mtxPivot.translateZ(-30);

  }
  
  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used
    
    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
    // Sideways
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D]))
    {
      agent.mtxLocal.translateX(moveSpeed * deltaTime);
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
      agent.mtxLocal.translateX(-moveSpeed * deltaTime);
    }
    // Rotation
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT]))
    {
      agent.mtxLocal.rotateZ(rotateSpeed * deltaTime);
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      agent.mtxLocal.rotateZ(-rotateSpeed * deltaTime);
    }

    let forwardSpeed: number = (
      ƒ.Keyboard.mapToValue(1,0,[ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) +       
      ƒ.Keyboard.mapToValue(-1,0,[ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]) 
    );
    ctrForward.setInput(forwardSpeed * deltaTime);
    // console.log(ctrForward.getOutput());
    agent.mtxLocal.translateY(ctrForward.getOutput());
    
    let laserRotationSpeed: number = 120;
    let lasers: ƒ.Node[] = laserformation.getChildren();
    for (let laser of lasers)
    {
      laser.getComponent(ƒ.ComponentTransform).mtxLocal.rotateZ(laserRotationSpeed * deltaTime);
    }

    viewport.draw();
    ƒ.AudioManager.default.update();

    for (let laser of lasers)
    {
      let beams: ƒ.Node[] = laser.getChildrenByName("Beam");
      for (let beam of beams)
      {
        collisionTest(agent, beam);
      }
    }
  }

  function collisionTest(_agent: ƒ.Node, _beam: ƒ.Node) {
    let testPosition: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_agent.mtxWorld.translation, _beam.mtxWorldInverse);
    let distance: ƒ.Vector2 = ƒ.Vector2.DIFFERENCE(testPosition.toVector2(), _beam.mtxLocal.translation.toVector2());    
    
    // if (distance.x < 1 && distance.x > -1 && distance.y < 7 && distance.y > -1) {
    //   console.log("hit");
    // }
    // auf negative Abfrage umgestellt mit || ( || ist schneller als && )
    
    if (distance.x <-1 || distance.x > 1 || distance.y < -0.5 || distance.y > 6.5)
    return;
    else
    console.log("hit");
  }
}