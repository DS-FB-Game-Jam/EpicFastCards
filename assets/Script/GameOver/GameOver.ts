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
import {BaseSwipe} from '../Swipe/BaseSwipe';

@ccclass
export default class GameOver extends BaseSwipe {

     @property(cc.Label)
    labelScore: cc.Label = null;

     @property()
    public minThreshold:number = -20;
    @property()
    public maxThreshold:number = 20;

    private _gm;
    private swipped:boolean = false;
    private info;
    // LIFE-CYCLE CALLBACKS:

    private fbInstant: any;

    // onLoad () {}

    start () {
      console.log("GameOver");
      super.start();
      this.swipped = false;
      this._gm = cc.find("GameManager").getComponent("GameManager");
      this.fbInstant = window['FBInstant'];
      this.setInfo();

  
    }

    setInfo() {
      this.info = this._gm.getProgressInfo();
      this.labelScore.string = "Score: "+this.info.score;
      this.postScore(this.info.score);
    }

    update (dt) {
      if(this.isSwipeUp && !this.swipped) {
        console.log("Identifiquei o swipeUp");
        // if(this._gm) {
          this.swipped = true;
          this._gm.restartGame();
        // }
      }
    }

    postScore(score: number) {
      console.log("postScore", this.fbInstant);
      if (!this.fbInstant) return;
      this.fbInstant.getLeaderboardAsync('leaderboard')
      .then(function(leaderboard) {
        console.log("leaderboard", leaderboard);
        console.log("score", score);
        return leaderboard.setScoreAsync(score);
      }).then( function(entry) {
        console.log("entry", entry);
        // this.getConnectedLeaderBoard();
      }, function(error) {
        console.error(error);
      });
    }

    // getConnectedLeaderBoard() {
    //   console.log("getConnectedLeaderBoard");
    //    if (!this.fbInstant) return;
    //   this.fbInstant.getLeaderboardAsync('leaderboard')
    //   .then(function(leaderboard) {
    //     console.log("leaderboard", leaderboard);
    //     return leaderboard.getConnectedPlayerEntriesAsync(5,3);
    //   })
    //   .then(function(entries) {
    //     console.log("connect leaderboard entries size", entries.length);
    //     for(let entry of entries) {
    //       console.log("entry", entry);
    //       console.log("rank: ", entry.getRank());
    //       console.log("score: ", entry.getScore());
    //     }
    //   });
    // }

    share() {
      console.log("share", this.getImageBase64());
      // if (!this.fbInstant) return;

      // console.log("fbInstant loaded");

      // this.fbInstant.shareAsync({
      //       intent: 'CHALLENGE',
      //       image: this.getImageBase64(),
      //       text: 'Fiz '+this.info.score+" pontos, você consegue me superar?",
      //       data: {myReplayData: '...'},
      //   }).then(() => {
      //       // continue with the game.
      //       console.log("yaaaay");
      //   }, (e) => {
      //     console.log("error?", e);
      //   });
      this.shareHighscore();
    }

    shareHighscore() {
      console.log("shareHighscore");
      if (!this.fbInstant) return;
      this.fbInstant.updateAsync({
        action: 'LEADERBOARD',
        name: 'leaderboard'
      })
      .then(() => console.log('Update Posted'))
      .catch(error => console.error(error));
    }

    getImageBase64() {
      return 'data:image/png;base64,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ZwHg2WeftdttJ52UZwIEgGeffWb//v1/+ctfzPhtdMMluWMPabvotMPy3mVZeuvuA/c+OpFNQZZBVLBgS5IkmpRBAVEGBEFIxcYVNT9zSXNifcwiM+yeIMksMX/729+5+OKLAeC8887NO5fedNPNZ511FgCcc87ZKSetFDRNr1279oQTToSpziEYhs2cObOzc9asWZ2dnbPOPPNMADjjjDMBoCJ6xjC48ORDjj9MMbFRIsFlWv5VcjChVJ7VRTrXRVHzs3981FL1nAWeT0fwZpnBbrjhhnPOOXfLli0/+MH1oVCIIIisM63//d+fnXzyyZs2bbrhhh9Go5NRYq2trU888SQAvPHGGzfffFOiULhiajN8zz33/P3vD2fdOuaYY3/5y18CwJNPPtHV1bV///6urq7MLw7t1LttbQ2uRq/D62QJHBsJxHBMPuvouVqe/cbd/0m9ULZso4DnakKS5OTBmbWo+TlmJR9PWZbTYsZxPMumfc45527atOmaa74nCMKpp562du3azLvBYNDj8bzyyis/+tENmdeXLl16//0PAMCTTz7585//TMswlPy6Tj311LVrf5p6fe6552XdPfroVZdeemlvb29vb29fX5/St8a89vpjl8781JGz8t6NxZMJzVU10ORcM0jS5LGicT2LomipaOfMBFdK4YQpJ9CUl/WePXvmzZuXuu7xeJ555pnbbrs1q31KzOm0QT6f75lnnl2/fn1PT3d394QZTMsJ9tlnn/OjH/0oGR594m+/50MHjlrU1jOWBMpJuZtP+K/PkowjFfycyXvvvdff39fb2/vhhx/u3LF9zeoFZx27UP1d7DYGxyAW1yRpFbcwlMqzusjMFWlcz7GYhXxIJEnK9GFWyl+Zyf333//aa+sB4Bvf+Kbf7w8E/EcffXQgEPD7/X6/n+O488+/AAAeffTRdA6wpqZmADjppJNye/vtb3/70EN/yr3ucTBfuejs41cs2fHvnwHA4W0YtLUBwEwfA8AD9H3ywr0A8Mw7XaMJ2tvYPmNGx4wZM0444cSjjjrqqKOOio7sDx8/3989R2O4J8sygiByGnL3qYgWFamqIkRxSk5143qOWsknLMdbW1Mc6Jo1a268Mc8Jc4q77roLADZunLAGe53sMQt93W8/HBvtBoADQZEjXHR958mfORcAvv71r6f1LEtCg034/CmHfGbV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';
    }

}
