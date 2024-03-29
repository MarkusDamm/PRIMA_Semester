namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class ScriptSensor extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(ScriptSensor);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "ScriptSensor added to ";

    constructor() {
      super();
    }
  }
}