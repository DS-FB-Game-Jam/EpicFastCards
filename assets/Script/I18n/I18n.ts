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

import {pt_BR} from './pt_br'
import {en_US} from './en_us'

@ccclass
export class I18n {

  private static fbInstant: any;
  private static locale:string = null;
  private static dicts:any = {
    'pt_BR': pt_BR,
    'en_US': en_US,
  }

  public static getTranslation(key:string) {
    let dict = this.getDictionary();
    let translation = dict[key];
    return translation?translation:key; 
  }

  private static getDictionary():any {
    if (!I18n.locale) {
      if (!window['FBInstant']) {
        I18n.locale = 'en_US';
      } else {
        I18n.locale = window['FBInstant'].getLocale();
      }
    }
    let dict = I18n.dicts[I18n.locale];
    if (!dict) dict = I18n.dicts['en_US']
    return dict;
  }


}
