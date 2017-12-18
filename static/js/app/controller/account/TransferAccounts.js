define([
    'app/controller/base',
    'app/module/validate',
    'app/interface/UserCtr',
    'app/interface/AccountCtr',
], function(base, Validate, UserCtr, AccountCtr) {
	var isBindCUser = base.getUrlParam("isBindCUser");//是否绑定c端
	var currency = base.getUrlParam("currency");//币种
	var config={
		currency:currency,
		toUserId:'',
		amount:0
	}
	
    init();
    
    function init() {
    	
        base.showLoading();
        $.when(
        	getAccount(),
    		getUserInfo()
        ).then(base.hideLoading,base.hideLoading)
    	
    	addListener();
    }
    
    // 获取账户信息
	function getAccount() {
	    return AccountCtr.getAccount().then(function(data) {
	        data.forEach(function(d, i) {
	        	if (d.currency == currency) {
	            	$("#accountAmount").text(base.formatMoney(d.amount));
	           }
	        })
	    });
	}
	 // 获取用户信息
	function getUserInfo() {
		return UserCtr.getUser().then(function(data) {
			config.toUserId = data.cuserId
		});
	}
	
	//划转
	function transferAccounts(){
		return AccountCtr.transferAccounts(config).then(function(data) {
			base.showMsg("操作成功")
			
			setTimeout(function(){
				if(currency=='JF'){
					location.href="../user/jf-account.html?isBindCUser="+isBindCUser
				}else if(currency=='XJK'){
					location.href="../user/xjk-account.html?isBindCUser="+isBindCUser
				}
			},500)
	    });
	}

    function addListener() {
    	var _formWrapper = $("#formWrapper");
        _formWrapper.validate({
            'rules': {
                amount: {
                    required: true,
                    amount: true,
                },
            },
            onkeyup: false
        });
        
        $("#subBtn").click(function(){
        	if(_formWrapper.valid()){
        		
        		config.amount = $("#amount").val()*1000
        		transferAccounts()
        	}
        })
        
    }
});
