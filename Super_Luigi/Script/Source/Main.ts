namespace Script {
  import ƒ = FudgeCore;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  let luigiPos: ƒ.Node;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    console.log(viewport);

    let branch: ƒ.Node = viewport.getBranch();
    console.log(branch);
    luigiPos = branch.getChildrenByName("LuigiPosition")[0];
    console.log(luigiPos);
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    luigiPos.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(0.01);
  }
}