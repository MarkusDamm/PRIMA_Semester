"use strict";
var L16_Doom_Audio;
(function (L16_Doom_Audio) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let FACES;
    (function (FACES) {
        FACES[FACES["_IDLE"] = 0] = "_IDLE";
        FACES[FACES["_IDLE_DAMAGED1"] = 1] = "_IDLE_DAMAGED1";
        FACES[FACES["_IDLE_DAMAGED2"] = 2] = "_IDLE_DAMAGED2";
        FACES[FACES["_IDLE_DAMAGED3"] = 3] = "_IDLE_DAMAGED3";
        FACES[FACES["_IDLE_DAMAGED4"] = 4] = "_IDLE_DAMAGED4";
        FACES[FACES["_ANGRY_FRONT"] = 5] = "_ANGRY_FRONT";
        FACES[FACES["_ANGRY_LEFT"] = 6] = "_ANGRY_LEFT";
        FACES[FACES["_ANGRY_RIGHT"] = 7] = "_ANGRY_RIGHT";
        FACES[FACES["_SURPRISED"] = 8] = "_SURPRISED";
        FACES[FACES["_MAD"] = 9] = "_MAD";
        FACES[FACES["_MOREMAD"] = 10] = "_MOREMAD";
    })(FACES = L16_Doom_Audio.FACES || (L16_Doom_Audio.FACES = {}));
    class UI {
        constructor(_startHealth, _startAmmo, _startMaxAmmo) {
            this.uiRoot = new ƒ.Node("UIRoot");
            this.uiDiv = document.querySelector(".UI");
            this.faceSprite = new ƒAid.NodeSprite("Face");
            this.uiRoot.appendChild(this.faceSprite);
            this.uiViewport = new ƒ.Viewport();
            this.uiViewport.initialize("UI", this.uiRoot, new ƒ.ComponentCamera(), document.querySelector(".Doom-Guy"));
            this.uiViewport.camera.backgroundColor = ƒ.Color.CSS("aqua");
            this.uiViewport.camera.pivot.translateZ(1);
            this.uiViewport.camera.pivot.rotateY(180);
            this.changeFace(FACES._IDLE);
            // this.face.setAnimation(<ƒAid.SpriteSheetAnimation>UI.faceAnimations["Face_MOREMAD"]);
            this.faceSprite.setFrameDirection(1);
            this.faceSprite.framerate = 0.5;
            this.uiViewport.draw();
            this.setHealth(_startHealth);
            this.curAmmo = _startAmmo;
            this.maxAmmo = _startMaxAmmo;
        }
        static generateSprites(_spritesheet) {
            UI.faceAnimations = {};
            for (let faceStyle = 0; faceStyle < 11; faceStyle++) {
                let name = "Face" + FACES[faceStyle];
                let sprite = new ƒAid.SpriteSheetAnimation(name, _spritesheet);
                sprite.generateByGrid(ƒ.Rectangle.GET(14, 13 + faceStyle * 32, 24, 29), 3, 32, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(26));
                UI.faceAnimations[name] = sprite;
            }
        }
        update() {
            this.uiViewport.draw();
        }
        changeFace(_face) {
            if (_face == this.currentFace)
                return;
            let name = "Face" + FACES[_face];
            this.faceSprite.setAnimation(UI.faceAnimations[name]);
            this.currentFace = _face;
        }
        setHealth(_health) {
            this.health = _health;
        }
    }
    L16_Doom_Audio.UI = UI;
})(L16_Doom_Audio || (L16_Doom_Audio = {}));
//# sourceMappingURL=UI.js.map