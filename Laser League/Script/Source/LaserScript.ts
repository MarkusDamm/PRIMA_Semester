namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  
    export class LaserScript extends CustomComponentScript {
  
        public message: string = "Laser Script added to ";

        private laserRotationSpeed: number = 120;

        constructor() {
            super();
        
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
        
            // Listen to this component being added to or removed from a node
            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
        }

        public hndEvent = (_event: Event) => {
            switch (_event.type) {
                case ƒ.EVENT.COMPONENT_ADD:
                    console.log("add listener for hdlRotation");
                    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.hdlRotation);
                    break;
                case ƒ.EVENT.COMPONENT_REMOVE:
                    this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
                    this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
                    break;
            }
        }
          
        public hdlRotation = (_event: Event) => {
            let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;      
            this.node.getComponent(ƒ.ComponentTransform).mtxLocal.rotateZ(this.laserRotationSpeed * deltaTime)
        }
    }
}