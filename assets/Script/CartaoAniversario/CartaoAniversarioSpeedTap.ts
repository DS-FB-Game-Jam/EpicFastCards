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
  public card:cc.Node;

  @property()
  public startY:number = -110;

  @property()
  public height:number = 140;
  
  @property()
  public mistakeTime:number = 1;

  private endGame:boolean = false;
  private finished:boolean = false;
  private finishedTime:number = 0;

  start () {
    super.start();
    this.totalTaps = 10;
  }

  update(dt) {
    if(this.finished && !this.endGame) {
      this.finishedTime += dt;
      if (this.finishedTime > this.mistakeTime) {
        this.winGame();
      }
    }

  }

  hasTapped(tapCount, progress) {
    if (this.endGame) return;

    if (progress == 1) {
      this.finished = true;
      this.finishedTime = 0;
    }

    if (progress < 1) {
      console.log("rolou progresso");
      this.card.setPosition(this.card.position.x, this.startY + (progress*this.height));
    }
    if (progress > 1) {
      this.loseGame();
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
