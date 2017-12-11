define([
    'app/controller/base',
    'app/module/scroll',
    'app/interface/GeneralCtr',
    'app/interface/ActivityStr'
], function(base, scroll, GeneralCtr, ActivityStr) {
    var myScroll;
    var config = {
        start: 1,
        limit: 10
    }, isEnd = false, canScrolling = false;
    var orderStatus = {};
    var currentType = 0,
        type2Status = {
            "0": '',
            "1": '0',
            "2": '2',
            "3": '1',
            "4": '4',
            "5": '3',
            "6": '9',
            "7": '5',
        };
    init();

	function init(){
		
		base.showLoading();
		//获取状态数据字典
		GeneralCtr.getDictList({parentKey:'act_status'},'801907').then((data)=>{
    		data.forEach(function(d, i){
    			orderStatus[d.dkey]=d.dvalue
    		})
			
    		getPageActivity();
		},base.hideLoading);
		
    	initScroll();
		addListener();
	}
	
	//导航滑动
    function initScroll() {
        var width = 0;
        var _wrap = $("#am-tabs-bar");
        _wrap.find('.am-tabs-tab').each(function () {
            width += this.clientWidth;
        });
        _wrap.find('.scroll-content').css('width', width+ 2 + 'px');
        myScroll = scroll.getInstance().getScrollByParam({
            id: 'am-tabs-bar',
            param: {
                scrollX: true,
                scrollY: false,
                eventPassthrough: true,
                snap: true,
                hideScrollbar: true,
                hScrollbar: false,
                vScrollbar: false
            }
        });
    }
    
    //分页查询活动
    function getPageActivity(refresh) {
        return ActivityStr.getPageActivity({
            status: type2Status[currentType],
            ...config
        }, refresh).then((data) => {
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
                $("#content")[refresh || config.start == 1 ? "html" : "append"](html);
                isEnd && $("#loadAll").removeClass("hidden");
                config.start++;
            } else if(config.start == 1) {
                $("#content").html('<div class="no-data-img"><img src="/static/images/no-data.png"/><p>暂未发布活动</p></div>');
                $("#loadAll").addClass("hidden");
            } else {
                $("#loadAll").removeClass("hidden");
            }
            !isEnd && $("#loadAll").addClass("hidden");
            canScrolling = true;
            base.hideLoading()
        }, () => base.hideLoading());
    }
    //列表
    function buildHtml(item) {
    	var tmplProHtml = '',tmplbtnHtml =' ';
    	
		tmplProHtml+=`<a class="mall-item leaseOrder-item activity-item" href="./activity-detail.html?code=${item.code}">
		<div class="mall-item-img fl" style="background-image: url('${base.getImg(item.advPic)}')"></div>
		<div class="mall-item-con fr">
			<p class="name">${item.name}</p>
				<samp class="slogan mt10">${item.groupNum}人成团</samp>
				<samp class="slogan">${base.formatDate(item.startDatetime, "yyyy-MM-dd")}至${base.formatDate(item.endDatetime, "yyyy-MM-dd")}</samp>
				<samp class="slogan">报名截止：${base.formatDate(item.enrollEndDatetime, "yyyy-MM-dd")}</samp>
			</div></a>`
    	
    	//待支付
    	if(item.status == "0" || item.status == "2" ){
    		tmplbtnHtml += `<div class="order-item-footer"><div class="am-button am-button-small am-button-red delete-btn"  data-code="${item.code}">删除</div>
                            <a class="am-button am-button-small cancel-order" href="../activity/activity-addedit.html?code=${item.code}">修改</a></div>`
    	
    	//已发布
    	}else if(item.status == "1"){
    		tmplbtnHtml += `<div class="order-item-footer"><a class="am-button am-button-small" href="../public/comment2.html?code=${item.code}">查看留言</a></div>`
    	
    	}
    	
        return `<div class="order-item leaseOrder-item">
                    <div class="order-item-header">
                        <span>${base.formatDate(item.updateDatetime, "yyyy-MM-dd")}</span>
                        <span class="fr tcolor_red">${orderStatus[item.status]}</span>
                    </div>
                    <div class="orderPro-list">`+tmplProHtml+`</div><div class="totalAmout"><p>金额:<samp>￥${base.formatMoney(item.amount)}</samp></p>
                    </div>`+tmplbtnHtml+`</div></div>`;

    }
	
	function addListener(){
		// tabs切换事件
        var _tabsInkBar = $("#am-tabs-bar").find(".am-tabs-ink-bar"),
            _tabpanes = $("#am-tabs-content").find(".am-tabs-tabpane");
        $("#am-tabs-bar").on("click", ".am-tabs-tab", function(){
            var _this = $(this), index = _this.index() - 1;
            if(!_this.hasClass("am-tabs-tab-active")){
                _this.addClass("am-tabs-tab-active")
                    .siblings(".am-tabs-tab-active").removeClass("am-tabs-tab-active");
                _tabsInkBar.css({
                    "-webkit-transform": "translate3d(" + index * 1.8 + "rem, 0px, 0px)",
                    "-moz-transform": "translate3d(" + index * 1.8 + "rem, 0px, 0px)",
                    "transform": "translate3d(" + index * 1.8 + "rem, 0px, 0px)"
                });
                _tabpanes.eq(index).removeClass("am-tabs-tabpane-inactive")
                    .siblings().addClass("am-tabs-tabpane-inactive");
                    
                myScroll.myScroll.scrollToElement(_this[0], 200, true);
                // 当前选择查看的订单tab的index
                currentType = index;
                config.start = 1;
                base.showLoading();
                getPageActivity();
            }
        });
        
        $(window).on("scroll", function() {
            if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
                canScrolling = false;
                var choseIndex = $(".am-tabs-tab-active").index() - 1;
                getPageActivity();
            }
        });
        
        //删除
        $("#content").on("click", ".delete-btn", function() {
            var code = $(this).attr("data-code");
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
	}
	
	
	
})
