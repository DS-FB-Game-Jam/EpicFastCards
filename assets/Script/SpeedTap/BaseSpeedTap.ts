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
export class BaseSpeedTap extends cc.Component {

    @property()
    public totalTaps:number = 10;

    tapCount:number = 0;

    start () {
      this.tapCount = 0;

      this.node.on("touchend", function () {

        this.tapCount++;
        this.hasTapped(this.tapCount, this.tapCount/this.totalTaps);

      }, this);
    }

    hasTapped(tapCount, tapProgress) { }
}
