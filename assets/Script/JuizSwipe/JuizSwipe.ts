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
import {BaseSwipe} from '../Swipe/BaseSwipe'
import {GameManager} from '../GameManager/GameManager'


@ccclass
export default class JuizSwipe extends BaseSwipe {


    @property(cc.AudioSource)
    public music1:cc.AudioSource = null;
    @property(cc.AudioSource)
    public music2:cc.AudioSource = null;
    @property(cc.AudioSource)
    public music3:cc.AudioSource = null;
    @property(cc.AudioSource)
    public timeout:cc.AudioSource = null;
    @property(cc.AudioSource)
    public win:cc.AudioSource = null;
    @property(cc.AudioSource)
    public lose:cc.AudioSource = null;
    @property(cc.AudioSource)
    public fail:cc.AudioSource = null;
    @property(cc.AudioSource)
    public whistle:cc.AudioSource = null;

    @property(cc.Node)
    public losePrefab:cc.Node = null;

    @property(cc.Node)
    public playerBr:cc.Node = null;
    public _playerBrAnimation:cc.Animation = null;
    @property(cc.Node)
    public playerSu:cc.Node = null;
    public _playerSuAnimation:cc.Animation = null;
    @property(cc.Node)
    public bola:cc.Node = null;
    public _bolaAnimation:cc.Animation = null;
    @property(cc.Node)
    public juiz:cc.Node = null;
    public _juizAnimation:cc.Animation = null;

    @property(cc.Node)
    public timer:cc.Node = null;


    private endGame:boolean = false;
    private totalTime:number = 5;
    private levelTime:number = 0;
    private _gm:GameManager = null;

    private falta:boolean = true;

    start () {
      super.start();
      if (cc.find("GameManager")) {
        this._gm = cc.find("GameManager").getComponent("GameManager");
        let progressInfo = this._gm.getProgressInfo();
        this.totalTime = progressInfo.levelTime;
        if (progressInfo.difficulty/2 <= 1) {
          this.music1.play();
        } else if (progressInfo.difficulty/2 <= 2) {
          this.music2.play();
        } else {
          this.music3.play();
        }
      } else {
        this.totalTime = 5;
      }

      if (this.playerBr) this._playerBrAnimation = this.playerBr.getComponent(cc.Animation);
      if (this.playerSu) this._playerSuAnimation = this.playerSu.getComponent(cc.Animation);
      if (this.bola) this._bolaAnimation = this.bola.getComponent(cc.Animation);
      if (this.juiz) this._juizAnimation = this.juiz.getComponent(cc.Animation);

      let rng = Math.random();
      this.falta =  rng < 0.5;
      this.playAnims();
    }

    playAnims() {
      if (this.falta) {
        this._playerBrAnimation.play("PlayerBRCair");
        this._playerSuAnimation.play("PlayerSUFalta");
        this._bolaAnimation.play("BolaSUWin");
      } else {
        this._playerBrAnimation.play("PlayerBRDibre");
        this._playerSuAnimation.play("PlayerSULiso");
        this._bolaAnimation.play("BolaBRWin");
      }
      if (this._gm) {
        let progressInfo = this._gm.getProgressInfo();
        let speedup =  1 + (progressInfo.difficulty*0.1);

        this._playerBrAnimation.currentClip.speed = speedup;  
        this._playerSuAnimation.currentClip.speed =  speedup;
        this._bolaAnimation.currentClip.speed =  speedup;
      }
    }

    update(dt) {
      if (this.endGame) return;

      this.levelTime += dt;
      this.updateTimer();
      if (this.levelTime > this.totalTime) {
        this.timeout.play();
        if (this.falta) {
          this.loseGame();
        } else {
          this.winGame();
        }
        return;
      }

      if (this.isSwipeUp) {
        this.doSwipeUp();
      }
    }

    updateTimer(){
      this.timer.setScale(1-(this.levelTime/this.totalTime), 1);
    }

    doSwipeUp() {
      this._juizAnimation.play("JuizApitar");
      this.whistle.play();
      if (this.falta) {
        this.winGame();
      } else {
        this.loseGame();
      }
    }


    winGame() {
      console.log("winGame");
      this.endGame = true;
      this.win.play();

      if (!this._gm) return;
      let gm = this._gm;
      setTimeout(function (){
        gm.nextLevel(false);
      }, 1500);
    }

    loseGame() {

      console.log("loseGame");
      this.endGame = true;
      this.fail.play();
      this.lose.play();
      this.losePrefab.active = true;
      
      if (!this._gm) return;
      let gm = this._gm;
      setTimeout(function (){
        gm.nextLevel(true);
      }, 1500);
    }
}
