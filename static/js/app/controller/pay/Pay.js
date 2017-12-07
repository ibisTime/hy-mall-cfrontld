define([
    'app/controller/base',
    'app/interface/MallCtr',
    'app/interface/LeaseCtr',
    'app/interface/AccountCtr',
    'app/module/weixin'
], function(base, MallCtr, LeaseCtr, AccountCtr, weixin) {
    const MALL_ORDER = "mall",LEASE_ORDER = "lease";
    const BALANCE_PAY = 1, WX_PAY = 5;
    var code = base.getUrlParam("code"),
        type = base.getUrlParam("type"),
        proType = base.getUrlParam("type"),//商品类型
        pay_type = 1;
    
    var account={
    	cny: 0,
    	jf: 0,
    	xjk: 0,
    }

    init();
    function init(){
        if(!code) {
            base.showMsg("未传入订单编号");
        } else {
            base.showLoading();
            //获取商城订单支付金额
            if(type == MALL_ORDER) {
        		getAccount().then(()=>{
        			getMallOrderDetail()
        		})
            
            //获取租赁订单支付金额
            } else if(type == LEASE_ORDER) {
				getAccount().then(()=>{
        			getLeaseOrderDetail()
        		})
            } 
            addListener();
        }
    }
    
    // 详情查询商城订单
    function getMallOrderDetail() {
        MallCtr.getOrderDetail(code)
            .then((data) => {
                base.hideLoading();
                var price = 0;
                if(!data.amount1&&data.amount2&&!data.yunfei){
                	price = base.formatMoney(data.amount2)+' 积分'
                	
                	$("#payName").html('积分支付');
	        		$("#accountAmount").html(''+base.formatMoney(account.jf)+'积分');
                }else if(data.amount1&&!data.amount2){
                	price = '￥ '+base.formatMoney(data.amount1+data.yunfei)+'<samp>(含运费：￥ '+base.formatMoney(data.yunfei)+')</samp>';
                	
                	$("#payName").html('余额支付')
	        		$("#accountAmount").html('￥'+base.formatMoney(account.cny+account.xjk)+'<i>(含小金库)</i>');
                	$("#wxPay").removeClass('hidden')
                }else{
                	price = '￥ '+base.formatMoney(data.amount1+data.yunfei)+' + '+base.formatMoney(data.amount2)+' 积分'+'<samp>(含运费：￥ '+base.formatMoney(data.yunfei)+')</samp>'
                	
                	$("#payName").html('余额支付')
                	$("#wxPay").removeClass('hidden')
	        		$("#accountAmount").html(base.formatMoney(account.jf)+'积分 + ￥'+base.formatMoney(account.cny+account.xjk)+'<i>(含小金库)</i>');
                }
                
                $("#totalAmount").html(price);
                
            });
    }
    
    function getAccount(){
    	return AccountCtr.getAccount(true).then((data)=>{
    		data.forEach(function(d, i) {
	        	if (d.currency == "CNY") {
	        		account.cny = d.amount
	        	} else if (d.currency == "JF") {
	        		account.jf = d.amount
	        	} else if (d.currency == "XJK") {
	        		account.xjk = d.amount
	        	}
	        })
    	})
    }
    
    // 详情查询租赁订单
    function getLeaseOrderDetail() {
        LeaseCtr.getOrderDetail(code)
            .then((data) => {
                base.hideLoading();
                var price = 0;
                if(!data.amount1&&data.amount2&&!data.yunfei){
                	price = base.formatMoney(data.amount2)+' 积分'
                	
                	$("#payName").html('积分支付')
	        		$("#accountAmount").html(''+base.formatMoney(account.jf)+'积分');
                }else if(data.amount1&&!data.amount2){
                	price = '￥ '+base.formatMoney(data.amount1+data.yunfei);
                	
                	$("#payName").html('余额支付')
                	$("#wxPay").removeClass('hidden')
	        		$("#accountAmount").html('￥'+base.formatMoney(account.cny+account.xjk)+'<i>(含小金库)</i>');
                }else{
                	price = '￥ '+base.formatMoney(data.amount1+data.yunfei)+' + '+base.formatMoney(data.amount2)+' 积分'
                	
                	$("#payName").html('余额支付')
                	$("#wxPay").removeClass('hidden')
	        		$("#accountAmount").html(base.formatMoney(account.jf)+'积分 + ￥'+base.formatMoney(account.cny+account.xjk)+'<i>(含小金库)</i>');
                }
                
                $("#totalAmount").html(price);
            });
    }
    
    function addListener() {
        $("#payType").on("click", ".pay-item", function() {
            var _me = $(this);
            if(!_me.hasClass("active")) {
                _me.addClass("active").siblings(".active").removeClass("active");
                if(_me.index()==0){
                	pay_type = 1;//余额
                }else if(_me.index()==1){
                	pay_type = 5;//微信
                }
                
            }
        });
        $("#payBtn").on("click", function(){
            base.showLoading("支付中...");
            
            payByBalance();
        });
    }
    
    //判断支付接口调用类型
    function payByBalance(){
    	if(type==MALL_ORDER){
    		payMallOrder(pay_type);
    	}else if(type==LEASE_ORDER){
    		payLeaseOrder(pay_type)
    	}
    }
    
    // 支付商城订单
    function payMallOrder(payType) {
    	var config = {
    		payType:payType,
    		codeList:[code]
    	}
        MallCtr.payOrder(config,true)
            .then((data) => {
                if(pay_type == WX_PAY) {
                    wxPay(data);
                } else {
                    base.hideLoading();
                    base.showMsg("支付成功");
                    setTimeout(() => {
                        location.replace("../user/user.html");
                    }, 500);
                }
            });
    }
    
    // 支付租赁订单
    function payLeaseOrder(payType) {
    	var config = {
    		payType:payType,
    		codeList:[code]
    	}
        LeaseCtr.payOrder(config,true)
            .then((data) => {
                if(pay_type == WX_PAY) {
                    wxPay(data);
                } else {
                    base.hideLoading();
                    base.showMsg("支付成功");
                    setTimeout(() => {
                        location.replace("../user/user.html");
                    }, 500);
                }
            });
    }
    
    function wxPay(data) {
        if (data && data.signType) {
            weixin.initPay(data, () => {
                base.showMsg("支付成功");
                setTimeout(function(){
                    location.href = "../user/user.html";
                }, 500);
            }, () => {
                base.showMsg("支付失败");
            });
        } else {
            base.hideLoading();
            base.showMsg("微信支付失败");
        }
    }
});
