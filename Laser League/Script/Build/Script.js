"use strict";
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    class Agent extends ƒ.Node {
        constructor() {
            super("Agent");
            this.agentMoveSpeed = 8;
            this.agentRotateSpeed = 160;
            this.ctrForward = new ƒ.Control("Forward", this.agentMoveSpeed, 0 /* PROPORTIONAL */);
            this.ctrSideways = new ƒ.Control("Sideways", this.agentMoveSpeed, 0 /* PROPORTIONAL */);
            this.ctrRotation = new ƒ.Control("Rotation", this.agentRotateSpeed, 0 /* PROPORTIONAL */);
            this.hndAgentMovement = () => {
                let deltaTime = ƒ.Loop.timeFrameReal / 1000;
                let forwardSpeed = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) +
                    ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]));
                this.ctrForward.setInput(forwardSpeed * deltaTime);
                this.mtxLocal.translateY(this.ctrForward.getOutput());
                let sidewaysSpeed = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D]) +
                    ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A]));
                this.ctrSideways.setInput(sidewaysSpeed * deltaTime);
                this.mtxLocal.translateX(this.ctrSideways.getOutput());
                let rotationSpeed = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.ARROW_LEFT]) +
                    ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.ARROW_RIGHT]));
                this.ctrRotation.setInput(rotationSpeed * deltaTime);
                this.mtxLocal.rotateZ(this.ctrRotation.getOutput());
            };
            this.addComponent(new ƒ.ComponentTransform);
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshPolygon("MeshAgent")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("mtrAgent", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0.9, 0.75, 0, 1)))));
            this.ctrForward.setDelay(50);
            this.ctrSideways.setDelay(50);
            this.ctrRotation.setDelay(20);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.hndAgentMovement);
            // this.mtxLocal.scale(ƒ.Vector3.ONE(0.5));
        }
    }
    LaserLeague.Agent = Agent;
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(LaserLeague); // Register the namespace to FUDGE for serialization
    class AgentScript extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "AgentScript added to ";
            this.agentMoveSpeed = 8;
            this.agentRotateSpeed = 160;
            this.ctrForward = new ƒ.Control("Forward", this.agentMoveSpeed, 0 /* PROPORTIONAL */);
            this.ctrSideways = new ƒ.Control("Sideways", this.agentMoveSpeed, 0 /* PROPORTIONAL */);
            this.ctrRotation = new ƒ.Control("Rotation", this.agentRotateSpeed, 0 /* PROPORTIONAL */);
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        // ƒ.Debug.log("Custom component script added", this.message, this.node);
                        this.ctrForward.setDelay(50);
                        this.ctrSideways.setDelay(50);
                        this.ctrRotation.setDelay(20);
                        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.hndAgentMovement);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                }
            };
            this.hndAgentMovement = () => {
                let deltaTime = ƒ.Loop.timeFrameReal / 1000;
                let forwardSpeed = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) +
                    ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]));
                this.ctrForward.setInput(forwardSpeed * deltaTime);
                this.node.mtxLocal.translateY(this.ctrForward.getOutput());
                let sidewaysSpeed = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D]) +
                    ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A]));
                this.ctrSideways.setInput(sidewaysSpeed * deltaTime);
                this.node.mtxLocal.translateX(this.ctrSideways.getOutput());
                let rotationSpeed = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.ARROW_LEFT]) +
                    ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.ARROW_RIGHT]));
                this.ctrRotation.setInput(rotationSpeed * deltaTime);
                this.node.mtxLocal.rotateZ(this.ctrRotation.getOutput());
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    AgentScript.iSubclass = ƒ.Component.registerSubclass(AgentScript);
    LaserLeague.AgentScript = AgentScript;
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(LaserLeague); // Register the namespace to FUDGE for serialization
    class ItemScript extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "ItemScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        // ƒ.Debug.log("Item script added", this.message, this.node);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    ItemScript.iSubclass = ƒ.Component.registerSubclass(ItemScript);
    LaserLeague.ItemScript = ItemScript;
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(LaserLeague); // Register the namespace to FUDGE for serialization
    class LaserScript extends ƒ.ComponentScript {
        constructor() {
            super();
            this.message = "Laser Script added to ";
            this.laserRotationSpeed = 120;
            // use arrow-structure to make hndEvent an Attribute of LaserScript, so that *this* references this script
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        let random = new ƒ.Random();
                        this.laserRotationSpeed = random.getRangeFloored(40, 80);
                        if (random.getBoolean())
                            this.laserRotationSpeed *= -1;
                        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.hndRotation);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.hndRotation);
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                }
            };
            this.hndRotation = (_event) => {
                let deltaTime = ƒ.Loop.timeFrameReal / 1000;
                this.node.getComponent(ƒ.ComponentTransform).mtxLocal.rotateZ(this.laserRotationSpeed * deltaTime);
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        static collisionCheck(_agent, _beam) {
            let testPosition = ƒ.Vector3.TRANSFORMATION(_agent.mtxWorld.translation, _beam.mtxWorldInverse);
            let distance = ƒ.Vector2.DIFFERENCE(testPosition.toVector2(), _beam.mtxLocal.translation.toVector2());
            let beamLength = _beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y;
            let beamWidth = _beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x;
            let agentWidth = _agent.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x;
            if (distance.x < -beamWidth - agentWidth || distance.x > beamWidth + agentWidth || distance.y < -agentWidth || distance.y > agentWidth + beamLength)
                return false;
            else
                return true;
        }
    }
    LaserLeague.LaserScript = LaserScript;
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
    // Don't forget to compile: Strg + Shift + B
    var ƒ = FudgeCore; // ALT+159
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let root;
    // let agent: ƒ.Node;
    let agent;
    let laserformation;
    let laserPrefab;
    let copy;
    let fps = 60;
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        viewport = _event.detail;
        root = viewport.getBranch();
        // console.log(root);
        setUpLasers();
        // agent = root.getChildrenByName("Agents")[0].getChildrenByName("Agent")[0];
        agent = new LaserLeague.Agent();
        root.getChildrenByName("Agents")[0].addChild(agent);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, fps); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        // Adjust Camera Position
        viewport.camera.mtxPivot.translateZ(-30);
    }
    async function setUpLasers() {
        laserformation = root.getChildrenByName("Laserformations")[0].getChildrenByName("Laserformation")[0];
        let graphLaser = FudgeCore.Project.resources["Graph|2021-10-28T13:13:43.242Z|36118"];
        laserPrefab = await ƒ.Project.createGraphInstance(graphLaser);
        let laserPlacementPosition = new ƒ.Vector3(-12, 6.5, 0);
        let laserAmounts = new ƒ.Vector2(3, 2);
        let xPosition = -12;
        let yPosition = 6.5;
        for (let i = 0; i < laserAmounts.y; i++) {
            for (let i = 0; i < laserAmounts.x; i++) {
                await placeLaser(laserPlacementPosition);
                laserPlacementPosition.x -= xPosition;
            }
            yPosition = -yPosition;
            laserPlacementPosition = new ƒ.Vector3(xPosition, yPosition, 0);
        }
    }
    async function placeLaser(_translation) {
        copy = await copyGraph(laserPrefab);
        copy.mtxLocal.translation = _translation;
        laserformation.appendChild(copy);
    }
    async function copyGraph(_copy) {
        let graph = await ƒ.Project.registerAsGraph(_copy, false);
        let graphInstance = await ƒ.Project.createGraphInstance(graph);
        return graphInstance;
    }
    function update(_event) {
        // ƒ.Physics.world.simulate();  // if physics is included and used
        let lasers = laserformation.getChildren();
        for (let laser of lasers) {
            let beams = laser.getChildrenByName("Beam");
            for (let beam of beams) {
                if (LaserLeague.LaserScript.collisionCheck(agent, beam))
                    console.log("hit");
            }
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(LaserLeague || (LaserLeague = {}));
//# sourceMappingURL=Script.js.map