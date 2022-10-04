"use strict";
var L16_Doom_Audio;
(function (L16_Doom_Audio) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let ANGLE;
    (function (ANGLE) {
        // N = 0, NE = 1, E = 2, SE = 3, S = 4, SW = 5, W = 6, NW = 7,
        ANGLE[ANGLE["_000"] = 0] = "_000";
        ANGLE[ANGLE["_045"] = 1] = "_045";
        ANGLE[ANGLE["_090"] = 2] = "_090";
        ANGLE[ANGLE["_135"] = 3] = "_135";
        ANGLE[ANGLE["_180"] = 4] = "_180";
        ANGLE[ANGLE["_225"] = 5] = "_225";
        ANGLE[ANGLE["_270"] = 6] = "_270";
        ANGLE[ANGLE["_315"] = 7] = "_315";
    })(ANGLE = L16_Doom_Audio.ANGLE || (L16_Doom_Audio.ANGLE = {}));
    let STATE;
    (function (STATE) {
        STATE[STATE["IDLE"] = 0] = "IDLE";
        STATE[STATE["STOP"] = 1] = "STOP";
        STATE[STATE["MOVE"] = 2] = "MOVE";
        STATE[STATE["ATTACK"] = 3] = "ATTACK";
        STATE[STATE["DIE"] = 4] = "DIE";
    })(STATE = L16_Doom_Audio.STATE || (L16_Doom_Audio.STATE = {}));
    class Enemy extends L16_Doom_Audio.GameObject {
        constructor(_position) {
            super("Enemy", _position, ƒ.Vector3.ZERO());
            this.speed = 2;
            this.angleView = 0;
            this.state = STATE.IDLE;
            this.changeState = (_state = STATE.MOVE) => {
                this.state = _state;
                this.sprite.framerate = 2;
                if (_state == STATE.MOVE) {
                    this.chooseTargetPosition();
                }
            };
            this.show = new ƒAid.Node("Show", ƒ.Matrix4x4.IDENTITY());
            this.appendChild(this.show);
            this.audio = new ƒ.ComponentAudio(new ƒ.Audio("../DoomAssets/Pig_Grunt.wav"), true, true);
            this.audio.setPanner(ƒ.AUDIO_PANNER.CONE_OUTER_ANGLE, 360);
            this.audio.setPanner(ƒ.AUDIO_PANNER.CONE_INNER_ANGLE, 20);
            this.addComponent(this.audio);
            this.sprite = new ƒAid.NodeSprite("Sprite");
            this.sprite.addComponent(new ƒ.ComponentTransform());
            this.show.appendChild(this.sprite);
            this.sprite.setAnimation(Enemy.animations["Idle_000"]);
            this.sprite.setFrameDirection(1);
            this.sprite.framerate = 2;
            this.chooseTargetPosition();
            this.changeState(STATE.MOVE);
        }
        static generateSprites(_spritesheet) {
            Enemy.animations = {};
            for (let angle = 0; angle < 8; angle++) {
                let name = "Idle" + ANGLE[angle];
                let sprite = new ƒAid.SpriteSheetAnimation(name, _spritesheet);
                sprite.generateByGrid(ƒ.Rectangle.GET(44 + angle * 130, 33, 82, 108), 4, 32, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.Y(143));
                Enemy.animations[name] = sprite;
            }
        }
        update(_avatarPosition) {
            this.show.mtxLocal.showTo(ƒ.Vector3.TRANSFORMATION(_avatarPosition, this.mtxWorldInverse, true), ƒ.Vector3.Y(), true);
            this.adjustSprite();
            switch (this.state) {
                case STATE.MOVE:
                    if (this.mtxLocal.translation.equals(this.posTarget, 0.1))
                        this.changeState(STATE.STOP);
                    else
                        this.move();
                    break;
                case STATE.STOP:
                    this.changeState(STATE.IDLE);
                    this.sprite.framerate = 0.2;
                    setTimeout(this.changeState, 3000);
                    // console.log("Stoped; change to idle, then to Move");
                    break;
                case STATE.IDLE:
                default:
                    break;
                case STATE.ATTACK:
                    // attack
                    break;
                case STATE.DIE:
                    // change animation to dying
                    break;
            }
        }
        move() {
            this.mtxLocal.showTo(this.posTarget, ƒ.Vector3.Y(), true);
            this.mtxLocal.translateZ(this.speed * ƒ.Loop.timeFrameGame / 1000);
        }
        checkVision() {
            return true;
        }
        adjustSprite() {
            let rotation = this.show.mtxLocal.rotation.y;
            rotation = (rotation + 360 + 22.5) % 360;
            rotation = Math.floor(rotation / 45);
            if (this.angleView == rotation)
                return;
            this.angleView = rotation;
            if (rotation > 4) {
                rotation = 8 - rotation;
                this.flip(true);
            }
            else
                this.flip(false);
            let section = ANGLE[rotation]; // .padStart(3, "0");
            // console.log(section);
            this.sprite.setAnimation(Enemy.animations["Idle" + section]);
        }
        flip(_reverse) {
            this.sprite.mtxLocal.rotation = ƒ.Vector3.Y(_reverse ? 180 : 0);
        }
        chooseTargetPosition() {
            let range = L16_Doom_Audio.sizeWall * L16_Doom_Audio.numWalls / 2 - 2;
            this.posTarget = new ƒ.Vector3(ƒ.Random.default.getRange(-range, range), 0, ƒ.Random.default.getRange(-range, range));
        }
    }
    Enemy.TXT_ENEMY = new ƒ.TextureImage("../DoomAssets/Cyberdemon01.png");
    Enemy.SIZE = ƒ.Vector2.ONE(2);
    L16_Doom_Audio.Enemy = Enemy;
})(L16_Doom_Audio || (L16_Doom_Audio = {}));
//# sourceMappingURL=Enemy.js.map