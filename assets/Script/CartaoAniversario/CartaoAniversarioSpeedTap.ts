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
import { BaseSpeedTap } from '../SpeedTap/BaseSpeedTap'

@ccclass
export default class CartaoAniversarioSpeedTap extends BaseSpeedTap {

  @property(cc.Node)
  public card:cc.Node = null;

  @property(cc.Node)
  public button:cc.Node = null;
  public _buttonAnimation:cc.Animation = null;

  @property()
  public startY:number = -110;

  @property()
  public height:number = 140;
  
  @property()
  public mistakeTime:number = 1;

  private endGame:boolean = false;

  private totalTime:number = 5;
  private levelTime:number = 0;

  start () {
    super.start();
    if (this.button)
      this._buttonAnimation = this.button.getComponent(cc.Animation);
  }

  update(dt) {
    this.levelTime += dt;
    if (!this.endGame && this.levelTime > this.totalTime) {
      this.loseGame();
    }
  }

  hasTapped(tapCount, progress) {
    if (this.endGame) return;

    if (progress == 1) {
      this.winGame();
    }

    if (progress < 1) {
      console.log("rolou progresso");
      this.card.setPosition(this.card.position.x, this.startY + (progress*this.height));
      if (this._buttonAnimation) {
        this._buttonAnimation.play("ButtonPress");
      }
    }

  }

  loseGame() {
    this.endGame = true;
    console.log("perdeu");
  }

  winGame() {
    this.endGame = true;
    console.log("ganhou");
  }

}
