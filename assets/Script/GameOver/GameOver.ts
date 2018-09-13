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
import {BaseSwipe} from '../Swipe/BaseSwipe';

@ccclass
export default class GameOver extends BaseSwipe {

     @property(cc.Label)
    labelScore: cc.Label = null;

     @property()
    public minThreshold:number = -20;
    @property()
    public maxThreshold:number = 20;

    private _gm;
    private swipped:boolean = false;
    private info;
    // LIFE-CYCLE CALLBACKS:

    private fbInstant: any;

    // onLoad () {}

    start () {
      console.log("GameOver");
      super.start();
      this.swipped = false;
      this._gm = cc.find("GameManager").getComponent("GameManager");
      this.fbInstant = window['FBInstant'];
      this.setInfo();

  
    }

    setInfo() {
      this.info = this._gm.getProgressInfo();
      this.labelScore.string = "Score: "+this.info.score;
    }

    update (dt) {
      if(this.isSwipeUp && !this.swipped) {
        console.log("Identifiquei o swipeUp");
        // if(this._gm) {
          this.swipped = true;
          this._gm.restartGame();
        // }
      }
    }

    share() {
      console.log("share");
      if (!this.fbInstant) return;

      console.log("fbInstant loaded");

      this.fbInstant.shareAsync({
            intent: 'SHARE',
            text: 'Fiz '+this.info.score+" pontos, você consegue me superar?",
            data: {myReplayData: '...'},
        }).then(() => {
            // continue with the game.
            console.log("yaaaay");
        });
    }
}
