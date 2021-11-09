namespace LaserLeague {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(LaserLeague);  // Register the namespace to FUDGE for serialization

    export class LaserScript extends ƒ.ComponentScript {

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

        // use arrow-structure to make hndEvent an Attribute of LaserScript, so that *this* references this script
        public hndEvent = (_event: Event) => {
            switch (_event.type) {
                case ƒ.EVENT.COMPONENT_ADD:
                    let random: ƒ.Random = new ƒ.Random();
                    this.laserRotationSpeed = random.getRangeFloored(40, 80);
                    if (random.getBoolean())
                        this.laserRotationSpeed *= -1;
                    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.hndRotation);
                    break;
                case ƒ.EVENT.COMPONENT_REMOVE:
                    ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.hndRotation);
                    this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
                    this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
                    break;
            }
        }

        public hndRotation = (_event: Event) => {
            let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
            this.node.getComponent(ƒ.ComponentTransform).mtxLocal.rotateZ(this.laserRotationSpeed * deltaTime)
        }

        public static collisionCheck(_agent: ƒ.Node, _beam: ƒ.Node): boolean {
            let testPosition: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_agent.mtxWorld.translation, _beam.mtxWorldInverse);
            
            let distance: ƒ.Vector2 = ƒ.Vector2.DIFFERENCE(testPosition.toVector2(), _beam.mtxLocal.translation.toVector2());
            let beamScaling: ƒ.Vector3 = _beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling;
            let beamLength: number = beamScaling.y;
            let beamWidth: number = beamScaling.x;
            let agentWidth: number = _agent.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x;
            
            if (distance.x < -beamWidth-agentWidth || distance.x > beamWidth+agentWidth || distance.y < -agentWidth || distance.y > agentWidth + beamLength)
              return false;
            else
              return true;
          }
    }
}