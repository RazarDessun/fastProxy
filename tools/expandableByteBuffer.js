	// buffer 组装工具类构造函数
	function expandeBuffer(size){
		 this.buffer = new Buffer(size);
		 this.expansion_factor=2;
		 this.currentPos = 0;
	}
	/*添加在构造函数原型链上的方法*/
	
	//扩展buffer
	expandeBuffer.prototype.expandBuffer=function(){
		var len = this.buffer.length;
	 	var tempBuffer = new Buffer(len * this.expansion_factor);
		for (j=0; j < len; j++) {
			tempBuffer[j] = this.buffer[j];
		}
		this.buffer=tempBuffer;
	 }
	
	//向buffer中添加一个字节
	expandeBuffer.prototype.appandByte=function(data){
			var pos = this.currentPos;
			if(!(pos<this.buffer.length)){
				this.expandBuffer()
			}
			this.buffer[pos] = data;
			this.currentPos++;
	}
	
	 
	//向buffer中添加两个字节
	 expandeBuffer.prototype.append2=function(data){
	 	var ebf =this;
		ebf.appandByte( data & 255 ); 			//	  00000000 11111111
		ebf.appandByte( data >>> 8 & 255 );
	}



	//向buffer中添加四个字节
	expandeBuffer.prototype.append4=function(data){
		var ebf =this;
		ebf.appandByte( data & 255 );				//取int数值的低八位放入字节数组
		ebf.appandByte(data >>> 8 & 255);
		ebf.appandByte(data >>> 16 & 255);
		ebf.appandByte(data >>> 24 & 255);			
	}
	
	
	//向buffer中添加若干个字节，一般用来存放字符串。
	expandeBuffer.prototype.append=function(data){
		while(data.length+this.currentPos>this.buffer.length){
			this.expandBuffer()
		}		
		data.copy(this.buffer,this.currentPos,0,data.length);
		this.currentPos+=data.length;
	}
	
	//删除buffer中未被使用的空间。
	expandeBuffer.prototype.trim=function(){
		var newbuf =this.buffer.slice(0,this.currentPos);
		this.buffer= null; 
		return newbuf;
	};

	// 本模块对外提供调用方法。size 指定初始化的时候buffer的大小。
	exports.createBuffer = function(size){
		return new expandeBuffer(size);
	}






