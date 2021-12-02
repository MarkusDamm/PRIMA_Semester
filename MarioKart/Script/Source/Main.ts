namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
  let cameraNode: ƒ.Node = new ƒ.Node("Camera");
  cameraNode.addComponent(cmpCamera);
  let root: ƒ.Node;

  let kart: ƒ.Node;
  let rbKart: ƒ.ComponentRigidbody;
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
    setUpViewport();

    // root.getChildrenByName("Relief")[0].getComponent(ƒ.ComponentMesh).mesh.setTexture();
    let cmpMeshRelief: ƒ.ComponentMesh = root.getChildrenByName("Relief")[0].getComponent(ƒ.ComponentMesh);
    meshRelief = <ƒ.MeshRelief>cmpMeshRelief.mesh;
    mtxRelief = cmpMeshRelief.mtxWorld;

    ƒ.AudioManager.default.listenTo(root);
    ƒ.AudioManager.default.listenWith(root.getComponent(ƒ.ComponentAudioListener));

    // kart = <ƒ.Graph>ƒ.Project.resources["Graph|2021-11-18T12:47:22.918Z|78691"];
    // kart.mtxLocal.translateX(5);
    // root.appendChild(kart);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function setUpViewport(): void {
    root = <ƒ.Graph>ƒ.Project.resources[document.head.querySelector("meta[autoView]").getAttribute("autoView")];
    kart = root.getChildrenByName("Kart")[0];
    rbKart = kart.getComponent(ƒ.ComponentRigidbody);
    root.appendChild(cameraNode);
    let cmpTransformCamera: ƒ.ComponentTransform = new ƒ.ComponentTransform();
    cameraNode.addComponent(cmpTransformCamera);
    // let cmpCamera: ƒ.ComponentCamera = root.getComponent(ƒ.ComponentCamera);
    // root.removeComponent(cmpCamera);
    // cmpCamera = new ƒ.ComponentCamera();
    // kart.addComponent(cmpCamera);
    cmpCamera.mtxPivot.translateZ(-8);
    cmpCamera.mtxPivot.translateY(5);
    cmpCamera.mtxPivot.rotateX(20);
    adjustCamera();
    // cmpCamera.mtxPivot.lookAt(ƒ.Vector3.SUM(kart.mtxWorld.translation, ƒ.Vector3.Z(5)), ƒ.Vector3.Y());
    // cmpCamera.mtxPivot.rotateY(0);
    // cmpCamera.mtxPivot.rotateX(30);

    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", root, cmpCamera, canvas);
  }

  function update(_event: Event): void {
    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
    controls(deltaTime);

    let terrainInfo: ƒ.TerrainInfo = meshRelief.getTerrainInfo(kart.mtxLocal.translation, mtxRelief);
    kart.mtxLocal.translation = terrainInfo.position;
    kart.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, kart.mtxLocal.getZ()), terrainInfo.normal);

    hover();
    ƒ.Physics.world.simulate();  // if physics is included and used
    adjustCamera();
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function controls(_deltaTime: number): void {
    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward * _deltaTime);
    rbKart.applyForce(ƒ.Vector3.SCALE(kart.mtxLocal.getZ(), ctrForward.getOutput()));
    // kart.mtxLocal.translateZ(ctrForward.getOutput());
    let velocity: number = ctrForward.getOutput();

    let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    ctrTurn.setInput(turn * _deltaTime);
    if (velocity > 0.05) {
      rbKart.applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput()))
      // kart.mtxLocal.rotateY(ctrTurn.getOutput());
    }
    else if (velocity < -0.05) {
      rbKart.applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), -ctrTurn.getOutput()))
      // kart.mtxLocal.rotateY(-ctrTurn.getOutput());
    }
  }

  function adjustCamera(): void {
    let kartPosition: ƒ.Vector3 = kart.mtxWorld.translation;
    cameraNode.mtxLocal.translation = kartPosition;
    cameraNode.mtxLocal.rotation = new ƒ.Vector3(0, kart.mtxLocal.rotation.y, 0);

    // cmpCamera.mtxPivot.translation = ƒ.Vector3.SUM(kart.mtxWorld.translation, ƒ.Vector3.Y(5), ƒ.Vector3.CROSS(kart.mtxLocal.translation, ƒ.Vector3.Z(-6)));
    // cmpCamera.mtxPivot.lookAt(ƒ.Vector3.SUM(kart.mtxWorld.translation, ƒ.Vector3.Z(5)), ƒ.Vector3.Y());
  }

  function hover(): void {
    // let maxHeight: number = 0.3;
    // let minHeight: number = 0.2;
    let wheels: ƒ.Node[] = kart.getChildren();
    let hoverForce: number = rbKart.mass * rbKart.effectGravity * ƒ.Physics.world.getGravity().magnitude / wheels.length;

    for (let wheel of wheels) {
      let posWheel: ƒ.Vector3 = wheel.mtxWorld.translation;
      let terrainInfo: ƒ.TerrainInfo = meshRelief.getTerrainInfo(posWheel, mtxRelief);
      let height: number = posWheel.y - terrainInfo.position.y;
      let multiplier: number = 3 - (height * 10);
      rbKart.applyForceAtPoint(ƒ.Vector3.Y(hoverForce * multiplier), wheel.mtxWorld.translation)
    }
  }

}