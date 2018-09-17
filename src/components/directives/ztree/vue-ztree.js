import 'ztree/js/jquery-1.4.4.min'
import 'ztree/js/jquery.ztree.all.min'
import 'ztree/css/metroStyle/metroStyle.css'

export default {
    bind:function(el, binding, context){
        context.context.$nextTick(()=>{
            let id = '#'+el.id;
            let setting = binding.value.setting;
            let zTreeNodes  = binding.value.ztreeData;

            $.fn.zTree.init($(id), setting, zTreeNodes);
        })
    },
    update:function(el, binding, context){
        console.log(context.context, 'update 的更新频率');
        context.context.$nextTick(()=>{
            //_this.$nextTick(()=>{
                let id = '#'+el.id;
                let setting = binding.value.setting;
                let zTreeNodes  = binding.value.ztreeData;

                $.fn.zTree.init($(id), setting, zTreeNodes);

            //});
        })
    },
    unbind:function(el, binding, context){
        let _this = context.context;

        _this.$destroy(el.id);
    }
}


