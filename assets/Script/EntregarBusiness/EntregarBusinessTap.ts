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
import { BaseTap } from '../Tap/BaseTap'
import {GameManager} from '../GameManager/GameManager';


@ccclass
export class EntregarBusinessTap extends BaseTap {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

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
    public success:cc.AudioSource = null;

    @property(cc.Node)
    public timer:cc.Node = null;

    @property()
    public totalHands:number = 5;
    public timePerHand:number = 1;

    @property(cc.Node)
    public card:cc.Node = null;

    @property(cc.Node)
    public handOpen:cc.Node = null;
    private _handOpenAnimation:cc.Animation = null;
    @property(cc.Node)
    public handClose:cc.Node = null;
    private _handCloseAnimation:cc.Animation = null;
    @property(cc.Node)
    public businessCards:cc.Node = null;
    private _businessCardsAnimation:cc.Animation = null;

    public currentHand:cc.Node = null;
    public currentHandCount:number = 0;
   
    private levelTime:number = 0;

    @property(cc.Node)
    public losePrefab:cc.Node = null;

    private totalTime:number = 5;
    private endGame:boolean = false;
    private _gm:GameManager = null;

    private startHandTime:number = 0;
    private intermissionTime:number = 0.5;

    start () {
      super.start();
      this.levelTime = 0;
      if (this.handOpen)
        this._handOpenAnimation = this.handOpen.getComponent(cc.Animation);
      if (this.handClose)
        this._handCloseAnimation = this.handClose.getComponent(cc.Animation);
      if (this.businessCards) 
        this._businessCardsAnimation = this.businessCards.getComponent(cc.Animation);

      if (cc.find("GameManager")) {
        this._gm = cc.find("GameManager").getComponent("GameManager");
        let progressInfo = this._gm.getProgressInfo();
        this.totalTime = progressInfo.levelTime;
        if (progressInfo.difficulty == 1) {
          this.music1.play();
        } else if (progressInfo.difficulty == 2) {
          this.music2.play();
        } else {
          this.music3.play();
        }
      } else {
        this.totalTime = 5;
      }

      this.timePerHand = (this.totalTime ) / this.totalHands;
      console.log("tempos");
      console.log("totalTime"+this.totalTime);
      console.log("perhand"+this.timePerHand);
      this.startHandTime = 0;
      // this.choseHand();
      this.intermissionTime = 0;
    }

    update(dt) {
      // if (this.currentHandCount > this.totalHands || this.endGame) return;
      if (this.endGame) return;
      
      this.levelTime += dt;
      this.updateTimer();
      if (this.levelTime > this.totalTime) {
        console.log("timeout", this.levelTime);
        if (this.currentHand == this.handOpen) this.deliver();
        this.timeout.play();
        this.winGame();
        return;
      }

      this.startHandTime += dt;
      if (this.currentHand != null) {
        if (this.startHandTime > this.timePerHand) {
          console.log("Deu o tempo da mão");
          if (this.currentHand == this.handOpen) {
            console.log("timeout opened");
            this.loseGame();
          } else {
            this.intermissionTime = 0.5;
            this.nextHand();
          }
        }
      } else {
        if (this.startHandTime >= this.intermissionTime) {
          console.log("Deu o tempo de espera");
          this.choseHand();
        }
      }
    }

    updateTimer(){
      this.timer.setScale(1-(this.levelTime/this.totalTime), 1);
    }

    choseHand() {
      let rnd = Math.random();
      this.card.active = false;
      this.currentHandCount++;
      if (rnd < 0.5) {
        this.currentHand = this.handOpen;
        this._handOpenAnimation.play("MaoAbertaEnter");
      } else {
        this.currentHand = this.handClose;
        this._handCloseAnimation.play("MaoFechadaEnter");
      }

      // if (this.currentHandCount >= this.totalHands) {
      //   console.log("choseHand > total");
      //   this.winGame();
      // }

      this.startHandTime = 0;

    }

    nextHand() {
      if (this.currentHand == this.handOpen) this._handOpenAnimation.play("MaoAbertaLeave");
      if (this.currentHand == this.handClose) this._handCloseAnimation.play("MaoFechadaLeave");

      this.currentHand = null;
      this.startHandTime = 0;

      // if (this.currentHandCount > this.totalHands) {
      //   console.log("nextHand > total");
      //   this.winGame();
      // }
    }

    tapped(location:cc.Vec2) {
      if (!this.currentHand || this.endGame) return;

      if (this.currentHand == this.handOpen) {
        this.deliver();
        this.nextHand();
      } else {
        this._handCloseAnimation.play("MaoFechadaGetCard");
        console.log("click on closed");
        this.fail.play();
        this.loseGame();
      }

    }

    deliver() {
      this._businessCardsAnimation.play("BusinessCardDeliver");
      this.card.active = true;
      this.intermissionTime = 0.5;
      this.success.play();
    }

    loseGame() {
      console.log("Perdeu");
      this.lose.play();
      this.endGame = true;
      this.losePrefab.active = true;
      if (!this._gm) return;
      let gm = this._gm;
      setTimeout(function (){
        gm.nextLevel(true);
      }, 1500);
      //Lose
    }

    winGame() {
      this.win.play();
      console.log("Ganhou");
      this.endGame = true;
      if (!this._gm) return;
      let gm = this._gm;
      setTimeout(function (){
        gm.nextLevel(false);
      }, 1500);
    }

    // update (dt) {}
}
