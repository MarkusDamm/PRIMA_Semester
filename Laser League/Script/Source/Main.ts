namespace Script {
  // Don't forget to compile: Strg + Shift + B
  import ƒ = FudgeCore; // ALT+159
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let root: ƒ.Node;
  let laser: ƒ.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    root = viewport.getBranch();
    console.log(root);
    laser = root.getChildrenByName("Laserformations")[0].getChildrenByName("Laserformation")[0].getChildrenByName("Laser01")[0];

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    laser.getComponent(ƒ.ComponentTransform).mtxLocal.rotateZ(0.5);
  }


}