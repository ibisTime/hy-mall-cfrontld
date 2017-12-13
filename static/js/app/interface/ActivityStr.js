define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        //发布活动
        addActivity(config) {
            return Ajax.post("808700", {
            	userId: base.getUserId(),
            	updater: base.getUserId(),
                ...config	
            });
        },
        //修改活动
        editActivity(config) {
            return Ajax.post("808702", {
            	userId: base.getUserId(),
            	updater: base.getUserId(),
                ...config
            });
        },
        //删除活动
        deleteActivity(code) {
            return Ajax.post("808701", {
            	code
            },true);
        },
        // 分页查询活动
        getPageActivity(config, refresh) {
            return Ajax.get("808708", {
            	userId: base.getUserId(),
                ...config
            }, refresh);
        },
        // 查询活动详情
        getActivityDetail(code) {
            return Ajax.get("808706", {
            	code
            });
        },
        // 分页查询报名
        getPageOrder(config, refresh) {
            return Ajax.get("808737", {
            	leaderUser: base.getUserId(),
                ...config
            }, refresh);
        },
        
    };
})
