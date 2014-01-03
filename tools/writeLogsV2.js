var stringBuilder = require('./SBuffer');
//user Global config
//var config = require('../config').config;


/**
 * 日志记录通用组件
 * @param {Object} name
 * @param {Object} sername
 * @param {Object} arr
 * @author sundl 
 * @describe 原版本未处理特殊 字符和对象  
 * 过滤规则 
 * 1 如果不含数据对象或者数据为空  不记录
 * 2 如果key 为空， 或者key 未定义 ，或者 key包含 非法字符 替换非法字符后 如果为空不记录 
 * 3 如果key 为Version 或osversion 值存储为字符类型
 * 4 如果key值为number 类型且key 不为 version 或 osversion，存储时不加引号
 * 5 key值 为 object /function /undefined 时处理为空   存储时 默认替换非法字符
 * 6 boolean 返回 字符 ”sucess“ ”false“
 * 7 
 */
exports.logs= function(name,sername,arr){
	//console.log(arr,typeof(arr),arr.length,"debug logs");
	//未定义
	if(typeof(arr)=="undefined" || typeof(arr)=="string"  ) 
		return false;

	var sb = new stringBuilder();

	for(var p in arr){
        //key值处理 
		p=stripscript(p);
		if(p.length>0){
			//value 值未定义处理
			 if(typeof(arr[p])=='undefined' || typeof(arr[p])=='function' || typeof(arr[p])=='object' )
			 arr[p] ="";
			 
			 if(typeof(arr[p])=='boolean')
			 arr[p] =(arr[p]==true)?"success":"false";
			 
			 //if(sername==('error')){ 
			 //		arr[p]=stripscript(arr[p]);
			 //}
			
			 //由于p值会变化 保存清理后的arr[p] 
			 if (typeof(arr[p])=="string"){
				var arrp_value=stripscript(arr[p]);
			 }
			 else{
				var  arrp_value=arr[p];
			 }
 			 if(typeof(arrp_value)=='string' ){
				if(p == 'osversion' || p == 'version' || !hasErrorCode(arrp_value) ){
					sb.append(","+p+"='" + arrp_value+"'");
				}else{
					sb.append(","+p+"=''" );
				}
				 
			 }else{
				if( !hasErrorCode(arrp_value) && p != 'osversion' && p != 'version' ){
					sb.append(","+p+"=" + arrp_value);
				}
				else if(p == 'osversion' || p == 'version'){
					sb.append(","+p+"='" + arrp_value+"'");
				}
				else{
					sb.append(","+p+"=''" );
				}
			}
			
			if(p=="osversion") {
				 console.log(p,arrp_value,sb);
			}   
		 }
	}
 
	var msgdataStr = sb.toString();
 
	if(msgdataStr.length>0){
		name.info({
			serverName: sername,
			msg: msgdataStr
		});
	}
}



/**
 * 过滤统计日志
 * @param {Object} request
 * @param {Object} response
 */
function stripscript(s) {
	var pattern = new RegExp("[`~!@#$^&*()=|{}';',\\[\\]<>/?~！@#￥……&*（）|{}【】‘；：”“'。，、\"？]");
	var rs = "";
	for (var i = 0; i < s.length; i++) { 
		rs = rs+s.substr(i, 1).replace(pattern, ''); 
	}
	rs=rs.replace(/\\/g,"");
	rs=rs.replace(/\n/g,"");
	rs=rs.replace(/\r/g,"");
	return rs;
}

/**
* 过滤osversion中的乱码
*/
function hasErrorCode(str){
	
	var pattern = new RegExp("[^A-Za-z0-9\\.\\s-_]+");
	try{
		return pattern.test(str);
	}
	catch(e){
		return true;
	}
}
