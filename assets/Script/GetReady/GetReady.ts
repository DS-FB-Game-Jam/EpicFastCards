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
export default class GetReady extends cc.Component {

    @property(cc.Label)
    labelTimer: cc.Label = null;

    @property(cc.Node)
    labelMaisRapido: cc.Node = null;

    // @property(cc.Label)
    // labelHP: cc.Label = null;

    @property(cc.Node)
    char: cc.Node = null;
    private _charAnimation: cc.Animation = null;

    @property(cc.Node)
    joia: cc.Node = null;
    private _joiaAnimation: cc.Animation = null;

    @property(cc.Node)
    disquete1: cc.Node = null;
    private _disquete1Animation: cc.Animation = null;
    @property(cc.Node)
    disquete2: cc.Node = null;
    private _disquete2Animation: cc.Animation = null;
    @property(cc.Node)
    disquete3: cc.Node = null;
    private _disquete3Animation: cc.Animation = null;

    private _gm;
    private _countDownMax:number = 3;
    private _countDown:number = -1;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
      this._gm = cc.find("GameManager").getComponent("GameManager");
      this._charAnimation = this.char.getComponent(cc.Animation);
      this._joiaAnimation = this.joia.getComponent(cc.Animation);
      this._disquete1Animation = this.disquete1.getComponent(cc.Animation);
      this._disquete2Animation = this.disquete2.getComponent(cc.Animation);
      this._disquete3Animation = this.disquete3.getComponent(cc.Animation);
      this.setInfo();
      this._countDown = this._countDownMax;
    }

    setInfo() {
      let info = this._gm.getProgressInfo();
      // this.labelScore.string = "Score: "+info.score;
      // this.labelHP.string = "HP: "+info.hp;
      if (info.lost) {
        this._charAnimation.play("CharMad");
      } else {
        this._joiaAnimation.play("JoiaAppear");
      }
      if (info.levelUp) {
        this.labelMaisRapido.active = true;
      }

      this._disquete1Animation.play("DisqueteInteiroIddle");
      if (info.hp == 1) {
        if (info.lost){
          this._disquete2Animation.play("DisqueteQuebrando");
          this._disquete3Animation.play("DisqueteShatteredIddle");
        } else {
          this._disquete2Animation.play("DisqueteShatteredIddle");
          this._disquete3Animation.play("DisqueteShatteredIddle");
        }
      }

      if(info.hp >= 2) {
        this._disquete2Animation.play("DiqueteInteiroIddle");
        if (info.lost){
          this._disquete3Animation.play("DisqueteQuebrando");
        } else {
          this._disquete3Animation.play("DisqueteShatteredIddle");
        }
      }

      if(info.hp >= 3) {
        this._disquete3Animation.play("DiqueteInteiroIddle");
      }
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
