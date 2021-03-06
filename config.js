exports.config = {
	port : 8088, // 服务监听的端口号
	timeout : 20000, // 请求超时时间
	contentType : 'text/plain; charset=utf-8',// node给客户端响应内容的类型和字符编码

	logerPath:"/opt/node/logs/",
	tongjiLogerNames:["poiKeywordServer","poiListServer","poiListInfoServer","poiDetailServer","loginServer","rvsServer","mapServer","npsServer","rtsServer","queryServer","scenicServer","friendServer","edriverServer","shorturlServer","themeServer","themegisServer","mapDownload","userloginServer","registphoneServer","error","navidog2NewsServer","testServerPost","testServerGet"],
	loger4jsNames:["navidog4"],
	
	//node error日志对照表。// application/x-www-form-urlencoded  //resType "","body","json"
	poiKeywordServer: {
					//code 统计日志使用  desc 描述 reqMethod POST/GET
					"code":11,"desc":"关键字列表查询服务","resType":"json","reqType":"application/x-www-form-urlencoded","reqMethod":"POST",
					"headers":"mobileid,version,gender,escapes,uid","analysis":"gender:0","map":"",
				    "host":"nvdserver2.lbs8.com","port":80,"reqPath":"/QueryServer3.0/queryAjax_getSearchListTerm.htm",
				    "isjson":1,"gzip":0,"errormsg":""},
	poiListServer: {"code":1,"desc":"poi列表服务","resType":"json","reqType":"application/x-www-form-urlencoded","reqMethod":"POST",
				    "headers":"mobileid,version,gender","analysis":"","map":"",
				    "host":"nvdserver2.lbs8.com","port":80,"reqPath":"/QueryServer3.0/queryAjax_resList.htm",
				    "isjson":1,"gzip":0,"errormsg":""},
	poiListInfoServer: {"code":1,"desc":"poi列表信息服务","resType":"json","reqType":"application/x-www-form-urlencoded","reqMethod":"POST",
					"headers":"mobileid,version,gender","analysis":"","map":"",
				    "host":"nvdserver2.lbs8.com","port":80,"reqPath":"/QueryServer3.0/queryAjax_searchCommonList.htm",
				    "isjson":1,"gzip":0,"errormsg":""},
	poiDetailServer: {"code":1,"desc":"poi详情","resType":"","reqType":"application/x-www-form-urlencoded","reqMethod":"POST","headers":"mobileid,version,gender","analysis":"",
				    "host":"nvdserver2.lbs8.com","port":80,"reqPath":"/QueryServer3.0/queryAjax_single.htm",
				    "isjson":1,"gzip":0,"errormsg":""},
	loginServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET",
				    "headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,  "reqPath":"",
				    "isjson":1,"gzip":1,"errormsg":""},
	ad_redirect: {"code":115,"desc":"广告跳转","resType":"","reqType":"text/plain; charset=utf-8","reqMethod":"GET",
				    "headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,"reqPath":"/navidog2Advert/4xhoutai/response4xClient_linkPicUrl.htm",
				    "isjson":0,"gzip":0,"errormsg":""}, 
	ad_check: {"code":91,"desc":"版本检查","resType":"","reqType":"text/plain; charset=utf-8","reqMethod":"GET",
				    "headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,"reqPath":"/navidog2Advert/4xhoutai/response4xClient_sendResponse.htm",
				    "isjson":1,"gzip":0,"errormsg":"%7B%22resultcode%22%3A0%2C%22msg%22%3A%5B%22%E7%89%88%E6%9C%AC%E6%9B%B4%E6%96%B0%E8%AF%B7%E6%B1%82%E5%BC%82%E5%B8%B8%22%5D%7D"
				}, 			    
				    
	rvsServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,"reqPath":"",
				    "isjson":1,"gzip":1,"errormsg":""},
	mapServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,
				    "reqPath":"","isjson":1,"gzip":1},
	npsServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,
				    "reqPath":"","isjson":1,"gzip":1},
	rtsServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,
				    "reqPath":"","isjson":1,"gzip":1},
	queryServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,
				    "reqPath":"","isjson":1,"gzip":1},
	scenicServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,"reqPath":"",
				    "isjson":1,"gzip":1},
	friendServer: {"code":81,"desc":"位置分享","resType":"","reqType":"",	"reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80, "reqPath":"/navidog2Application/navidog4x/locationShareNavidog4x_location_share.htm",
				   "isjson":1,"gzip":1},
	edriverServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,
				    "reqPath":"","isjson":1,"gzip":1},
	shorturlServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,
				    "reqPath":"","isjson":1,"gzip":1},
	themeServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,
				    "reqPath":"","isjson":1,"gzip":1},
	themegisServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,
				    "reqPath":"","isjson":1,"gzip":1},
	mapDownload: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,
				    "reqPath":"","isjson":1,"gzip":1},
	userloginServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,
				    "reqPath":"","isjson":1,"gzip":1},
	registphoneServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,
				    "reqPath":"","isjson":1,"gzip":1},
	error: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"",
						"headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,
				    "isjson":1,"gzip":1},
	navidog2NewsServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"nvdserver.lbs8.com","port":80,
				    "reqPath":"","isjson":1,"gzip":1},
	testServerPost: {"code":171,"desc":"测试1","resType":"","reqType":"","reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"192.168.1.124","port":8001,"reqPath":"?t=0&lev=1&size=1&lon1=419218383&lat1=143672800&gzip=0",
				    "reqPath":"","isjson":0,"gzip":0},
	testServerGet: {"code":181,"desc":"测试2","resType":"测试get","reqType":"","reqMethod":"GET",
					"headers":"","analysis":"","map":"",
				    "host":"192.168.1.124","port":8001,"reqPath":"/queryGisCode?t=1&lev=1&gzip=0","isjson":0,"gzip":0},
	
	headerkey : 'Service-Provider',
	headerval : 'tiros.com.cn',

	/* 地图相关服务配置信息（使用nvdserver2.lbs8.com） */
	poi_host : 'nvdserver2.lbs8.com', // poi服务host
	poi_port : 80,
	keyword_path : '/QueryServer3.0/queryAjax_getSearchListTerm.htm',
	list_path : '/QueryServer3.0/queryAjax_resList.htm',
	baseinfo_path : '/QueryServer3.0/queryAjax_single.htm',

	/*poi详情 地图相关服务配置信息（使用nvdserver2.lbs8.com） */
	poi_info_host : 'nvdserver2.lbs8.com', // poi服务host
	poi_info_port : 80,
	list_info_path:'/QueryServer3.0/queryAjax_searchCommonList.htm',

	
	map_host : 'nvdserver2.lbs8.com', // 地图服务
	map_port : 80,
	map_path : '/MTServer5.0/mts',

	nps_host : 'nvdserver2.lbs8.com', // 定位服务
	nps_port : 80,
	nps_path : '/NPS2.0/nps',

	query_host : 'nvdserver2.lbs8.com', // 大头针
	query_port : 80,
	query_path : '/QueryServer2.0/qs',

	rts_host : 'nvdserver2.lbs8.com', // 实时交通服务
	rts_port : 80,
	rts_path : '/RTEIServer2.0/rts',

	rvs_host : 'nvdserver2.lbs8.com', // 导航服务
	rvs_port : 80,
	rvs_path : '/RVServer4.0/rvs',

	themegis_host : 'nvdserver2.lbs8.com',// 请求GIS主题数据
	themegis_port : 80,
	themegis_path : '/RT-Activity/activityServlet',

	map_download_host : 'bugfree.lbs8.com',// 离线地图下载
	map_download_port : 9000,
	map_download_path : '/CityMapServer/cms',
	
	pti_host : 'nvdserver2.lbs8.com', // 公交换乘配置
	pti_port : 80,
	pti_path : '/PTIServer4.0/ptis',

	/* 后台服务相关配置（使用nvdserver.lbs8.com） */
	update_host : 'nvdserver.lbs8.com', // 版本检查服务地址
	update_port : 80, // 版本检查服务端口
	update_path : '/navidog2Update/Upgrade', // 版本检查服务录建

	token_host : 'nvdserver.lbs8.com', // 消息推送服务地址
	token_port : 80, // 消息推送服务端口
	token_path : '/navidog2News/token.htm', // 消息推送服务录建
	
	friend_host : 'nvdserver.lbs8.com',// 位置分享
	friend_port : 80,
	friend_path : '/navidog2Application/navidog4x/locationShareNavidog4x_location_share.htm',

	scenic_host : 'bugfree.lbs8.com',// 门票系统
	scenic_port : 80,
	scenic_path : '/navidog2Goods/scenery.htm',// 门票系统景区部分
	scenic_order_path : '/navidog2Goods/order.htm',// 门票系统订单部分

	ad_host : 'nvdserver.lbs8.com', // 广告信息服务
	ad_port : 80,
	ad_path : '/navidog2Advert/4xhoutai/response4xClient_sendResponse.htm',
	ad_map_path : '/navidog2Advert/4xhoutai/response4xClient_linkPicUrl.htm',

	edriver_host : 'nvdserver.lbs8.com',// e代驾服务
	edriver_port : 80,
	edriver_path : '/navidogWebPage/navidog4xeDaij.htm',

	shorturl_host : 'nvdserver.lbs8.com',// 短网址服务
	shorturl_port : 80,
	shorturl_path : '/navidog2Application/navidog4x/navidog4xQuery_queryLongUrl.htm',

	theme_host : 'nvdserver.lbs8.com',// 主题类别
	theme_port : 80,
	theme_path : '/navidog2Theme/sortquery.htm',
	theme_blend_path : '/navidog2Theme/marksortquery.htm',

	user_login_host : 'nvdserver.lbs8.com',// 登录
	user_login_port : 80,
	user_login_path : '/loginserver/Login4x',
	
	aid_host : 'nvdserver.lbs8.com',// 未登录
	aid_port : 80,
	aid_path : '/loginserver/NoLogin4x',

	user_regist_phone_host : 'nvdserver.lbs8.com',// 手机号注册
	user_regist_phone_port : 80,
	user_regist_phone_path : '/Tirosdatabase/Regist4xServlet',

	/* 后台服务相关配置（通用接口nvdserver1.lbs8.com） */
	general_host : '192.168.1.111',
	general_port : 8086,
	
	/* gis服务相关配置（通用接口nvdserver2.lbs8.com） */
	gis_general_host : 'nvdserver2.lbs8.com',
	gis_general_port : 80,

	
	poidetail_cycle : 60 * 2, // poi 详情保存周期2分钟
	map_cycle : 60 * 60 * 24 * 7, // poi 地图数据缓存周期一周
	map_key : 'map', // redis中保存的地图key的起始字符
	new_map_key : 'map01', // redis 地图数据更新是使用的新key的起始字符
	redisHost : 'redis.navidog.tv', // redis数据库IP
	redisPort : '6379', // redis端口
	redis_options : {
		detect_buffers : true,
		connect_timeout : 30
	}
// redis链接超时时间
};
