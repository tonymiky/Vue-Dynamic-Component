<template>
    <div class="vbl-auth-wrap">
        <slot v-if="isShow"></slot>
    </div>
</template>

<script>
export default {
    name: 'vbl-auth-wrap',
    props: {
        options: {
            type: Object
        },
        url: {
            type: String
        },
        httpType: {
            type: String,
            default: 'post'
        }
    },
    data() {
    	return {
    		value: [],
            isShow: false
    	};
    },
    methods: {
    	send() {
            var items = Object.keys(this.options);
            var params = [];
            let newArr = [];
            console.log(items)
            items.forEach((item) => {
                params.push({
                    elementName: item,
                    sourcePermisionDatas: this.options[item]
                });
                newArr.push(this.options[item]);
            });
            
            console.log(newArr);
    		this.$http[this.httpType](
                this.url,   
                newArr,         
    			// {
                //     sourcePermisionDTOsStr: newArr
                    
                // },
                {params: "application"}
    		).then((response) => {
                console.log('权限按钮',response)
                if(response.data.success){
                    this.value = response.data.data;
                    this.isShow = true;
                }
            });
    	}
    },
    created() {
        this.send();
    }
};
</script>
