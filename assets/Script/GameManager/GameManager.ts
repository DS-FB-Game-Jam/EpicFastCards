// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export enum Difficulty {
  EASY,
  MEDIUM,
  HARD
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    private _levels: string[] = [
      "CartaoBanco"
    ];
    private _shuffledLevels: string [];
    private _currentLevel = 0;
    private _currentHP = 3;
    private _currentDifficulty: Difficulty = Difficulty.EASY;
    private _score = 0;
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
      this.loadLevel(0);
    }

    nextLevel(fail:boolean) {
      console.log("nextLevel", fail);
      if(fail) this._currentHP--;

      if(this._currentHP <= 0) {
        this.gameOver();
      } else {
        this.loadNextLevel();
      }
    }

    gameOver() {
      console.log("gameOver");
      this.resetGameValues();
    }

    updateScore(score:number) {
      console.log("updateScore", score);
      this._score += score;
    }

    getLevelInfo() {
      return {difficulty: this._currentDifficulty, hp: this._currentHP, score:this._score};
    }

    //END



    resetGameValues() {
      this._score = 0;
      this._currentLevel = 0;
      this._currentHP = 3;
      this._currentDifficulty = Difficulty.EASY;
      this.shuffleLevels();
    }

    loadLevel(index:number) {
      cc.director.loadScene(this._shuffledLevels[index]);
    }

    loadNextLevel() {
      this._currentLevel++;
      if(this._currentLevel < this._shuffledLevels.length) {
        this.loadLevel(this._currentLevel);
      } else {
        if(this._currentDifficulty != Difficulty.HARD) {
          this._currentDifficulty++;

          this._currentLevel = 0;
          this.shuffleLevels();
          this.loadLevel(this._currentLevel);
        } else {
          cc.director.loadScene("EndGame");
        }
      }
    }

    shuffleLevels() {
      this._shuffledLevels = this.shuffleArray(this._levels);
    }

    shuffleArray(array) {
      let currentIndex = array.length, temporaryValue, randomIndex;

      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

     test() {
      this._currentHP = 99;
      this._currentDifficulty++;
      this._score = 345345245;
    }





}
