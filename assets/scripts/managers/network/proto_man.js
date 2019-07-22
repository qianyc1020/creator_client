var proto_tools = require("proto_tools");
/* 规定:
(1)服务号 命令号 不能为0
(2)服务号与命令号大小不能超过2个字节的整数;
(3) buf协议里面2个字节来存放服务号(0开始的2个字节)，命令号(1开始的2个字节);
(4) 加密,解密, 
(5) 服务号命令号二进制中都用小尾存储
(6) 所有的文本，都使用utf8
*/
var log = {
	info: console.log,
	warn: console.log,
	error: console.log,
};

var proto_man = {
	PROTO_JSON: 1,  
	PROTO_BUF: 2,
	encode_cmd: encode_cmd,
	decode_cmd: decode_cmd,
};

// 加密
function encrypt_cmd(str_of_buf) {
	return str_of_buf;
}

// 解密
function decrypt_cmd(str_of_buf) {
	return str_of_buf;
}

function _json_encode(stype, ctype, body) {
	var str = JSON.stringify(body);
	var cmd_buf = proto_tools.encode_json_cmd(stype, ctype, str);
	return cmd_buf;
}

function _json_decode(cmd_buf) {
	var cmd = proto_tools.decode_json_cmd(cmd_buf, cmd_buf.byteLength);
	var cmd_json = cmd[2];
	
	if (cmd_json !== null) {
		try {
			cmd[2] = JSON.parse(cmd_json);
		}
		catch(e) {
			console.log(e);
			return null;
		}
	}
	
	
	if (!cmd || 
		typeof(cmd[0])=="undefined" ||
		typeof(cmd[1])=="undefined" ||
		typeof(cmd[2])=="undefined") {
		return null;
	}

	return cmd;
} 

// 参数1: 协议类型 json, buf协议;
// 参数2: 服务类型 
// 参数3: 命令号;
// 参数4: 发送的数据本地，js对象/js文本，...
// 返回是一段编码后的数据;
function encode_cmd(proto_type, stype, ctype, body) {
	var buf = null;
	var dataview;
	if (proto_type == proto_man.PROTO_JSON) {
		dataview = _json_encode(stype, ctype, body);
	}
	else { // buf协议
		return null;
	}

	buf = dataview.buffer;
	if (buf) {
		buf = encrypt_cmd(buf); // 加密	
	}
	
	return buf;
}

// 参数1: 协议类型
// 参数2: 接手到的数据命令
// 返回: {0: stype, 1, ctype, 2: body}
function decode_cmd(proto_type, str_or_buf) {
	str_or_buf = decrypt_cmd(str_or_buf); // 解密
	var cmd = null;
	
	var dataview = new DataView(str_or_buf);
	if (dataview.byteLength < proto_tools.header_size) {
		return null;
	}

	if (proto_type == proto_man.PROTO_JSON) {
		return _json_decode(dataview);
	}

	/*if (str_or_buf.length < 4) {
		return null;
	}*/

	
	return null;
}

module.exports = proto_man;