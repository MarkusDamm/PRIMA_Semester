namespace Script {
  import ƒ = FudgeCore;
  // Random Objekte einbauen

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let ship: ƒ.Node;
  let rbShip: ƒ.ComponentRigidbody;
  let cmpCamera: ƒ.ComponentCamera;

  let meshTerrain: ƒ.ComponentMesh;

  let towerResource: string = "Graph|2022-11-29T16:03:19.230Z|03819";

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    cmpCamera = viewport.camera;
    cmpCamera.mtxPivot.translate(new ƒ.Vector3(0, 2, -15));

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    let graph: ƒ.Node = viewport.getBranch();
    ship = graph.getChildrenByName("Fox")[0].getChild(0);
    console.log(ship);
    rbShip = ship.getComponent(ƒ.ComponentRigidbody);

    let terrainNode: ƒ.Node = viewport.getBranch().getChildrenByName("Terrain")[0];
    meshTerrain = terrainNode.getComponent(ƒ.ComponentMesh);

    // console.log(ƒ.Project.resources["Graph|2022-11-29T16:03:19.230Z|03819"]);

    placeTowers(graph, 30);
  }

  function checkTerrainHeight(_pos: ƒ.Vector3): number {
    let terrain: ƒ.MeshTerrain = <ƒ.MeshTerrain>meshTerrain.mesh;
    let terrainInfo: ƒ.TerrainInfo = terrain.getTerrainInfo(_pos, meshTerrain.mtxWorld);
    let height: number = terrainInfo.position.y;

    return height;
  }

  function placeTowers(_graph: ƒ.Node, _amount: number): void {
    let staticObjGraph: ƒ.Node = _graph.getChildrenByName("Objects")[0].getChildrenByName("Static")[0];
    let towerGraph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources[towerResource];


    for (let i: number = 0; i < _amount; i++) {

      let newTower: ƒ.GraphInstance = new ƒ.GraphInstance();
      newTower.set(towerGraph);
      let tip: ƒ.GraphInstance = new ƒ.GraphInstance();
      tip.set(<ƒ.Graph>towerGraph.getChild(0));
      newTower.addChild(tip);

      let randomPos: ƒ.Vector3 = new ƒ.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1);
      randomPos.scale(400);
      randomPos.add(ƒ.Vector3.Y(checkTerrainHeight(randomPos)));

      newTower.addComponent(new ƒ.ComponentTransform());
      newTower.mtxLocal.translation = randomPos;

      staticObjGraph.appendChild(newTower);
    }

  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}