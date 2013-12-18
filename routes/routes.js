
var login_Handlers = require('../handlers/login_redis_handlers');
var ptiServer_handlers = require('../handlers/ptiServer_handlers');
//var login_Handlers = require('../handlers/login_handlers');
var poi_handlers = require('../handlers/poi_handlers');
var npslocation_Handlers = require('../handlers/nps_location_handlers');
var rvs_Handlers = require('../handlers/rvs_rvServer_handlers');
var mapPin_handlers = require('../handlers/mapPin_handlers.js');
var test_Handlers = require('../handlers/versionTest');
var httptest = require('../handlers/httptest');
//使用global config
//var config = require('../config').config;
var rts_Handlers = require('../handlers/rtsServer_handlers');
var scenic_Handlers= require('../handlers/scenic_handlers');
var friendshare_Handlers= require('../handlers/friendshare_handlers');
var zgip = require('../test/zgipTest');
var agentwatch_Handlers = require('../handlers/agent_handlers');
var pjtest = require('../test/pjtest');
var keysTest = require('../test/keysTest');
var rtsTest = require('../test/rtsTest');
var range_handlers = require('../test/range_handles');
var poi_ticket_redis_handlers = require('../test/poi_ticket_redis_handlers');
var help_handlers = require('../handlers/help_handlers');

var poi_redis_handlers = require('../handlers/poi_redis_handlers');
var map_redis_handlers = require('../handlers/map_redis_handlers');
var map_noredis_handlers = require('../handlers/map_noredis_handlers');

var cache_handlers=require('../handlers/createCache_handlers');
var readcache_handlers=require('../handlers/readFile_cache_handlers');
var edriver_Handlers= require('../handlers/edriver_handlers');
var shorturl_Handlers= require('../handlers/shorturl_handlers');

var theme_Handlers= require('../handlers/theme_handlers');	//主题类别服务
var themeGistest = require('../test/themeGistest');//主题服务统计测试
var map_download_handlers=require('../handlers/map_download_handlers'); //地图离线下载请求

var navidog2News_handlers = require('../handlers/navidog2News_handlers');
var user_login= require('../handlers/user_login');//用户登录
var user_regist_phone= require('../handlers/user_regist_phone');//手机号注册

var general_handler= require('../handlers/general_handlers');//通用接口
var gis_general_handler= require('../handlers/gis_general_handlers');//gis通用接口
var roistar_general_handler= require('../handlers/roistar_general_handlers');//楼兰通用接口

var test_redirect= require('../handlers/redirect_handlers');//gis通用接口

 

exports.route = function(app){
    app.get('/poi_keyword', poi_handlers.poi_keywordlist); 	//poi关键字查询服务
    app.get('/poi_list', poi_handlers.poi_list); 			//搜素服务
    app.get('/poi_list_info', poi_handlers.poi_list_info); 			//搜素详情服务
    app.get('/poi_detail', poi_handlers.poi_detail_ticket); //poi详情服务
	app.get('/login', login_Handlers.login);
    app.get('/ad_redirect', login_Handlers.ad_redirect); 					//客户端广告跳转
    app.post('/lbs_rvs', rvs_Handlers.rvs_rvServerPost);	//导航服务
    app.get('/map_pin', mapPin_handlers.query); 			//地	图点选服务
    
    app.post('/nps_location', npslocation_Handlers.npslocation); //基站定位
	app.post('/map', map_redis_handlers.map); 			//地图服务,加入redis缓存,更新
	//app.post('/map', map_noredis_handlers.map); 		//地图服务,没有redis缓存,更新
 	app.get('/map_get', map_redis_handlers.map_get); 	//地图服务,给客户端提供get方式请求
 	app.get('/flushdb', map_redis_handlers.flushdb); 	//地图服务,清空redis数据库
    app.post('/lbs_rts', rts_Handlers.rts); 			//实时交通服务
    // app.post('/rvs/rvServerPost', rvs_Handlers.rvs_rvServerPost);
    app.get('/friendshare', friendshare_Handlers.friend_share); //位置分享服务
    
	app.get('/scenic', scenic_Handlers.scenic); 			//scenic门票系统景区部分
    app.get('/order_detail', scenic_Handlers.order_detail); //scenic门票系统订单详情服务
    app.post('/order_submit', scenic_Handlers.order_submit); //scenic门票系统订单提交服务
    app.get('/check', login_Handlers.check);				//版本检测服务
    //app.get('/Version', test_Handlers.ver);
    //app.get('/poi_detail_ticket', poi_handlers.poi_detail_ticket); //搜素服务
 
    app.get('/check', login_Handlers.check);
 
    app.get('/edriver', edriver_Handlers.edriver); 			// e代驾服务
    app.get('/shorturl', shorturl_Handlers.shorturl); 			// 短网址服务

    app.get('/theme_allSort', theme_Handlers.theme_allSort); 	//主题类别
    app.get('/theme_blendSort', theme_Handlers.theme_blendSort); 	//融合点主题类别
    app.post('/themeData', theme_Handlers.themeData); 	//GIS主题数据

    app.post('/map_download', map_download_handlers.map_download); 	//地图离线下载服务
    
    app.get('/user_login', user_login.user_login); //用户登录
    app.get('/user_regist_phone', user_regist_phone.user_regist_phone); //手机号注册
    
	 app.get('/cache', cache_handlers.createCache);
	 app.get('/readcache', readcache_handlers.read);
	 app.get('/baidu', function pay(request, response){
		 response.redirect("http://www.baidu.com/");
	 }); 
	 
	 app.get('/test_redirect',test_redirect.test_redirect);
	//test
    app.get('/rts', rtsTest.rts);
    app.get('/range', range_handlers.upload);
    
    //主题统计测试
    app.get('/tongjiGis', themeGistest.tongjiGis);
    
	// app.post('/testPost', httptest.testPost);
//    app.get('/testmap', httptest.testmap);
    app.get('/first', httptest.first);
//	 app.get('/redis', httptest.redis);
    app.get('/agent', agentwatch_Handlers.anget_watch_nvd);
    app.get('/agent_generalServer', agentwatch_Handlers.anget_watch_general);
    app.get('/agent_gisServer', agentwatch_Handlers.anget_watch_gis);
   app.get('/navidog2Goods/order.htm', scenic_Handlers.pay); 					//客户端进行支付
   app.get('/nodeweb/help/*', help_handlers.help);
   
   
   
   app.get('/test', httptest.test); 			
   
   app.get('/msgpush', navidog2News_handlers.token); 	//消息推送接口
   app.post('/msgpushPost', navidog2News_handlers.tokenPost); 	//消息推送接口
   
   app.get('/general_Get', general_handler.get_method); 	//消息推送接口
   app.post('/general_Post', general_handler.post_method); 	//消息推送接口
   app.post('/general_Upload', general_handler.upload_method); 	//消息推送接口

   app.get('/gis_general_Get',   gis_general_handler.get_method); 	//消息推送接口
   app.post('/gis_general_Post',   gis_general_handler.post_method); 	//消息推送接口
   
   app.get('/roistar_general_Get',   roistar_general_handler.get_method); 	//楼兰通用接口
   app.post('/roistar_general_Post',   roistar_general_handler.post_method); 	//楼兰通用接口
   app.post('/roistar_general_Upload', roistar_general_handler.upload_method); 	//楼兰通用接口
   
   app.post('/pti_ServerPost', ptiServer_handlers.pti_ServerPost); 	//公交换乘接口
}

