define([
    'app/controller/base',
	'app/module/validate',
    'app/module/qiniu',
    'app/interface/GeneralCtr',
    'app/interface/ActivityStr'
], function(base, Validate, qiniu, GeneralCtr, ActivityStr) {
    var code = base.getUrlParam("code") || '';
	
    init();

	function init(){
		base.showLoading();
		//获取类型数据字典
		GeneralCtr.getDictList({parentKey:'act_type'},'801907').then((data)=>{
			var html = ""
    		data.forEach(function(d, i){
    			html+=`<option value="${d.dkey}">${d.dvalue}</option>`
    		})
    		$("#type").append(html);
    		
			if(code){
				getActivityDetail();
			}
    		
    		base.hideLoading();
    		initUpload();
			addListener();
		},base.hideLoading);
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
	
	//七牛
	function initUpload(){
		//advPic
		qiniu.getQiniuToken()
			.then((data) =>{
				var token = data.uploadToken;
				qiniu.uploadInit({
					token: token,
					btnId: "uploadBtnAdvPic",
					containerId: "uploadContainerAdvPic",
					multi_selection: false,
					showUploadProgress: function(up, file){
						$("#advPic .upload-progress").css("width", parseInt(file.percent, 10) + "%");
					},
					fileAdd: function(up, file){
						$("#advPic .upload-progress-wrap").show();
					},
					fileUploaded: function(up, url, key){
						$("#advPic .upload-progress-wrap").hide().find(".upload-progress").css("width", 0);
						
						var picHtml = `<div class="pic" style="background-image: url('${url}');" 
									data-url="${key}"></div>`
						$("#uploadContainerAdvPic").before(picHtml)
						$("#uploadContainerAdvPic").addClass("hidden")
					}
				});
			}, () => {})
			
		//advPic
		qiniu.getQiniuToken()
			.then((data) =>{
				var token = data.uploadToken;
				qiniu.uploadInit({
					token: token,
					btnId: "uploadBtnPic",
					containerId: "uploadContainerPic",
					multi_selection: false,
					showUploadProgress: function(up, file){
						$("#pic .upload-progress").css("width", parseInt(file.percent, 10) + "%");
					},
					fileAdd: function(up, file){
						$("#pic .upload-progress-wrap").show();
					},
					fileUploaded: function(up, url, key){
						$("#pic .upload-progress-wrap").hide().find(".upload-progress").css("width", 0);
						
						var picHtml = `<div class="pic" style="background-image: url('${url}');" 
									data-url="${key}"><i class="delete"></i></div>`
						$("#uploadContainerPic").before(picHtml)
					}
				});
			}, () => {})
			
	}
	
	//详情
	function getActivityDetail(){
		ActivityStr.getActivityDetail(code).then((data)=>{
			$("#formWrapper").setForm(data)
			
			var picHtml='';
			var advPicHtml=`<div class="pic" style="background-image: url('${base.getImg(data.advPic)}');" data-url="${data.advPic}"></div>`;
			var strs =[],strs=data.pic.split('||');
    		
    		if(strs.length){
				strs.forEach(function(d, i){
					picHtml += `<div class="pic" style="background-image: url('${base.getImg(d)}');" 
								data-url="${d}"><i class="delete"></i></div>`
				})
			}
			
			$("#uploadContainerAdvPic").before(advPicHtml)
			$("#uploadContainerAdvPic").addClass("hidden")
			$("#uploadContainerPic").before(picHtml)
			
			startActive($("#indexQd"),data.indexQd)
			startActive($("#indexNd"),data.indexNd)
			startActive($("#indexFj"),data.indexFj)
			
			base.hideLoading()
		}, base.hideLoading)
	}
	
	//新增
	function addActivity(params){
		base.showLoading();
		ActivityStr.addActivity(params).then(()=>{
			base.hideLoading();
			base.showMsg("修改成功！请等待平台审核！")
			setTimeout(()=>{
				location.replace("./activity-list.html")
			},800)
		}, base.hideLoading)
	}
	
	//修改
	function editActivity(params){
		base.showLoading();
		ActivityStr.editActivity(params).then(()=>{
			base.hideLoading();
			base.showMsg("提交成功！请等待平台审核！")
			setTimeout(()=>{
				location.replace("./activity-list.html")
			},800)
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
	
	function addListener(){
		var _formWrapper = $("#formWrapper");
        _formWrapper.validate({
            'rules': {
                name: {
                    required: true,
                },
                type: {
                    required: true,
                },
                slogan: {
                    required: true,
                },
                startDatetime: {
                    required: true,
                },
                endDatetime: {
                    required: true,
                },
                enrollEndDatetime: {
                    required: true,
                },
                placeDest: {
                    required: true,
                },
                placeAsse: {
                    required: true,
                },
                groupNum: {
                    required: true,
                    number: true
                },
                amount: {
                    required: true,
                    amount: true
                },
                description: {
                    required: true,
                },
                placeDesc: {
                    required: true,
                },
                amountDesc: {
                    required: true,
                },
                scheduling: {
                    required: true,
                },
                equipment: {
                    required: true,
                },
            },
            onkeyup: false
        });
		
		var start = {
            elem: '#startDatetime',
            format: 'YYYY-MM-DD',
            min: laydate.now(), //设定最小日期为当前日期
            isclear: false, //是否显示清空
            istoday: false,
            choose: function(datas) {
                var d = new Date(datas);
                d.setDate(d.getDate());
                datas = d.format('yyyy-MM-dd');
                end.min = datas; //开始日选好后，重置结束日的最小日期
                end.start = datas //将结束日的初始值设定为开始日
                
                d1.setDate(d.getDate()-1)
                datas1 = d1.format('yyyy-MM-dd');
                enrollEndDatetime.max = datas1;
            }
        };
        var end = {
            elem: '#endDatetime',
            format: 'YYYY-MM-DD',
            min: laydate.now(),
            isclear: false, //是否显示清空
            istoday: false,
            choose: function(datas) {
                var d = new Date(datas);
                d.setDate(d.getDate());
                datas = d.format('yyyy-MM-dd');
                start.max = datas; //结束日选好后，重置开始日的最大日期
            }
        };
        var enrollEndDatetime = {
            elem: '#enrollEndDatetime',
            format: 'YYYY-MM-DD',
            min: laydate.now(), //设定最小日期为当前日期
            isclear: false, //是否显示清空
            istoday: false,
            choose: function(datas) {
            	var d = new Date(datas);
                d.setDate(d.getDate()+1);
                datas = d.format('yyyy-MM-dd');
                
                end.min = datas; //截止日选好后，重置结束日的最小日期
                start.min = datas; //截止日选好后，重置开始日的最小日期
            }
        };
        laydate(start);
        laydate(end);
        laydate(enrollEndDatetime);
		
	    //图片删除
	    $("#pic").on("click",".pic .delete", function(){
	    	$(this).parent('.pic').remove();
	    })
	    
	    //星星点击
	    $(".form-item .starWrap .star").click(function(){
    		var _this = $(this);
    		var _starWrap = _this.parent('.starWrap');
    		var _thisIndex = _this.index()+1
    		
    		startActive(_starWrap,_thisIndex);
    	})
	    
	    //发布
	    $("#subBtn").click(function(){
	    	if (_formWrapper.valid()) {
	    		var params = $('#formWrapper').serializeObject();
	    		var pic='';
	    		var advPic='';
	    		
      			$("#advPic").find('.pic').each(function(i, d){
      				advPic+=$(this).attr("data-url")
      				
      				if(i<$("#picWrap").find('.pic').length-1){
      					advPic+='||';
      				}
      			})
      			$("#pic").find('.pic').each(function(i, d){
      				pic+=$(this).attr("data-url")
      				
      				if(i<$("#picWrap").find('.pic').length-1){
      					pic+='||';
      				}
      			})
      			params.advPic = advPic;
    			params.pic = pic;
    			params.indexQd = $("#indexQd").attr('data-score');
    			params.indexNd = $("#indexNd").attr('data-score');
    			params.indexFj = $("#indexFj").attr('data-score');
    			
				base.showLoading();
				
	    		if(code){
	    			params.code = code
	    			editActivity(params)
	    		}else{
	    			addActivity(params)
	    		}
	    		
		    }
	    })
	    
	    
	}
})
