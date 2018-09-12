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

@ccclass
export class CartaoBancoSwipe extends BaseSwipe {

    @property()
    public minThreshold:number = -20;
    @property()
    public maxThreshold:number = 20;

    private swipped:boolean = false;
    update (dt) {
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
      console.log("cards: ", cards)
      let win:boolean = false;
      let swipedCard:CartaoBancoScroll = null;
      cards.forEach((card:CartaoBancoScroll) => {
        if (!swipedCard) swipedCard = card;
        if (card.inPosition && card.correctCard) { 
          win = true; 
          swipedCard = card; 
        }
      })

      swipedCard.swipe();
      if (win) {
        this.winGame();
      } else {
        this.loseGame();
      }
    }

    winGame() {
      //DoWinGame;
    }

    loseGame() {
      //DoLoseGame;
    }
}
