namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let root: ƒ.Node;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    
    root = viewport.getBranch();
    
    hndAnimation();
  }
  
  async function hndAnimation(): Promise<void> {
    
    let luigi: ƒ.Node = root.getChildren()[0];
    console.log(luigi);
    
    let imgSpriteSheed: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheed.load("../Sprites/Luigi_Moves_Sheet.png");

  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}