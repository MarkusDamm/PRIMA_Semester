namespace Script {
  // Don't forget to compile: Strg + Shift + B
  import ƒ = FudgeCore; // ALT+159
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let root: ƒ.Node;
  let agent: ƒ.Node;
  let laserformation: ƒ.Node;
  let laserPrefab: ƒ.Node;
  let copy: ƒ.GraphInstance;

  let fps: number = 60;

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    root = viewport.getBranch();
    // console.log(root);
    laserformation = root.getChildrenByName("Laserformations")[0].getChildrenByName("Laserformation")[0];
    let graphLaser: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2021-10-28T13:13:43.242Z|36118"];
    laserPrefab = await ƒ.Project.createGraphInstance(graphLaser);
    // laserPrefab = laserformation.getChildrenByName("Laser01")[0];

    let laserPlacementPosition: ƒ.Vector3 = new ƒ.Vector3(-12, 6.5, 0);
    let laserAmounts: ƒ.Vector2 = new ƒ.Vector2(3,2);
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

    agent = root.getChildrenByName("Agents")[0].getChildrenByName("Agent")[0];
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, fps);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    // Adjust Camera Position
    viewport.camera.mtxPivot.translateZ(-30);
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

    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;

    agent.getComponent(AgentScript).hdlAgentMovement(deltaTime);

    let lasers: ƒ.Node[] = laserformation.getChildren();

    for (let laser of lasers) {
      let beams: ƒ.Node[] = laser.getChildrenByName("Beam");
      for (let beam of beams) {
        if (collisionTest(agent, beam))
          console.log("hit");
      }
    }

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function collisionTest(_agent: ƒ.Node, _beam: ƒ.Node): boolean {
    let testPosition: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_agent.mtxWorld.translation, _beam.mtxWorldInverse);
    let distance: ƒ.Vector2 = ƒ.Vector2.DIFFERENCE(testPosition.toVector2(), _beam.mtxLocal.translation.toVector2());
    let beamLength: number = _beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y;
    if (distance.x < -1 || distance.x > 1 || distance.y < -0.5 || distance.y > 0.5 + beamLength)
      return false;
    else
      return true;
  }
}