<template>
	<footer  class="cont">
		<div class="btnDiv">
			<slot></slot>
		</div>
		<transition name="fade">
	    <p class="logoDiv" v-show="flag">
	      建议使用IE11(及以上)、Chrome、Safari浏览器访问&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CopyRight © 2016 daikuan.com,All Rights Reserved 易鑫集团
	    </p>
	    </transition>
	</footer>
</template>
<script>
    export default {
      
        data() {
            return {
            	flag:true
            }
        },
        watch:{
        	
        },
        methods: {


        },
        mounted(){

        	this.$bus.$on('showCompanyFlag',resp=>{
		        this.flag = resp;
		    });
        }

    }
</script>
<style type="text/css">
	
	
</style>
<style type="text/css" scoped>
	.cont{
		position: fixed;
		bottom: 0px;
		left: 0px;
		width: 100%;
		z-index:100
	}
	.btnDiv{
		width:100%;
		background: rgba(0,0,0,0.1);
		text-align: center;

	}
	.logoDiv{
		color: #808aa1;
		background-color: #465885;
		height:40px;
		text-align:center;
		line-height:40px
	}
	.btnDiv .ivu-btn{
		margin:8px 5px;
	}
</style>
