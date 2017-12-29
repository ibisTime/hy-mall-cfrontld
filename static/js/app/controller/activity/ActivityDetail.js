define([
    'app/controller/base',
    'swiper',
    'app/interface/GeneralCtr',
    'app/interface/ActivityStr'
], function(base, Swiper, GeneralCtr, ActivityStr) {
	var code = base.getUrlParam("code");
	var actName = '';
    init();

	function init(){
		
		base.showLoading();
		$.when(
			getUserSysConfig(),
			getActivityDetail(),
			getActJoinIn(),
			getPageActComment()
		)
		addListener()
		
	}
	
	//获取详情
	function getActivityDetail(){
		return ActivityStr.getActivityDetail(code).then((data)=>{
			
			var dpic = data.pic;
	        var strs= []; //定义一数组 
			var html="";
			strs=dpic.split("||"); //字符分割
			
			if(strs.length>1){
				strs.forEach(function(d, i){
					html+=`<div class="swiper-slide"><div class="mallDetail-img" style="background-image: url('${base.getImg(d)}')"></div></div>`;
				})
				$("#top-swiper").html(html);
				var mySwiper = new Swiper('#swiper-container', {
		            'paginationClickable' :true,
		            'preventClicksPropagation': true,
	                // 如果需要分页器
	                'pagination': '.swiper-pagination'
	            });
			}else{
				$("#top-swiper").html(`<div class="swiper-slide"><div class="mallDetail-img" style="background-image: url('${base.getImg(dpic)}')"></div></div>`);
			}
			
			actName = data.name;
			
			$('title').html(data.name+'-活动详情');
	        
	        $(".detail-title .name").html(data.name)
			$(".detail-title .slogan").html(data.slogan)
			$("#price").html('<i>￥</i>'+base.formatMoney(data.amount))
			$(".detail-title .enrollEndDatetime").text(base.formatDate(data.enrollEndDatetime, "yyyy-MM-dd"))
			$(".detail-title .data").text(base.formatDate(data.startDatetime, "yyyy-MM-dd")+"至"+base.formatDate(data.endDatetime, "yyyy-MM-dd"))
			$(".detail-title .userNum").text(data.groupNum)
			$(".detail-title .placeAsse").text(data.placeAsseProvince+" "+data.placeAsseCity+" "+data.placeAsse)
			$(".detail-title .placeDest").text(data.placeDestProvince+" "+data.placeDestCity+" "+data.placeDest)
			
			startActive($("#indexQd"),data.indexQd)
			startActive($("#indexNd"),data.indexNd)
			startActive($("#indexFj"),data.indexFj)
			
			$("#description").html(data.description)
			$("#amountDesc").html(data.amountDesc)
			$("#scheduling").html(data.scheduling)
			$("#equipment").html(data.equipment)
			$("#enrollNum").html(data.enrollNum)
			
			//审核中和审核不通过
			if(data.status == "0" || data.status == "2"){
				$(".activity-bottom").removeClass("hidden");
				$("#activity-bottom-height").removeClass("hidden");
			}else{
				$("#goliuyan").removeClass("hidden");
				//留言点击
		        $("#goliuyan").click(function(){
		        	location.href="../public/comment2.html?type=AN&code="+code+"&name="+actName;
		        })
		        //查看更多留言 点击
		        $("#allTNotesComment").click(function(){
		        	location.href="../public/comment2.html?type=AN&code="+code+"&name="+actName;
		        })
			}
			base.hideLoading()
		}, base.hideLoading)
	}
	
	//星星选中
	function startActive(starWrap,thisIndex){
		var _starWrap = starWrap,
			_thisIndex = thisIndex-1,
    		score = 1;
    	_starWrap.children('.star').removeClass("active")	
		_starWrap.children('.star').each(function(i, d){
			if(i<=_thisIndex){
				score = i+1;
				$(this).addClass('active')
			}
		})
		_starWrap.attr('data-score', score);
	}
	
	//获取 报名须知，免责申明，注意事项
	function getUserSysConfig(){
		return $.when(
			GeneralCtr.getUserSysConfig("act_enroll"),
			GeneralCtr.getUserSysConfig("act_mzsm"),
			GeneralCtr.getUserSysConfig("act_zysx"),
		).then(function(data1,data2,data3){
        	$("#act_enroll").html(data1.cvalue);
        	$("#act_mzsm").html(data2.cvalue);
        	$("#act_zysx").html(data3.cvalue);
		});
	}
	//获取活动报名人数
	function getActJoinIn(){
		return ActivityStr.getActJoinIn(code).then(function(data){
			var html = ''
			data.length && data.forEach(function(d, i){
				if(i<=14){
					html+=`<div class="photo-item" style="background-image: url('${base.getAvatar(d.photo)}');"></div>`
				}else{
					return false;
				}
				
			})
			$("#photoList").html(html)
		});
	}
	
	//分页查询评论
	function getPageActComment(){
		GeneralCtr.getPageActComment({
			start:1,
			limit:3,
			entityCode: code,
			parentCode: code
		}).then((data)=>{
			var lists = data.list;
			if(data.list.length) {
                var html = "";
                lists.forEach((item,i) => {
                    html += buildHtml(item,i);
                });
                $("#tNcommentList").html(html);
                $("#allTNotesComment").removeClass("hidden");
                
            }else{
                $("#tNcommentList").html('<div class="no-data">暂无留言</div>');
            }
			base.hideLoading();
		})
	}
	function buildHtml(item,i){
		var toComment = "";
		if(item.parentComment){
			toComment = `<div class="toComment">
    						<p class="toNickName">回复@<samp>${item.parentComment.nickname}</samp></p>
    						<p class="toContent">${item.parentComment.content}</p>
    					</div>`;
		}
		
		return `<div class="tNcomment-item">
    				<div class="userPicWrap">
    					<div class="userPic" style="background-image: url('${base.getAvatar(item.photo)}');"></div>
    				</div>
    				<div class="info">
    					<div class="userInfo">
    						<p class="nickName">${item.nickname}</p>
    						<samp class="updateTime">${base.formatDate(item.commentDatetime,"yyyy-MM-dd hh:mm:ss")}</samp>
    					</div>
    					${toComment}
    					<div class="content">${item.content}</div>
    				</div>
    			</div>`;
	}
	
	
	function addListener(){
        
        //详情tag切换
		$("#detailNav .nav").click(function(){
			$(this).addClass("active").siblings(".nav").removeClass("active");
			$(".contentWrap").eq($(this).index()).removeClass("hidden").siblings(".contentWrap").addClass("hidden");
		})
		
        //删除
        $("#deleteBtn").on("click", function() {
            base.confirm('确认删除活动吗？')
                .then(() => {
                    base.showLoading("删除中...");
                	ActivityStr.deleteActivity(code)
                        .then(() => {
                        	base.hideLoading();
                            base.showMsg("操作成功");
                            
                            setTimeout(function(){
					        	config.start = 1
	                			getPageActivity(true);
                            },500)
                        }, base.hideLoading);
                }, () => {});
        });
        
        //删除
        $("#editBtn").on("click", function() {
        	location.href="./activity-addedit.html?code="+code;
        });
        
        //免责申明 查看更多 点击
        $("#act_mzsm_more").click(function(){
        	if($(this).hasClass("active")){
        		$(this).removeClass("active");
        		$(this).html("查看更多")
        		$(this).css("max-height","10rem")
        		$("#act_mzsm").css("max-height","10rem")
        	}else{
        		$("#act_mzsm").css("max-height","none")
        		$(this).addClass("active");
        		$(this).html("收起")
        	}
        })
        
        //免责申明 查看更多 点击
        $("#act_enroll_more").click(function(){
        	if($(this).hasClass("active")){
        		$(this).removeClass("active");
        		$(this).html("查看更多")
        		$(this).css("max-height","10rem")
        		$("#act_enroll").css("max-height","10rem")
        	}else{
        		$("#act_enroll").css("max-height","none")
        		$(this).addClass("active");
        		$(this).html("收起")
        	}
        })
		
	}
})
