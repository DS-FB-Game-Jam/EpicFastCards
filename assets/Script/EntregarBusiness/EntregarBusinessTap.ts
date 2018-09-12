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


@ccclass
export class EntregarBusinessTap extends BaseTap {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    @property()
    public totalTime:number = 5;

    @property()
    public totalHands:number = 5;
    public timePerHand:number = 1;

    @property(cc.Node)
    public card:cc.Node;

    @property(cc.Node)
    public handOpen:cc.Node;
    private _handOpenAnimation:cc.Animation;
    @property(cc.Node)
    public handClose:cc.Node;
    private _handCloseAnimation:cc.Animation;
    @property(cc.Node)
    public businessCards:cc.Node;
    private _businessCardsAnimation:cc.Animation;

    public currentHand:cc.Node;
    public currentHandCount:number = 0;
    private endGame:boolean = false;

    private startHandTime:number = 0;
    private intermissionTime:number = 0.5;

    start () {
      super.start();
      if (this.handOpen)
        this._handOpenAnimation = this.handOpen.getComponent(cc.Animation);
      if (this.handClose)
        this._handCloseAnimation = this.handClose.getComponent(cc.Animation);
      if (this.businessCards) 
        this._businessCardsAnimation = this.businessCards.getComponent(cc.Animation);

      this.timePerHand = this.totalTime/this.totalHands;
      this.startHandTime = 0;
      // this.choseHand();
    }

    update(dt) {
      if (this.currentHandCount > this.totalHands || this.endGame) return;
      this.startHandTime += dt;
      if (this.currentHand != null) {
        if (this.startHandTime > this.timePerHand) {
          console.log("Deu o tempo da mão");
          if (this.currentHand == this.handOpen) {
            this.loseGame();
          } else {
            this.intermissionTime = 0.5;
            this.nextHand();
          }
        }
      } else {
        if (this.startHandTime > this.intermissionTime) {
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

      if (this.currentHandCount > this.totalHands) {
        this.winGame();
      }

      this.startHandTime = 0;

    }

    nextHand() {
      if (this.currentHand == this.handOpen) this._handOpenAnimation.play("MaoAbertaLeave");
      if (this.currentHand == this.handClose) this._handCloseAnimation.play("MaoFechadaLeave");
      
      this.currentHand = null;
      this.startHandTime = 0;
    }

    tapped(location:cc.Vec2) {
      if (!this.currentHand) return;

      if (this.currentHand == this.handOpen) {
        this._businessCardsAnimation.play("BusinessCardDeliver");
        this.card.active = true;
        this.nextHand();
      } else {
        this._handCloseAnimation.play("MaoFechadaGetCard");
        this.loseGame();
      }

    }

    loseGame() {
      console.log("Perdeu");
      this.endGame = true;
      //Lose
    }

    winGame() {
      console.log("Ganhou");
      this.endGame = true;
    }

    // update (dt) {}
}
