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

@ccclass
export default class CartaoMemoriaRegionTap extends cc.Component {

    private cards:string[] = ['memory_iron_souls', 'memory_oiram', 'memory_vasebreaker'];
    private tvAnimations:any = {
      'memory_iron_souls':'TVPlayIronSoul', 
      'memory_oiram':'TVPlayOIRam', 
      'memory_vasebreaker':'TVPlayVaseBreaker'};
    private memoryAnimations:any = {
      'memory_iron_souls':'MemoryCardsIronSoul', 
      'memory_oiram':'MemoryCardsOIRam', 
      'memory_vasebreaker':'MemoryCardsVaseBreaker'};
      
    @property(cc.Node)
    public tv:cc.Node = null;
    private _tvAnimation:cc.Animation = null;

    @property(cc.Node)
    public memories:cc.Node = null;
    private _memoriesAnimation:cc.Animation = null;

    private selectedCard:string = "";

    private endGame:boolean = false;

    private totalTime:number = 5;
    private levelTime:number = 0;

    start () {
      if (this.memories)
        this._memoriesAnimation = this.memories.getComponent(cc.Animation);
      if (this.tv)
        this._tvAnimation = this.tv.getComponent(cc.Animation);
      let idx = Math.round(Math.random()*2);
      console.log("idx manneiro:", idx);
      this.selectedCard = this.cards[ idx ];
      console.log("mandando a animação da tv", this.cards);
      this._tvAnimation.play(this.tvAnimations[this.selectedCard]);
    }

    update(dt) {
      this.levelTime += dt;
      if (!this.endGame && this.levelTime > this.totalTime) {
        this.loseGame();
      }
    }

    registerTap(region:string) {
      // console.log("registerTap:", region);
      if (this.endGame) return;
      if (region == this.selectedCard) {
        this._memoriesAnimation.play(this.memoryAnimations[this.selectedCard]);
        this.winGame();
      } else {
        this.loseGame();
      }
    }

    loseGame() {
      this.endGame = true;
      console.log("loseGame");
    }

    winGame() {
      this.endGame = true;
      console.log("winGame");
    }
}
