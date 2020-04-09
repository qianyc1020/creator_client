import ProtoManater from '../manager/ProtoManager';

export default class GameAppConfig {
    static IS_LOCAL_DEBUG           = true;                     //是否启用本地调试
    // static LOCAL_IP              = "127.0.0.1";
    static LOCAL_HOST                 = "192.168.0.104";          //本地电脑ip,暂时写死，主要为了游戏在web平台测试用
    static REMOTE_IP                = "www.hccfun.com";
    static REMOTE_WECHAT_PORT       = "6081";                   //小程序wss端口，nginx配置6081,转发到6061
    static NATIVE_PLATFORM_PORT     = "6061";                   //安卓IOS原生平台端口,直接连接到6081
    static PROTO_TYPE               = ProtoManater.PROTO_BUF;
    static IS_TEST_BALL             = false;                    //是否本地测试小球碰撞
    static BALL_COMPOSE_COUNT       = 3;                        //小球合成所需数量   

    //小球转换类型
    static BALL_UPDATE_TYPE = {
        SELL_TYPE:      0,  //卖了
        COMPOSE_TYPE:   1,  //合成,三个一合成
        GIVE_TYPE:      2,  //赠送
    }
}