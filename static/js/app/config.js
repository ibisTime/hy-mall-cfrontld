var SYSTEM_CODE = "CD-CHW000015";
var PIC_PREFIX = 'http://'+getCookie('qiniuUrl');
var PIC_SHOW = '?imageMogr2/auto-orient/interlace/1';
var JFPRODUCTTYPE = 'J01';
var JFLEASEPRODUCTTYPE = 'J04';
var SYS_USER = 'SYS_USER_HW';

(function() {
	// 判断是否登录
	if (!/\/login\.html/.test(location.href)&&!/\/register\.html/.test(location.href)&&!/\/findPwd\.html/.test(location.href)) {
    var userId = sessionStorage.getItem('userId');

    // 未登录
    if (!userId) {
    	var regIsRock = new RegExp("(^|&)isRock=([^&]*)(&|$)", "i");
			if(window.location.search.substr(1).match(regIsRock)!=null){
  		
  		}else{
	    	sessionStorage.setItem("l-return", location.pathname + location.search);
	    	location.replace("../user/login.html");
  		}
  	}
	}
})()
function getCookie(cname){
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}
