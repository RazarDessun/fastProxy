var loggerData=require("../utils/formatInput");
//var url = require("url");
var logger = config.logger;

function urlStrReplace(u){
	u=u.replace(/?&/g ,"?");
	u=u.replace(/[&]+/g ,"&");
	u=u.replace(/[=]+/g ,"=");
	return u;
}


exports = module.exports = function loggerRequests(){
	return function loggerRequests(req, res, next) {
		/*
		var ssex=req.headers['ssex']||0;  
		if(req.body!="" && typeof(req.body) == 'object'){
			req.body.ssex=ssex;
		}
		else{
			req.url += (req.url.indexOf("?")>0 ?"&":"?") + "ssex="+ssex; 
		}  
		req.url=urlStrReplace(req.url);
		*/  
		//loggerRequests 
		if (req.body || req.url) {
			var logdata=new loggerData();
			var data=logdata.parseUrl(req.url).parseHeaders(req.headers).addBody(req.body).toString(); 
			logger.info('url_data:'+data);
			
			next();
		  
		} else {
		  next();
		}
	}
};
