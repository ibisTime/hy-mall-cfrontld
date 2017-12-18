define([
    'app/controller/base',
    'app/interface/UserCtr',
    'app/interface/AccountCtr',
    'app/module/setTradePwd',
], function(base, UserCtr, AccountCtr, setTradePwd) {
	var isBindCUser = base.getUrlParam("isBindCUser");//是否绑定c端

    init();
    
    function init() {
    	getAccount();
    	addListener()
    }
    // 获取账户信息
	function getAccount() {
	    return AccountCtr.getAccount().then(function(data) {
	        data.forEach(function(d, i) {
	        	if (d.currency == "CNY") {
	            	$("#cnyAmount samp").text(base.formatMoney(d.amount));
	        	} else if (d.currency == "JF") {
	        		console.log(d.amount)
	            	$("#jfAmount samp").text(base.formatMoney(d.amount));
	        	} else if (d.currency == "XJK") {
	            	$("#XJKAmount samp").text(base.formatMoney(d.amount));
	        	}
	        })
	    });
	}

    function addListener() {
    	
        $("#jfAmount").click(function(){
        	location.href = '../user/jf-account.html?isBindCUser='+isBindCUser
        })
        $("#XJKAmount").click(function(){
        	location.href = '../user/xjk-account.html?isBindCUser='+isBindCUser
        })
    	
    }
});
