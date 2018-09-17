// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import iView from 'iview'
import 'iview/dist/styles/iview.css';
import vblAuth from './components/common/vblAuth';
//import qs from 'qs'
import echarts from 'echarts'
import promise from 'es6-promise'
import $JQ from "jquery"

import "./assets/yxCode.less"

// import upperFirst from 'lodash/upperFirst'
// import camelCase from 'lodash/camelCase'

promise.polyfill();

// window.echarts = echarts;

//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// dev 环境
// const apiURL_PATH = '/yxcode-channel-gateway/channel/';
// const rootURL_PATH = '/yxcode-channel-gateway/'; //用户登入登出 左侧菜单

// 图片路径
Vue.prototype.$imgURL_PATH = window.location.origin + apiURL_PATH + 'fileDownload/download?fileId=';

Vue.prototype.$apiURL_PATH = apiURL_PATH;

axios.defaults.baseURL = apiURL_PATH;


//用户登入登出 左侧菜单
let instance = axios.create();

instance.defaults.baseURL = rootURL_PATH;

// 全局底部+按钮
import poFooter from '@/components/common/footer'

Vue.component('poFooter', poFooter)


Vue.use(iView)

axios.defaults.withCredentials = true

Vue.prototype.$http = axios;

Vue.prototype.$ajax = instance;

Vue.prototype.$jq = $JQ;

//添加一个响应拦截器
axios.interceptors.response.use(function (res) {
    //在这里对返回的数据进行处理
    if (Object.prototype.toString.call(res.data).includes("[object ArrayBuffer]")) {
        console.log("下载文件", Object.prototype.toString.call(res.data));
    } else if (!res.data.success) {
        new Vue().$Message.error(res.data.errorMessage || '请求失败')
    }
    return res;
}, function (err) {
    //Do something with response error
    new Vue().$Message.error(res.data.errorMessage || '请求失败')
    return Promise.reject(err);
})

Vue.use(vblAuth)

Vue.config.productionTip = false

// 防止XSS攻击
Vue.mixin({
    created() {
        var SCRIPT_REGEX = /\<.*?\>|'|(^\s*)|(\s*$)/gi;
        this.$nextTick(() => {
            $(this.$el).find("input,textarea").on("blur", function () {
                var text = $(this).val();
                if (SCRIPT_REGEX.test(text)) {
                    text = text.replace(SCRIPT_REGEX, "");
                    $(this).val(text.replace(SCRIPT_REGEX, ""));
                }
            });
        });
    }
});

// 状态管理机制
const bus = new Vue();

Vue.prototype.$bus = bus;


// 请求返回格式化
Vue.prototype.$format = res => {
    let data = res.substring(8, res.length - 1);
    return JSON.parse(data);
}

//日期格式化
Vue.prototype.$formatDate = time => {
    if (time && time != '') {
        let dataTime = new Date(time).toLocaleDateString().replace(/\//g, "-");

        dataTime = dataTime.split('-').map(item => {
            if (item > 0 && item < 10) {
                return '0' + item;
            } else {
                return item;
            }
        }).join('-');

        return dataTime;
    } else {
        return ''
    }
}

Vue.prototype.$formatDateTime = (date, fmt) => {
    let getDate = new Date(date);
    let o = {
        "M+": getDate.getMonth() + 1,                 //月份
        "d+": getDate.getDate(),                    //日
        "h+": getDate.getHours(),                   //小时
        "m+": getDate.getMinutes(),                 //分
        "s+": getDate.getSeconds(),                 //秒
        "q+": Math.floor((getDate.getMonth() + 3) / 3), //季度
        "S": getDate.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// promise 封装
/*
* @params option 创建promise所需的参数
* @params url 必须 请求结构
* @params type 请求类型 默认为post
* @params params 请求所需的参数
* @params fn 请求成功的钩子函数
* */

Vue.prototype.$promise = (options) => {
    return new Promise((resolve, reject) => {

        if (!options.type || options.type.toUpperCase() === "POST") {
            axios.post(options.url, options.params).then(resp => {
                if (resp.data.success) {
                    options.success && options.success(resp);
                    resolve(resp);
                } else {
                    options.error && options.error(resp)
                    reject(resp);
                }
            })
        } else if (options.type && options.type.toUpperCase() === "get") {
            axios.get(options.url, options.params).then(resp => {
                if (resp.data.success) {
                    options.success && options.success(resp);
                    resolve(resp);
                } else {
                    options.error && options.error(resp)
                    reject(resp);
                }
            })
        } else {
            new Vue().$Message.error("请求类型错误");
        }
    })
};

Vue.prototype.$loading = res => {
    res.loading = false;
    setTimeout(() => {
        res.loading = true;
    }, 500);
};

Vue.prototype.$rm = function (arr, val) {
    let index = arr.indexOf(val);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
};

Vue.prototype.$realizeHeight = function (id, type) {
    if (document.getElementById(id) === null) {
        return false;
    }
    let a = `${document.documentElement.clientWidth - 183}px`;
    let b = `${document.documentElement.clientHeight - 70}px`;
    if (type === "width") {
        (function () {
            // 监听window的resize事件．在浏览器窗口变化时再设置下宽度．
            window.onresize = function () {
                Vue.prototype.$realizeHeight(id, type);
            };
            document.getElementById(id).style.width = a;
        })();
    } else if (type === "height") {
        (function () {
            // 监听window的resize事件．在浏览器窗口变化时再设置下宽度．
            window.onresize = function () {
                Vue.prototype.$realizeHeight(id, type);
            };
            document.getElementById(id).style.height = b;
        })();
    } else {
        (function () {
            // 监听window的resize事件．在浏览器窗口变化时再设置下宽度．
            window.onresize = function () {
                Vue.prototype.$realizeHeight(id, type);
            };
            document.getElementById(id).style.width = a;
            document.getElementById(id).style.height = b;
        })();
    }
};


/*遍历注册组件*/
const componentName_arr = [];
const requireComponent = require.context(
    // 其组件目录的相对路径
    './components/pages',
    // 是否查询其子目录
    true,
    // 匹配基础组件文件名的正则表达式
    /\w+\.(vue)$/
)
requireComponent.keys().forEach(fileName => {
    // 获取组件配置
    const componentConfig = requireComponent(fileName)

    // 获取组件的 PascalCase 命名
    // const componentName = upperFirst(
    //   camelCase(
    //     // 剥去文件名开头的 `'./` 和结尾的扩展名
    //     fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    //   )
    // )

    // 自定义去文件名 a.vue => a
    let fileName_arr = fileName.replace(/^\.\/(.*)\.\w+$/, '$1').split('/');
    let name = fileName_arr[fileName_arr.length - 1];

    // 加入全局数组
    componentName_arr.push(name)

    // 全局注册组件
    Vue.component(
        name,
        // 如果这个组件选项是通过 `export default` 导出的，
        // 那么就会优先使用 `.default`，
        // 否则回退到使用模块的根。
        componentConfig.default || componentConfig
    )
})
Vue.prototype.$componentName_arr = componentName_arr;


/* eslint-disable no-newtabChild.vue */
const vm = new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
})

