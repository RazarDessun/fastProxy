var url=require('url');
var http = require('http');
http.globalAgent.maxSockets = 5120; 
 
function logsdata(){
	this.path="";
	this.query="";
	this.headers="";
	this.body="";
}

logsdata.prototype.parseUrl=function(urlOfReq){
	console.log(urlOfReq);
	var url_obj = url.parse(urlOfReq, true);
	this.query=encodeURI(url_obj.search);
	this.path=encodeURI(url_obj.pathname);
	return this;
}
logsdata.prototype.parseHeaders=function(headers){
	var nheaders={}
	for (var k in headers){ nheaders[k] =headers[k];} 
	this.headers=encodeURI(JSON.stringify(nheaders));
	return this;
}
logsdata.prototype.addBody=function(body){
	console.log(typeof(body),'typeof(body);',body);
	if(typeof(body)=='object'){
		body=encodeURI(JSON.stringify(body));
	}

	this.body=body||"";
	return this;
}
logsdata.prototype.toString=function(){
	
	return JSON.stringify({"path":this.path,"query":this.query,"headers":this.headers,"body":this.body});
}
/*
http.createServer(function(req, res) {
	var logdata=new logsdata();
	console.log(req);

	var bdata="";
	req.on("data",function(chunk){
		bdata+=chunk;
		});
	req.on("end",function(){
		console.log(bdata);
		var data=logdata.parseUrl(req.url).parseHeaders(req.headers).addBody(bdata).toString();
		console.log(data);
	});
	
	

	
	res.end();
}).listen(8124);
*/
var port=8124;
var express = require('express');
var app = express();
	app.get('/hello.txt', function(req, res){
	  res.send('Hello World');
	});
	app.post('/as?:id', function(req, res){
		//var data=logdata.parseUrl(req.url).parseHeaders(req.headers).addBody(req.body).toString();
	  
		var bdata="";
		req.on("data",function(chunk){
			bdata+=chunk;
			});
		req.on("end",function(){
			console.log(bdata);
			var data=new logsdata().parseUrl(req.url).parseHeaders(req.headers).addBody(bdata).toString();
			console.log(data);
		});
		res.send(data);
	});
	app.use(function(err, req, res, next){
	  // logic
	});
app.listen(port);
console.log('Listening on port '+port);
