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


@ccclass
export class CartaoBancoScroll extends cc.Component {

    @property()
    public scrollSpeed:number = 20;

    @property(cc.Node)
    public link:cc.Node;

    private _cartaoBancoSwipe:CartaoBancoSwipe;
    private minThreshold:number;
    private maxThreshold:number;


    public working:boolean = true;
    public inPosition:boolean = false;
    public correctCard:boolean = false;

    start () {
      this._cartaoBancoSwipe = this.node.parent.parent.getComponent(CartaoBancoSwipe);
      this.minThreshold = this._cartaoBancoSwipe.minThreshold;
      this.maxThreshold = this._cartaoBancoSwipe.maxThreshold;
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
        if (this.node.position.y < 50) {
          this.node.setPosition(0, (this.node.position.y+(this.scrollSpeed*3*dt)));
        }
      }
    }

    swipe() {
      this.working = false;
    }
}
