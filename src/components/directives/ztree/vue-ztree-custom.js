import Vue from 'vue';

import 'ztree/js/jquery-1.4.4.min';
import 'ztree/js/jquery.ztree.all.min';
import 'ztree/css/metroStyle/metroStyle.css';

export default {
    bind:function(el, binding, context){
        let _this = context.context;
        let id = el.id;
        let ztreeParams = binding.value.ztreeParams;
        let  apiUrl = binding.value。apiUrl;

        console.log(binding, 'binding');

        let settings =  {
            view: {fontCss: setFontCss},
            check: {
                enable: true,
                    chkStyle: "radio",
                    radioType: "all"
            },/*
                    view: {
                        dblClickExpand: false
                    },*/
            callback: {
                //onClick: onClick,
                onCheck: onCheck
            }
        };


        function onCheck(event, treeId, treeNode){
            console.log(treeNode, '该节点的名称')

            if(treeNode.checked){
                $('#authorization-ztree-value').val(treeNode.name);
                _this.ztreeValidate.ztreeValue = treeNode.name;
            }else{
                $('#authorization-ztree-value').val('');
                _this.ztreeValidate.ztreeValue = '';
            }

        }

        // 自定义节点样式
        function setFontCss(treeId, treeNode) {
            return (treeNode.chkDisabled==="true" || treeNode.chkDisabled===true) ? {cursor: "not-allowed"} : "";
        }

        _this.ztreeLoading = true;

        let params = {

        };

        _this.$nextTick(()=>{
            setTimeout(()=>{
                _this.$http.post(apiUrl s+ '?t='+new Date().getTime(),params).then(resp=>{
                    _this.ztreeLoading = false;
                    $('#authorization-ztree-value').val('');
                    _this.ztreeValidate.ztreeValue="";

                    if(resp.data.success){
                        debugger
                        $.fn.zTree.init($("#"+id), settings, resp.data.data);

                        console.log(resp.data.data, '加载所属机构树');

                        if(ztreeParams){
                            let zTree = $.fn.zTree.getZTreeObj(id);

                            let node = zTree.getNodeByParam("id", ztreeParams);

                            zTree.checkNode(node, true, null);

                            //zTree.expandNode(node, true, true, true);

                            //zTree.selectNode(node);

                            $('#authorization-ztree-value').val(node.name);
                            _this.ztreeValidate.ztreeValue = node.name;
                        }


                    }else{
                        _this.$Message.error(resp.data.errorMessage || "请求失败");
                    }
                })
            },1000)
        });
    },
    unbind:function(el){
        $.fn.zTree.destroy(el.id);
    }
}