namespace L09_Doom_Control_Copy {
  import ƒ = FudgeCore;
  import ƒaid = FudgeAid;

  window.addEventListener("load", hndLoad);

  export let viewport: ƒ.Viewport;
  let root: ƒ.Node = new ƒ.Node("Root");
  let avatar: Avatar;

  export let walls: ƒ.Node;
  const sizeWall: number = 3;
  const numWalls: number = 20;

  function hndLoad(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");

    let floor: ƒaid.Node = createFloor();
    root.appendChild(floor);

    // let txtWall: ƒ.TextureImage = new ƒ.TextureImage("../DoomAssets/CEMPOIS.png");
    // let mtrWall: ƒ.Material = new ƒ.Material("Wall", ƒ.ShaderTexture, new ƒ.CoatTextured(null, txtWall));

    walls = createWalls();
    root.appendChild(walls);
    // let wall: Wall = new Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.Y(1.5), ƒ.Vector3.ZERO(), mtrWall);
    // root.appendChild(wall);

    avatar = new Avatar();
    root.appendChild(avatar);

    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", root, avatar.getComponent(ƒ.ComponentCamera), canvas);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, hndLoop);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 60);

    canvas.addEventListener("mousemove", hndMouse);
  }

  function createFloor(): ƒaid.Node {
    let meshQuad: ƒ.MeshQuad = new ƒ.MeshQuad("Quad");

    let txtFloor: ƒ.TextureImage = new ƒ.TextureImage("../DoomAssets/DEM1_5.png");
    let mtrFloor: ƒ.Material = new ƒ.Material("Floor", ƒ.ShaderTexture, new ƒ.CoatTextured(null, txtFloor));
    let floor: ƒaid.Node = new ƒaid.Node("Floor", ƒ.Matrix4x4.ROTATION_X(-90), mtrFloor, meshQuad);
    floor.mtxLocal.scale(ƒ.Vector3.ONE(sizeWall * numWalls));
    floor.getComponent(ƒ.ComponentMaterial).pivot.scale(ƒ.Vector2.ONE(numWalls));
    return floor;
  }

  function hndLoop(_event: Event): void {
    avatar.update();
    viewport.draw();
  }

  function hndMouse(_event: MouseEvent): void {
    // console.log(_event.movementX, _event.movementY);
    avatar.rotate(_event);
  }

  function createWalls(): ƒ.Node {
    let walls: ƒ.Node = new ƒ.Node("Walls");

    let txtWall: ƒ.TextureImage = new ƒ.TextureImage("../DoomAssets/CEMPOIS.png");
    let mtrWall: ƒ.Material = new ƒ.Material("Wall", ƒ.ShaderTexture, new ƒ.CoatTextured(null, txtWall));

    // let txtWall: ƒ.TextureImage = new ƒ.TextureImage("../DoomAssets/CEMPOIS.png");
    // let mtrWall: ƒ.Material = new ƒ.Material("Wall", ƒ.ShaderTexture, new ƒ.CoatTextured(null, txtWall));

    walls.appendChild(new Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.Y(sizeWall / 2), ƒ.Vector3.ZERO(), mtrWall));
    walls.appendChild(new Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.SCALE(new ƒ.Vector3(0.5, 1, -0.866), sizeWall / 2), ƒ.Vector3.Y(120), mtrWall));
    walls.appendChild(new Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.SCALE(new ƒ.Vector3(-0.5, 1, -0.866), sizeWall / 2), ƒ.Vector3.Y(-120), mtrWall));

    for (let i: number = -numWalls / 2 + 0.5; i < numWalls / 2; i++) {
      walls.appendChild(new Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.SCALE(new ƒ.Vector3(-numWalls / 2, 0.5, i), sizeWall), ƒ.Vector3.Y(90), mtrWall));

      // for (let i: number = -numWalls / 2 + 0.5; i < numWalls / 2; i++)
      walls.appendChild(new Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.SCALE(new ƒ.Vector3(numWalls / 2, 0.5, i), sizeWall), ƒ.Vector3.Y(-90), mtrWall));

      // for (let i: number = -numWalls / 2 + 0.5; i < numWalls / 2; i++)
      walls.appendChild(new Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.SCALE(new ƒ.Vector3(i, 0.5, -numWalls / 2), sizeWall), ƒ.Vector3.Y(0), mtrWall));

      // for (let i: number = -numWalls / 2 + 0.5; i < numWalls / 2; i++)
      walls.appendChild(new Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.SCALE(new ƒ.Vector3(i, 0.5, numWalls / 2), sizeWall), ƒ.Vector3.Y(180), mtrWall));
    }

    return walls;
  }

  export function bounceOffWalls(_walls: Wall[]): Wall[] {
    let bouncedOff: Wall[] = [];
    let posAvatar: ƒ.Vector3 = avatar.mtxLocal.translation;

    for (let wall of _walls) {
      let posBounce: ƒ.Vector3 = wall.calculateBounce(posAvatar, 1);
      if (posBounce) {
        avatar.mtxLocal.translation = posBounce;
        bouncedOff.push(wall);
      }
    }
    return bouncedOff;
  }

}