var UI_ctrl 		= require("UI_ctrl");
var net_mgr 		= require("net_mgr")
var GameApp 		= require("../game/managers/network/node_modules/GameApp");
var Stype 			= require("../game/managers/node_modules/Stype");
var LobbyScene  	= require("LobbyScene");
var cmd_name_map 	= require("../game/managers/node_modules/cmd_name_map")
var Cmd 			= require("../game/managers/node_modules/Cmd");
var event_mgr 		= require("event_mgr");
var event_name 		= require("../game/managers/node_modules/event_name")
var Respones 		= require("Respones")
var LocalStorageName = require("LocalStorageName")

var KW_IMG_LOGIN_BG 	= "KW_IMG_LOGIN_BG"
var KW_BTN_LOGIN 		= "KW_IMG_LOGIN_BG/KW_BTN_LOGIN"
var KW_INPUT_ACCOUNT 	= "KW_IMG_LOGIN_BG/KW_INPUT_ACCOUNT"
var KW_INPUT_PWD 		= "KW_IMG_LOGIN_BG/KW_INPUT_PWD"
var KW_BTN_GOTO_REGIST 	= "KW_IMG_LOGIN_BG/KW_BTN_GOTO_REGIST"

var KW_IMG_GUEST_LOGIN_BG 	= "KW_IMG_GUEST_LOGIN_BG"
var KW_BTN_REGIST 		  	= "KW_IMG_GUEST_LOGIN_BG/KW_BTN_REGIST"
var KW_BTN_CLOSE 			= "KW_IMG_GUEST_LOGIN_BG/KW_BTN_CLOSE" 
var KW_INPUT_ACCOUNT_REGIST = "KW_IMG_GUEST_LOGIN_BG/KW_INPUT_ACCOUNT"
var KW_INPUT_PWD_REGIST 	= "KW_IMG_GUEST_LOGIN_BG/KW_INPUT_PWD"
var KW_INPUT_PWD_COF 		= "KW_IMG_GUEST_LOGIN_BG/KW_INPUT_PWD_COF"

var KW_BTN_GUEST_LOGIN 		= "KW_BTN_GUEST_LOGIN"
var KW_TEXT_VERSION 		= "KW_TEXT_VERSION"
var KW_TEXT_NET_STATUS 		= "KW_TEXT_NET_STATUS"

