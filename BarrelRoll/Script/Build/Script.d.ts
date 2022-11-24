declare namespace Script {
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
        private width;
        private height;
        private xAxis;
        private yAxis;
        constructor();
        hndEvent: (_event: Event) => void;
        update: () => void;
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
