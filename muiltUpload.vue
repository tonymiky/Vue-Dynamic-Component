<!-- 其他资料 -->
<template>
    <div >
        <div class="demo-upload-list" v-for="(item,index) in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <div v-if="edit">
                        <Icon type="ios-eye-outline" @click.native="handleView(item,index)" title="查看"></Icon>
                        <Icon type="md-arrow-down" @click.native="handleDown(item)" title="下载"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item,index)" title="删除"></Icon>
                    </div>
                    <div v-else>
                        <Icon type="ios-eye-outline" @click.native="handleView(item,index)" title="查看"></Icon>
                        <Icon type="md-arrow-down" @click.native="handleDown(item)" title="下载"></Icon>
                    </div>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <div class="inline-block" v-show="edit">
            <Upload
                ref="upload"
                name="uploadedFile"
                :show-upload-list="true"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','pdf','png','doc','docx','ppt','pptx']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                :action="$apiURL_PATH + 'file/upload.do'"
                class="demo-upload-list addBtn">
                <Icon type="md-add" size="70" style="margin-top: -25px;"></Icon>

            </Upload>
            <div class="inline-block color-upload" style="vertical-align: text-bottom;position:relative;top:83px">单个附件大小不超过20M，支持PDF/JPG/PNG格式</div>
        </div>
        
        <!-- <Modal title="查看图片" v-model="visible">
            <img :src="imgSrc" style="width: 100%">
            <div slot="footer"></div>
        </Modal> -->

      
    </div>


   
</template>

