declare namespace Script {
    class Luigi extends ƒ.Node {
        static spriteSheedPath: string;
        node: ƒAid.NodeSprite;
        ySpeed: number;
        ctrSideways: ƒ.Control;
        animState: Animation;
        private readonly moveSpeed;
        private readonly jumpForce;
        private readonly resolution;
        private animations;
        private isOnGround;
        constructor();
        /**
         * initializes all animations from the given TextureImage
         */
        initializeAnimations(_texture: ƒ.TextureImage): void;
        /**
         * update
         */
        update(): void;
        /**
         * move
         */
        private move;
        /**
         * jump
         */
        private jump;
        /**
         * fall
         */
        private fall;
        /**
         * initializes multiple animation with the same amount of frames
         */
        private initializeAnimationsByFrames;
        /**
         * set current animation to given animationtype
         */
        private setAnimation;
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
declare namespace Script {
    import ƒ = FudgeCore;
    class ScriptRotator extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
        private test;
    }
}
