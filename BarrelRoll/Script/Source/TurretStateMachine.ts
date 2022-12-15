namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  enum JOB {
    IDLE, ATTACK
  }

  export class TurretStateMachine extends ƒAid.ComponentStateMachine<JOB> {
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(TurretStateMachine);
    private static instructions: ƒAid.StateMachineInstructions<JOB> = TurretStateMachine.get();
    private cannon: ƒ.Node;

    constructor() {
      super();
      this.instructions = TurretStateMachine.instructions; // setup instructions with the static set

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    public static get(): ƒAid.StateMachineInstructions<JOB> {
      let setup: ƒAid.StateMachineInstructions<JOB> = new ƒAid.StateMachineInstructions();
      setup.transitDefault = TurretStateMachine.transitDefault;
      setup.actDefault = TurretStateMachine.actDefault;
      setup.setAction(JOB.IDLE, <ƒ.General>this.actIdle);
      setup.setTransition(JOB.IDLE, JOB.ATTACK, <ƒ.General>this.startAttack);
      return setup;
    }

    private static transitDefault(_machine: TurretStateMachine): void {
      console.log("Transit to", _machine.stateNext);
    }

    private static async actDefault(_machine: TurretStateMachine): Promise<void> {
      // console.log("Default");

    }

    private static async actIdle(_machine: TurretStateMachine): Promise<void> {
      // console.log("Idle");
      if (_machine.cannon) {
        _machine.cannon.mtxLocal.rotateY(1);
      }
      else
        console.log("no Cannon found");

    }

    private static startAttack(_machine: TurretStateMachine): void {
      // Rotate Cannon towards Spaceship

      // Play Sound
      console.log("Start Attack");
    }

    // Activate the functions of this component as response to events
    private hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          this.transit(JOB.IDLE);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          this.cannon = this.node.getChildrenByName("Cannon")[0];

          break;
      }
    }

    private update = (_event: Event): void => {
      this.act();
    }



    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}