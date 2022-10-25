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
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    class Luigi extends ƒ.Node {
        pos: ƒ.Matrix4x4;
        node: ƒAid.NodeSprite;
        ySpeed: number;
        ctrSideways: ƒ.Control;
        animState: Animation;
        spriteSheedPath: string;
        private moveSpeed;
        private jumpForce;
        private resolution;
        private animWalk;
        private animRun;
        private animIdle;
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
    let branch: ƒ.Node;
    enum Animation {
        Idle = 0,
        Walk = 1,
        Run = 2
    }
}
