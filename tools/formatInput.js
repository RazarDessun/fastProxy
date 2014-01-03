var url=require('url');
//var logdata=new logsdata();
//var data=logdata.parseUrl(req.url).parseHeaders(req.headers).addBody(req.body).toString(); 
 
var logsdata= function(){
	this.path="";
	this.query="";
	this.headers="";
	this.body="";
	this.method="GET";
}

logsdata.prototype.parseUrl=function(urlOfReq){
	//console.log(urlOfReq);
	var url_obj = url.parse(urlOfReq, true);
	this.query=encodeURI(url_obj.search);
	this.path=encodeURI(url_obj.pathname);
	return this;
}
logsdata.prototype.parseHeaders=function(headers){
	var nheaders={};
	for (var k in headers){ nheaders[k] =headers[k];} 
	this.headers=encodeURI(JSON.stringify(nheaders));
	return this;
}
logsdata.prototype.addBody=function(body){
	if(typeof(body)=='object'){
		body=encodeURI(JSON.stringify(body));
	}
	//console.log(typeof(body),'typeof(body);',body);
	this.body=body||"";
	return this;
}

logsdata.prototype.addMechod=function(method){
	this.method=method || "GET";
	return this;
}

logsdata.prototype.toString=function(){
	return JSON.stringify({"path":this.path,"query":this.query,"headers":this.headers,"body":this.body});
}

exports = module.exports =logsdata;
