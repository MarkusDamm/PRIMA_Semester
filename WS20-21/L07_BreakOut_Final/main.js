"use strict";
var L07_BreakOut_Final;
(function (L07_BreakOut_Final) {
    var ƒ = FudgeCore;
    let GAMESTATE;
    (function (GAMESTATE) {
        GAMESTATE[GAMESTATE["PLAY"] = 0] = "PLAY";
        GAMESTATE[GAMESTATE["GAMEOVER"] = 1] = "GAMEOVER";
    })(GAMESTATE || (GAMESTATE = {}));
    document.addEventListener("DOMContentLoaded", init);
    let root = new ƒ.Node("Root");
    let points = 0;
    let counter;
    let gameState = GAMESTATE.PLAY;
    let ball;
    let paddle;
    let powerUps;
    let obstacles;
    let walls;
    let wallBottom;
    let cmpCamera = new ƒ.ComponentCamera();
    let cameraDistance = 40;
    let viewPort;
    let control = new ƒ.Control("PaddleControl", 1, 0 /* PROPORTIONAL */);
    control.setDelay(100);
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
        counter = document.querySelector(".counter");
        viewPort = new ƒ.Viewport();
        viewPort.initialize("ViewPort", root, cmpCamera, canvas);
        ball = new L07_BreakOut_Final.Ball("Ball");
        root.appendChild(ball);
        paddle = new L07_BreakOut_Final.Paddle("Controller", new ƒ.Vector2(0, -10));
        root.appendChild(paddle);
        obstacles = new ƒ.Node("Obstacles");
        root.appendChild(obstacles);
        walls = new ƒ.Node("Border");
        root.appendChild(walls);
        powerUps = new ƒ.Node("PowerUps");
        root.appendChild(powerUps);
        let powerUp = new L07_BreakOut_Final.PowerUp("PowerUp", ƒ.Vector2.X(5), ƒ.Vector2.ONE());
        powerUps.appendChild(powerUp);
        // 4 Blocks for the border needed
        walls.appendChild(new L07_BreakOut_Final.GameObject("WallRight", new ƒ.Vector2(17, -1), new ƒ.Vector2(1, 30)));
        walls.appendChild(new L07_BreakOut_Final.GameObject("WallUp", new ƒ.Vector2(0, 14), new ƒ.Vector2(35, 1)));
        walls.appendChild(new L07_BreakOut_Final.GameObject("WallLeft", new ƒ.Vector2(-17, -1), new ƒ.Vector2(1, 30)));
        wallBottom = new L07_BreakOut_Final.GameObject("WallDown", new ƒ.Vector2(0, -14), new ƒ.Vector2(35, 1));
        wallBottom.removeComponent(wallBottom.getComponent(ƒ.ComponentMaterial));
        walls.appendChild(wallBottom);
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
        if (gameState == GAMESTATE.GAMEOVER) {
            ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, hdlUpdate);
            alert("Rip In Paddles");
            return;
        }
        ball.update();
        for (let powerUp of powerUps.getChildren()) {
            powerUp.update();
        }
        for (let wall of walls.getChildren()) {
            if (ball.isColliding(wall)) {
                if (wall == wallBottom)
                    gameState = GAMESTATE.GAMEOVER;
                ball.hdlCollision(wall);
            }
        }
        for (let obstacle of obstacles.getChildren()) {
            if (ball.isColliding(obstacle)) {
                ball.hdlCollision(obstacle);
                obstacle.processCollision();
            }
        }
        if (ball.isColliding(paddle)) {
            ball.hdlCollision(paddle);
        }
        viewPort.draw();
        control.setInput(ƒ.Keyboard.mapToValue(10, 0, [ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])
            + ƒ.Keyboard.mapToValue(-10, 0, [ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]));
        let mttPosPaddle = paddle.mtxLocal.getMutator();
        paddle.setVelocity(ƒ.Vector2.X(Number((control.getOutput()).toFixed(3))));
        paddle.update();
        if (paddle.isColliding(walls.getChildrenByName("WallLeft")[0]) ||
            paddle.isColliding(walls.getChildrenByName("WallRight")[0])) {
            paddle.mtxLocal.mutate(mttPosPaddle);
        }
        if (powerUps.getChildren().length > 0) {
            if (paddle.isColliding(powerUps.getChildren()[0])) {
                paddle.increaseSize(ƒ.Vector2.X(2));
                console.log("increase Paddle size");
                powerUps.removeChild(powerUps.getChildren()[0]);
                // powerUp = null;
            }
        }
    }
    // Bis Dienstag: 
    // Doom-Texturen raussuchen
    // altes Doom betrachten und Umsetzungsvorschläge skizzieren
    // für den BreakOut-Rest noch möglich
    // PowerUp weiter ausbauen (Siehe Jirka)
    // ƒ.Timer nutzen, um ein Timer für PowerUps 
    function addBricks(_amount) {
        let x = -14;
        let y = 12;
        for (let i = 0; i < _amount; i++) {
            if (x > 14) {
                x = -14;
                y -= 2;
            }
            obstacles.addChild(new L07_BreakOut_Final.Brick(`Brick${i}`, new ƒ.Vector2(x, y)));
            x += 4;
        }
    }
    function addPoints(_amount) {
        points += _amount;
        counter.innerText = points + " Points";
    }
    L07_BreakOut_Final.addPoints = addPoints;
})(L07_BreakOut_Final || (L07_BreakOut_Final = {}));
//# sourceMappingURL=main.js.map