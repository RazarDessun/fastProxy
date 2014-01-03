var proxyAgent=require("../tools/ProxyAgent");

var sbuffer=require("../tools/SBuffer");
var os  = require('os');
var EventProxy =require("eventproxy");

exports.sysStatus=function(req,res){
	var proxy=new proxyAgent.ProxyAgent();
	proxy.getReqConfig("friendServer");
	proxy.doRequest(req,res);
    proxy.on("onDone",proxy.onDone);
};
exports.test=function(req,res){
	res.setHeader("Content-Type",Config.contentType);
	res.statusCode=200;
	var data=process.memoryUsage();
	var st=new sbuffer();
	st.append("常驻内存:"+sizecount(data.rss));
	st.append("使用内存:"+sizecount(data.heapUsed));
	st.append("占用内存:"+sizecount(data.heapTotal));
	
	st.append("主机名称:"+os.hostname()+"\n");
	st.append("系统类型:"+ os.type()+"\n");
	st.append("系统版本:"+ os.release()+"\n");
	st.append("系统uptime:"+ os.uptime()+"\n");
	st.append("系统负载:"+ os.loadavg()+"\n");
	st.append("总内存:"+ os.totalmem()+"\n");
	st.append("空闲内存:"+ os.freemem()+"\n");
	st.append("cpu数量:"+ os.cpus().length+"\n"); 
	var np=require('http').globalAgent;
    st.append("最大连接数:"+ np.maxSockets+"\n"); 
	//st.append("当前连接数:"+ np.sockets.length+"\n"); 
	//st.append("队列连接数:"+ np.queue.length+"\n"); 
	
	var buffer=st.toBuffer();
	res.setHeader("Content-Length", buffer.length);
	res.end(buffer);
};

exports.test2=function(req,res){
	var proxy=new proxyAgent.ProxyAgent();
	proxy.getReqConfig("testServerGet");
	var opts=proxy.getRequest(req,res);
	
	var opts1,opts2;
	console.log(opts,opts[1],"xxxx__"+opts[1].length);
	opts1=proxy.buildReqOptions(opts,Config.testServerGet);
	opts2=proxy.buildReqOptions(opts,Config.testServerPost);
	
	var jobs=function(first,last){
		//merge jobs return
		console.log(first,last);
		proxy.response.statusCode=first[1];
		var buffer=new sbuffer();
		
		buffer.append(first[0]).append(last[0]);
		proxy.response.end(buffer.toBuffer());
	}
	proxy.on("onDone",proxy.onDones);
	
	var eAgent = new EventProxy();
	eAgent.assign("first", "last", jobs);
	proxy.setobj("eAgent",eAgent);
	
	proxy.doRequest(opts1,"first");
	proxy.doRequest(opts2,"last");
	
   
};


 
function sizecount(filesize) {
	if (filesize >= 1073741824) {
		filesize = Math.round(filesize/1073741824*100)/100 +' GB';
	} else if (filesize >= 1048576) {
		filesize = Math.round(filesize/1048576*100)/100 +' MB';
	} else if(filesize >= 1024) {
		filesize = Math.round(filesize/1024*100)/100 + ' KB';
	} else {
		filesize = filesize+' Bytes';
	}
	return filesize+"\n";
}
