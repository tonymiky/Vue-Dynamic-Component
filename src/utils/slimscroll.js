import slimScroll from '../../static/js/jquery.slimscroll.js';

export default {
	deep: true,
	update: function (newValue, oldValue) {
	// 值更新时的工作
	// 也会以初始值为参数调用一次
		let this_ = newValue;
		$(this_).slimScroll({
	        width: '200px', //容器宽度,默认无
	        height: "100%", //容器高度,默认250px
	        size: '0px', //滚动条宽度,默认7px
	        position: 'right', //滚动条位置,可选值:left,right,默认right
	        color: 'transparent', //滚动条颜色,默认#000000
	        alwaysVisible: true, //是否禁用隐藏滚动条,默认false
	        railVisible: true, //滚动条背景轨迹,默认false
	        railColor: '#222', //滚动条背景轨迹颜色,默认#333333
	        railOpacity: 0.3, //滚动条背景轨迹透明度,默认0.2
	        wheelStep: 10, //滚动条滚动值,默认20
	        allowPageScroll: false, //滚动条滚动到顶部或底部时是否允许页面滚动,默认false
	        disableFadeOut: false //是否禁用鼠标在内容处一定时间不动隐藏滚动条,当设置alwaysVisible为true时该参数无效,默认false
	    });
	}
};
