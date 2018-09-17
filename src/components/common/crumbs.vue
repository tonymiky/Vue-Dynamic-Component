<template>
	<div class="crumbs clearfix">
		<div class="crumbs-info pull-left" :class="{'isTrue':item.url === ''}" v-for="item in items">
			<!-- <a v-link="item.url">{{ item.name }}</a> -->
			 <router-link :to="{name: item.url}">{{ item.name }}</router-link>
			<span>></span>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'crumbs',
		props: ['items'],
		data() {
			return {

			}
		}
	}
</script>
<style lang="less" scoped>
	.crumbs {
		font-size: 14px; background-color: #f7f7f8;
		margin:20px 0 20px;
		.crumbs-info {
			&.isTrue {
				> a {
					pointer-events: none;
				}
			}
			> a{
				color: #666; float: left; display: block;
				&:hover {
					color: #666;
				}
			}
			> span {
				margin: 0 10px; color: #ccc; display: block; float: left;
			}
			&:last-child {
				> span {
					display: none;
				}
			}
		}
        .crumbs-info:first-child{
            a {
                color:#1d86f4;
            }
        }
	}
</style>
