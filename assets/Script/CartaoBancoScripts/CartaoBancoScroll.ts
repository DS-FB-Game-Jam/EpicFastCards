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
import { CartaoBancoSwipe } from './CartaoBancoSwipe'
import {GameManager} from '../GameManager/GameManager';


@ccclass
export class CartaoBancoScroll extends cc.Component {

    @property()
    public scrollSpeed:number = 420;

    @property(cc.Node)
    public link:cc.Node = null;

    @property()
    public correctCard:boolean = false;
    
    private _cartaoBancoSwipe:CartaoBancoSwipe = null;
    private minThreshold:number = 0;
    private maxThreshold:number = 0;
    private _gm:GameManager = null;


    public working:boolean = true;
    public inPosition:boolean = false;

    start () {
      this._cartaoBancoSwipe = this.node.parent.parent.getComponent(CartaoBancoSwipe);
      this.minThreshold = this._cartaoBancoSwipe.minThreshold;
      this.maxThreshold = this._cartaoBancoSwipe.maxThreshold;
      if (cc.find("GameManager")) {
        this._gm = cc.find("GameManager").getComponent("GameManager");
        let info = this._gm.getProgressInfo();
        this.scrollSpeed = this.scrollSpeed * (1+ (0.1*info.difficulty))
      }
    }

    update (dt) {
      if (this.working) {
        let newx = this.node.position.x - this.scrollSpeed*dt;
        if (newx < -220) newx = this.link.position.x + 110;

        if ( newx+110 > this.minThreshold && newx < this.maxThreshold){
          this.inPosition = true;
        } else {
          this.inPosition = false;
        }

        this.node.setPosition(newx, this.node.position.y);
      } else {
        if (this.node.position.y < -80) {
          this.node.setPosition(0, (this.node.position.y+(this.scrollSpeed*2*dt)));
        }
      }
    }

    swipe() {
      this.working = false;
    }
}
