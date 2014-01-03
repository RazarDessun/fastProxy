//var general_handler= require('../handlers/general_handlers');//通用接口
var test_handler=require('../test/test_timeout');//测试接口
var sysapi_handler=require('../handlers/sysapi_handlers');//测试接口 
var poi_handler=require('../handlers/poi_handlers'); //poi 
var ad_handler=require('../handlers/ad_handlers'); //广告和版本检查

exports.route = function(app){

    app.get('/poi_keyword', poi_handler.poi_keyword);           	//poi关键字查询服务
    app.get('/poi_list', poi_handler.poi_list); 	           		//搜素服务
    app.get('/poi_list_info', poi_handler.poi_list_info); 			//搜素详情服务
    app.get('/poi_detail', poi_handler.poi_detail);                 //poi详情服务
     
    app.get("/check",ad_handler.ad_check);                          //版本检查
	app.get("/ad_redirect",ad_handler.ad_redirect);                 //客户端广告跳转
    
	app.get("/test",test_handler.get_method);
	app.get("/status",sysapi_handler.sysStatus);
	app.get("/st",sysapi_handler.test);
	app.get("/test2",sysapi_handler.test2);
}

/*   
   app.get('/general_Get', general_handler.get_method); 	//消息推送接口
   app.post('/general_Post', general_handler.post_method); 	//消息推送接口
   app.post('/general_Upload', general_handler.upload_method); 	//消息推送接口

   app.get('/gis_general_Get',   general_handler.get_method); 	//消息推送接口
   app.post('/gis_general_Post',   general_handler.post_method); 	//消息推送接口
*/
