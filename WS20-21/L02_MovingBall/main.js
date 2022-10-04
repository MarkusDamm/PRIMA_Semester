"use strict";
var L02_Ball;
(function (L02_Ball) {
    var ƒ = FudgeCore;
    document.addEventListener("DOMContentLoaded", init);
    let root = new ƒ.Node("Root");
    let cmpCamera = new ƒ.ComponentCamera();
    let cameraDistance = 2;
    let viewPort;
    //#region Velocity-variables
    let xInput;
    let xSpeed;
    let yInput;
    let ySpeed;
    //#endregion
    function init(_event) {
        let cmpTransformRoot = new ƒ.ComponentTransform();
        root.addComponent(cmpTransformRoot);
        let canvas = document.querySelector("canvas");
        cmpCamera.pivot.translateZ(cameraDistance);
        cmpCamera.pivot.rotateY(180);
        viewPort = new ƒ.Viewport();
        viewPort.initialize("ViewPort", root, cmpCamera, canvas);
        let colorCicle = ƒ.Color.CSS("green");
        let circle = createCircle(colorCicle);
        root.appendChild(circle);
        xInput = document.querySelector("input#X");
        xSpeed = Number(xInput.value);
        yInput = document.querySelector("input#Y");
        ySpeed = Number(yInput.value);
        document.querySelector("div").addEventListener("input", hdlInput);
        let fps = 30;
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hdlUpdate);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, fps);
        viewPort.draw();
    }
    function createCircle(_color) {
        let circle = new ƒ.Node("Circle");
        let meshCircle = new ƒ.MeshSphere("MeshCircle", 10, 10);
        let cmpMeshCircle = new ƒ.ComponentMesh(meshCircle);
        circle.addComponent(cmpMeshCircle);
        let matCircle = new ƒ.Material("CircleMat", ƒ.ShaderUniColor, new ƒ.CoatColored(_color));
        let cmpMatCircle = new ƒ.ComponentMaterial(matCircle);
        circle.addComponent(cmpMatCircle);
        let cmpTransCircle = new ƒ.ComponentTransform();
        let v3ScaleCircle = new ƒ.Vector3(0.2, 0.2, 0.001);
        cmpTransCircle.local.scale(v3ScaleCircle);
        circle.addComponent(cmpTransCircle);
        return circle;
    }
    function hdlInput(_event) {
        // console.log("input");
        xInput = document.querySelector("input#X");
        xSpeed = Number(xInput.value);
        yInput = document.querySelector("input#Y");
        ySpeed = Number(yInput.value);
    }
    function hdlUpdate(_event) {
        let mulitplier = 0.003;
        // für ständig neue "Wegwerf-Vectoren" kann der Recycler von Fudge genutzt werden ƒ.Recycler
        let v3Translate = new ƒ.Vector3(xSpeed * mulitplier, ySpeed * mulitplier, 0);
        root.mtxLocal.translate(v3Translate);
        // ƒ.Debug.log(root.mtxLocal.translation);     // Border at around 0.52 for 1,5; 0.72 for 2; 1.145 for 3; 1.554 for 4; 1.974 for 5
        let border = cameraDistance * (0.35 + (cameraDistance * 0.01));
        if (root.mtxLocal.translation.x <= -border || root.mtxLocal.translation.x >= border) {
            xInput.value = (Number(xInput.value) * -1).toString();
            document.querySelector("div").dispatchEvent(new Event("input"));
        }
        if (root.mtxLocal.translation.y <= -border || root.mtxLocal.translation.y >= border) {
            yInput.value = (Number(yInput.value) * -1).toString();
            document.querySelector("div").dispatchEvent(new Event("input"));
        }
        viewPort.draw();
    }
})(L02_Ball || (L02_Ball = {}));
//# sourceMappingURL=main.js.map