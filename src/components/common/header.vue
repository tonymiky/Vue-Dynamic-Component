<template>
	<!-- 头部 -->
    <div class="po-header clearfix">
        <a href="#" class="clearfix">
            <img alt="智能管理后台" src="../../assets/images/layout_set_logo.png">
            <span>销售渠道管理平台</span>
        </a>
        <!-- <ul class="clearfix">
            <li>
              <a @click="goHome">首页</a>
              <span class="divider"></span>
            </li>
        </ul> -->
        <!-- 用户登录 -->
        <div class="user-message">
            <ul class="user-reminder clearfix">
              <li class="user-name" @click="drop = !drop">
                <a href="javascript:void(0)">
                  <span class="user-logo">
                    <img v-if="userinfo.headPortraits === ''" src="../../assets/images/users.png" id="userpic"/>
                    <img v-else :src="userinfo.headPortraits" id="userpic"/>
                  </span>
                  <span class="po-name" id="userName">{{ userinfo.userName }}</span>
                </a>
              </li>
            </ul>
            <!-- 下拉菜单 -->
            <ul class="drop-down" v-if="drop" @mouseleave="drop = !drop">
                <!-- <li @click="modal1 = !modal1">
                    <div>
                        <span class="icon-user"></span>
                        <span>我的账户</span>
                    </div>
                </li>
                <li @click="modifyPassword">
                    <div>
                        <span class="edit-password"></span>
                        <span>修改密码</span>
                    </div>
                </li> -->
                <li class="logout" @click="loginout()">
                    <div>
                        <span class="exit"></span>
                        <span>退出</span>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 我的账户 -->
        <Modal
            v-model="modal1"
            title="个人信息"
            class="po-person"
            >
            <p><label>所属部门：</label>{{ personalInfo.num9 }}</p>
            <p><label>姓名：</label>{{ personalInfo.cnName }}</p>
            <p v-if="~~personalInfo.sex === 0"><label>性别：</label>女</p>
            <p v-else><label>性别：</label>男</p>
            <p><label>域账号：</label>{{ personalInfo.domainAccount }}</p>
            <p><label>手机号：</label>{{ personalInfo.mobile }}</p>
            <p><label>邮箱：</label>{{ personalInfo.email }}</p>
            <div slot="footer"></div>
        </Modal>
        <!-- 修改密码 -->
        <Modal
            v-model="modal2"
            title="修改密码"
            @on-ok="save"
            >
            <div class="po-mima">
                <label>域账号</label>
                <Input class="po-mima-input" v-model="userinfo.userAccount" style="width: 300px" :readonly="Boolean('true')"></Input>
            </div>
            <div class="po-mima">
                <label>原密码</label>
                <Input class="po-mima-input" :type="isOldShow?'password':'text'" v-model="userPass.a" style="width: 300px"></Input>
                <span class="isOpen" :class="{isActive:isOldShow}" @click="oldPasswordButton"></span>
            </div>
            <div class="po-mima">
                <label>新密码</label>
                <Input class="po-mima-input" :type="isNewShow?'password':'text'" v-model="userPass.b" style="width: 300px"></Input>
                <span class="isOpen" :class="{isActive:isNewShow}" @click="newPasswordButton"></span>
            </div>
            <div class="po-mima" :class="{password: ispassword}" v-if="!showlog">
                <p>密码由 7-15 位英文字母、数字和符号组成</p>
            </div>
            <div class="po-mima" :class="{password: ispassword}" v-else>
                <p>新旧密码不允许相同</p>
            </div>
            <div slot="footer">
                <Button type="primary" @click="save" :disabled="ispassword">确定</Button>
                <Button  @click="channel">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
	export default {
        name: "",
		data () {
			return {
				drop: false,
        modal2: false,
        showlog: false,
        userinfo: [],
        personalInfo: {},
        unreadmsg: [],
        newShow: false,
        newsShow: false,
        getNewsCount: 0,
        ispassword: false,
        modal1: false,
        userPass: {
            a: "",
            b: ""
        },
        isOldShow:true,
        isNewShow:true,
        NameReg:/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*\(\).?><\:\\\=\+\[\]\{\}_\|\/\'\"])[\da-zA-Z~!@#$%^&*\(\).?><\:\\\=\+\[\]\{\}_\|\/\'\"]{7,15}$/

    }
		},
        created () {
             this.$ajax.get('/user/currentUser').then(res =>{
                     if(res.data.success){
                         this.userinfo = res.data.data;
                     }else{
                       window.location.href = res.data.errorMessage;
                     }
            });
            // 获取未读消息总条数
            //this.$http.post('/wportal/unreadInformTotal').then(res => this.getNewsCount = this.$format(res.data).data);
        },
        methods: {
          goHome () {
            this.$bus.$emit("home")
          },
            goNews (obj) {
                // 向 index.vue/index.vue.vue 传递参数
                this.$router.push({ path: 'main' });
                this.$bus.$emit('newsIndex', obj);
            },
            getNews () {
                this.newsShow = !this.newsShow;
                this.$http.post('/wportal/unreadInformNum').then(res => {
                    // 获取所有消息的key
                  console.log(res)
                    let key = Object.keys(this.$format(res.data).data);
                    let value = Object.values(this.$format(res.data).data);
                    let obj = [];
                    if (key.length > 0) {
                        this.newShow = !this.newShow;
                        key.forEach( (element, index) => {
                           obj.push({
                                name: element,
                                value: value[index]
                           })
                        });
                    }
                    this.unreadmsg = obj;
                });
            },
          oldPasswordButton () {
               this.isOldShow = !this.isOldShow;
          },
          newPasswordButton () {
            this.isNewShow = !this.isNewShow;
          },
            save () {
               if (!this.ispassword && this.NameReg.test(this.userPass.b)) {
                    this.$http.post('/wportal/updatePassWord',{
                        oldPassWord: this.userPass.a,
                        type: 1,
                        newPassWord: this.userPass.b
                    }).then(res => {
                      if(res.data.success===true){
                        this.modal2 = !this.modal2;
                        this.isOldShow = false;
                        this.isNewShow = false;
                        this.ispassword = false;
                        this.$Modal.success({
                          title: "成功",
                          content: res.data.data,
                          onOk: () => {
                          }
                        });
                      }else{
                        this.$Modal.error({
                          title: "错误",
                          content: res.data.errorMessage,
                          onOk: () => {
                          }
                        });
                      }
                    });
               }else{
                 this.ispassword = true;
                 return false;
               }
               this.ispassword = false;
            },
            channel () {
              this.modal2 = !this.modal2;
              this.ispassword = false;
              this.showlog = false;
              this.isOldShow = false;
              this.isNewShow = false;
            },
            modifyPassword () {
              this.modal2 = !this.modal2;
              this.ispassword = false;
              this.showlog = false;
              this.isOldShow = true;
              this.isNewShow = true;
            },
            loginout () {
                this.$ajax.get('/user/logout').then(res => {
                  console.log(res.data.data)
                  window.location.href = res.data.data
                });
            }
        },
        watch: {
            userinfo (res) {
                localStorage.setItem("userInfo", res.userAccount);
            },
            ["userPass.b"] () {
                let reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*\(\).?><\:\\\=\+\[\]\{\}_\|\/\'\"])[\da-zA-Z~!@#$%^&*\(\).?><\:\\\=\+\[\]\{\}_\|\/\'\"]{7,15}$/;
                let blerA = this.userPass.a;
                let blerB = this.userPass.b;
                // 区分提示信息
                if (blerA === blerB) {
                    this.showlog = true;
                    this.ispassword = true;
                    return false;
                }
                // 密码验证规则
                if(reg.test(blerB)){
                  if (blerA !== blerB) {//true
                    this.ispassword = false;
                    this.showlog = false;
                  }else{//false
                    this.ispassword = true;
                    this.showlog = true;
                  }
                }else{
                  this.ispassword = true;
                  this.showlog = false;
                }


            },
            modal1 (val) {
                if (val) {
                    let this_ = this;
                    this.$http.post('/wportal/findOneByDomainAccount').then(res => this_.personalInfo = res.data);
                }
            },
            modal2 (val) {
                if (!val) this.userPass = {
                    b: "",
                    c: ""
                };
            }
        }
	}
