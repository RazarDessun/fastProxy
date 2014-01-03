/**
 * 通用数据库链接池模块
 * author:linbx
 * date:2012-06-10
 * 
 */
var poolModule = require('generic-pool');
var redis = require("redis");
//user Global config
//var config = require('../config').config;

//redis数据库连接池
var paramObj={name: 'redis',
		    create: function(callback){
					var client = redis.createClient(config.redisPort, config.redisHost, config.redis_options);
					setTimeout(function(){
						if(client.connected){
							callback(null,client);
						}else{
							callback(new Error('redis 创建链接失败'),null);
						}
					},config.redis_options.connect_timeout);
		    },
		    destroy: function(client) {
		      return client.quit();
		    },
		    max: 100,						//最大链接数
		    idleTimeoutMillis: 120000,  		//空闲超时时间
		    reapIntervalMillis: 2000,  		//检查空闲链接的频率 秒
		    log: false
		}

var redis_pool = poolModule.Pool(paramObj);

module.exports.redis_pool = redis_pool;

