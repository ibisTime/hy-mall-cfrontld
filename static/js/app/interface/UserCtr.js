define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        /**
         * 注册
         * @param config {mobile, loginPwd, smsCaptcha, userReferee?}
         */
        register(config) {
            return Ajax.post("805045", {
                kind: "OL",
                idKind: '1',
                ...config
            });
        },
        /**
         * 登录
         * @param config {loginName, loginPwd}
         */
        login(config) {
            return Ajax.post("805050", {
                kind: "OL",
                ...config
            });
        },
        /**
         * 找回密码
         * @param config: {mobile, smsCaptcha, newLoginPwd}
         */
        findPwd: (config) => {
            return Ajax.post("805063", {
                loginPwdStrength: base.calculateSecurityLevel(config.newLoginPwd),
                kind: "OL",
                ...config
            });
        },
        /**
         * 修改密码
         * @param config: {newLoginPwd, oldLoginPwd}
         */
        changePwd: (config) => {
            return Ajax.post("805064", {
                userId: base.getUserId(),
                loginPwdStrength: base.calculateSecurityLevel(config.newLoginPwd),
                ...config
            });
        },
        // 获取用户详情
        getUser(refresh, userId) {
            return Ajax.get("805121", {
                "userId": userId || base.getUserId()
            }, refresh);
        },
        // 绑定手机号
        bindMobile(mobile, smsCaptcha) {
            return Ajax.post("805060", {
                mobile,
                smsCaptcha,
                isSendSms: '0',
                userId: base.getUserId()
            });
        },
        // 设置支付密码
        setTradePwd(tradePwd, smsCaptcha) {
            return Ajax.post('805066', {
                tradePwd,
                smsCaptcha,
                tradePwdStrength: base.calculateSecurityLevel(tradePwd),
                userId: base.getUserId()
            });
        },
        // 重置支付密码
        changeTradePwd(newTradePwd, smsCaptcha) {
            return Ajax.post("805067", {
                newTradePwd,
                smsCaptcha,
                userId: base.getUserId()
            });
        },
        // 修改手机号
        changeMobile(newMobile, smsCaptcha) {
            return Ajax.post("805061", {
                newMobile,
                smsCaptcha,
                userId: base.getUserId()
            });
        },
        // 修改头像
        changePhoto(photo) {
            return Ajax.post("805080", {
                photo,
                userId: base.getUserId()
            });
        },
        // 详情查询银行卡
        getBankCard(code) {
            return Ajax.get("802017", {code});
        },
        // 列表查询银行的数据字典
        getBankList(){
            return Ajax.get("802116");
        },
        // 新增或修改银行卡
        addOrEditBankCard(config) {
            return config.code ? this.editBankCard(config) : this.addBankCard(config);
        },
        // 修改银行卡
        editBankCard(config) {
            return Ajax.post("802012", {
                userId: base.getUserId(),
                ...config
            });
        },
        // 新增银行卡
        addBankCard(config) {
            return Ajax.post("802010", {
                userId: base.getUserId(),
                ...config
            });
        },
        // 列表查询银行卡
        getBankCardList(refresh) {
            return Ajax.get("802016", {
                userId: base.getUserId(),
                status: "1"
            }, refresh);
        },
        /**
         * 分页查询银行卡
         * @param config: {start, limit}
         */
        getPageBankCard(config, refresh) {
            return Ajax.get("802015", {
                userId: base.getUserId(),
                status: "1",
                ...config
            }, refresh);
        },
        //绑定c端用户
        bindCUser(mobile,smsCaptcha){
            return Ajax.get("805082", {
                userId: base.getUserId(),
                mobile,
                smsCaptcha,
            }, true);
        },
        // 获取用领队收益详情
        getMyIncome() {
            return Ajax.get("808072", {
                "userId": base.getUserId()
            }, true);
        },
    };
})
