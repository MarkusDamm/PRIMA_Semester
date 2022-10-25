namespace Script {
  import ƒ = FudgeCore;
  // import ƒAid = FudgeAid;

  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  // global variables
  let luigi: Luigi;
  export let gravity: number = 9.81;

  export enum Animation {
    Idle, LookUp, Duck, Walk, Run, Jump, Fall, RunJump
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
