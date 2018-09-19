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
import {GameManager} from '../GameManager/GameManager';

@ccclass
export default class CartaoMemoriaRegionTap extends cc.Component {


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
    public click:cc.AudioSource = null;


    @property(cc.Node)
    public timer:cc.Node = null;

    private cards:string[] = ['memory_iron_souls', 'memory_oiram', 'memory_vasebreaker'];
    private tvAnimations:any = {
      'memory_iron_souls':'TVPlayIronSoul', 
      'memory_oiram':'TVPlayOIRam', 
      'memory_vasebreaker':'TVPlayVaseBreaker'};
    private memoryAnimations:any = {
      'memory_iron_souls':'MemoryCardsIronSoul', 
      'memory_oiram':'MemoryCardsOIRam', 
      'memory_vasebreaker':'MemoryCardsVaseBreaker'};
    private memorySounds:any = {
      'memory_iron_souls':'memorycard_darksouls', 
      'memory_oiram':'memorycard_mario', 
      'memory_vasebreaker':'memorycard_zelda'};
      
    @property(cc.Node)
    public tv:cc.Node = null;
    private _tvAnimation:cc.Animation = null;

    @property(cc.Node)
    public memories:cc.Node = null;
    private _memoriesAnimation:cc.Animation = null;

    private selectedCard:string = "";


    @property(cc.Node)
    public losePrefab:cc.Node = null;

    private endGame:boolean = false;

    private totalTime:number = 5;
    private levelTime:number = 0;
    private _gm:GameManager = null;

    start () {
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
      }

      if (this.memories)
        this._memoriesAnimation = this.memories.getComponent(cc.Animation);
      if (this.tv)
        this._tvAnimation = this.tv.getComponent(cc.Animation);
      let idx = Math.round(Math.random()*2);
      this.selectedCard = this.cards[ idx ];
      this._tvAnimation.play(this.tvAnimations[this.selectedCard]);
    }

    update(dt) {
      if (this.endGame) return;
      this.levelTime += dt;
      this.updateTimer();
      if (this.levelTime > this.totalTime) {
        this.timeout.play();
        this.loseGame();
      }
    }

    updateTimer(){
      this.timer.setScale(1-(this.levelTime/this.totalTime), 1);
    }

    registerTap(region:string) {
      // console.log("registerTap:", region);
      if (this.endGame) return;
      this.click.play();
      if (region == this.selectedCard) {
        this._memoriesAnimation.play(this.memoryAnimations[this.selectedCard]);
        this.winGame();
      } else {
        this.loseGame();
      }
    }

    loseGame() {
      this.lose.play();
      this.endGame = true;
      console.log("loseGame");
      this.losePrefab.active = true;
      if (!this._gm) return;
      let gm = this._gm;
      setTimeout(function (){
        gm.nextLevel(true);
      }, 1500);
    }

    winGame() {
      let source:cc.AudioSource = this.node.getChildByName(this.memorySounds[this.selectedCard]).getComponent(cc.AudioSource);
      if(source) source.play();
      this.win.play();
      this.endGame = true;
      console.log("winGame");
      if (!this._gm) return;
      let gm = this._gm;
      setTimeout(function (){
        gm.nextLevel(false);
      }, 1500);
    }
}
