namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class TargetScript extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(TargetScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "TargetScript added to ";

    private rb: ƒ.ComponentRigidbody;

    constructor() {
      super();

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);

    }

    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          // ƒ.Debug.log(this.message, this.node);
          this.rb = this.node.getComponent(ƒ.ComponentRigidbody);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          // console.log("TargetScript is deserialized");
          
          this.rb.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.hndCollision);
          // console.log("TargetScript got Collision EL");

          break;
      }
    }

    private hndCollision = (_event: ƒ.EventPhysics): void => {
      this.node.activate(false);

      // console.log(_event.target);
      // console.log("bumm");
    }



  }
}