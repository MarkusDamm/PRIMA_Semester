declare namespace Script {
    import ƒ = FudgeCore;
    class Bullet extends ƒ.Node {
        static bulletResource: string;
        private static speed;
        private static livetime;
        constructor(_transl: ƒ.Matrix4x4);
        /**
         * update
         */
        update: () => void;
        private move;
        private delete;
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
    import ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        height: number;
        velocity: number;
        controller: ƒui.Controller;
        constructor();
        /**
         * setHeight
         */
        setHeight(_height: number): void;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let state: GameState;
    function checkTerrainHeight(_pos: ƒ.Vector3): number;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class ScriptSensor extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class SpaceShipMovement extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        strafeThrust: number;
        forwardthrust: number;
        private rgdBodySpaceship;
        private relativeX;
        private relativeZ;
        private windowWidth;
        private windowHeight;
        private xAxis;
        private yAxis;
        private height;
        constructor();
        hndEvent: (_event: Event) => void;
        update: () => void;
        /**
         * applyTorque
         */
        applyTorque(): void;
        /**
         * checkHeight
         */
        checkHeight: () => void;
        handleMouse: (e: MouseEvent) => void;
        setRelativeAxes(): void;
        /**
         * thrust forward with _forward 1, backwards with _forward -1
         */
        thrust(_forward?: number): void;
        /**
         * roll right with _clockwise 1, left with _clockwise -1
         */
        roll(_clockwise?: number): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class TargetScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private rb;
        constructor();
        hndEvent: (_event: Event) => void;
        private hndCollision;
    }
}
