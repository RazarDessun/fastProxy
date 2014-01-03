function StringBuilder(){
    this._strings_ = new Array;
}

StringBuilder.prototype.append = function(str){
    this._strings_.push(str);
};
StringBuilder.prototype.toString = function(){
    return this._strings_.join("");
};

exports.getStringBuilderEntity=function(){
	return new StringBuilder();
}
