define([
    'app/controller/base',
    'app/module/validate',
	'app/interface/GeneralCtr',
    'app/interface/UserCtr',
], function(base, Validate, GeneralCtr, UserCtr) {
    var timer;

    init();

    function init(){
    	addListener();
    }

    function addListener(){
        var _formWrapper = $("#formWrapper");
        _formWrapper.validate({
            'rules': {
                loginName: {
                    required: true,
                    mobile: true
                },
                loginPwd: {
                    required: true,
                    maxlength: 16,
                    minlength: 6,
                    isNotFace: true
                }
            },
            onkeyup: false
        });
        $("#loginBtn").on("click", function() {
            if(_formWrapper.valid()){
            	$.when(
            		login(_formWrapper.serializeObject()),
	      			getQiniuUrl()
            	)
                
            }
        });
    }
	//获取七牛地址
	function getQiniuUrl(){
		GeneralCtr.getUserSysConfig('qiniu_domain').then(function(data) {
	        base.setSessionQiniuUrl(data.cvalue+'/');
	    });
	}
    function login(param) {
        base.showLoading("登录中...");
        UserCtr.login(param)
            .then((data) => {
                base.hideLoading();
                base.setSessionUser(data);
                location.href = "../index.html";
            });
    }
});
