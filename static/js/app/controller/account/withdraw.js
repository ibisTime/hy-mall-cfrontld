define([
    'app/controller/base',
    'app/module/validate',
    'app/interface/UserCtr',
    'app/interface/AccountCtr',
    'app/interface/GeneralCtr',
], function(base, Validate, UserCtr, AccountCtr, GeneralCtr) {
	var currency = base.getUrlParam("currency");//币种
	
	var _formWrapper = $("#formWrapper");
	
    init();
    
    function init() {
    	
        base.showLoading();
        $.when(
        	getAccount(),
        	getAccountSysConfig()
        ).then(base.hideLoading,base.hideLoading)
    	
    	addListener();
    }
    
    // 获取兑换比例
    
    function getAccountSysConfig(){
    	GeneralCtr.getAccountSysConfig("XJK2JF").then(function(data){
        	$("#rate").text('1小金库兑换'+data.cvalue+'积分');
    	}, function(){})
    }
    
    // 获取账户信息
	function getAccount() {
	    return AccountCtr.getAccount().then(function(data) {
	    	var amount = 0;
	        data.forEach(function(d, i) {
	        	if (d.currency == currency) {
	        		amount = base.formatMoney(d.amount);
	            	$("#accountAmount").text(base.formatMoney(d.amount));
	           }
	        })
	        
	        _formWrapper.validate({
	            'rules': {
	                amount: {
	                    required: true,
	                    amount: true,
	                    max: amount
	                },
	            },
	            onkeyup: false
	        });
	    });
	}
	
	//划转
	function transferAccounts(amount){
		return AccountCtr.JFTransferXJK(amount).then(function(data) {
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
        
        $("#subBtn").click(function(){
        	if(_formWrapper.valid()){
        		transferAccounts($("#amount").val()*1000)
        	}
        })
        
    }
});
