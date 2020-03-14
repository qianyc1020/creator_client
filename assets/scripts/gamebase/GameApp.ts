import Log from '../framework/utils/Log';
import SceneManager from '../framework/manager/SceneManager';
import LoginScene from './scene/LoginScene/LoginScene';
import LobbyScene from './scene/lobbyScene/LobbyScene';
import GameScene from './scene/gameScene/GameScene';
import HotFixScene from './scene/hotfixScene/HotFixScene';
import EventManager from '../framework/manager/EventManager';
import EventDefine from '../framework/config/EventDefine';
import NetWork from '../framework/network/NetWork';
import DialogManager from '../framework/manager/DialogManager';
import PlatForm from '../framework/config/PlatForm';
import StringUtil from '../framework/utils/StringUtil';

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameApp extends cc.Component {
    //onload >> start
    onLoad () {
        this.node.addComponent("EnablePhysics"); //开启物理引擎
        NetWork.getInstance().connect()

        EventManager.on(EventDefine.EVENT_NET_CONNECTED, this, this.on_net_connected.bind(this));
        EventManager.on(EventDefine.EVENT_NET_CLOSED, this, this.on_net_closed.bind(this));
        EventManager.on(EventDefine.EVENT_NET_ERROR, this, this.on_net_error.bind(this));
    }

    start () {
        let scene = new HotFixScene();
        SceneManager.getInstance().enter_scene_asyc(scene);
        PlatForm.printPlatForm()
        // this.test_func()
        // this.test_func()
    }

    on_net_connected(event:cc.Event.EventCustom){
        Log.info("GameApp hcc>>>on_net_connected success")
        DialogManager.getInstance().show_weak_hint("网络连接成功!")
    }

    on_net_closed(event:cc.Event.EventCustom){
        Log.info("GameApp hcc>>>on_net_closed")
        setTimeout(() => {
            NetWork.getInstance().reconnect();
        }, 2000);
        DialogManager.getInstance().show_weak_hint("网络断开,正在连接中。。。")
    }

    on_net_error(event:cc.Event.EventCustom){
        Log.info("GameApp hcc>>>on_net_error")
        DialogManager.getInstance().show_weak_hint("网络断开!")
    }
    //test
    test_func(){
        /*
        //array test
        let array = {
            [0]: 1,
            [1]: "222222",
            [3]: "sdfsdfds",
            [9]: 9999,
        }
        let count = 0;
        for(let key in array){
            count ++;
            cc.log("key: " , key , " ,value: " , array[key])
        }
        cc.log("count: " , count)
        //
        this.node.convertToNodeSpaceAR(cc.v2(100,100)); //将世界坐标ccv2(100,100)转换成node下的节点坐标系  
        this.node.convertToWorldSpaceAR(cc.v2(100,100)); // 将节点坐标系node下的一个点cc.v2(100,100)转换到世界空间坐标系。
        */
        //1080  1920
        // -540-> 540
        // -960-> 960
        //0 - 1
       let posx = StringUtil.random_int(-540 , 540);
       let posy = StringUtil.random_int(-960 , 960);
       console.log("hcc>>startpos: " , posx, posy)

       console.log("hcc>>>>>>>>" , 5 % 4)
    }

}
