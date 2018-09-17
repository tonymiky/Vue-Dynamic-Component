<template>
  <div class="po-right" id="po-right">
    <!-- tab 切换 -->
    <div id="changTabsParent" class="po-tab ">

      <span class="navBtn navBtnLeft" @click="moveToRight" v-if="isLong"><!--右移动按钮--></span>
      <Tabs class="root-tabs-header"  :animated="false" type="card" closable v-model="selectedTabId" @on-click="handleTabClick" @on-tab-remove="handleTabRemove">
        <TabPane v-for="(item, index) in tabs" :name="item.id" :key="item.id" v-if="item.isShow" :closable="item.id=='myChannel'?false:true" :label="item.name">
          <keep-alive :exclude="excludeArr">
            <components v-if="item.id===name" :is="name" :params="params"  />
          </keep-alive>
        </TabPane>
      </Tabs>
      <span class="navBtn navBtnRight" @click="moveToLeft" v-if="isLong"><!--左移动按钮--></span>
    </div>
    <loading :show="!loading"></loading>
  </div>
</template>
<script>
  import loading from '../loading';
  import demo from '../../components/demo'
  export default {
    name: "",
    data () {
      return {
        excludeArr:[],
        componentName_arr: this.$componentName_arr,
        tabs: [
          {
            id: "myChannel",
            isShow: true,
            name: "我的渠道"
          }
        ],
        name: "myChannel",
        selectedTabId:"",
        loading: true,
        newStatus: false,
        iframeStatus: {
          status: false,
          url: {}
        },
        navIndex: 0,
        isLong:false,
        params:""
      }
    },
    methods: {

      handleTabClick(name){
        this.excludeArr = [];
        this.$nextTick(()=>{
          this.linkToComponents(name);
          this.selectedTabId = name;
        })
      },
      handleTabRemove (id) {

        let arr = Object.values(this.tabs);
        let t;

        arr.map((item,index) => {
          if(item.id === id){
            t = index;
            arr.splice(index,1);
          }
        })

        this.tabs = arr;

        //setTimeout(()=>{
          if(t > 0){
            this.linkToComponents(this.tabs[t-1].id);
            this.selectedTabId = this.tabs[t-1].id;
          }else{
            this.linkToComponents(this.tabs[t].id);
            this.selectedTabId = this.tabs[t].id;
          }
        //},1000)
      },
      unique(arr){
        var i,
          j,
          len = arr.length;
        for(i = 0; i < len; i++){
          for(j = i + 1; j < len; j++){
            if(arr[i].id == arr[j].id){
              arr.splice(j,1);
              len--;
              j--;
            }
          }
        }
        return arr;
      },
      moveToRight (e) {
        //向右移动
        let $$navParent   = document.querySelector('#changeTabsLists');
        if($$navParent.offsetLeft>=0){
          $$navParent.style.left = 0;
          return false;
        }
        $$navParent.style.left = $$navParent.offsetLeft + 50 +'px';
        console.log('向右移动');
        return false;
        e.stopPropagation();
      },
      moveToLeft (e) {
        //向左移动
        let $$navigation = document.querySelector('#changTabsParent');
        let $$screenWidth = window.innerWidth - 200;
        let $$navParent   = document.querySelector('#changeTabsLists');
        let $$navParentW  = $$navParent.offsetWidth;
        if($$navParent.offsetLeft<=$$screenWidth-$$navParentW+200){
          $$navParent.style.left = $$screenWidth-$$navParentW + 'px';
          return false;
        }
        $$navParent.style.left = $$navParent.offsetLeft - 50 +'px';
        console.log('向左移动');
        return false;
        e.stopPropagation();
      },
      repeated (value) {
        let status = false;
        this.navlist.forEach((element, index) =>{
          if (element.hostname === value.hostname) {
            status = index;
            return false;
          }
        });
        return status;
      },
      linkToComponents(name){
        // console.group('当前打开或切换的组件名称name: '+name)

        this.$nextTick(()=>{
        	this.name = name;
        })
        
      }
    },
    created () {

    },
    mounted () {
      var _this = this;
      _this.$realizeHeight("po-right", "height");
      _this.$realizeHeight("po-content", "width");
      window.addEventListener('resize',e=>{
        _this.$realizeHeight("po-right", "height");
        _this.$realizeHeight("po-content", "width");
      },false);

      this.$bus.$on('openNewTab',resp=>{
        if(resp.isParent==="0"){
          console.log("%c当前点击的标签名：%c"+ resp.name,"font-weight:bold", "font-size:14px;color:blue;font-weight:bold");
          console.log(resp)

          let str = resp.hostname;
          let arr = str.split("#/");
          let componentName = arr[1];
          console.log(componentName, "被点击的组件名称");
          for(let i=0;i<this.tabs.length;i++){
            if(this.tabs[i].id!==componentName){
              this.tabs.push({
                id: componentName,
                isShow: true,
                name: resp.name
              })
            }
          }
          this.tabs = this.unique(this.tabs);

          this.excludeArr = [];

          this.linkToComponents(componentName);
          this.selectedTabId=componentName;
        }
      });

      // 设置滚动条
      // let bodyHeight = $(document).height() - $('.po-header').outerHeight()-92;
      let bodyHeight = $(window).height()- $('.po-header').outerHeight() - 88;
      $('.root-tabs-header>.ivu-tabs-content').css({"overflow-y": "scroll", "overflow-x":"hidden", "height": bodyHeight,"background":'#fff'});

      // 控制底部广告
      $('.root-tabs-header>.ivu-tabs-content').on('scroll',function(){
        var top = $(this).scrollTop() || 0;
        var flag;
        if(top>20){
          flag = false;
        }else{
          flag = true;
        }
        _this.$bus.$emit("showCompanyFlag", flag);
      })

      // 监听所有跳转组件
      this.componentName_arr.map(item => {
        this.$bus.$on(item ,(resp)=>{

          let h_current = this.tabs.filter(item => {
            return item.id === resp.id;
          })

          let attr = Object.values(this.tabs);

          // 如果tab已存在
          if(h_current.length > 0){
            attr.map(item => {
              if(item.id === resp.id){
                item.name = resp.name;
              }
            })

            
            if(resp.refresh){
              this.excludeArr.push(resp.id)
            }else{ 
              this.excludeArr.splice(this.excludeArr.indexOf(resp.id),1);
            }

          // 不存在
          }else{
            attr.push({
              id: resp.id,
              isShow: true,
              name:resp.name
            })
            this.excludeArr = [];
          }

          this.tabs = this.unique(attr);



          if(resp.closeName){

            let id = resp.closeName;

            let arr = Object.values(this.tabs);
            let t;

            arr.map((item,index) => {
              if(item.id === id){
                t = index;
                arr.splice(index,1);
              }
            })

            this.tabs = arr;
          }

          
          if(resp.params){
            this.params = resp.params;
          }

          this.linkToComponents(resp.id);
          this.selectedTabId=resp.id;

        });
      })
      this.$bus.$on("closeTab",resp=>{
            this.handleTabRemove (resp.id)

        })

    },
    components: {
      loading,
      demo
    },

  }
