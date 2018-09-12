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

@ccclass
export class BaseSwipe extends cc.Component {

    @property(cc.Label)
    public label: cc.Label = null;

    @property(cc.Vec2)
    public touchStartPoint: cc.Vec2 = null;
    
    @property(cc.Vec2)
    public touchLastPoint: cc.Vec2 = null;

    @property()
    public touchThreshold: number = 15;
    @property()
    public isSwipeLeft:boolean = false;
    @property()    
    public isSwipeRight:boolean = false;
    @property()    
    public isSwipeUp:boolean = false;
    @property()    
    public isSwipeDown:boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
      console.log("O Console.log funciona?");
      this.node.on('touchstart', function (event:cc.Event.EventTouch) {
        let touch = event.getTouches()[0];
        let location:cc.Vec2 = touch.getLocation();
        this.touchStartPoint = new cc.Vec2(location.x, location.y);
        this.touchLastPoint = new cc.Vec2(location.x, location.y);
      }, this);

      this.node.on('touchmove', function (event:cc.Event.EventTouch) {
        let touch = event.getTouches()[0];
        let loc:cc.Vec2 = touch.getLocation();

        let start:cc.Vec2 = this.touchStartPoint;
        if (loc.x < start.x - this.touchThreshold) {
          if (loc.x > this.touchLastPoint.x) {
            start = this.touchStartPoint = new cc.Vec2(loc.x, loc.y);
            this.isSwipeLeft = false;
          } else {
            this.isSwipeLeft = true;
          }
        }

        if (loc.x > start.x + this.touchThreshold) {
          if (loc.x < this.touchLastPoint.x) {
            start = this.touchStartPoint = new cc.Vec2(loc.x, loc.y);
            this.isSwipeRight = false;
          } else {
            this.isSwipeRight = true;
          }
        }

        if (loc.y < start.y - this.touchThreshold) {
          if (loc.y > this.touchLastPoint.y) {
            start = this.touchStartPoint = new cc.Vec2(loc.x, loc.y);
            this.isSwipeDown = false;
          } else {
            this.isSwipeDown = true;
          }
        }

        if (loc.y > start.y + this.touchThreshold) {
          if (loc.y < this.touchLastPoint.y) {
            start = this.touchStartPoint = new cc.Vec2(loc.x, loc.y);
            this.isSwipeUp = false;
          } else {
            this.isSwipeUp = true;
          }
        }

        this.touchLastPoint = new cc.Vec2(loc.x, loc.y);
      }, this);

      this.node.on('touchend', function(event) {
        let touch = event.getTouches()[0];
        let loc:cc.Vec2 = touch.getLocation();

        this.isSwipeLeft = false;
        this.isSwipeRight = false;
        this.isSwipeUp = false;
        this.isSwipeDown = false;
        
      }, this);
    }

    // update (dt) {
    // }
}
