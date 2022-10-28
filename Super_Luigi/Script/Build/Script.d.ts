declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    class Luigi extends ƒ.Node {
        node: ƒAid.NodeSprite;
        ySpeed: number;
        ctrSideways: ƒ.Control;
        animState: Animation;
        spriteSheedPath: string;
        private moveSpeed;
        private jumpForce;
        private resolution;
        private animIdle;
        private animLookUp;
        private animDuck;
        private animWalk;
        private animRun;
        private animJump;
        private animFall;
        private animRunJump;
        private isOnGround;
        constructor(_texture: ƒ.TextureImage);
        /**
         * setAnimation to given animationtype
         */
        setAnimation(_type: Animation): void;
        /**
         * update
         */
        update(): void;
        /**
         * move
         */
        move(_deltaTime: number): void;
        /**
         * jump
         */
        jump(): void;
        /**
         * fall
         */
        fall(_deltaTime: number): void;
        /**
        * check if Luigi is on the Ground
        */
        private checkGrounded;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
    let gravity: number;
    enum Animation {
        Idle = 0,
        LookUp = 1,
        Duck = 2,
        Walk = 3,
        Run = 4,
        Jump = 5,
        Fall = 6,
        RunJump = 7
    }
}
