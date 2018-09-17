const PublicScroll = {
  created: function () {

    let _this = this;

    //加载数据流状态
    //console.log("loadingState: " + this.loadingState);
    //搜索栏class
    //console.log("headerSearchClass: " + this.headerSearchClass);
    //提交按钮class
    //console.log("footerButtonClass: " + this.footerButtonClass);

    this.$jq("body").scrollTop(0);

     let timer = null;
     window.addEventListener("scroll", function(e){
     let sign = 10;
     let scrollTop  = _this.$jq("body").scrollTop();

      let bodyHeight = document.body.scrollHeight;
      let viewHeight = document.documentElement.clientHeight;

      if(timer){
        clearTimeout(timer);
      }

      timer = setTimeout( function(){

        //按需加载数据流
        if(_this.loadingState && bodyHeight-viewHeight-scrollTop<20){
          _this.loadingState = false;
          console.log('改变值：'+_this.loadingState);
          _this.getTableList({},()=>{
            _this.$jq("body").scrollTop((bodyHeight-viewHeight)/2);
            _this.loadingState = true;
          });
        }

        //header footer 固定位置
        if(_this.headerSearchClass){
          let $searchBody = _this.$jq(_this.headerSearchClass);
          let searchHeight = $searchBody.outerHeight();
          let searchWidth = $searchBody.outerWidth();
          //console.log($searchBody.offset().top);

          if ( scrollTop > sign) {
            sign =  scrollTop;//下滚
            $searchBody.css({"position": "fixed", "opacity":1, "width": searchWidth, "z-index": 999}).stop(true,true).animate({"top": scrollTop}, 10, "linear", function(){
              $searchBody.stop(true,true).animate({"opacity":1});
              if(_this.$jq('.search-copy').length===0){
                $searchBody.after("<div class='search-copy' style='height:"+searchHeight+"px'></div>");
              }
            });
          }
          if ( scrollTop< sign) {
            sign =  scrollTop//上滚
            $searchBody.css({"position": "fixed","opacity":1, "width": searchWidth, "z-index": 2}).stop(true,true).animate({"top": scrollTop}, 10, "linear", function(){
              if(scrollTop>=0 && scrollTop<=10){
                _this.$jq('.search-copy').remove();
                $searchBody.css({"position":"", "opacity":1, "width":"auto"});
              }
            });
          }
        }

        if(_this.footerButtonClass){
          let $ButtonFooter = _this.$jq(_this.footerButtonClass);

          let clientH = document.documentElement.clientHeight;
          let clientW = document.documentElement.clientWidth;
          let footerW = $ButtonFooter.outerWidth();

          console.log('clientW: '+(clientW-253));

          $ButtonFooter.css({"position": "fixed","opacity":1, "margin":"0 0 0 23px", "width": clientW-253,"height":90, "bottom":20,"z-index": 1000})
          $ButtonFooter.stop(true,true).animate({"top": scrollTop+clientH-180}, 10, "linear",function(){
            $ButtonFooter.stop(true,true).animate({"opacity":1});
          });
        }
      },300);

      e.preventDefault();
      return false;
    },true)
  }
}

export default PublicScroll;
