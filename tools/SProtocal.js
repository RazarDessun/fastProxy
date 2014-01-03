var url=require("url");

var protocal={};

protocal.error={"status":0,"msg":"error","data":""};
   
protocal.getParam=function(requestUrl){
    return url.parse(requestUrl, true).query;  
}
protocal.getPath=function(requestUrl){
    return url.parse(requestUrl).pathname;
}
protocal.getQuery=function(requestUrl){
    return  url.parse(requestUrl).query;  
}
protocal.headerStatus=function(code){
	return function(res){
		if(code==200){
				res.writeHead(200, {'Content-Type' : 'text/plain','charset' : 'utf-8'});
			}
   			 else{
				res.writeHead(code);
			}
		}
}
protocal.getHeaders=function(reqheaders){
	  var headers = {};

	  for(var x in reqheaders){
		headers[x] = reqheaders[x];
	  }
	 return headers;
}   

module.exports=protocal;
