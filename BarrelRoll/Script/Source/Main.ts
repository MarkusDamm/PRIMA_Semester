namespace Script {
  import ƒ = FudgeCore;
  // Random Objekte einbauen

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let fox: ƒ.Node;
  let ship: ƒ.Node;
  let shipMovement: SpaceShipMovement;
  let cmpCamera: ƒ.ComponentCamera;

  // export let bullets: Bullet[] = [];

  let meshTerrain: ƒ.ComponentMesh;

  let towerResource: string = "Graph|2022-11-29T16:03:19.230Z|03819";
  let turretResource: string = "Graph|2022-12-15T13:38:21.686Z|43512";

  export let state: GameState;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    cmpCamera = viewport.camera;
    cmpCamera.mtxPivot.translate(new ƒ.Vector3(0, 2, -15));

    let graph: ƒ.Node = viewport.getBranch();
    fox = graph.getChildrenByName("Fox")[0];
    ship = fox.getChild(0);
    shipMovement = ship.getComponent(SpaceShipMovement);
    console.log(fox);

    setTerrainMesh();

    placeInstances(graph, 30, towerResource);
    placeInstances(graph, 5, turretResource);
    console.log("placed tower and turret instances");
    
    state = new GameState();

    document.addEventListener("keydown", shoot);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function setTerrainMesh(): void {
    if (!viewport) {
      return;
    }
    let terrainNode: ƒ.Node = viewport.getBranch().getChildrenByName("Terrain")[0];
    meshTerrain = terrainNode.getComponent(ƒ.ComponentMesh);
  }

  export function checkTerrainHeight(_pos: ƒ.Vector3): number {
    if (!meshTerrain) {
      setTerrainMesh();
      return -666;
    }
    let terrain: ƒ.MeshTerrain = <ƒ.MeshTerrain>meshTerrain.mesh;
    let terrainInfo: ƒ.TerrainInfo = terrain.getTerrainInfo(_pos, meshTerrain.mtxWorld);
    let height: number = terrainInfo.position.y;
    
    return height;
  }

  function placeInstances(_mainGraph: ƒ.Node, _amount: number, _resource: string): void {
    let staticObjGraph: ƒ.Node = _mainGraph.getChildrenByName("Objects")[0].getChildrenByName("Static")[0];
    let sourceGraph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources[_resource];

    for (let i: number = 0; i < _amount; i++) {

      let graphInstance: ƒ.GraphInstance = new ƒ.GraphInstance(sourceGraph);
      graphInstance.reset();

      let randomPos: ƒ.Vector3 = new ƒ.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1);
      randomPos.scale(400);
      randomPos.add(ƒ.Vector3.Y(checkTerrainHeight(randomPos) - 0.5));

      graphInstance.addComponent(new ƒ.ComponentTransform());
      graphInstance.mtxLocal.translation = randomPos;

      staticObjGraph.appendChild(graphInstance);
    }
  }

  function shoot(_event: KeyboardEvent): void {
    if (_event.key == "e") {
      console.log("bumm");
      let bullet: Bullet = new Bullet(ship.mtxLocal);
      let objGraph: ƒ.Node = viewport.getBranch().getChildrenByName("Objects")[0].getChildrenByName("Temp")[0];
      objGraph.appendChild(bullet);
      // bullets.push(bullet);
    }
  }

  function update(_event: Event): void {
    shipMovement.setRelativeAxes();
    handleShipMovement();

    // for (let bullet of bullets) {
    //   bullet.update();      
    // }

    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function handleShipMovement(): void {
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
      shipMovement.thrust();
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
      shipMovement.thrust(-1);
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
      shipMovement.roll(-1);
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
      shipMovement.roll();
    }

    shipMovement.applyTorque();
  }
}