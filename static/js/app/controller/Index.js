define([
    'app/controller/base',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr',
], function(base, GeneralCtr, UserCtr) {
    var isBindCUser = '0';//是否绑定c端用户
    
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
			isBindCUser = data.cuserId?'1':'0';
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
            location.href = "./account/account.html?isBindCUser="+isBindCUser;
        });
		
        // 关于我们
        $("#aboutus").click(function() {
            location.href = "../public/article.html?type=about_us";
        });
    }
});
