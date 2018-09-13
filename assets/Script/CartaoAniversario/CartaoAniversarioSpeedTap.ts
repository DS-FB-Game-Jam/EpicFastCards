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
import {GameManager} from '../GameManager/GameManager';

@ccclass
export default class CartaoAniversarioSpeedTap extends BaseSpeedTap {

  @property(cc.Node)
  public timer:cc.Node = null;

  @property(cc.Node)
  public card:cc.Node = null;
  private _cardAnimation:cc.Animation = null;

  @property(cc.Node)
  public button:cc.Node = null;
  public _buttonAnimation:cc.Animation = null;

  @property()
  public startY:number = -110;

  @property()
  public height:number = 140;
  
  @property()
  public mistakeTime:number = 1;

  @property(cc.Node)
  public losePrefab:cc.Node = null;

  private endGame:boolean = false;

  private totalTime:number = 5;
  private levelTime:number = 0;
  private _gm:GameManager = null;

  start () {
    super.start();
    this.levelTime = 0;
    if (cc.find("GameManager")) {
      this._gm = cc.find("GameManager").getComponent("GameManager");
      let progressInfo = this._gm.getProgressInfo();
      this.totalTime = progressInfo.levelTime;
    } else {
      this.totalTime = 5;
    }
    if (this.button)
      this._buttonAnimation = this.button.getComponent(cc.Animation);
    if (this.card)
      this._cardAnimation = this.card.getComponent(cc.Animation);
  }
  

  update(dt) {
    if (this.endGame) return;

    this.levelTime += dt;
    this.updateTimer();
    if (this.levelTime > this.totalTime) {
      this.loseGame();
    }
  }

  updateTimer(){
    this.timer.setScale(1-(this.levelTime/this.totalTime), 1);
  }

  hasBaseTapped(tapCount, progress) {
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
    this.losePrefab.active = true;
      if (!this._gm) return;
    let gm = this._gm;
    setTimeout(function (){
      gm.nextLevel(true);
    }, 1500);
  }

  winGame() {
    this.endGame = true;
    if (this._cardAnimation)
      this._cardAnimation.play("BirthdayCardClose");
    console.log("ganhou");
      if (!this._gm) return;
    let gm = this._gm;
    setTimeout(function (){
      gm.nextLevel(false);
    }, 1500);
  }

}
