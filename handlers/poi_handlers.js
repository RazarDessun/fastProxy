var proxyAgent=require("../tools/ProxyAgent");

exports.poi_keyword=function(req,res){
	var proxy=new proxyAgent.ProxyAgent();
	proxy.getReqConfig("poiKeywordServer");
	proxy.ezRequest(req,res);
    proxy.on("onDone",proxy.onDone);
};
exports.poi_list=function(req,res){
	var proxy=new proxyAgent.ProxyAgent();
	proxy.getReqConfig("poiListServer");
	proxy.ezRequest(req,res);
    proxy.on("onDone",proxy.onDone);
};
exports.poi_list_info=function(req,res){
	var proxy=new proxyAgent.ProxyAgent();
	proxy.getReqConfig("poiListInfoServer");
	var opts=proxy.getRequest(req,res);
    proxy.on("onDone",proxy.onDone);
};
exports.poi_detail=function(req,res){
	var proxy=new proxyAgent.ProxyAgent();
	proxy.getReqConfig("poiDetailServer");
	var opts=proxy.getRequest(req,res);
	
	var jobs=function(first,last){
		//merge jobs return
	}
	
	var eAgent = new EventProxy();
	eAgent.assign("first", "last", jobs);
	proxy.setobj("eAgent",eAgent);
	
	eAgent.trigger("first", template);
	eAgent.trigger("last", resources);


	proxy.doRequest(opts);
    proxy.on("onDone",proxy.onDones);
};


