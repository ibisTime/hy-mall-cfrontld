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
    var currentType = 0;
    init();

	function init(){
		
		base.showLoading();
		//获取状态数据字典
		GeneralCtr.getDictList({parentKey:'act_order_status'},'801907').then((data)=>{
    		data.forEach(function(d, i){
    			orderStatus[d.dkey]=d.dvalue
    		})
			
    		getPageOrder();
		},base.hideLoading);
		
		addListener();
	}
	
    //分页查询活动
    function getPageOrder(refresh) {
        return ActivityStr.getPageOrder({
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
    	var tmplProHtml = '';
    	
		tmplProHtml+=`<a class="mall-item leaseOrder-item activity-item" href="./order-detail.html?code=${item.code}">
		<div class="mall-item-img fl" style="background-image: url('${base.getImg(item.activity.advPic)}')"></div>
		<div class="mall-item-con fr">
			<p class="name">活动名称:${item.activity.name}</p>
				<samp class="slogan mt10">下单人：${item.user.nickname}</samp>
				<samp class="slogan">下单人手机号：${item.user.mobile}</samp>
				<samp class="slogan">下单时间：${base.formatDate(item.applyDatetime, "yyyy-MM-dd hh:mm")}</samp>
			</div></a>`
    	
        return `<div class="order-item leaseOrder-item">
                    <div class="order-item-header">
                        <span>订单编号:${item.actCode}</span>
                        <span class="fr tcolor_red">${orderStatus[item.status]}</span>
                    </div>
                    <div class="orderPro-list">`+tmplProHtml+`</div>
                </div>`;

    }
	
	function addListener(){
        $(window).on("scroll", function() {
            if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
                canScrolling = false;
                getPageOrder();
            }
        });
	}
	
	
	
})
