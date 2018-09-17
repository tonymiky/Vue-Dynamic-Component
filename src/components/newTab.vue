<template>
  <div class="contentner demo">
    <div class="portal_plate_down new_proClass info-bg">
      <div class="info-shadow info-box selinput">
        <Row class="bot14">
          <Col span="8">
            <label for="">渠道名称</label>
            <Input v-model="searchObj.channelName" placeholder="请输入"></Input>
          </Col>
          <Col span="8">
            <label for="">渠道编号</label>
            <Input v-model="searchObj.channelNum" placeholder="请输入"></Input>
          </Col>
          <Col span="8">
            <label for="">产品名称</label>
            <Input v-model="searchObj.product.productName" placeholder="请输入"></Input>
          </Col>
        </Row>
        <!--<ul id="example-ztree"
            class="ztree"
            v-vueZtree="{ztreeData,setting}">
            部门结构树
        </ul>-->
      </div>
      <div class="info-shadow info-box info-box-marginTop">
        <div class="optionArea">
          <Button type="primary" @click="openNewTab">跳转路由</Button>
          <Button type="primary" @click="add">新增</Button>
          <Button type="primary" @click="exportTable">导出</Button>
        </div>
        <Table border :columns="columns" ref="table" :data="data" class='tableStyle'></Table>
      </div>
      <div class="info-shadow info-box selinput">
      </div>
    </div>
    <div class="info-shadow info-box selinput element-fixed-bottom-scroll">
      <Row class="bot14">
        <Col span="8">
          <div></div>
        </Col>
        <Col span="8">
          <Button type="primary" @click="search">查询</Button>
          <Button type="ghost" @click="reset">重置</Button>
        </Col>
        <Col span="8">
          <div></div>
        </Col>
      </Row>
    </div>
    <Modal v-model="addModalVisible" :mask-closable="false" :title="modalTitle">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class='addform'>
        <FormItem label="渠道名称" prop="channelName">
          <Input v-model="formValidate.channelName" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="渠道编号" prop="channelNum">
          <Input v-model="formValidate.channelNum" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="产品名称" prop="productName">
          <Input v-model="formValidate.productName" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="产品编号" prop="productNum">
          <Input v-model="formValidate.productNum" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="省市" class='bot0'>
          <Row>
            <Col span="10">
              <FormItem prop="primateProvinceCode">
                <Select v-model="formValidate.primateProvinceCode" filterable clearable class="selectSpc" @on-change='getSubCity(formValidate.primateProvinceCode)'>
                  <Option v-for="item in provinceList" :value="item.value+''" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>

            <Col span="10">
              <FormItem prop="secondProvinceCode">
                <Select v-model="formValidate.secondProvinceCode" filterable clearable class="selectSpc">
                  <Option v-for="item in cityListModal" :value="item.value+''" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="主营品牌" class='bot0'>
          <Row>
            <Col span="10">
              <FormItem prop="primateMainBrandCode">
                <Select v-model="formValidate.primateMainBrandCode" filterable clearable class="selectSpc" @on-change='getBrand(formValidate.primateMainBrandCode)'>
                  <Option v-for="item in mainBrandList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem prop="secondMainBrandCode">
                <Select v-model="formValidate.secondMainBrandCode" filterable clearable class="selectSpc">
                  <Option v-for="item in brandListModal" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="上传附件" prop="fileCode">
          <!-- Zuul上传文件，中文文件名乱码???解决办法 -->
          <Upload  ref="upload" action="/yxcode-channel-gateway/zuul/demo/api/fileUpload/upload"  name='uploadedFile' :default-file-list="defaultList" :on-preview="onUploadPreview" :on-success="uploadSuccess" :on-error="uploadError">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submitSubmit('formValidate')" :loading="submitLoading">提交</Button>
        <Button type="primary" @click="handleSubmit('formValidate')" :loading="addLoading">保存</Button>
        <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <router-view></router-view>
  </div>
