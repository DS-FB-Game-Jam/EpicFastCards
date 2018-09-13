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
      } else {
        this.totalTime = 5;
      }

      this.timePerHand = (this.totalTime - (0.5*this.totalHands) ) / this.totalHands;
      console.log("tempos");
      console.log("totalTime"+this.totalTime);
      console.log("perhand"+this.timePerHand);
      this.startHandTime = 0;
      // this.choseHand();
      this.intermissionTime = 0;
    }

    update(dt) {
      if (this.currentHandCount > this.totalHands || this.endGame) return;
      
      this.levelTime += dt;
      if (this.levelTime > this.totalTime) {
        console.log("timeout", this.levelTime);
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

      if (this.currentHandCount >= this.totalHands) {
        console.log("choseHand > total");
        this.winGame();
      }

      this.startHandTime = 0;

    }

    nextHand() {
      if (this.currentHand == this.handOpen) this._handOpenAnimation.play("MaoAbertaLeave");
      if (this.currentHand == this.handClose) this._handCloseAnimation.play("MaoFechadaLeave");

      this.currentHand = null;
      this.startHandTime = 0;

      if (this.currentHandCount > this.totalHands) {
        console.log("nextHand > total");
        this.winGame();
      }
    }

    tapped(location:cc.Vec2) {
      if (!this.currentHand) return;

      if (this.currentHand == this.handOpen) {
        this._businessCardsAnimation.play("BusinessCardDeliver");
        this.card.active = true;
        this.intermissionTime = 0.5;
        this.nextHand();
      } else {
        this._handCloseAnimation.play("MaoFechadaGetCard");
        console.log("click on closed");
        this.loseGame();
      }

    }

    loseGame() {
      console.log("Perdeu");
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
