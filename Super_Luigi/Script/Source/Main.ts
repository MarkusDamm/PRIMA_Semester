namespace Script {
  import ƒ = FudgeCore;
  // import ƒAid = FudgeAid;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  // global variables for animation
  let luigi: Luigi;

  export enum Animation {
    Idle, Walk, Run
  }

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    // get Nodes
    let branch: ƒ.Node = viewport.getBranch();
    let texture: ƒ.TextureImage = new ƒ.TextureImage();
    await texture.load("./Sprites/Luigi_Moves_Sheet2.png");
    luigi = new Luigi(texture);
    branch.appendChild(luigi);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
  }

  function update(_event: Event): void {
    luigi.update();

    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

}
