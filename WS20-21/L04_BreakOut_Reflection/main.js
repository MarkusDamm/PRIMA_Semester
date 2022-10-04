"use strict";
var L04_BreakOut_Reflection;
(function (L04_BreakOut_Reflection) {
    var ƒ = FudgeCore;
    document.addEventListener("DOMContentLoaded", init);
    let root = new ƒ.Node("Root");
    let ball;
    let obstacles;
    let walls;
    let cmpCamera = new ƒ.ComponentCamera();
    let cameraDistance = 40;
    let viewPort;
    //#region Velocity-variables
    let xInput;
    let yInput;
    //#endregion
    function init(_event) {
        let cmpTransformRoot = new ƒ.ComponentTransform();
        root.addComponent(cmpTransformRoot);
        let canvas = document.querySelector("canvas");
        cmpCamera.pivot.translateZ(cameraDistance);
        cmpCamera.pivot.rotateY(180);
        viewPort = new ƒ.Viewport();
        viewPort.initialize("ViewPort", root, cmpCamera, canvas);
        ball = new L04_BreakOut_Reflection.Ball("Ball");
        root.appendChild(ball);
        obstacles = new ƒ.Node("Obstacles");
        root.appendChild(obstacles);
        walls = new ƒ.Node("Border");
        root.appendChild(walls);
        // 4 Blocks for the border needed
        walls.appendChild(new L04_BreakOut_Reflection.GameObject("Wall", new ƒ.Vector2(17), new ƒ.Vector2(1, 28)));
        walls.appendChild(new L04_BreakOut_Reflection.GameObject("Wall", new ƒ.Vector2(0, 14), new ƒ.Vector2(35, 1)));
        walls.appendChild(new L04_BreakOut_Reflection.GameObject("Wall", new ƒ.Vector2(-17), new ƒ.Vector2(1, 28)));
        walls.appendChild(new L04_BreakOut_Reflection.GameObject("Wall", new ƒ.Vector2(0, -14), new ƒ.Vector2(35, 1)));
        addBricks(24);
        xInput = document.querySelector("input#X");
        yInput = document.querySelector("input#Y");
        document.querySelector("div").addEventListener("input", hdlInput);
        document.querySelector("div").addEventListener("adjust", hdlAdjustment);
        let fps = 30;
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hdlUpdate);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, fps);
        viewPort.draw();
    }
    function hdlInput(_event) {
        ball.setVelocity(new ƒ.Vector2(Number(xInput.value), Number(yInput.value)));
    }
    function hdlAdjustment(_event) {
        xInput.value = (ball.velocity.x / 2).toString();
        yInput.value = (ball.velocity.y / 2).toString();
    }
    function hdlUpdate(_event) {
        ball.update();
        for (let wall of walls.getChildren()) {
            if (ball.isColliding(wall)) {
                ball.hdlCollision(wall);
            }
        }
        for (let obstacle of obstacles.getChildren()) {
            if (ball.isColliding(obstacle)) {
                ball.hdlCollision(obstacle);
                obstacle.processCollision();
            }
        }
        viewPort.draw();
        // Interaktive Plattform an der der Ball abprallen soll
        // mit ƒ.Keyboard.isPressedOne() oder mit horizontaler Achse
        // Axis-Referenz anschauen
        // Control-Referenz anschauen
        // console.log(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.ARROW_RIGHT]));
        // new ƒ.Axis("Horizontal");
    }
    function addBricks(_amount) {
        let x = -14;
        let y = 12;
        for (let i = 0; i < _amount; i++) {
            if (x > 14) {
                x = -14;
                y -= 2;
            }
            obstacles.addChild(new L04_BreakOut_Reflection.Brick(`Brick${i}`, new ƒ.Vector2(x, y)));
            x += 4;
        }
    }
})(L04_BreakOut_Reflection || (L04_BreakOut_Reflection = {}));
//# sourceMappingURL=main.js.map