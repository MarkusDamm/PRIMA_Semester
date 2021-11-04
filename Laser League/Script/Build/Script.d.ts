declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class Agent extends ƒ.Node {
        constructor();
        private agentMoveSpeed;
        private agentRotateSpeed;
        private ctrForward;
        private ctrSideways;
        private ctrRotation;
        hndAgentMovement: () => void;
    }
}
declare namespace LaserLeague {
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
        hndAgentMovement: () => void;
    }
}
declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class ItemScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class LaserScript extends ƒ.ComponentScript {
        message: string;
        private laserRotationSpeed;
        constructor();
        hndEvent: (_event: Event) => void;
        hndRotation: (_event: Event) => void;
        static collisionCheck(_agent: ƒ.Node, _beam: ƒ.Node): boolean;
    }
}
declare namespace LaserLeague {
}
