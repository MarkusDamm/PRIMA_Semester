namespace Script {
  import ƒ = FudgeCore;
  // Steuerung einbauen
  
  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let rbShip: ƒ.ComponentRigidbody;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    let graph: ƒ.Node = viewport.getBranch();
    let ship: ƒ.Node = graph.getChildrenByName("Fox")[0].getChild(0);
    console.log(ship);
    rbShip = ship.getComponent(ƒ.ComponentRigidbody);

  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();

    rbShip.applyForce(ƒ.Vector3.Z(rbShip.mass * 5));
  }
}