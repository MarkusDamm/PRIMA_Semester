"use strict";
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
    // Random Objekte einbauen
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let ship;
    let rbShip;
    let cmpCamera;
    let meshTerrain;
    let towerResource = "Graph|2022-11-29T16:03:19.230Z|03819";
    function start(_event) {
        viewport = _event.detail;
        cmpCamera = viewport.camera;
        cmpCamera.mtxPivot.translate(new ƒ.Vector3(0, 2, -15));
        let graph = viewport.getBranch();
        ship = graph.getChildrenByName("Fox")[0].getChild(0);
        console.log(ship);
        rbShip = ship.getComponent(ƒ.ComponentRigidbody);
        let terrainNode = viewport.getBranch().getChildrenByName("Terrain")[0];
        meshTerrain = terrainNode.getComponent(ƒ.ComponentMesh);
        placeTowers(graph, 30);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function checkTerrainHeight(_pos) {
        let terrain = meshTerrain.mesh;
        let terrainInfo = terrain.getTerrainInfo(_pos, meshTerrain.mtxWorld);
        let height = terrainInfo.position.y;
        return height;
    }
    function placeTowers(_graph, _amount) {
        let staticObjGraph = _graph.getChildrenByName("Objects")[0].getChildrenByName("Static")[0];
        let towerGraph = ƒ.Project.resources[towerResource];
        for (let i = 0; i < _amount; i++) {
            let newTower = new ƒ.GraphInstance(towerGraph);
            newTower.reset();
            let randomPos = new ƒ.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1);
            randomPos.scale(400);
            randomPos.add(ƒ.Vector3.Y(checkTerrainHeight(randomPos) - 0.5));
            newTower.addComponent(new ƒ.ComponentTransform());
            newTower.mtxLocal.translation = randomPos;
            staticObjGraph.appendChild(newTower);
        }
    }
    function update(_event) {
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
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
            this.width = 0;
            this.height = 0;
            this.xAxis = 0;
            this.yAxis = 0;
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        this.rgdBodySpaceship = this.node.getComponent(ƒ.ComponentRigidbody);
                        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                        console.log(this.node);
                        window.addEventListener("mousemove", this.handleMouse);
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
            this.update = () => {
                this.setRelativeAxes();
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
                this.rgdBodySpaceship.applyTorque(new ƒ.Vector3(0, this.xAxis * -3, 0));
                this.rgdBodySpaceship.applyTorque(ƒ.Vector3.SCALE(this.relativeX, this.yAxis));
            };
            this.handleMouse = (e) => {
                this.width = window.innerWidth;
                this.height = window.innerHeight;
                let mousePositionY = e.clientY;
                let mousePositionX = e.clientX;
                this.xAxis = 2 * (mousePositionX / this.width) - 1;
                if (this.xAxis < 0.15 && this.xAxis > -0.15) {
                    this.xAxis = 0;
                }
                this.yAxis = 2 * (mousePositionY / this.height) - 1;
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
//# sourceMappingURL=Script.js.map