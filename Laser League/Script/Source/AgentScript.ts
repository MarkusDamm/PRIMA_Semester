namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  export class AgentScript extends ƒ.ComponentScript {
    
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(AgentScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "AgentScript added to ";

    private agentMoveSpeed: number = 8;
    private agentRotateSpeed: number = 160;
    private ctrForward: ƒ.Control = new ƒ.Control("Forward", this.agentMoveSpeed, ƒ.CONTROL_TYPE.PROPORTIONAL);
    private ctrSideways: ƒ.Control = new ƒ.Control("Sideways", this.agentMoveSpeed, ƒ.CONTROL_TYPE.PROPORTIONAL);
    private ctrRotation: ƒ.Control = new ƒ.Control("Rotation", this.agentRotateSpeed, ƒ.CONTROL_TYPE.PROPORTIONAL);
    
    constructor() {
      super();
      
      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
      return;
      
      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
    }
    
    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event) => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Debug.log("Custom component script added", this.message, this.node);
          this.ctrForward.setDelay(50);
          this.ctrSideways.setDelay(50);
          this.ctrRotation.setDelay(20);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
      }
    }

    public hdlAgentMovement = (_deltaTime: number) => {
      let forwardSpeed: number = (
        ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) +
        ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
      );
      this.ctrForward.setInput(forwardSpeed * _deltaTime);
      this.node.mtxLocal.translateY(this.ctrForward.getOutput());
  
      let sidewaysSpeed: number = (
        ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D]) +
        ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A])
      );
      this.ctrSideways.setInput(sidewaysSpeed * _deltaTime);
      this.node.mtxLocal.translateX(this.ctrSideways.getOutput());
  
      let rotationSpeed: number = (
        ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.ARROW_LEFT]) +
        ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.ARROW_RIGHT])
      );
      this.ctrRotation.setInput(rotationSpeed * _deltaTime);
      this.node.mtxLocal.rotateZ(this.ctrRotation.getOutput());
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}