<script>
  import PhotoSwipe from 'photoswipe'

  import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

  // 暂无图片
  import defaultImg from '@/assets/images/upload.jpg'

  // 默认图片
  import defaultIMGImg from '@/assets/images/d_img.png'

  // 默认PDF
  import defaultPDFImg from '@/assets/images/d_pdf.png'

  // 默认word
  import defaultWORDImg from '@/assets/images/d_word.png'

  // 默认xls
  import defaultXLSImg from '@/assets/images/d_xls.png'

    export default {
        props: {
            value:{
            type: Object,
            default: {}
          },
          attachmentCode: {
            type: String,
            default: ''
          },
          edit:{
            type:Boolean,
            default:false
          }
        },
        watch:{
            value:{
                handler: function (newVal) {

                  this.returnImgs(newVal);

              },
              deep: true
            },
            uploadList:{
                handler: function (newVal) {
                  
                    if(newVal.length >= 10){

                      this.pushFlag = false;

                      if(!this.oneFlag){
                        // this.$Message.error('最多上传10个！');
                      }
                    }else{
                      this.pushFlag = true;
                    }

                    this.oneFlag = false;

              },
              deep: true
            }
        },
        data() {
            return {
                oneFlag: true,
                pushFlag: true,
                uploadList:[],
                defaultList:[],
                defaultImg: defaultImg,
                defaultIMGImg: defaultIMGImg,
                defaultPDFImg: defaultPDFImg,
                defaultWORDImg: defaultWORDImg,
                defaultXLSImg: defaultXLSImg,
                imgSrc: '',
                imgSrc_source:'',  //原图
                visible: false,
                showFlag: false,
            }
        },
        methods: {
           
            //获取图片
              imgPreview(file, callback) {
                let self = this;
                //判断支不支持FileReader
                if (!file || !window.FileReader) return;

                if(file.size > 20480000){
                  this.$Message.error('超过最大文件限制！');
                  return;
                }
                // 图片类型
                if (/^image/.test(file.type)) {
                  //创建一个reader
                  let reader = new FileReader();

                  //将图片转成base64格式
                  reader.readAsDataURL(file);
                  //读取成功后的回调
                  reader.onloadend = function() {
                    let result = this.result;
                    let img = new Image();
                    img.src = result;
                  
                    img.onload = function() {
                      let data = self.compress(img);
                      let blob = self.dataURItoBlob(data);

                      var formData = new FormData();
                      formData.append("uploadedFile", file);
                      formData.append("uploadedFile", blob , file.name);
                      
                      // console.log("********将blob对象转成formData对象********");
                      // console.log(formData.get("file"));

                      let config = {
                        headers: { "Content-Type": "multipart/form-data" }
                      };
                      // 发送请求;
                      self.$ajax.post('zuul/channel/file/upload.do', formData, config).then(res => {
         
                        if (res.data.success) {

                          let d = res.data.data;

                          d.attachmentCode = self.attachmentCode;

                          self.imgSrc = self.$imgURL_PATH + d.serverThumbnailFileName;

                          self.imgSrc_source = self.$imgURL_PATH + d.serverFileName;

                          if(!self.pushFlag) return;

                          self.value.list.push(d)

                          // self.$emit('update:value', d);

                    
                        } else {
                          self.$Message('上传失败，请重试');
                        }
                      });
                    };
                  };

                // PDF类型
                }else if (/.pdf$/.test(file.type)){
                  var formData = new FormData();
                  formData.append("uploadedFile", file);
                  let config = {
                    headers: { "Content-Type": "multipart/form-data" }
                  };
                  // 发送请求;
                  self.$ajax.post('zuul/channel/file/upload.do', formData, config).then(res => {

                    if (res.data.success) {

                      let d = res.data.data;

                      d.attachmentCode = self.attachmentCode;

                      self.imgSrc = self.defaultPDFImg;

                      self.imgSrc_source = self.$imgURL_PATH + d.serverFileName;

                      if(!self.pushFlag) return;

                      self.value.list.push(d);
                      
                      // self.$emit('update:value', d);

                
                    } else {
                      self.$Message('上传失败，请重试');
                    }
                  });
                }else{
                  this.$Message.error('文件格式不支持！');
                  return
                }
              },

              // 压缩图片
              compress(img) {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                let initSize = img.src.length;
                let width = img.width;
                let height = img.height;
                canvas.width = width;
                canvas.height = height;
                // 铺底色
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, width, height);

                //进行最小压缩
                let ndata = canvas.toDataURL("image/jpeg", 0.1);
                return ndata;
              },

              // base64转成bolb对象
              dataURItoBlob(base64Data) {
                var byteString;
                if (base64Data.split(",")[0].indexOf("base64") >= 0)
                  byteString = atob(base64Data.split(",")[1]);
                else byteString = unescape(base64Data.split(",")[1]);
                var mimeString = base64Data
                  .split(",")[0]
                  .split(":")[1]
                  .split(";")[0];
                var ia = new Uint8Array(byteString.length);
                for (var i = 0; i < byteString.length; i++) {
                  ia[i] = byteString.charCodeAt(i);
                }
                return new Blob([ia], { type: mimeString });
              },
            // 上传前
            handleBeforeUpload(data){
                if(this.value.list.length < 10){
                    this.imgPreview(data)
                }else{
                    this.$Message.error('最多上传10个！');
                }
                return false;
            },
            // 查看图片
            handleView (item,index) {
                if(!item.showFlag){
                  this.$Message.info('此类型文件不支持查看！');
                  return;
                }
                // this.visible = true;
                // this.imgSrc = item.downUrl;
                this.openBig(index);

            },
            // 打开大图
            openBig(index){
                var pswpElement = document.querySelectorAll('.pswp')[0];

                var list = this.uploadList.filter(item => {
                  return item.showFlag
                })

                var t_index;

                list.map((item,i) => {
                  if(item.num === index){
                    t_index = i;
                  }
                })
               
                // define options (if needed)
                var options = {
                    shareEl: false,
                    closeOnScroll: false,
                    history: false,
                    focus: false,
                    index: t_index,

                    showAnimationDuration: 0,
                    hideAnimationDuration: 0
                };

                
                
                var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, list, options);
                gallery.init();
            },
            handleRemove (file,index) {

                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除？</p>',
                    onOk: () => {
                        const fileList = this.$refs.upload.fileList;
                        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                        this.value.list.splice(index,1)
                    },
                });
                
            },
            handleSuccess (res, file) {
                res.data.attachmentCode = this.attachmentCode;
                this.value.list.push(res.data);
            },
            // 格式错误
           handleFormatError(){
             this.$Message.error('文件格式不支持！');
           },
           // 超出文件大小限制
           handleMaxSize(){
            this.$Message.error('超过最大文件限制！');
           },
            
            // 下载
            handleDown(item){
              window.open( item.downUrl );
            },

            // 返显图片
            returnImgs(newVal){

                if(newVal.list.length > 0){

                    this.defaultList = newVal.list.map((item,index) => {

                          var url,downUrl,showFlag,num;

                          var x = item.serverFileName;
                          var y = x.lastIndexOf(".");
                          var idx = x.substring(y); 
                          showFlag = false;
                          num = null;

                          if(idx === '.pdf'){
                            url = this.defaultPDFImg;
                          }else
                          if(idx === '.doc'){
                            url = this.defaultWORDImg;
                          }else
                          if(idx === '.docx'){
                            url = this.defaultWORDImg;
                          }else
                          if(idx === '.ppt'){
                            url = this.defaultXLSImg;
                          }else
                          if(idx === '.pptx'){
                            url = this.defaultXLSImg;
                          }else{
                            if(item.serverThumbnailFileName){
                              url =  this.$imgURL_PATH + item.serverThumbnailFileName;
                            }else{
                              url = this.defaultIMGImg;
                            }

                            showFlag = true;
                            num = index;
                             
                          }
                          downUrl = this.$imgURL_PATH + item.serverFileName;

                          
                          return{
                              name: item.attachmentName,
                              showFlag: showFlag,
                              url: url,
                              downUrl: downUrl,
                              src: downUrl,
                              num: num
                          }

                    })
                        
                    this.$nextTick(()=>{
                      this.$previewRefresh();
                      this.uploadList = this.$refs.upload.fileList;
                      this.uploadList.map(item => {
                        let img = new Image();
                        img.src = item.downUrl;
                        img.onload = function() {
                          item.w = img.width;
                          item.h = img.height
                        }
                      })
                    })
                }
              }
        },
        mounted () {
            this.returnImgs(this.value);
        }
    } 
</script>
<style scoped >
     .demo-upload-list{
        display: inline-block;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        /*border: 1px solid transparent;*/
        border-radius: 2px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin: 10px;
        float:left;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .addBtn{
        border:1px solid #e8e8e8;
        line-height: 120px;
        color:#e8e8e8;
        cursor: pointer;
    }

</style>



