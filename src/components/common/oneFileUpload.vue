<!-- 单个附件上传 -->
<template>
  <div>
    <Upload
      :class="{disableClick: btns.indexOf('again') < 0}"
      name="uploadedFile"
      action="zuul/channel/file/upload.do"
      :show-upload-list="true"
      :format="['jpg','jpeg','pdf','png']"
      :max-size="20480"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :on-success="handleSuccess"
      :before-upload="handleBeforeUpload"
      style="margin-top:10px;">
      <div class="demo-upload-list">
        <img :src="imgSrc" class="uploadImg">
        <div class="demo-upload-list-cover" v-if="imgSrc !== defaultImg" @click="clickCover">
          <Icon v-if="btns.indexOf('show') > -1" type="ios-eye-outline" @click.stop="handleView" title="查看"></Icon>
          <Icon v-if="btns.indexOf('delete') > -1" type="ios-trash-outline" @click.stop="handleDelete" title="删除"></Icon>
          <Icon v-if="btns.indexOf('down') > -1" type="md-arrow-down" @click.stop="handleDown" title="下载"></Icon>
          <Icon v-if="btns.indexOf('again') > -1" type="ios-sync" title="重选"></Icon>
        </div>
      </div>
      
    </Upload>
    <span v-if="btns.indexOf('again') > -1" class="color-upload" style="position: absolute;left:110px;top:77px">单个附件大小不超过20M，支持PDF/JPG/PNG格式</span>
    <!-- <Modal title="查看图片" v-model="visible" class-name="imgModal" width="600">
      <img :src="imgSrc_source" v-if="visible" style="width:100%">
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
    props:{
      value:{
        type: Object,
        default: {}
      },
      attachmentCode: {
        type: String,
        default: ''
      },
      // ['show','delete','down','again']
      btns: {
        type: Array,
        default: []
      },
    },
    data() {

      return {
        defaultImg: defaultImg,
        defaultIMGImg: defaultIMGImg,
        defaultPDFImg: defaultPDFImg,
        defaultWORDImg: defaultWORDImg,
        defaultXLSImg: defaultXLSImg,
        imgSrc: '',
        imgSrc_source:'',  //原图
        visible: false,
        showFlag: false,
        imgList:[],
      }
    },
    watch:{
     
      value: {
          handler: function (newVal) {

            if($.isEmptyObject(newVal)){
              this.imgSrc = this.defaultImg;
            }else{
            	this.returnImg(newVal);
            }
            this.$emit('update:value', newVal);



          },
          deep: true
        }
    },
    methods: {
     
      // 判断点击遮罩层位置
      clickCover(event){
        let targetDom =  event.target.className;
        if(targetDom !== 'ivu-icon ivu-icon-ios-sync'){
          event.stopPropagation();
          return ;
        }
      },
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

                  self.$emit('update:value', d);

                  self.$emit('clearValidate');
            
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
              
              self.$emit('update:value', d);

              self.$emit('clearValidate');
        
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
      handleBeforeUpload (data) {
          this.imgPreview(data)
          return false;
      },
      // 格式错误
      handleFormatError(){
        this.$Message.error('文件格式不支持！');
      },
      // 超出文件大小限制
      handleMaxSize(){
        this.$Message.error('超过最大文件限制！');
      },
      // 上传成功
      handleSuccess (res, file) {

      },
      // 查看图片
      handleView () {
        if(!this.showFlag){
          this.$Message.info('此类型文件不支持查看！');
          return;
        }
        // this.visible = true;
        this.openBig();
      },
      // 删除
      handleDelete(){

      },
      // 下载
      handleDown(){
        window.open( this.imgSrc_source );
      },
      // 返显图片
      returnImg(newVal){
      	var x = newVal.serverFileName;
        var y = x.lastIndexOf(".");
        var idx = x.substring(y); 
        this.showFlag = false;

        if(idx === '.pdf'){
          this.imgSrc = this.defaultPDFImg;
        }else
        if(idx === '.doc'){
          this.imgSrc = this.defaultWORDImg;
        }else
        if(idx === '.docx'){
          this.imgSrc = this.defaultWORDImg;
        }else
        if(idx === '.ppt'){
          this.imgSrc = this.defaultXLSImg;
        }else
        if(idx === '.pptx'){
          this.imgSrc = this.defaultXLSImg;
        }else{
          if(newVal.serverThumbnailFileName){
            this.imgSrc =  this.$imgURL_PATH + newVal.serverThumbnailFileName;
          }else{
            this.imgSrc = this.defaultIMGImg;
          }
          this.showFlag = true;
           
        }
        this.imgSrc_source = this.$imgURL_PATH + newVal.serverFileName;

        // 返显图片列表
        let _this = this;
        let img = new Image();
        img.src = this.imgSrc_source;
        img.onload = function() {
            _this.imgList = [
              {
                src: _this.imgSrc_source,
                w: img.width,
                h: img.height
              }
            ]
            _this.$previewRefresh()
        }

      },

      // 打开大图
      openBig(){
          var pswpElement = document.querySelectorAll('.pswp')[0];
         
          // define options (if needed)
          var options = {
              shareEl: false,
              closeOnScroll: false,
              history: false,
              focus: false,

              showAnimationDuration: 0,
              hideAnimationDuration: 0
          };
          
          var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, this.imgList, options);
          gallery.init();
      }
    },
    mounted () {
          
            if($.isEmptyObject(this.value)){
	              this.imgSrc = this.defaultImg;
            }else{
            	this.returnImg(this.value);
            }

            $('.disableClick .ivu-upload').on('click',function(event){
                event.preventDefault();
            })
    }
  }
</script>
<style type="text/css">
  .ivu-upload .ivu-upload-select{
    height:100px;
  }
</style>
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
    /*box-shadow: 0 1px 1px rgba(0,0,0,.2);*/
    /*margin: 10px;*/
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
  

</style>



