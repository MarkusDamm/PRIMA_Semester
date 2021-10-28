declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private laserRotationSpeed;
        constructor();
        hndEvent: (_event: Event) => void;
        hdlRotation: (_event: Event) => void;
    }
}
declare namespace Script {
}
