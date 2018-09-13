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
import {CartaoBancoScroll} from './CartaoBancoScroll';
import {GameManager} from '../GameManager/GameManager';

@ccclass
export class CartaoBancoSwipe extends BaseSwipe {

    @property()
    public minThreshold:number = -20;
    @property()
    public maxThreshold:number = 20;

    @property(cc.Node)
    public maquina:cc.Node = null;
    public _maquinaAnimation:cc.Animation = null;

    private swipped:boolean = false;
    private _gm:GameManager = null;


    @property(cc.Node)
    public losePrefab:cc.Node = null;

    private endGame:boolean = false;
    private totalTime:number = 5;
    private levelTime:number = 0;

    start() {
      super.start();
      this._gm = cc.find("GameManager").getComponent("GameManager");
      let progressInfo = this._gm.getProgressInfo();
      this.totalTime = progressInfo.levelTime;
    }

    update (dt) {
      if (this.endGame) return;
      this.levelTime += dt;
      if (this.levelTime > this.totalTime ) {
        this.loseGame();
      }
      if (this.isSwipeUp && !this.swipped) {
        this.swipped = true;
        this.doSwipeUp();
        console.log("Identifiquei o swipeUp");
      }
    }

    doSwipeUp() {
      let cardSlider:cc.Node = this.node.getChildByName("CardSlider");
      if (!cardSlider) {console.log("Não achei o cardSlider"); return;}

      let cards:CartaoBancoScroll[] = cardSlider.getComponentsInChildren(CartaoBancoScroll);

      let win:boolean = false;
      let swipedCard:CartaoBancoScroll = null;

      cards.forEach((card:CartaoBancoScroll) => {
        if (card.inPosition) {
          if (!swipedCard) {
            swipedCard = card;
          }
          if (card.correctCard) { 
            win = true; 
            swipedCard = card; 
          }
        }
      });

      swipedCard.swipe();
      if(!this._maquinaAnimation && this.maquina) {
        this._maquinaAnimation = this.maquina.getComponent(cc.Animation);
      }
      if (win) {
        this.winGame();
      } else {
        this.loseGame();
      }
    }

    winGame() {
      //DoWinGame;
      this.endGame = true;
      if(this._maquinaAnimation) {
        this._maquinaAnimation.play("MaquinaCartaoPago");
      }
      if (!this._gm) return;
      let gm = this._gm;
      setTimeout(function (){
        gm.nextLevel(false);
      }, 1500);
    }

    loseGame() {
      //DoLoseGame;
      this.endGame = true;
      this.losePrefab.active = true;
      if(this._maquinaAnimation) {
        this._maquinaAnimation.play("MaquinaCartaoError");
      }
      if (!this._gm) return;
      let gm = this._gm;
      setTimeout(function (){
        gm.nextLevel(true);
      }, 1500);
    }
}
