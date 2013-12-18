 

//var general_handler= require('../handlers/general_handlers');//通用接口
var test_handler=require('../test/test_timeout');//测试接口
 

 

exports.route = function(app){
/*
   
   app.get('/general_Get', general_handler.get_method); 	//消息推送接口
   app.post('/general_Post', general_handler.post_method); 	//消息推送接口
   app.post('/general_Upload', general_handler.upload_method); 	//消息推送接口

   app.get('/gis_general_Get',   general_handler.get_method); 	//消息推送接口
   app.post('/gis_general_Post',   general_handler.post_method); 	//消息推送接口
*/
   app.get("/test",test_handler);

}

