<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
	export default {
		created () {
			console.log("%c%c我们愿意用毕生所学，向你们展示真正的魔法！","line-height:18px;","line-height:18px;padding:4px 0px;color:#000;font-size:12px;background-image:-webkit-gradient(linear,left top,right top,color-stop(0,#ff22ff),color-stop(1,#5500ff));color:#fff;-webkit-background-clip:text;");
			console.log("%c%c----智能数据中心-前端应用组","line-height:18px;","line-height:18px;padding:4px 10px;color:#000;font-size:12px;background-image:-webkit-gradient(linear,left top,right top,color-stop(0,#ff22ff),color-stop(1,#5500ff));color:#fff;-webkit-background-clip:text;");
		}
	}
</script>
<style lang="less">
	#app {
		height: 100%;
		width: 100%;
		position: relative;
	}
</style>
