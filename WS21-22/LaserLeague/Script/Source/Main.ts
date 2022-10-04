namespace LaserLeague {
  // Don't forget to compile: Strg + Shift + B
  import ƒ = FudgeCore; // ALT+159
  // import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let root: ƒ.Node;
  // let agent: ƒ.Node;
  let agent: Agent;
  let laserformation: ƒ.Node;
  let laserPrefab: ƒ.Node;
  let copy: ƒ.GraphInstance;

  let fps: number = 240;
  let timeouts: (number|NodeJS.Timeout)[] = [];

  window.addEventListener("load", init);

  function init(_event: Event): void {
    let dialog: HTMLDialogElement = document.querySelector("dialog");
    dialog.querySelector("h1").textContent = document.title;
    dialog.addEventListener("click", function (_event: Event) {
        // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
        dialog.close();
        start();
    });
    //@ts-ignore
    dialog.showModal();
}

  async function start(): Promise<void> {
    await ƒ.Project.loadResourcesFromHTML();
    let graph: ƒ.Node = <ƒ.Graph>ƒ.Project.resources[document.head.querySelector("meta[autoView]").getAttribute("autoView")];
    // setup Camera
    let cmpCamera: ƒ.ComponentCamera = graph.getComponent(ƒ.ComponentCamera);
    graph.addComponent(cmpCamera);

    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", graph, cmpCamera, canvas);

    root = viewport.getBranch();
    ƒ.AudioManager.default.listenTo(root);
    ƒ.AudioManager.default.listenWith(root.getComponent(ƒ.ComponentAudioListener));

    Hud.start();
    setUpLasers();

    agent = new Agent();
    root.getChildrenByName("Agents")[0].addChild(agent);

    LaserScript.sound = root.getComponents(ƒ.ComponentAudio)[1]; // check for audio name/ ID instead
    console.log(LaserScript.sound.getAudio());
    
    document.addEventListener("keydown", hdlCollision);

    // root.getComponents(ƒ.ComponentAudio)[0].play(true);  // enables background music
    // Adjust Camera Position
    viewport.draw();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, fps);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  async function setUpLasers(): Promise<void> {
    laserformation = root.getChildrenByName("Laserformations")[0].getChildrenByName("Laserformation")[0];
    let graphLaser: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2021-10-28T13:13:43.242Z|36118"];
    laserPrefab = await ƒ.Project.createGraphInstance(graphLaser);

    let laserPlacementPosition: ƒ.Vector3 = new ƒ.Vector3(-12, 6.5, 0);
    let laserAmounts: ƒ.Vector2 = new ƒ.Vector2(3, 2);
    let xPosition: number = -12;
    let yPosition: number = 6.5;

    for (let i = 0; i < laserAmounts.y; i++) {
      for (let i = 0; i < laserAmounts.x; i++) {
        await placeLaser(laserPlacementPosition);
        laserPlacementPosition.x -= xPosition;
      }
      yPosition = -yPosition;
      laserPlacementPosition = new ƒ.Vector3(xPosition, yPosition, 0);
    }
  }

  async function placeLaser(_translation: ƒ.Vector3): Promise<void> {
    copy = await copyGraph(laserPrefab);
    copy.mtxLocal.translation = _translation;
    laserformation.appendChild(copy);
  }

  async function copyGraph(_copy: ƒ.Node): Promise<ƒ.GraphInstance> {
    let graph: ƒ.Graph = await ƒ.Project.registerAsGraph(_copy, false);
    let graphInstance: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(graph);
    return graphInstance;
  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used

    let lasers: ƒ.Node[] = laserformation.getChildren();

    for (let laser of lasers) {
      let beams: ƒ.Node[] = laser.getChildrenByName("Beam");
      for (let beam of beams) {
        if (LaserScript.collisionCheck(agent, beam)) {
          LaserScript.sound.play(true);
          hdlCollision();
          console.log("hit");
        }
      }
    }

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function hdlCollision(_event?: KeyboardEvent): void {
    if (_event && _event.key != "k") { // for debugging
      return
    }
    ƒ.Time.game.setScale(0.2);
    timeouts.push(setTimeout(resetTime, 1000));
  }

  function resetTime(): void {
    for (let timeout of timeouts) {
      clearTimeout(<number>timeout);
    }

    ƒ.Time.game.setScale(1);
  }
}