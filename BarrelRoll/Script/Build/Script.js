"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Bullet extends ƒ.Node {
        constructor(_transl) {
            super("Bullet");
            /**
             * update
             */
            this.update = () => {
                this.move();
            };
            this.delete = () => {
                this.getParent().removeChild(this);
            };
            let bulletGraph = ƒ.Project.resources[Bullet.bulletResource];
            let newBullet = new ƒ.GraphInstance(bulletGraph);
            newBullet.reset();
            let mtx = new ƒ.Matrix4x4();
            mtx.translation = _transl.translation;
            mtx.rotation = _transl.rotation;
            this.addComponent(new ƒ.ComponentTransform(mtx));
            this.mtxLocal.translateZ(5);
            // this.mtxLocal.rotateX(90, false);
            this.appendChild(newBullet);
            this.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.update);
            setTimeout(this.delete, Bullet.livetime);
        }
        move() {
            this.mtxLocal.translateZ(Bullet.speed);
        }
    }
    Bullet.bulletResource = "Graph|2022-12-12T15:53:18.076Z|03469";
    Bullet.speed = 1.5;
    Bullet.livetime = 3000;
    Script.Bullet = Bullet;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    CustomComponentScript.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        constructor() {
            super();
            this.controller = new ƒui.Controller(this, document.querySelector("#vui"));
            console.log(this.controller);
        }
        /**
         * setHeight
         */
        setHeight(_height) {
            // console.log("set height to " + _height);
            this.height = _height;
        }
        reduceMutator(_mutator) { }
    }
    Script.GameState = GameState;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    // Random Objekte einbauen
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let fox;
    let ship;
    let shipMovement;
    let cmpCamera;
    // export let bullets: Bullet[] = [];
    let meshTerrain;
    let towerResource = "Graph|2022-11-29T16:03:19.230Z|03819";
    let turretResource = "Graph|2022-12-15T13:38:21.686Z|43512";
    function start(_event) {
        viewport = _event.detail;
        cmpCamera = viewport.camera;
        cmpCamera.mtxPivot.translate(new ƒ.Vector3(0, 2, -15));
        let graph = viewport.getBranch();
        fox = graph.getChildrenByName("Fox")[0];
        ship = fox.getChild(0);
        shipMovement = ship.getComponent(Script.SpaceShipMovement);
        console.log(fox);
        setTerrainMesh();
        placeInstances(graph, 30, towerResource);
        placeInstances(graph, 5, turretResource);
        console.log("placed tower and turret instances");
        Script.state = new Script.GameState();
        document.addEventListener("keydown", shoot);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function setTerrainMesh() {
        if (!viewport) {
            return;
        }
        let terrainNode = viewport.getBranch().getChildrenByName("Terrain")[0];
        meshTerrain = terrainNode.getComponent(ƒ.ComponentMesh);
    }
    function checkTerrainHeight(_pos) {
        if (!meshTerrain) {
            setTerrainMesh();
            return -666;
        }
        let terrain = meshTerrain.mesh;
        let terrainInfo = terrain.getTerrainInfo(_pos, meshTerrain.mtxWorld);
        let height = terrainInfo.position.y;
        return height;
    }
    Script.checkTerrainHeight = checkTerrainHeight;
    function placeInstances(_mainGraph, _amount, _resource) {
        let staticObjGraph = _mainGraph.getChildrenByName("Objects")[0].getChildrenByName("Static")[0];
        let sourceGraph = ƒ.Project.resources[_resource];
        for (let i = 0; i < _amount; i++) {
            let graphInstance = new ƒ.GraphInstance(sourceGraph);
            graphInstance.reset();
            let randomPos = new ƒ.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1);
            randomPos.scale(400);
            randomPos.add(ƒ.Vector3.Y(checkTerrainHeight(randomPos) - 0.5));
            graphInstance.addComponent(new ƒ.ComponentTransform());
            graphInstance.mtxLocal.translation = randomPos;
            staticObjGraph.appendChild(graphInstance);
        }
    }
    function shoot(_event) {
        if (_event.key == "e") {
            console.log("bumm");
            let bullet = new Script.Bullet(ship.mtxLocal);
            let objGraph = viewport.getBranch().getChildrenByName("Objects")[0].getChildrenByName("Temp")[0];
            objGraph.appendChild(bullet);
            // bullets.push(bullet);
        }
    }
    function update(_event) {
        shipMovement.setRelativeAxes();
        handleShipMovement();
        // for (let bullet of bullets) {
        //   bullet.update();      
        // }
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function handleShipMovement() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
            shipMovement.thrust();
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
            shipMovement.thrust(-1);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
            shipMovement.roll(-1);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
            shipMovement.roll();
        }
        shipMovement.applyTorque();
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class ScriptSensor extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "ScriptSensor added to ";
        }
    }
    // Register the script as component for use in the editor via drag&drop
    ScriptSensor.iSubclass = ƒ.Component.registerSubclass(ScriptSensor);
    Script.ScriptSensor = ScriptSensor;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class SpaceShipMovement extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "SpaceShipMovement added to ";
            // werden im Editor überschrieben
            this.strafeThrust = 20;
            this.forwardthrust = 10e+4;
            this.windowWidth = 0;
            this.windowHeight = 0;
            this.xAxis = 0;
            this.yAxis = 0;
            this.height = 0;
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        this.rgdBodySpaceship = this.node.getComponent(ƒ.ComponentRigidbody);
                        // ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
                        console.log(this.node);
                        window.addEventListener("mousemove", this.handleMouse);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.checkHeight);
                        break;
                }
            };
            this.update = () => {
                // this.setRelativeAxes();
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
                    this.thrust();
                }
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
                    this.thrust(-1);
                }
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
                    this.roll(-1);
                }
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
                    this.roll();
                }
                this.applyTorque();
            };
            /**
             * checkHeight
             */
            this.checkHeight = () => {
                if (!Script.state) {
                    return;
                }
                this.height = Script.checkTerrainHeight(this.node.getParent().mtxLocal.translation);
                Script.state.setHeight(this.height);
            };
            this.handleMouse = (e) => {
                this.windowWidth = window.innerWidth;
                this.windowHeight = window.innerHeight;
                let mousePositionY = e.clientY;
                let mousePositionX = e.clientX;
                this.xAxis = 2 * (mousePositionX / this.windowWidth) - 1;
                if (this.xAxis < 0.15 && this.xAxis > -0.15) {
                    this.xAxis = 0;
                }
                this.yAxis = 2 * (mousePositionY / this.windowHeight) - 1;
                if (this.yAxis < 0.15 && this.yAxis > -0.15) {
                    this.yAxis = 0;
                }
                // console.log(this.yAxis);
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        /**
         * applyTorque
         */
        applyTorque() {
            this.rgdBodySpaceship.applyTorque(new ƒ.Vector3(0, this.xAxis * -3, 0));
            this.rgdBodySpaceship.applyTorque(ƒ.Vector3.SCALE(this.relativeX, this.yAxis));
        }
        setRelativeAxes() {
            this.relativeZ = ƒ.Vector3.Z(3);
            this.relativeZ.transform(this.node.mtxWorld, false);
            this.relativeX = ƒ.Vector3.X(3);
            this.relativeX.transform(this.node.mtxWorld, false);
        }
        /**
         * thrust forward with _forward 1, backwards with _forward -1
         */
        thrust(_forward) {
            if (!_forward) {
                _forward = 1;
            }
            let scaledRotatedDirection = ƒ.Vector3.SCALE(this.relativeZ, this.forwardthrust * _forward);
            this.rgdBodySpaceship.applyForce(scaledRotatedDirection);
        }
        /**
         * roll right with _clockwise 1, left with _clockwise -1
         */
        roll(_clockwise) {
            if (!_clockwise) {
                _clockwise = 1;
            }
            this.rgdBodySpaceship.applyTorque(ƒ.Vector3.SCALE(this.relativeZ, _clockwise));
        }
    }
    // Register the script as component for use in the editor via drag&drop
    SpaceShipMovement.iSubclass = ƒ.Component.registerSubclass(SpaceShipMovement);
    Script.SpaceShipMovement = SpaceShipMovement;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class TargetScript extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "TargetScript added to ";
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        // ƒ.Debug.log(this.message, this.node);
                        this.rb = this.node.getComponent(ƒ.ComponentRigidbody);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        // console.log("TargetScript is deserialized");
                        this.rb.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.hndCollision);
                        // console.log("TargetScript got Collision EL");
                        break;
                }
            };
            this.hndCollision = (_event) => {
                this.node.activate(false);
                // console.log(_event.target);
                // console.log("bumm");
            };
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    TargetScript.iSubclass = ƒ.Component.registerSubclass(TargetScript);
    Script.TargetScript = TargetScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["ATTACK"] = 1] = "ATTACK";
    })(JOB || (JOB = {}));
    class TurretStateMachine extends ƒAid.ComponentStateMachine {
        constructor() {
            super();
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                        this.transit(JOB.IDLE);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        this.cannon = this.node.getChildrenByName("Cannon")[0];
                        break;
                }
            };
            this.update = (_event) => {
                this.act();
            };
            this.instructions = TurretStateMachine.instructions; // setup instructions with the static set
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = TurretStateMachine.transitDefault;
            setup.actDefault = TurretStateMachine.actDefault;
            setup.setAction(JOB.IDLE, this.actIdle);
            setup.setTransition(JOB.IDLE, JOB.ATTACK, this.startAttack);
            return setup;
        }
        static transitDefault(_machine) {
            console.log("Transit to", _machine.stateNext);
        }
        static async actDefault(_machine) {
            // console.log("Default");
        }
        static async actIdle(_machine) {
            // console.log("Idle");
            if (_machine.cannon) {
                _machine.cannon.mtxLocal.rotateY(1);
            }
            else
                console.log("no Cannon found");
        }
        static startAttack(_machine) {
            // Rotate Cannon towards Spaceship
            // Play Sound
            console.log("Start Attack");
        }
    }
    TurretStateMachine.iSubclass = ƒ.Component.registerSubclass(TurretStateMachine);
    TurretStateMachine.instructions = TurretStateMachine.get();
    Script.TurretStateMachine = TurretStateMachine;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map