define([
    'app/controller/base',
	'app/module/validate',
    'app/interface/TravelNotesStr',
    'app/interface/GeneralCtr',
], function(base, Validate, TravelNotesStr, GeneralCtr) {
    var code = base.getUrlParam("code");
    var config = {
        start: 1,
        limit: 10,
        type:'AN',
		entityCode: code,
		parentCode: code
    }, isEnd = false, canScrolling = false;
    
    init();

	function init(){
        base.showLoading();
    	getPageActComment();
        addListener();
	}
	
	//分页查询游记评论
	function getPageActComment(refresh){
		return GeneralCtr.getPageActComment(config,refresh).then((data)=>{
			var lists = data.list;
            var totalCount = +data.totalCount;
            if (totalCount <= config.limit || lists.length < config.limit) {
                isEnd = true;
            } else {
                isEnd = false;
            }
            if(data.list.length) {
                var html = "";
                lists.forEach((item) => {
                    html += buildHtml(item);
                });
                $("#tNcommentList")[refresh || config.start == 1 ? "html" : "append"](html);
                isEnd && $("#loadAll").removeClass("hidden");
                config.start++;
                
            } else if(config.start == 1) {
                $("#tNcommentList").html('<div class="no-data-img"><img src="/static/images/no-data.png"/><p>暂无</p></div>');
                $("#loadAll").addClass("hidden");
            } else {
                $("#loadAll").removeClass("hidden");
            }
            !isEnd && $("#loadAll").addClass("hidden");
            canScrolling = true;
            
            base.hideLoading();
            
		}, base.hideLoading)
	}
	function buildHtml(item,i){
		var toComment = "";
		var bottomWrap="";
		
		if(item.childComment){
			toComment = `<div class="toComment">
    						<p class="toNickName">领队回复:${item.childComment.content}</p>
    					</div>`;
		}else{
			bottomWrap = `<div class="bottomWrap">
	    					<div class="reply" data-code="${item.code}"><i class="icon"></i><samp>回复</samp></div>
	    				</div>`
		}
		
		return `<div class="tNcomment-item actComment-item">
    				<div class="userPicWrap">
    					<div class="userPic" style="background-image: url('${base.getAvatar(item.photo)}');"></div>
    				</div>
    				<div class="info">
    					<div class="userInfo">
    						<p class="nickName">${item.nickname}</p>
    						<samp class="updateTime">${base.formatDate(item.commentDatetime,"yyyy-MM-dd hh:mm:ss")}</samp>
    					</div>
    					<div class="content">${item.content}</div>
    					${toComment}
    					${bottomWrap}
    				</div>
    			</div>`;
	}
	
	//回复
	function reply(comCode){
		if(comCode){
        	$("#comBtn").attr("data-code",comCode)
			$("#tNotesForm-comCon").focus();
		}else{
        	$("#comBtn").attr("data-code",'')
		}
	}
	
	function addListener(){
		$(window).on("scroll", function() {
            if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
                canScrolling = false;
                base.showLoading();
                getPageTravelNotesComment();
            }
        });
        
        //评论
        $("#comBtn").click(function(){
        	var comCode = $(this).attr("data-code");
        	
        	if($("#tNotesForm-comCon").val()){
        		base.showLoading();
        		
    			GeneralCtr.comment({
		        	content:$("#tNotesForm-comCon").val(),
		        	parentCode: comCode?comCode:code,
		        	entityCode: code,
		        	type: "AN"
		        }).then(()=>{
		        	
		        	$("#mask").addClass("hidden")
		    		$("#tNotesForm-comCon").val("")
		        	base.hideLoading();
		        	base.showMsg("留言成功");
		        	
//		        	setTimeout(function(){
//						location.reload(true)
//		        	},800)
		        	
		        }, base.hideLoading)
        	}
        }) 
        
        //输入框获取焦点
        $("#tNotesForm-comCon").on("focus",function(){
        	$("#mask").removeClass("hidden");
        })
        
        //遮罩层
        $("#mask").click(function(){
        	$("#mask").addClass("hidden")
        	
        	//回复时
        	if($("#comBtn").attr("data-code")){
        		$("#comBtn").attr("data-code",'')
        		$("#tNotesForm-comCon").val("")
        	}
        })
        
        //回复点击
        $("#tNcommentList").on("click",".tNcomment-item .bottomWrap .reply",function(){
    		$("#tNotesForm-comCon").val("")
        	reply($(this).attr("data-code"));
        })
        
	}
})