</script>
<style lang="less" scoped>

  .upmail {
    img {
      display: inline-block;
      width: auto;
      /*height: 36px;*/
    }
    text-align: center;
    background-color:#FFF;
    padding:10px 0;
  }
  .po-content-left {
    float: left;
    width: 64%;
    margin: 10px 0 10px 20px;
    height: auto;
  }
  .po-content-right {
    float: right;
    width: 31%;
    margin-right: 15px;
    margin-top: 10px;
    height: 0;
    background: #fff;
  }
  .po-scoll {
    padding-right: 17px;
    overflow: auto;
  }
  .po-right {
    margin-left:15px;
    .po-iframe {
      overflow: hidden;
    }
    flex: 1;
    overflow: hidden;
    margin-top: 70px;
    .po-tab {
      height: 30px;
      line-height: 40px;
      font-size: 12px;
      background: #f4f5f8;
      padding-right: 30px;
      position: absolute;
      width: calc(~"100% - 185px");
      top: 76px;
      z-index: 8;
      ul {
        overflow: hidden;
      }
      .root-tabs-header{
        .ivu-tabs-bar{

          position: fixed;
          width: calc(~"100% - 200px");
          z-index: 1;
          background:#fff;
        }
      }
    }
    .po-content {
      background: #fff;
      position: relative;
      height: 100%;
      padding-top: 40px;
      .po-content-ad{
        padding: 20px 15px 20px 25px;
        height: 110px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .po-tab span.navBtn{
    position: absolute;
    top:0;
    z-index:100;
    width:18px;
    height:inherit;
    text-align: center;
    cursor:pointer;
    background:#dfdfdf;
    border:1px solid #dfdfdf;
  }
  .po-tab span.navBtnLeft{
    left:0;
    background:url('../../assets/images/tabs_icons.png') #ccc left center no-repeat;
  }
  .po-tab span.navBtnRight{
    right:0;
    background:url('../../assets/images/tabs_icons.png') #ccc -20px center no-repeat;
  }
  .po-tab .changeTabsLists{
    padding:0 10px;
    position:relative;
    transition: all 0.3s;
  }
  .po-tab li {
    float: left;
    min-width: 86px;
    background: #fff;
    text-align: center;
    height: 40px;
    /*width: 86px;*/
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .po-tab li:hover {
    cursor: pointer;
  }

  .po-tab li > a {
    color: inherit;
    position: relative;
    display: block;
    margin-left: 20px;
    padding-right: 20px;
    /*overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;*/
  }

  .po-tab li > a > span {
    display: inline-block;
    width: 15px;
    height: 15px;
    background: url('../../assets/images/close.png') no-repeat;
    position: absolute;
    right: 2px;
    top: 11px;
    z-index: 99;
    cursor: pointer;
  }

  .po-tab .cur {
    color: #3687fb;
    border-bottom: 2px solid #3687fb;
  }

</style>

