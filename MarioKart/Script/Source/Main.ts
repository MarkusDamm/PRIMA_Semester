namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let root: ƒ.Node;

  let kart: ƒ.Node;
  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 10, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(200);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 100, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(50);

  let meshRelief: ƒ.MeshRelief;
  let mtxRelief: ƒ.Matrix4x4;

  // let hightMap: ƒ.TextureImage = new ƒ.TextureImage();
  window.addEventListener("load", init);

  async function init(_event: Event): Promise<void> {
    let dialog: HTMLDialogElement = document.querySelector("dialog");
    dialog.querySelector("h1").textContent = document.title;
    dialog.addEventListener("click", function (_event: Event) {
      // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
      dialog.close();
      start();
    });
    //@ts-ignore
    dialog.showModal();
    // await hightMap.load("../../images/Kart-track.png");
  }

  async function start(): Promise<void> {
    await ƒ.Project.loadResourcesFromHTML();
    root = <ƒ.Graph>ƒ.Project.resources[document.head.querySelector("meta[autoView]").getAttribute("autoView")];
    // let cmpCamera: ƒ.ComponentCamera = root.getComponent(ƒ.ComponentCamera);
    // root.removeComponent(cmpCamera);
    // cmpCamera = new ƒ.ComponentCamera();
    let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    // cmpCamera.mtxPivot.translateZ(60);
    cmpCamera.mtxPivot.translateY(110);
    cmpCamera.mtxPivot.rotateY(180);
    cmpCamera.mtxPivot.rotateX(90);

    root.addComponent(cmpCamera);
    // root.getChildrenByName("Relief")[0].getComponent(ƒ.ComponentMesh).mesh.setTexture();
    let cmpMeshRelief: ƒ.ComponentMesh = root.getChildrenByName("Relief")[0].getComponent(ƒ.ComponentMesh);
    meshRelief = <ƒ.MeshRelief>cmpMeshRelief.mesh;
    mtxRelief = cmpMeshRelief.mtxWorld;

    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", root, cmpCamera, canvas);

    ƒ.AudioManager.default.listenTo(root);
    ƒ.AudioManager.default.listenWith(root.getComponent(ƒ.ComponentAudioListener));

    kart = root.getChildrenByName("Kart")[0];
    // kart = <ƒ.Graph>ƒ.Project.resources["Graph|2021-11-18T12:47:22.918Z|78691"];
    // kart.mtxLocal.translateX(5);
    // root.appendChild(kart);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used
    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
    controls(deltaTime);
    let terrainInfo: ƒ.TerrainInfo = meshRelief.getTerrainInfo(kart.mtxWorld.translation, mtxRelief);
    kart.mtxLocal.translation = terrainInfo.position;
    kart.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, kart.mtxLocal.getZ()), terrainInfo.normal);

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function controls(_deltaTime: number): void {
    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward * _deltaTime);
    kart.mtxLocal.translateZ(ctrForward.getOutput());
    let velocity: number = ctrForward.getOutput();

    let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    ctrTurn.setInput(turn * _deltaTime);
    if (velocity < -0.1 || velocity > 0.1) {
      kart.mtxLocal.rotateY(ctrTurn.getOutput());
    }
    // console.log(ctrTurn.getOutput());


  }
}