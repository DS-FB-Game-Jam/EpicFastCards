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
import { RegionTap } from '../RegionTap/RegionTap';
import { GameManager } from '../GameManager/GameManager';

@ccclass
export default class BoardingPassRegionTap extends RegionTap {


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
    public appear:cc.AudioSource = null;
    @property(cc.AudioSource)
    public success:cc.AudioSource = null;
    @property(cc.AudioSource)
    public fail:cc.AudioSource = null;


    public boardingPasses:string[] = ["boardingCard1", "boardingCard2", "boardingCard3", "boardingCard4"];
    public invalidTimes:any = {
      "boardingCard1": ["13:00", "14:30", "15:00", "22:00"],
      "boardingCard2": ["13:30", "18:00", "21:50", "23:30"],
      "boardingCard3": ["22:00", "23:00", "22:30", "23:30"],
      "boardingCard4": ["9:00", "10:00", "19:00", "15:00"],
    }
    public validTimes:any = {
      "boardingCard1": ["8:00", "11:20", "11:00", "9:30"],
      "boardingCard2": ["6:00", "11:00", "10:00", "8:30"],
      "boardingCard3": ["21:00", "20:00", "18:40", "12:00"],
      "boardingCard4": ["8:00", "6:00", "7:30", "6:30"],
    }
    public gate:any = {
      "boardingCard1": "GateA",
      "boardingCard2": "GateF",
      "boardingCard3": "GateF",
      "boardingCard4": "GateA",
    }

    @property(cc.Label)
    public timeLabel:cc.Label = null;

    @property(cc.Node)
    public plane:cc.Node = null;

    @property(cc.Node)
    public losePrefab:cc.Node = null;
    @property(cc.Node)
    public timer:cc.Node = null;

    private selectedCard:string = "boardingCard1";
    private validTime:boolean = false;
    private cardAnimation:cc.Animation = null;

    private endGame:boolean = false;

    private totalTime:number = 5;
    private levelTime:number = 0;
    private _gm:GameManager = null;


    start () {
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
      }

      this.selectedCard = this.boardingPasses[Math.round(Math.random()*4)];
      this.validTime = Math.random() < 0.5;
      if (this.validTime) {
        this.timeLabel.string = this.validTimes[this.selectedCard][Math.round(Math.random()*4)];
      } else {
        this.timeLabel.string = this.invalidTimes[this.selectedCard][Math.round(Math.random()*4)];
      }

      this.cardAnimation = this.node.getChildByName(this.selectedCard).getComponent(cc.Animation);
      this.cardAnimation.play(this.selectedCard+"Appear");
      this.appear.play();
    }

    update (dt) {
      if (this.endGame) return;

      this.levelTime += dt;
      this.updateTimer();
      if (this.levelTime > this.totalTime) {
        this.timeout.play();
        if (!this.validTime) {
          this.fail.play();
          this.winGame();
        } else {
          this.loseGame();
        }
      }

    }

    registerTap(region:string) {
      if (this.endGame) return;
      if (this.validTime) {
        if (region == this.gate[this.selectedCard]) {
          this.success.play();
          this.winGame();
        } else {
          this.loseGame();
        }
      } else {
        this.loseGame();
      }
      // switch(region) {
      //   case 'GateA': 
      //       if (this.validTime) {

      //       }
      //     break;
      //   case 'GateB':
      //     break;
      //   case 'Trash':
      //     break;
      // }
    }

    updateTimer(){
      this.timer.setScale(1-(this.levelTime/this.totalTime), 1);
    }

    loseGame() {
      console.log("LoseGame");
      this.endGame = true;
      this.lose.play();

      this.losePrefab.active = true;
      if (!this._gm) return;
      let gm = this._gm;
      setTimeout(function (){
        gm.nextLevel(true);
      }, 1500);
    }

    winGame() {
      console.log("LoseGame");
      this.endGame = true;
      this.win.play();
      this.plane.getComponent(cc.Animation).play("PlaneFly");
      
      if (!this._gm) return;
      let gm = this._gm;
      setTimeout(function (){
        gm.nextLevel(false);
      }, 1500);
    }
}
