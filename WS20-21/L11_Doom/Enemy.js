"use strict";
var L11_Doom;
(function (L11_Doom) {
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
    })(ANGLE = L11_Doom.ANGLE || (L11_Doom.ANGLE = {}));
    class Enemy extends L11_Doom.GameObject {
        constructor(_position) {
            super("Enemy", _position, ƒ.Vector3.ZERO());
            this.speed = 0.1;
            this.show = new ƒAid.Node("Show", ƒ.Matrix4x4.IDENTITY());
            this.appendChild(this.show);
            this.sprite = new ƒAid.NodeSprite("Sprite");
            this.show.appendChild(this.sprite);
            this.sprite.setAnimation(Enemy.animations["Idle_000"]);
            this.sprite.setFrameDirection(1);
            this.sprite.framerate = 2;
            this.posTarget = _position;
            // let mtrEnemy: ƒ.Material = new ƒ.Material("Enemy", ƒ.ShaderTexture, new ƒ.CoatTextured(null, Enemy.TXT_ENEMY));
            // let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrEnemy);
            // cmpMaterial.pivot.scale(ƒ.Vector2.ONE(1));
            // this.addComponent(cmpMaterial);
        }
        static generateSprites(_spritesheet) {
            Enemy.animations = {};
            for (let angle = 0; angle < 8; angle++) {
                let name = "Idle" + ANGLE[angle];
                let sprite = new ƒAid.SpriteSheetAnimation(name, _spritesheet);
                sprite.generateByGrid(ƒ.Rectangle.GET(44 + angle * 160, 33, 82, 108), 4, 32, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.Y(143));
                Enemy.animations[name] = sprite;
            }
        }
        update(_avatarPosition) {
            this.posTarget = _avatarPosition;
            if (this.checkVision()) {
                this.moveTowards();
            }
            this.show.mtxLocal.showTo(_avatarPosition, ƒ.Vector3.Y(), true);
            // console.log(this.show.mtxLocal.rotation.y - this.mtxLocal.rotation.y);
            this.adjustSprites();
            // this.angle = calculateAngle(this.mtxLocal.rotation, this.show.mtxLocal.rotation);
        }
        moveTowards() {
            // this.mtxLocal.showTo(this.posTarget, ƒ.Vector3.Y(), true);
            // this.mtxLocal.translateZ(this.speed);
        }
        checkVision() {
            return true;
        }
        adjustSprites() {
            let angle = this.show.mtxLocal.rotation.y;
            console.log(angle);
            if (-22 < angle && angle < 22)
                this.sprite.setAnimation(Enemy.animations["Idle_000"]);
            else if (angle < 67)
                this.sprite.setAnimation(Enemy.animations["Idle_045"]);
            else if (angle < 112)
                this.sprite.setAnimation(Enemy.animations["Idle_090"]);
            else if (angle < 157)
                this.sprite.setAnimation(Enemy.animations["Idle_135"]);
            else if (angle < 180 || angle < -157)
                this.sprite.setAnimation(Enemy.animations["Idle_180"]);
            else if (angle < -112)
                this.sprite.setAnimation(Enemy.animations["Idle_225"]);
            else if (angle < -67)
                this.sprite.setAnimation(Enemy.animations["Idle_270"]);
            else if (angle < -22)
                this.sprite.setAnimation(Enemy.animations["Idle_315"]);
            // this.sprite.setFrameDirection(1);
            // this.sprite.framerate = 2;
        }
    }
    Enemy.TXT_ENEMY = new ƒ.TextureImage("../DoomAssets/Cyberdemon01.png");
    Enemy.SIZE = ƒ.Vector2.ONE(2);
    L11_Doom.Enemy = Enemy;
})(L11_Doom || (L11_Doom = {}));
//# sourceMappingURL=Enemy.js.map