</script>
<style lang="less" scoped>
.po-news::before {
    content: " ";
    height: 0;
    width: 0;
    line-height: 0;
    position: absolute;
    right: 18px;
    top: -12px;
    border: 6px solid transparent;
    border-bottom-color: #5ba5ef;
}
.po-news {
    position: absolute;
    padding: 0;
    right: 100px;
    top: 50px;
    width: 180px;
    max-height: 166px;
    font-size: 13px;
    z-index: 12;
    background: #FFFFFF;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-box-shadow: 0 0 20px #aaaaaa;
    box-shadow: 0 0 20px #aaaaaa;
    .cur {
        line-height: 128px;
        text-align: center;
    }
    ul {
        display: block;
        overflow-x:hidden;
        overflow-y:auto;
        height: 128px;
        li {
            width: 100%;
            height: 30px;
            line-height: 30px;
            margin-left: 10px;
            color: #009ae5;
            cursor: pointer;
            span {
              position: static;
              display: inline-block;
              margin: 0;
              padding: 0 3px;
              color: #FFFFFF;
              background: #fd5263;
              line-height: 18px;
              height: 18px;
              min-width: 18px;
              border-radius: 9px;
              text-align: center;
            }
        }
    }
    .po-news-title {
        height: 40px;
        background: #5ba5ef;
        overflow: hidden;
        span:first-child {
            float: left;
            position: static;
            color: #FFFFFF;
            margin-left: 10px;
            margin-top: 3px;
        }
        span {
            position: static;
            line-height: 40px;
            height: 40px;
            float: right;
            margin-right: 10px;
        }
    }
}
.po-person {
    p {
        height: 35px;
        line-height: 35px;
        padding-left: 20px;
        label {
            display: inline-block;
            width: 60px;
            text-align: right;
        }
    }
}
.password {
    color: red;
}
.po-mima {
    margin-top: 15px;
    p {
        padding-left: 65px;
    }
    .po-mima-input {
        margin-left: 10px;
    }
  .isOpen{
    display: inline-block;
    width:17px;
    height:7px;
    background: url('../../assets/images/01@2x.png') no-repeat center center;
    cursor:pointer;
  }
  .isActive{
    display: inline-block;
    width:17px;
    height:7px;
    background: url('../../assets/images/02@2x.png') no-repeat center center;
  }
}
.po-header {
    position: fixed;
    top:0;
    z-index: 9;
    width: 100%;
    height: 70px;

    background: #465885;
    //border-bottom: 1px solid #e9e9e9;
    background-size: cover;
}

