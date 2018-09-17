<template>
    <div class="vbl-auth" :style="{display: inline ? 'inline-block' : 'block'}">
        <slot v-if="isShow"></slot>
    </div>
</template>

<script>
	export default {
        name: 'vbl-auth',
		props: {
            name: {
                type: String
            },
            inline: {
                type: Boolean,
                default: true
            }
        },
		data() {
			return {
				isShow: false
			};
		},
        methods: {
            setShow() {
                var parent = this.$parent;
                console.log('parent',parent.value,this.name)
                while (parent && parent.$options.name !== 'vbl-auth-wrap') {
                    parent = parent.$parent;
                }
                this.isShow = parent && parent.value && parent.value[this.name];
                  console.log(this.name)
                console.log(this.isShow)
            }
        },
		created() {
            this.setShow();
		}
	};
</script>