</template>

<script>
  import publicScroll from "./mixins/publicScroll";
  import vueZtree from "./directives/ztree/vue-ztree"
  export default {
    name: "newtab",
    mixins:[publicScroll],
    directives:{
      vueZtree
    },
    data() {
      return {
        setting:{
          view: {
            selectedMulti: false
          },
          callback: {
            onClick: function (event, treeId, treeNode) {
              alert(treeNode.tId + ", " + treeNode.name);
            }
          }
        },
        ztreeData:[
          {"name":"网站导航", open:true, children: [
              { "name":"google", "url":"http://g.cn", "target":"_blank"},
              { "name":"baidu", "url":"http://baidu.com", "target":"_blank"},
              { "name":"sina", "url":"http://www.sina.com.cn", "target":"_blank"}
            ]
          }
        ],
        loadingState: true,
        headers:{'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'},
        url: '/yxcode-channel-gateway/user/permissions',
        auth: {
          test:{"system":"yxcode","page":"yxcodedemo","element":"test"},
          test2:{"system":"yxcode","page":"yxcodedemo","element":"test2"}

        },
        addModalVisible: false,
        tableDatas:{
          columns:[
            {
              key: "id",
              title: "id"
            },
            {
              key: "name",
              title: "姓名"
            },
            {
              key: "age",
              title: "年龄"
            },
            {
              key: "profession",
              title: "职业"
            }
          ],
          data: [
            {
              id:"preson001",
              name: "张三",
              age:18,
              profession: "Senior R & D Engineer"
            },
            {
              id:"person002",
              name:"李四",
              age:19,
              profession: "teacher"
            },
            {
              id:"person003",
              name:"王五",
              age:20,
              profession: "sicentist"
            }
          ]
        },
        current: 1,
        pageSize:10,
        total: 0,
        modalTitle:'新增',
        addLoading:false,
        submitLoading:false,
        formValidate: {
          channelName: '',
          channelNum: '',
          primateMainBrandCode: '',
          secondMainBrandCode: '',
          businessType: '',
          primateProvinceCode: '',
          secondProvinceCode: '',
          productName: '',
          productNum: '',
          product:{
            productName: '',
            productNum: '',
          },
          sourceFileName: "",
          fileId: "",

        },
        defaultList:[],
        ruleValidate: {
          channelName: [{
            required: true,
            message: '渠道名称不能为空',
            trigger: 'blur'
          }],
          channelNum: [{
            required: true,
            message: '渠道编号不能为空',
            trigger: 'blur'
          }],

          productName: [{
            required: true,
            message: '产品名称不能为空',
            trigger: 'blur'
          }],
          productNum: [{
            required: true,
            message: '产品编号不能为空',
            trigger: 'blur'
          }],

          primateMainBrandCode:[{
            required: true,
            message: '请选择主营品牌',
            trigger: 'change'
          }],
          secondMainBrandCode:[{
            required: true,
            message: '请选择品牌',
            trigger: 'change'
          }],
          primateProvinceCode:[{
            required: true,
            message: '请选择省',
            trigger: 'change'
          }],
          secondProvinceCode:[{
            required: true,
            message: '请选择市',
            trigger: 'change'
          }]
        },
        businessTypeList: [],
        searchObj: {
          channelName: '',
          channelNum: '',
          businessType: '',
          primateProvinceCode: '',
          secondProvinceCode: '',
          primateMainBrandCode: '',
          secondMainBrandCode: '',
          product:{
            productName: '',
            productNum: '',
          }
        },
        provinceList: [],
        cityList: [],
        cityListModal: [],
        brandList: [],
        brandListModal: [],
        mainBrandList: [],
        columns: [
          {
          title: '渠道名称',
          key: 'channelName',
          },
          {
            title: '渠道编号',
            key: 'channelNum',

          },
          {
            title: '产品名称',
            key: 'productName',
          },
          {
            title: '产品编号',
            key: 'productNum',
          },
          {
            title: '主营品牌',
            key: 'primateMainBrandCode',
            render: (h, params) => {
              return h('div', [
                h('span', params.row.primateMainBrandName+'-'+params.row.secondMainBrandName)
              ]);
            }
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                }, '编辑'),
                h('a', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row.id)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        data: [],
        editFlag:false,
        editObj:{}
      }
    },
    methods:{
      openNewTab () {
        this.$bus.$emit("newTab", {"id": "newTab", isShow: true, "name":"tab页中打开新标签页"});
      },
      onUploadPreview(file){
        console.log(file);
        let fileId;
        if(this.editFlag){
          fileId =  file.fileId
        }else{
          if(!file.response){
            fileId =  file.fileId
          }else{
            fileId =  file.response.data.fileId
          }

        }
        window.location.href = '/api/fileDownload/download?fileId='+fileId

      },

      uploadSuccess(response, file, fileList){

        this.defaultList = [];
        let obj={
          'name': response.data.sourceFileName,
          'fileId':response.data.fileId
        }
        this.defaultList.push(obj);
        this.formValidate.fileId = response.data.fileId;
        this.formValidate.sourceFileName = response.data.sourceFileName;
        this.$Modal.success({
          title: '提示',
          content: '上传成功'
        });
      },
      uploadError(response, file, fileList){
        this.$Modal.success({
          title: '提示',
          content: '上传失败'
        });
      },
      //iview的导出
      exportTable1(){
        this.$refs.table.exportCsv({
          filename: 'demo列表',
          columns: this.columns,
          data:this.data
        });
      },
      //处理二进制流导出
      exportTable(){
        let list = this.searchObj;
        this.$http.post('/yxcode-channel-gateway/demo/demo/channel/export/condition',list,{params: "application",responseType: 'arraybuffer'}).then(res => {
          // 创建隐藏的可下载链接
          let content = res.data;
          var eleLink = document.createElement('a');
          eleLink.download = 'demo列表.xlsx';
          eleLink.style.display = 'none';
          // 字符内容转变成blob地址
          var blob = new Blob([content],{ type: 'application/force-download;charset=UTF-8' });
          eleLink.href = URL.createObjectURL(blob);
          // 触发点击
          document.body.appendChild(eleLink);
          eleLink.click();
          // 然后移除
          document.body.removeChild(eleLink);
        });
      },
      //获取省份
      getInitProvinces(){
        this.$http.post('/yxcode-channel-gateway/demo/api/basicRegion/getProvinces').then(res => {
          let data  = [];
          if(res.data.success){
            if(res.data.data.length){
              res.data.data.map((item,i)=>{
                item.value = ''+item.regionId;
                item.label = item.name;
              });
              data = res.data.data;
            }
            this.provinceList = data;
          }
        });
      },
      //省份change 获取市
      getSubCity(val, edit,fn){
        if(val==''){
          return false;
        }

        this.formValidate.secondProvinceCode = "";
        this.$http.post('/yxcode-channel-gateway/demo/api/basicRegion/getSubRegions',{
          regionId:val
        }).then(res => {
          this.cityList = [];
          this.cityListModal = [];
          let  data=[];
          if(res.data.success){
            if(res.data.data.length){
              res.data.data.map((item,i)=>{
                item.value = ''+item.regionId;
                item.label = item.name;
              });
              data = res.data.data;
            }
            if(edit && edit==="edit"){
              this.cityListModal = data;
              fn && fn();
            }else{
              this.cityList = data;
              this.cityListModal = data;
            }
          }
        });
      },
      //获取主营品牌
      getprimateMainBrandCode(){
        this.$http.get('/yxcode-channel-gateway/demo/api/vehicleLib/masterBrand').then(res => {
          let data  = [];
          //debugger
          //if(res.data.success){
          if(res.data.data.length){
            res.data.data.map((item,i)=>{
              item.value = item.id;
              item.label = item.name;
            });
            data = res.data.data;
          }
          this.mainBrandList = data;

          //}
        });
      },
      //主营品牌change 获取二级
      getBrand(val, edit,fn){
        if(val==''){
          return false;
        }

        this.formValidate.secondMainBrandCode = "";
        this.$http.get('/yxcode-channel-gateway/demo/api/vehicleLib/brand?masterId='+val).then(res => {
          let data  = [];
          this.brandList=[];
          this.brandListModal = [];
          //if(res.data.success){
          if(res.data.data.length){
            res.data.data.map((item,i)=>{
              item.value = item.id;
              item.label = item.name;
            });
            data = res.data.data;
          };


          if(edit && edit==="edit"){
            this.brandListModal = data;
            fn && fn();
          }else{
            this.brandList = data;
            this.brandListModal = data;
          }
          //}
        });

      },
      //查询
      search(){
        this.searchObj.current = 1;
        this.searchObj.rowCount = 10;
        let list = this.searchObj;
        this.getTableList(list);
      },
      //重置
      reset(){
        this.resetFn(this.searchObj)
        this.getTableList({});
      },
      resetFn(params){
        params.channelName = ''
        params.channelNum = ''
        params.product.productNum= '',
          params.product.productName='';
        params.primateProvinceCode= '';
        params.secondProvinceCode= '';
        params.primateMainBrandCode='';
        params.secondMainBrandCode= '';
      },
      //编辑
      edit(params){
        //debugger
        console.log(params);
        this.addLoading = false;
        this.submitLoading = false;
        this.defaultList=[];
        this.editObj = params;
        if(params.sourceFileName==''){
          this.defaultList=[];
        }else{
          let obj={
            'name': params.sourceFileName,
            'url':params.fileUrl,
            'fileId':params.fileId
          }
          this.defaultList.push(obj);
        };

        let  editData =  {
          channelName: params.channelName,
          channelNum: params.channelNum,
          primateMainBrandCode: params.primateMainBrandCode,
          secondMainBrandCode: params.secondMainBrandCode,
          businessType: params.businessType,
          primateProvinceCode: String(params.primateProvinceCode),
          secondProvinceCode: String(params.secondProvinceCode),
          productName: params.product.productName,
          productNum: params.product.productNum,
          product:{
            productName: params.product.productName,
            productNum: params.product.productNum,
          },
          sourceFileName: params.sourceFileName,
          fileId: params.fileId
        };

        let _this = this;
        this.getSubCity(''+params.primateProvinceCode, "edit",()=>{
          _this.getBrand(params.primateMainBrandCode, "edit",()=>{

            _this.formValidate = editData;

            _this.editFlag = true;
            _this.modalTitle = '编辑'
            _this.addModalVisible = true;
          });
        });
      },
      //删除
      remove(id){
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定要删除吗？</p>',
          onOk: () => {
            this.$http.post('/yxcode-channel-gateway/demo/demo/channel/del/'+id,{}).then(res => {
              if(!res.data.hasErrors){
                this.$Modal.success({
                  title: '提示',
                  content: '删除成功',
                  onOk: () => {
                    this.getTableList({});
                  },
                });
              }else{
                this.$Modal.error({
                  title: '提示',
                  content: res.data.errorMessage
                });
              }
            });
          },
          onCancel: () => {

          }
        });

      },
      //获取列表
      getTableList(param,fn){
        this.$http.post('/yxcode-channel-gateway/demo/demo/channel/query/notStarted',param,{params: "application"}).then(res => {
          if(!res.data.hasErrors){
            if(res.data.data.data.length){
              res.data.data.data.map((item,i)=>{
                item.productName = item.product.productName;
                item.productNum = item.product.productNum;
              });
            };
            this.total = res.data.data.total;
             res.data.data.data.map((item)=>{
               this.data.push(item);
             });
            this.current =  res.data.data.current;
          }
          fn && fn();
        });
      },

      //添加
      add() {
        this.addModalVisible = true;
        this.editFlag = false;
        this.addLoading = false;
        this.submitLoading = false;
        this.cityListModal = [];
        this.brandListModal = [];
        this.resetFn(this.formValidate);
        this.formValidate.productName='';
        this.formValidate.productNum='';
        this.formValidate.fileId = '';
        this.formValidate.sourceFileName = '';
        this.$refs.upload.clearFiles();
        this.$refs.formValidate.resetFields();
        this.modalTitle = '新增'
      },
      addModalOk() {
        this.handleSubmit()
      },
      addModalCancel() {
        this.handleReset()
      },
      submitSubmit(name){
        //提交
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            if(this.editFlag){

              let  editData =  {
                id:this.editObj.id,
                channelName:  this.formValidate.channelName,
                channelNum:  this.formValidate.channelNum,
                primateMainBrandCode:  this.formValidate.primateMainBrandCode,
                secondMainBrandCode:  this.formValidate.secondMainBrandCode,
                primateProvinceCode: this.formValidate.primateProvinceCode,
                secondProvinceCode: this.formValidate.secondProvinceCode,
                product:{
                  id: this.editObj.product.id,
                  productName:  this.formValidate.productName,
                  productNum:  this.formValidate.productNum,
                },
                sourceFileName:  this.formValidate.sourceFileName,
                fileId:  this.formValidate.fileId
              };
              this.$http.post('/yxcode-channel-gateway/demo/channelWfptController/commitChannelInfo',editData,{
                params: "application"
              }).then(res => {
                console.log(res)
                if(!res.data.hasErrors){
                  this.addModalVisible = false;
                  this.$Modal.success({
                    title: '提示',
                    content: '编辑提交成功',
                    onOk: () => {
                      this.getTableList({});
                      this.$refs[name].resetFields();
                    },

                  });
                }else{
                  this.$Modal.error({
                    title: '提示',
                    content: res.data.errorMessage
                  });
                }
                this.submitLoading = false;
              });
            }else{
              let  editData =  {
                channelName:  this.formValidate.channelName,
                channelNum:  this.formValidate.channelNum,
                primateMainBrandCode:  this.formValidate.primateMainBrandCode,
                secondMainBrandCode:  this.formValidate.secondMainBrandCode,
                primateProvinceCode: this.formValidate.primateProvinceCode,
                secondProvinceCode: this.formValidate.secondProvinceCode,
                product:{
                  productName:  this.formValidate.productName,
                  productNum:  this.formValidate.productNum,
                },
                sourceFileName:  this.formValidate.sourceFileName,
                fileId:  this.formValidate.fileId
              };
              this.$http.post('/yxcode-channel-gateway/demo/channelWfptController/commitChannelInfo',editData,{
                params: "application"
              }).then(res => {
                console.log(res)
                if(!res.data.hasErrors){
                  this.addModalVisible = false;
                  this.$Modal.success({
                    title: '提示',
                    content: '添加提交成功',
                    onOk: () => {
                      this.getTableList({});
                      this.$refs[name].resetFields();
                    },
                  });

                }else{
                  this.$Modal.error({
                    title: '提示',
                    content: res.data.errorMessage
                  });
                }
                this.submitLoading = false;
              });
            }

          } else {
            // this.$Message.error('Fail!');
          }
        })
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.addLoading = true;
            if(this.editFlag){

              let  editData =  {
                id:this.editObj.id,
                channelName:  this.formValidate.channelName,
                channelNum:  this.formValidate.channelNum,
                primateMainBrandCode:  this.formValidate.primateMainBrandCode,
                secondMainBrandCode:  this.formValidate.secondMainBrandCode,
                primateProvinceCode: this.formValidate.primateProvinceCode,
                secondProvinceCode: this.formValidate.secondProvinceCode,
                product:{
                  id: this.editObj.product.id,
                  productName:  this.formValidate.productName,
                  productNum:  this.formValidate.productNum,
                },
                sourceFileName:  this.formValidate.sourceFileName,
                fileId:  this.formValidate.fileId
              };
              this.$http.post('/yxcode-channel-gateway/demo/demo/channel/update',editData,{
                params: "application"
              }).then(res => {
                console.log(res)
                if(!res.data.hasErrors){
                  this.addModalVisible = false;
                  this.$Modal.success({
                    title: '提示',
                    content: '编辑成功',
                    onOk: () => {
                      this.getTableList({});
                      this.$refs[name].resetFields();
                    },

                  });
                }else{
                  this.$Modal.error({
                    title: '提示',
                    content: res.data.errorMessage
                  });
                }
                this.addLoading = false;
              });
            }else{
              let  editData =  {
                channelName:  this.formValidate.channelName,
                channelNum:  this.formValidate.channelNum,
                primateMainBrandCode:  this.formValidate.primateMainBrandCode,
                secondMainBrandCode:  this.formValidate.secondMainBrandCode,
                primateProvinceCode: this.formValidate.primateProvinceCode,
                secondProvinceCode: this.formValidate.secondProvinceCode,
                product:{
                  productName:  this.formValidate.productName,
                  productNum:  this.formValidate.productNum,
                },
                sourceFileName:  this.formValidate.sourceFileName,
                fileId:  this.formValidate.fileId
              };
              this.$http.post('/yxcode-channel-gateway/demo/demo/channel/add',editData,{
                params: "application"
              }).then(res => {
                console.log(res)
                if(!res.data.hasErrors){
                  this.addModalVisible = false;
                  this.$Modal.success({
                    title: '提示',
                    content: '添加成功',
                    onOk: () => {
                      this.getTableList({});
                      this.$refs[name].resetFields();
                    },
                  });

                }else{
                  this.$Modal.error({
                    title: '提示',
                    content: res.data.errorMessage
                  });
                }
                this.addLoading = false;
              });
            }

          } else {
            // this.$Message.error('Fail!');
          }
        })
      },
      handleReset(name) {
        this.resetFn(this.formValidate);
        this.formValidate.fileId = '';
        this.formValidate.sourceFileName = '';
        this.$refs[name].resetFields();
        this.addModalVisible = false;
      },

    },
    mounted () {
      this.getprimateMainBrandCode();
      this.getInitProvinces();
      this.getTableList({});
      console.log(this)
    },
    destroyed () {

    }
  }
