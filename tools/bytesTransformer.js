
//buffer解析工具类构造函数
function BytesTransformer(){
	
}

BytesTransformer.prototype.transform=function(bytes,start,end){
		var ti = 0;
		for (var i = (end - 1); i >= start; i--) {
			ti <<= 8;
			ti |= bytes[i] & 0xff;
		}
		return ti;
}
//读取两个字节构成数值
BytesTransformer.prototype.get2byte=function(buffer,starttag){
	return this.transform(buffer,starttag,starttag+2);
}
//读取四个字节构成数值
BytesTransformer.prototype.get4byte=function(buffer,starttag){
	return this.transform(buffer,starttag,starttag+4);
}
//读取八个字节构成数值
BytesTransformer.prototype.get8byte=function(buffer,starttag){
	return this.transform(buffer,starttag,starttag+8);
}
//获取指定长度的字节
BytesTransformer.prototype.getBytes=function(buffer,starttag,endtag){
	var slicebuffer=buffer.slice(starttag,endtag);
	return slicebuffer;
}


//读取若干个字节构成字符串
BytesTransformer.prototype.getString=function(buffer,starttag,strlength){
	var slicebuffer=buffer.slice(starttag,starttag+strlength);
	var ss = slicebuffer.toString('utf8',0,slicebuffer.length);
	slicebuffer=null;
	return ss;
}


exports.createTransFormer=function(){
	return new BytesTransformer();
}
