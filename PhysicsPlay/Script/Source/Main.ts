namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let root: ƒ.Node;
  let rbCube: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(5, ƒ.BODY_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CUBE);

  let cube: ƒ.Node;
  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 50, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(200);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 5, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(50);


  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    viewport.camera.mtxPivot.translateZ(-10);

    root = viewport.getBranch();
    let plane: ƒ.Node = root.getChildrenByName("Plane")[0];
    plane.addComponent(new ƒ.ComponentTransform());
    let rbPlane: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
    plane.addComponent(rbPlane);
    rbPlane.initialization = ƒ.BODY_INIT.TO_MESH;
    console.log(rbPlane.friction);

    rbPlane.friction = 2;

    cube = root.getChildrenByName("Cube")[0];
    cube.addComponent(rbCube);
    rbCube.initialization = ƒ.BODY_INIT.TO_MESH;

    // document.addEventListener("keydown", hdlKeyDown);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
    controls(deltaTime);
    ƒ.Physics.world.simulate(deltaTime);  // if physics is included and used

    // console.log(rbCube.getVelocity().z);


    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  // function hdlKeyDown(): void {
  //   rbCube.applyForce(new ƒ.Vector3(0, 5000, 0));
  //   console.log("KeyDown");
  // }

  function controls(_deltaTime: number): void {
    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward);
    rbCube.applyForce(ƒ.Vector3.SCALE(cube.mtxLocal.getZ(), ctrForward.getOutput()));
    // cube.mtxLocal.translateZ(ctrForward.getOutput());
    // let velocity: number = ctrForward.getOutput();

    let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    ctrTurn.setInput(turn);
    rbCube.applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput()))
    // if (velocity > 0.1) {
    //   cube.mtxLocal.rotateY(ctrTurn.getOutput());
    // }
    // else if (velocity < -0.1) {
    //   cube.mtxLocal.rotateY(-ctrTurn.getOutput());
    // }
  }

}