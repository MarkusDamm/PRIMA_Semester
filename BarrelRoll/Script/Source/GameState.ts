namespace Script {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  export class GameState extends ƒ.Mutable {
    public height: number;
    public velocity: number;
    public controller: ƒui.Controller;

    constructor() {
      super();
      this.controller = new ƒui.Controller(this, document.querySelector("#vui"));
      console.log(this.controller);
      
    }
    
      /**
       * setHeight
       */
      public setHeight(_height: number): void {
        // console.log("set height to " + _height);
        
        this.height = _height;
      }

    protected reduceMutator(_mutator: ƒ.Mutator): void {/* */ }

  }



}