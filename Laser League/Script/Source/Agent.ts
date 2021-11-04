namespace LaserLeague {
  import ƒ = FudgeCore;

  export class Agent extends ƒ.Node {
    constructor() {
      super("Agent");

      this.addComponent(new ƒ.ComponentTransform);

      this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshPolygon("MeshAgent")));
      this.addComponent(new ƒ.ComponentMaterial(
        new ƒ.Material("mtrAgent", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0.9, 0.75, 0, 1))))
      );

      this.ctrForward.setDelay(50);
      this.ctrSideways.setDelay(50);
      this.ctrRotation.setDelay(20);
      ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.hndAgentMovement);

      // this.mtxLocal.scale(ƒ.Vector3.ONE(0.5));
    }

    private agentMoveSpeed: number = 8;
    private agentRotateSpeed: number = 160;
    private ctrForward: ƒ.Control = new ƒ.Control("Forward", this.agentMoveSpeed, ƒ.CONTROL_TYPE.PROPORTIONAL);
    private ctrSideways: ƒ.Control = new ƒ.Control("Sideways", this.agentMoveSpeed, ƒ.CONTROL_TYPE.PROPORTIONAL);
    private ctrRotation: ƒ.Control = new ƒ.Control("Rotation", this.agentRotateSpeed, ƒ.CONTROL_TYPE.PROPORTIONAL);
 
    public hndAgentMovement = () => {
      let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;

      let forwardSpeed: number = (
        ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) +
        ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
      );
      this.ctrForward.setInput(forwardSpeed * deltaTime);
      this.mtxLocal.translateY(this.ctrForward.getOutput());
  
      let sidewaysSpeed: number = (
        ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D]) +
        ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A])
      );
      this.ctrSideways.setInput(sidewaysSpeed * deltaTime);
      this.mtxLocal.translateX(this.ctrSideways.getOutput());
  
      let rotationSpeed: number = (
        ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.ARROW_LEFT]) +
        ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.ARROW_RIGHT])
      );
      this.ctrRotation.setInput(rotationSpeed * deltaTime);
      this.mtxLocal.rotateZ(this.ctrRotation.getOutput());
    }
  }
}