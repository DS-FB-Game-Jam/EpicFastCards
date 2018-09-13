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
export default class NewClass extends cc.Component {

    @property(cc.Label)
    labelScore: cc.Label = null;

    @property(cc.Label)
    labelHP: cc.Label = null;

    @property(cc.Label)
    labelTimer: cc.Label = null;

    private _gm;
    private _countDownMax:number = 2;
    private _countDown:number = -1;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
      this._gm = cc.find("GameManager").getComponent("GameManager");
      this.setInfo();
      this._countDown = this._countDownMax
    }

    setInfo() {
      let info = this._gm.getProgressInfo();
      this.labelScore.string = "Score: "+info.score;
      this.labelHP.string = "HP: "+info.hp;
    }


    update (dt) {
      if(this._countDown >= 0 ) {
        this._countDown -= dt;
        this.labelTimer.string = ""+Math.floor(this._countDown);

        if(this._countDown <= 0) {
          this.labelTimer.string = "0";
          this._gm.loadNextLevel();
        }
      }
    }
}
