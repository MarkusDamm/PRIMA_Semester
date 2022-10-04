"use strict";
var L03_BreakOut_Move;
(function (L03_BreakOut_Move) {
    var ƒ = FudgeCore;
    document.addEventListener("DOMContentLoaded", init);
    let root = new ƒ.Node("Root");
    let ball;
    let ballRect;
    let blocks = [];
    let blocksRects = [];
    let cmpCamera = new ƒ.ComponentCamera();
    let cameraDistance = 40;
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
        let colorBall = ƒ.Color.CSS("green");
        ball = createBall(colorBall);
        root.appendChild(ball);
        let border = new ƒ.Node("Border");
        root.appendChild(border);
        // 4 Blocks for the border needed
        let colorBorder = ƒ.Color.CSS("white");
        let borderPosition;
        let borderScale;
        for (let i = 0; i < 4; i++) {
            switch (i) {
                case 0:
                    borderPosition = new ƒ.Vector3(0, 14);
                    borderScale = new ƒ.Vector3(35, 1);
                    break;
                case 1:
                    borderPosition = new ƒ.Vector3(17);
                    borderScale = new ƒ.Vector3(1, 28);
                    break;
                case 2:
                    borderPosition = new ƒ.Vector3(0, -14);
                    borderScale = new ƒ.Vector3(35, 1);
                    break;
                case 3:
                    borderPosition = new ƒ.Vector3(-17);
                    borderScale = new ƒ.Vector3(1, 28);
            }
            let borderBlock = createBlock(colorBorder, borderPosition, borderScale);
            // console.log("border " + i + " at " + borderPosition + " with " + borderScale);
            border.appendChild(borderBlock);
        }
        let colorBlock = ƒ.Color.CSS("orange");
        let blockPosition = new ƒ.Vector3(0, 10, 0);
        let block = createBlock(colorBlock, blockPosition);
        root.appendChild(block);
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
    function createBall(_color) {
        // Für die Kollision sind hier womöglich Vorbereitungen notwendig:
        // vielleicht was mit ƒ.Rectangle
        // auch im Collision-Test von Fudge nachgucken
        // Pong von WS19 kann auch hilfreich sein
        let ball = new ƒ.Node("Ball");
        let meshBall = new ƒ.MeshSphere("MeshBall", 15, 15);
        let cmpMeshBall = new ƒ.ComponentMesh(meshBall);
        ball.addComponent(cmpMeshBall);
        let matBall = new ƒ.Material("BallMat", ƒ.ShaderUniColor, new ƒ.CoatColored(_color));
        let cmpMatBall = new ƒ.ComponentMaterial(matBall);
        ball.addComponent(cmpMatBall);
        let cmpTransBall = new ƒ.ComponentTransform();
        let v3ScaleBall = new ƒ.Vector3(1, 1, 1);
        cmpTransBall.local.scale(v3ScaleBall);
        ball.addComponent(cmpTransBall);
        ballRect = new ƒ.Rectangle();
        return ball;
    }
    function createBlock(_color, _position, _scale = new ƒ.Vector3(3, 1, 1)) {
        let block = new ƒ.Node("Block");
        let meshBlock = new ƒ.MeshCube("MeshBlock");
        let cmpMeshBlock = new ƒ.ComponentMesh(meshBlock);
        block.addComponent(cmpMeshBlock);
        let matBlock = new ƒ.Material("BlockMat", ƒ.ShaderUniColor, new ƒ.CoatColored(_color));
        let cmpMatBlock = new ƒ.ComponentMaterial(matBlock);
        block.addComponent(cmpMatBlock);
        let cmpTransBlock = new ƒ.ComponentTransform();
        cmpTransBlock.local.scale(_scale);
        if (_position) {
            cmpTransBlock.local.translate(_position);
        }
        block.addComponent(cmpTransBlock);
        let blockRect = new ƒ.Rectangle(0, 0, _scale.x, _scale.y);
        let rectPos = new ƒ.Vector2(block.mtxLocal.translation.x - (_scale.x / 2), block.mtxLocal.translation.y - (_scale.y / 2));
        blockRect.position = rectPos;
        console.log(blockRect.height);
        blocks.push(block);
        blocksRects.push(blockRect);
        return block;
    }
    function hdlInput(_event) {
        // console.log("input");
        xInput = document.querySelector("input#X");
        xSpeed = Number(xInput.value);
        yInput = document.querySelector("input#Y");
        ySpeed = Number(yInput.value);
    }
    function hdlUpdate(_event) {
        let mulitplier = 2;
        ballRect.position = ball.mtxLocal.translation.toVector2();
        // console.log(ƒ.Time.game.getElapsedSincePreviousCall());
        for (let blockRect of blocksRects) {
            if (ballRect.collides(blockRect)) {
                console.log("Ball collides with Block!");
                let intersection = ballRect.getIntersection(blockRect);
                if (intersection.size.x > intersection.size.y) {
                    yInput.value = (Number(yInput.value) * -1).toString();
                    document.querySelector("div").dispatchEvent(new Event("input"));
                }
                else if (intersection.size.x < intersection.size.y) {
                    xInput.value = (Number(xInput.value) * -1).toString();
                    document.querySelector("div").dispatchEvent(new Event("input"));
                }
                // ƒ.DebugConsole(ballRect.getIntersection(blockRect).position);
            }
        }
        let frameTime = ƒ.Time.game.getElapsedSincePreviousCall() / 1000;
        // für ständig neue "Wegwerf-Vectoren" kann der Recycler von Fudge genutzt werden ƒ.Recycler
        let v3Velocity = new ƒ.Vector3(xSpeed * mulitplier, ySpeed * mulitplier, 0);
        v3Velocity.scale(frameTime);
        ball.mtxLocal.translate(v3Velocity);
        viewPort.draw();
    }
})(L03_BreakOut_Move || (L03_BreakOut_Move = {}));
//# sourceMappingURL=main.js.map