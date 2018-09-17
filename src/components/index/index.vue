<template>
	<div class="main">
		<!-- <po-header></po-header> -->
		<!-- 页面下面部分 -->
		<loading :show="!loading"></loading>
		<router-view v-show="loading"></router-view>
	</div>
</template>
<script>
import loading from '../loading';
import poHeader from '../common/header';
	export default {
		data () {
			return {
				loading: true
			}
		},
		components: {
			loading,
			poHeader
		},
		created () {
			//this.$loading(this);
			this.$bus.$on('lunbo', res => {
				this.$loading(this);
				this.$router.push({ path: 'xinwen' });
			});
		},
		mounted () {
			this.$bus.$on('newsIndex', res => {
				// 向下传递 content/index.vue.vue
				this.$bus.$emit('news', res);
			});
		}
	}
</script>
<style lang="less" scoped>
	.main {
		height: 100%;
	}
</style>
