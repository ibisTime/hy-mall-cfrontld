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
        // 获取活动报名人数
        getActJoinIn(code) {
            return Ajax.get("808709", {code});
        },
        // 获取订单详情
        getOrderDetail(code) {
            return Ajax.get("808736", {code});
        },
        // 成团
        successGroup(code) {
            return Ajax.get("808715", {code});
        },
        // 发布活动
        upActivity(code) {
            return Ajax.get("808703", {code});
        },
        // 取消活动
        cancelActivity(config) {
            return Ajax.get("808724", {
            	updater: base.getUserId(),
            	...config
            });
        },
    };
})
