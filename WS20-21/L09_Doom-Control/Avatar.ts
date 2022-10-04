namespace L09_Doom_Control {
    export class Avatar extends ƒ.Node {

        public constructor() {
            super("Avatar");

            let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
            this.addComponent(cmpCamera);

            let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.ZERO()));
            this.addComponent(cmpTransform);
        }
    }
}