</script>

<style lang="less" scoped>
  .contentner{
    padding:0 0 100px 0;
  }
  .demo{
    .selinput .ivu-input-wrapper,
    .selinput .ivu-select {
      width: 50%;
    }
    .permissionStyle {
      display: inline-block;
    }

    .selinput .selectSpc {
      width: 24%;
      margin-right: 1%;
    }

    .bot14 {
      margin-bottom: 14px;
    }
    .ivu-col label {
      width: 70px;
      display: inline-block;
      text-align: right;
      padding-right: 5px;
    }

    .btns {
      text-align: center;
      .ivu-btn {
        margin-right: 2%;
        font-size: 14px;
      }
    }

    .optionArea {
      text-align: right;
      margin: 10px 0px;
      .ivu-btn {
        margin-right: 10px;
        font-size: 14px;
      }
    }

    .pageT {
      text-align: right;
      margin-top: 10px;
    }
  }
  .addform .ivu-form-item {
    margin-bottom: 18px;
  }

  .addform .ivu-form-item-error-tip {
    padding-top: 3px!important;
    white-space: nowrap;
  }

  .tableStyle .ivu-table table {
    width: 100%!important;
  }
  .addform .ivu-input-wrapper,
  .addform .ivu-select {
    width: 80%;
  }

  .addform .selectSpc {
    width: 98%;
    margin-right: 1%;
  }
</style>
