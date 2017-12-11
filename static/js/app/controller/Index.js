define([
    'app/controller/base',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr',
], function(base, GeneralCtr, UserCtr) {
    
    init();
    
    function init(){
    	
        base.showLoading();
        $.when(
        	getUserInfo(),
        	getPageNotice()
        ).then(base.hideLoading,base.hideLoading)
    	
        addListener()
    }
    
    //公告
    function getPageNotice() {
    	return GeneralCtr.getPageSysNotice({
	        start: 1,
	        limit: 1
    	}, true).then(function(data) {
        	$("#goNotice").html(data.list[0].smsTitle)
    	});
    }
    
    // 获取用户信息
	function getUserInfo() {
		return UserCtr.getUser().then(function(data) {
			$("#mobile").text(data.mobile);
			$("#userPhoto").css("background-image", "url('"+base.getAvatar(data.photo)+"')");
		});
	}
  
    function addListener(){
		
		//设置
		$("#userPhoto").click(function() {
            location.href = "../user/set.html";
        });
		//账户管理
		$("#account").click(function() {
            location.href = "./account/account.html";
        });
		
        // 关于我们
        $("#aboutus").click(function() {
            location.href = "../public/article.html?type=about_us";
        });
    }
});
