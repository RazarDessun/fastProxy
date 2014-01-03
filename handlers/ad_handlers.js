/*
 * 广告模块
 * written by sundl
 * 2013-12-26
 */
 
  
var proxyAgent=require("../tools/ProxyAgent"); //加载代理模块

/**
 * 广告跳转服务
 * test /redirect
 * @param req
 * @param res
 */ 
exports.ad_redirect=function(req,res){
	var proxy=new proxyAgent.ProxyAgent();
	proxy.getReqConfig("ad_redirect");
	proxy.doRequest(req,res);
    proxy.on("onDone",proxy.onDone);
    
};

/**
 * 版本检查服务
 * test /check?lon=419274697&lat=143731351
 * @param req
 * @param res
 */ 
exports.ad_check=function(req,res){
	var proxy=new proxyAgent.ProxyAgent();
	proxy.getReqConfig("ad_check");
	proxy.doRequest(req,res);
    proxy.on("onDone",proxy.onDone);
};
