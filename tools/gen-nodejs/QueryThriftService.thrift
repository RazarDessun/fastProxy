namespace java cn.com.tiros.thrift.util

/**
查询的Service
*/
service QueryThriftService
{
	/*
		查询分类列表
		参数列表
		1:cateid,如果为空查询所有的一级分类,如果不为空查询相应的子分类
		返回列表,名字,值
	*/
	string findCateCondListService(1:string params);
		
	/*
	查询列表
	参数列表
	搜索参数
	keyword:关键词
	cateid:分类,从分类列表中获取
	long:经度
	lat:纬度
	ra:半径
	areacode:在城市列表中查看某个城市的记录
	分页参数
	st:开始记录数
	ed:结束记录数
	日志参数
	selflon:自我定位经度
	selflat:自我定位纬度
	mobileid:mobieid
	uid:犬号
	catefilever:资源版本号
	version:version
	bpointlist:是否跳转地图，0跳转、1不跳转
	
	以上五个条件可传也不传,周边搜索的话,需要传半径和经纬度
	*/
	string findCondListService(1:string params);
	
	/*
	查询单个POI
	poigid:poigid
	selflon:自我定位经度
	selflat:自我定位纬度
	mobileid:mobieid
	uid:犬号
	catefilever:资源版本号
	version:version
	*/
	string findOnePoi2Service(1:string params);
	
	/*
	keyword: 查询关键字
	*/
	string findKeywordListService(1:string params);
}