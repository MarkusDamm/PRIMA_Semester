declare namespace Script {
    import ƒ = FudgeCore;
    class AgentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private agentMoveSpeed;
        private agentRotateSpeed;
        private ctrForward;
        private ctrSideways;
        private ctrRotation;
        constructor();
        hndEvent: (_event: Event) => void;
        hdlAgentMovement: (_deltaTime: number) => void;
    }
}
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
    class LaserScript extends ƒ.ComponentScript {
        message: string;
        private laserRotationSpeed;
        constructor();
        hndEvent: (_event: Event) => void;
        hndRotation: (_event: Event) => void;
    }
}
declare namespace Script {
}
