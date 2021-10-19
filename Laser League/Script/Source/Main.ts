namespace Script {
  // Don't forget to compile: Strg + Shift + B
  import ƒ = FudgeCore; // ALT+159
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let root: ƒ.Node;
  let agent: ƒ.Node;
  let laser: ƒ.Node;

  let fps: number = 60;
  let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
  let moveSpeed: number = 5;
  let rotateSpeed: number = 60;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    root = viewport.getBranch();
    console.log(root);
    laser = root.getChildrenByName("Laserformations")[0].getChildrenByName("Laserformation")[0].getChildrenByName("Laser01")[0];

    agent = root.getChildrenByName("Agents")[0].getChildrenByName("Agent01")[0];
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, fps);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    // Adjust Camera Position
    viewport.camera.mtxPivot.translateZ(-45);

  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used

    // Movements
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]))
    {
      agent.mtxLocal.translateY(moveSpeed * deltaTime);
      // agent.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(0.3);
      // begrenze Arena durch Kolissionen
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]))
    {
      agent.mtxLocal.translateY(-moveSpeed * deltaTime);
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D]))
    {
      agent.mtxLocal.translateX(moveSpeed * deltaTime);
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A]))
    {
      agent.mtxLocal.translateX(-moveSpeed * deltaTime);
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT]))
    {
      agent.mtxLocal.rotateZ(rotateSpeed * deltaTime);
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
    {
      agent.mtxLocal.rotateZ(-rotateSpeed * deltaTime);
    }
    
    let laserRotationSpeed: number = 120;
    laser.getComponent(ƒ.ComponentTransform).mtxLocal.rotateZ(laserRotationSpeed * deltaTime);
    
    
    viewport.draw();
    ƒ.AudioManager.default.update();
  }


}