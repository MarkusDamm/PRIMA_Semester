namespace L14_Doom {
  import ƒ = FudgeCore;
  import ƒaid = FudgeAid;

  window.addEventListener("load", hndLoad);

  export let viewport: ƒ.Viewport;
  let root: ƒ.Node = new ƒ.Node("Root");
  let avatar: Avatar;
  let enemies: ƒ.Node;

  export let walls: ƒ.Node;
  export const sizeWall: number = 3;
  export const numWalls: number = 20;

  const clrWhite: ƒ.Color = ƒ.Color.CSS("white");

  async function hndLoad(_event: Event): Promise<void> {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");

    let floor: ƒaid.Node = createFloor();
    root.appendChild(floor);

    walls = createWalls();
    root.appendChild(walls);

    enemies = await createEnemies();
    root.appendChild(enemies);

    avatar = new Avatar();
    root.appendChild(avatar);

    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", root, avatar.getComponent(ƒ.ComponentCamera), canvas);
    viewport.draw();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, hndLoop);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 60);

    canvas.addEventListener("mousemove", hndMouseMove);
    canvas.addEventListener("click", canvas.requestPointerLock);
  }

  async function createEnemies(): Promise<ƒ.Node> {
    let enemies: ƒ.Node = new ƒ.Node("Enemies");

    let txtEnemy: ƒ.TextureImage = new ƒ.TextureImage();
    await txtEnemy.load("../DoomAssets/Cyberdemon_transparent.png");
    let coatSprite: ƒ.CoatTextured = new ƒ.CoatTextured(clrWhite, txtEnemy);
    Enemy.generateSprites(coatSprite);

    enemies.appendChild(new Enemy(new ƒ.Vector3(4, 0, -3)));
    enemies.appendChild(new Enemy(new ƒ.Vector3(-4, 0, -3)));

    return enemies;
  }

  function createFloor(): ƒaid.Node {
    let meshQuad: ƒ.MeshQuad = new ƒ.MeshQuad("Quad");

    let txtFloor: ƒ.TextureImage = new ƒ.TextureImage("../DoomAssets/DEM1_5.png");
    let mtrFloor: ƒ.Material = new ƒ.Material("Floor", ƒ.ShaderTexture, new ƒ.CoatTextured(clrWhite, txtFloor));
    let floor: ƒaid.Node = new ƒaid.Node("Floor", ƒ.Matrix4x4.ROTATION_X(-90), mtrFloor, meshQuad);
    floor.mtxLocal.scale(ƒ.Vector3.ONE(sizeWall * numWalls));
    floor.getComponent(ƒ.ComponentMaterial).pivot.scale(ƒ.Vector2.ONE(numWalls));
    return floor;
  }

  function hndLoop(_event: Event): void {
    avatar.update();
    for (let enemy of enemies.getChildren() as Enemy[]) {
      // enemy.update();
      enemy.update(avatar.mtxWorld.translation);
    }
    viewport.draw();
  }

  function hndMouseMove(_event: MouseEvent): void {
    // console.log(_event.movementX, _event.movementY);
    avatar.rotate(_event);
  }

  function createWalls(): ƒ.Node {
    let walls: ƒ.Node = new ƒ.Node("Walls");

    let txtWall: ƒ.TextureImage = new ƒ.TextureImage("../DoomAssets/CEMPOIS.png");
    let mtrWall: ƒ.Material = new ƒ.Material("Wall", ƒ.ShaderTexture, new ƒ.CoatTextured(clrWhite, txtWall));

    // walls.appendChild(new Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.Y(sizeWall / 2), ƒ.Vector3.ZERO(), mtrWall));
    // walls.appendChild(new Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.SCALE(new ƒ.Vector3(0.5, 1, -0.866), sizeWall / 2), ƒ.Vector3.Y(120), mtrWall));
    // walls.appendChild(new Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.SCALE(new ƒ.Vector3(-0.5, 1, -0.866), sizeWall / 2), ƒ.Vector3.Y(-120), mtrWall));

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

  export function calculateAngle(_vectorA: ƒ.Vector3, _vectorB: ƒ.Vector3): number {
    let angle: number = 0;
    let dotProduct: number = ƒ.Vector3.DOT(_vectorA, _vectorB);
    let lengthA: number = calculateVectorLenght(_vectorA);
    let lengthB: number = calculateVectorLenght(_vectorB);
    angle = dotProduct / (lengthA * lengthB);
    console.log(_vectorA);

    return angle;
  }

  function calculateVectorLenght(_vector: ƒ.Vector3): number {
    let length: number = _vector.x * _vector.x + _vector.y * _vector.y + _vector.z * _vector.z;
    length = Math.sqrt(length);
    return length;
  }

}