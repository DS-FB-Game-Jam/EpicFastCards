// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


const {ccclass, property} = cc._decorator;

@ccclass
export class GameManager extends cc.Component {

    private _levels: string[] = [
      "CartaoBanco",
      "CartaoAniversario",
      "EntregarCartao",
      "MemoryCard",
      "JuizCard",
    ];
    private _lastLevel: string;
    private _currentLevel:number = 0;
    private _currentHP:number = 3;
    private _lost:boolean = false;
    private _currentDifficulty:number = 1;
    private _levelUp:boolean = false;
    private _currentSessionSize:number = 3;
    private _score:number = 0;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
      console.log("start");
      cc.game.addPersistRootNode(this.node);

      // this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
      //   console.log("Loding test scene");
      //   cc.director.loadScene("LevelTest");
      // }, this) 
    }

    //USAR ESSAS FUNCOES

    startGame() {
      console.log("startGame");
      this.resetGameValues();
      this.loadLevel();
    }

    nextLevel(fail:boolean) {
      console.log("nextLevel", fail);
      if(fail) {
        this._currentHP--;
      } else {
        this._score++;
      }
      
      if(this._currentLevel+1 >= this._currentSessionSize) {
        this._levelUp = true;
      } else {
        this._levelUp = false;
      }

      this._lost = fail;

      if(this._currentHP <= 0) {
        this.gameOver();
      } else {
        cc.director.loadScene("GetReady");
      }
    }

    loadNextLevel() {
      console.log("loadNextLevel", this.getProgressInfo());
      this._currentLevel++;
      if(this._currentLevel < this._currentSessionSize) {
        console.log("1");
        this.loadLevel();
      } else {
        console.log("2");
        this._currentDifficulty++;
        this._currentLevel = 0;
        this.loadLevel();
      }
    }

    gameOver() {
      console.log("gameOver");
      cc.director.loadScene("GameOver");
    }

    restartGame() {
      this.resetGameValues();
      cc.director.loadScene("GameStart");
    }

    getProgressInfo() {
      return {
        difficulty: this._currentDifficulty,
        levelUp: this._levelUp,
        hp: this._currentHP,
        score: this._score,
        levelTime: 7 - (this._currentDifficulty*0.5),
        lost: this._lost
      };
    }

    //END

    resetGameValues() {
      this._score = 0;
      this._currentLevel = 0;
      this._currentHP = 3;
      this._currentDifficulty = 1;
    }

    loadLevel() {
      console.log("loadLevel");
      let size = this._levels.length;

      for(;;) {
        let i = Math.round(Math.random() * (size-1));
        let level = this._levels[i];
        if(level != this._lastLevel) {
          this._lastLevel = level;
          console.log("loading", level);
          cc.director.loadScene(level);
          break;
        }
      }
    }

    

    // shuffleLevels() {
    //   this._shuffledLevels = this.shuffleArray(this._levels);
    // }

    // shuffleArray(array) {
    //   let currentIndex = array.length, temporaryValue, randomIndex;

    //   while (0 !== currentIndex) {
    //     randomIndex = Math.floor(Math.random() * currentIndex);
    //     currentIndex -= 1;

    //     temporaryValue = array[currentIndex];
    //     array[currentIndex] = array[randomIndex];
    //     array[randomIndex] = temporaryValue;
    //   }

    //   return array;
    // }

     test() {
      this._currentHP = 99;
      this._currentDifficulty++;
      this._score = 345345245;
    }





}
