declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class Agent extends ƒ.Node {
        health: number;
        name: string;
        private agentMoveSpeed;
        private agentRotateSpeed;
        private ctrForward;
        private ctrSideways;
        private ctrRotation;
        constructor();
        private update;
        private hndAgentMovement;
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
    class GameState extends ƒ.Mutable {
        name: string;
        health: number;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
    export let gameState: GameState;
    export class Hud {
        private static controller;
        static start(): void;
    }
    export {};
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
        static sound: ƒ.ComponentAudio;
        constructor();
        hndEvent: (_event: Event) => void;
        hndRotation: (_event: Event) => void;
        static collisionCheck(_agent: ƒ.Node, _beam: ƒ.Node): boolean;
    }
}
declare namespace LaserLeague {
}
