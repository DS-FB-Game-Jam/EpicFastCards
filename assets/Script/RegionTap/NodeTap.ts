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
export default class NodeTap extends cc.Component {

    @property()
    public regionScriptName:string = "RegionTap";

    start () {

    }

    onEnable() {
      // console.log("onEnable NodeTap", this.node);

      this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
        // console.log("event", event);
        this.processTouch();
      }, this);
    }

    onDisable() {
      // console.log("onDisable NodeTap", this.node);
      this.node.off(cc.Node.EventType.TOUCH_START, function (event) {
        // console.log("event", event);
      }, this);
    }

    processTouch(event) {
      console.log("processTouch:", this.node.name);
      this.node.parent.getComponent(this.regionScriptName).registerTap(this.node.name);
    }


}