cc.Class({
	extends: UI_ctrl,

	properties: {
		_connect_count : 0,
	},

	onLoad() {
		UI_ctrl.prototype.onLoad.call(this);
		this.view[KW_TEXT_VERSION].getComponent(cc.Label).string = "2.0.0"; //test
		this.view[KW_TEXT_NET_STATUS].getComponent(cc.Label).string = "正在连接。。。"; //test
		
		this.add_net_event_listener();
		this.add_button_event_listener();
	},

	start() {
		this.init_UI();
	},

	add_net_event_listener(){
		event_mgr.add_event_listenner(cmd_name_map[Cmd.eGuestLoginRes],this,this.on_event_guest_login)
		event_mgr.add_event_listenner(cmd_name_map[Cmd.eUnameLoginRes],this,this.on_event_uname_login)
		event_mgr.add_event_listenner(cmd_name_map[Cmd.euserRegistRes],this,this.on_event_user_regist)
		event_mgr.add_event_listenner(cmd_name_map[Cmd.eHeartBeatRes],this,this.on_event_heartbeat)

		event_mgr.add_event_listenner(event_name.net_connect,this,this.on_event_net_connect)
		event_mgr.add_event_listenner(event_name.net_disconnect,this,this.on_event_net_disconnect)
		event_mgr.add_event_listenner(event_name.net_connecting, this,this.on_event_net_connecting);
	},

	add_button_event_listener(){
		this.add_button_listener(KW_BTN_LOGIN, this, this.on_login_click_event);
		this.add_button_listener(KW_BTN_REGIST, this, this.on_regist_click_event);
		this.add_button_listener(KW_BTN_CLOSE, this, this.on_close_click_event);
		this.add_button_listener(KW_BTN_GUEST_LOGIN, this, this.on_guest_login_click_event);
		this.add_button_listener(KW_BTN_GOTO_REGIST, this, this.on_gotoregist_click_event);
	},
//////////////////////////////// 网络事件
	//登陆
	on_event_uname_login(udata){
		console.log('on_event_uname_login ' + udata);
		if(udata.status === Respones.OK){
			if(udata.uinfo){
				cc.sys.localStorage.setItem(LocalStorageName.user_info_self,JSON.stringify(udata.uinfo));
			}
			var self = this
			var on_process = function(percent){
				cc.log("Lobby>>on_process>> " + percent);
				//self.view[KW_TEXT_VERSION].getComponent(cc.Label).string = "loading: " + percent * 100 + "%"
			};
	
			var on_finished = function(){
				cc.log("Lobby>>on_finished>> ");
				GameApp.Instance.enter_scene(LobbyScene);
			};
			GameApp.Instance.preload_scene(LobbyScene,on_process,on_finished)
		}else{
			this.view[KW_TEXT_NET_STATUS].getComponent(cc.Label).string = "账号或密码错误";
		}
	},
	//游客登录
	on_event_guest_login(udata){
		console.log('on_event_guest_login ' + udata);
		if(udata.status === Respones.OK){
			if(udata.uinfo){
				cc.sys.localStorage.setItem(LocalStorageName.user_info_self,JSON.stringify(udata.uinfo));
			}
			var self = this
			var on_process = function(percent){
				cc.log("Lobby>>on_process>> " + percent);
				//self.view[KW_TEXT_VERSION].getComponent(cc.Label).string = "loading: " + percent * 100 + "%"
			};
	
			var on_finished = function(){
				cc.log("Lobby>>on_finished>> ");
				GameApp.Instance.enter_scene(LobbyScene);
			};
			GameApp.Instance.preload_scene(LobbyScene,on_process,on_finished)
		}
	},
	//注册
	on_event_user_regist(udata){
		if(udata.status == Respones.OK){
			this.init_UI()
		}else{
			this.view[KW_TEXT_NET_STATUS].getComponent(cc.Label).string = "账号或密码错误";
		}
	},
	//心跳
	on_event_heartbeat(udata){
		cc.log('loginUI: on_event_heartbeat')
		if(udata.status == 1){
			net_mgr.Instance.send_msg(Stype.Logic,Cmd.eHeartBeatReq,null)
		}
	},
	//
	on_event_net_connect(udata){
		this._connect_count = 0;
		this.view[KW_TEXT_NET_STATUS].getComponent(cc.Label).string = "连接成功...."
	},

	on_event_net_disconnect(udata){
		this._connect_count += 1; 
		this.view[KW_TEXT_NET_STATUS].getComponent(cc.Label).string = "连接失败: " + udata + " ," + this._connect_count
	},

	on_event_net_connecting(udata){
		this._connect_count += 1; 
		this.view[KW_TEXT_NET_STATUS].getComponent(cc.Label).string = "正在连接.... " + this._connect_count;
	},
//////////////////////////////// button事件
	//账号登录
	on_login_click_event(sender) {
		var uname = this.view[KW_INPUT_ACCOUNT].getComponent(cc.EditBox).string;
		var upwd = this.view[KW_INPUT_PWD].getComponent(cc.EditBox).string;
		cc.log("uname: " + uname + " ,upwd: " + upwd);
		if(uname.length < 6 || upwd.length < 6){
			this.view[KW_TEXT_NET_STATUS].getComponent(cc.Label).string = "账号或者密码错误，不能小于6位数"
			return
		}
		var msg = {
			uname:String(uname),
			upwd:String(upwd),
		}
		cc.sys.localStorage.setItem(LocalStorageName.user_login_msg, JSON.stringify(msg));
		cc.sys.localStorage.setItem(LocalStorageName.user_login_type, "uname");
		net_mgr.Instance.send_msg(Stype.Auth,Cmd.eUnameLoginReq,msg)
	},
	//注册
	on_regist_click_event(sender){
		var uname = this.view[KW_INPUT_ACCOUNT_REGIST].getComponent(cc.EditBox).string;
		var upwd = this.view[KW_INPUT_PWD_REGIST].getComponent(cc.EditBox).string;
		var upwdconf = this.view[KW_INPUT_PWD_COF].getComponent(cc.EditBox).string;
		if(upwd !== upwdconf || upwd.length < 6 || upwdconf.length < 6){
			this.view[KW_TEXT_NET_STATUS].getComponent(cc.Label).string = "账号或密码错误...";
			return;
		}
		cc.log("regist>> uname: " + uname + " ,upwd: " + upwd);
		var msg = {
			uname:String(uname),
			upwdmd5:String(upwd) ,
		}
		cc.sys.localStorage.setItem(LocalStorageName.user_login_msg, JSON.stringify(msg));
		net_mgr.Instance.send_msg(Stype.Auth,Cmd.eUserRegistReq,msg)
	},
	on_close_click_event(sender){
		this.view[KW_IMG_GUEST_LOGIN_BG].active = false;
	},
	//游客登录
	on_guest_login_click_event(sender){
		//Math.floor((Math.random()*100));  1-100 ,不包含100
		var keystr = cc.sys.localStorage.getItem(LocalStorageName.user_login_guest_msg)
		if (keystr == null){
			keystr = Math.floor(Math.random()*1000000) + "8JvrDstUNDuTNnnCKFEw" + Math.floor(Math.random()*1000000);
			cc.log("guest login reborn: " + keystr + " ,len: " + keystr.length)
			cc.sys.localStorage.setItem(LocalStorageName.user_login_guest_msg,keystr)
		}
		cc.log("guest login: " + keystr)
		if (keystr.length != 32){
			return
		}
		cc.sys.localStorage.setItem(LocalStorageName.user_login_type, "guest");
		net_mgr.Instance.send_msg(Stype.Auth,Cmd.eGuestLoginReq,{guestkey : String(keystr)})
	},
	//去注册
	on_gotoregist_click_event(sender){
		this.view[KW_IMG_GUEST_LOGIN_BG].active = true;
	},
///////////////////////////
	init_UI(){
		var loginType = cc.sys.localStorage.getItem(LocalStorageName.user_login_type);
		if (loginType == "uname"){
			var loginMsg = JSON.parse(cc.sys.localStorage.getItem(LocalStorageName.user_login_msg));
			this.view[KW_INPUT_ACCOUNT].getComponent(cc.EditBox).string = loginMsg.uname == null ? "" : loginMsg.uname;
			this.view[KW_INPUT_PWD].getComponent(cc.EditBox).string = loginMsg.upwd == null ? "" : loginMsg.upwd;
			cc.log("login type uname")
		}else if (loginType == "guest"){
			cc.log("login type guest")
		}
	},
///////////////////////////
	onDestroy(){
		cc.log("loginUI>>destory....")
		this.remove_event_listenner()
	},

	remove_event_listenner(){
		event_mgr.remove_event_listenner(cmd_name_map[Cmd.eUnameLoginRes],this,this.on_event_guest_login)
		event_mgr.remove_event_listenner(cmd_name_map[Cmd.eUnameLoginRes],this,this.on_event_uname_login)
		event_mgr.remove_event_listenner(cmd_name_map[Cmd.eHeartBeatRes],this,this.on_event_heartbeat)

		event_mgr.remove_event_listenner(event_name.net_connect,this,this.on_event_net_connect)
		event_mgr.remove_event_listenner(event_name.net_disconnect,this,this.on_event_net_disconnect)
		event_mgr.remove_event_listenner(event_name.net_connecting,this,this.on_event_net_connecting)
	},

});