.po-header > a {
    display: inline-block;
    float: left;
}

.po-header > a > img {
    height: 69px;
    width: 165px;
    float: left;
}

.po-header > a > span {
    font-size: 14px;
    color: #fff;
    font-weight: 300;
    float: left;
    height: 66px;
    line-height: 70px;
    margin: 4px 0 0 9px;
}

.po-header > ul {
    display: inline-block;
    float: left;
    line-height: 70px;
    margin-left: 28px;
}

.po-header > ul > li {
    position: relative;
    float: left;
    color: #fff;
    height: 70px;
    font-weight: 300;
}

.po-header > ul > li > a {
    font-size: 12px;
    font-weight: 300;
    color: #fff;
    padding:  0 14px;
}
.user-message {
    position: relative;
    float: right;
    line-height: 70px;
    margin-right: 40px;
    height: 70px;
}
.user-reminder li {
    float: left;
}
.user-logo img {
    display: inline-block;
    width: 10px;
    height: 12px;
    vertical-align: inherit;
    margin-right: 5px;
}
.user-message a {
    color: #fff;
    text-decoration: none;
}
.user-message a:hover {
    text-decoration: none;
}

.user-message .drop-down {
    position: absolute;
    top: 60px;
    right: 0;
    width: 135px;
    background: #fff;
    border-radius: 4px;
}
.user-message .drop-down li {
    padding: 10px 25px;
    line-height: 1;
}
.user-message .drop-down li:hover {
    background: #F3F3F3;
    border-radius: 4px;
}
.drop-down li div {
    color: #333333;
    font-size: 14px;
    cursor:pointer;
}
.user-name .po-name {
    position: relative;
    display: inline-block;
    min-width: 10px;
}


.reminder-item {
    .message-num {
        min-width: 20px;
        height: 18px;
        line-height: 18px;
        padding:0 3px;
        background: #fd6206;
        color: #fff;
        display: inline-block;
        position: absolute;
        left: 28px;
        top: 5px;
        font-size: 12px;
        font-weight: 700;
        border-radius: 2px 2px 2px 0px;
        text-align: center;
    }
}

.reminder-item::after {
    content: "";
    display: inline-block;
    width: 1px;
    height: 25px;
    background: #53b4fc;
    margin: 0 25px;
    margin-top: 25px;
}
.po-header ul .divider {
    height: 12px;
    width: 1px;
    display: inline-block;
    background: #53b4fc;
    position: absolute;
    top: 50%;
    margin-top: -4px
}
.po-header > ul > li .message-num {
    width: 20px;
    height: 18px;
    line-height: 18px;
    background: #fd6206;
    color: #fff;
    display: inline-block;
    position: absolute;
    right: -3px;
    top: 10px;
    font-size: 12px;
    font-weight: 700;
    border-radius: 2px 2px 2px 0px;
    text-align: center;
}
.message-num::after {
    content: "";
    position: absolute;
    top: 18px;
    left: 0;
    width: 0;
    height: 0;
    line-height: 0;
    border-top:  5px solid #fd6206;
    border-right: 5px solid transparent;
}
.drop-down .icon-user, .drop-down .edit-password, .exit {
    font-family: "pictos";
    font-size: 14px;
    color: #999;
    vertical-align: middle;
}
.drop-down li a:hover{
    text-decoration: none;
}
.drop-down::before {
    content: " ";
    height: 0;
    width: 0;
    line-height: 0;
    position: absolute;
    right: 18px;
    top: -12px;
    border: 6px solid transparent;
    border-bottom-color: #fff;
}
.icon-user:before {
    content: "\f007";
}
.edit-password:before {
    content: "\f044";
}
.exit:before {
    content: "\f011";
}
.drop-down span {
    color: #666;
}

#userName {
    padding: 0;
    cursor: pointer;
}
</style>
<style>
.po-person .ivu-modal-footer{
  display: none;
}svn
html,body{
  font-family: "Microsoft YAHEI"!important;
}
</style>
