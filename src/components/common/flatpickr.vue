<template>
  <div class="vbl-dateTime" :class="[{'is-empty': !dataDefaultValue}, time]">
    <span class="icon-delete" :class="{'is-show':isShow}" @click="clear">×</span>
    <input class="ivu-input" ref="flatpickrInput" v-model="dataDefaultValue" data-min-date="today" readonly>
  </div>
</template>

<script>
  import Flatpickr from 'flatpickr';
  import {zh} from'flatpickr/dist/l10n/zh';
  zh.weekdays.shorthand = ["日", "一", "二", "三", "四", "五", "六"];
  export default {
    props: {
      defaultValue: {
        type: String,
        default: ''
      },
      time: {
        type: String,
        default: ''// hour/minute/second
      },
      disableFrom: {
        type: String,
        default: ''
      },
      disableTo: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        dataDefaultValue: this.defaultValue,
        isShow: false
      };
    },
    computed: {
      computedDisableTo() {
        return new Date(this.disableTo) - 24 * 60 * 60 * 1000;
      },
      options() {
        var _this = this;
        var opt = {};
        if (this.time) {
          opt = {
            time_24hr: true,// 24小时制
            enableTime: true,// 显示小时分钟
            dateFormat: "Y-m-d H:i:S",// 自定义格式
            enableSeconds: true,// 显示秒
            onChange:function(dateObj, dateStr, instance){
              let newTime = dateStr.split(' ')[0]+' 23:59:59';
              _this.dataDefaultValue = newTime;
              _this.$emit('update:defaultValue', newTime);
            }
          };
        }

        if (this.disableTo && !this.disableFrom) {
          opt.disable = [(date) => date < new Date(this.computedDisableTo)];
        } else if (!this.disableTo && this.disableFrom) {
          opt.disable = [(date) => date > new Date(this.disableFrom)];
        } else if (this.disableTo && this.disableFrom) {
          opt.disable = [(date) => {
            return date < new Date(this.computedDisableTo) || date > new Date(this.disableFrom);
          }];
        }
        opt.locale = zh;
        return opt;
      }
    },
    watch: {
      defaultValue(val) {
        if (this.dataDefaultValue !== val) {
          this.dataDefaultValue = val;
          this.init();
        }
      },
      dataDefaultValue(val) {
        this.$emit('update:defaultValue', val);
      },
      options() {
        this.init();
      },
      dataDefaultValue (val) {
        if(!val){
          this.isShow = false;
        }else{
          this.isShow = true;
        }
      }
    },
    methods: {
      init() {
        this.flatpickr = new Flatpickr(this.$refs.flatpickrInput, this.options);
        this.flatpickr.setDate(this.dataDefaultValue);
        if (this.time) {
          this.flatpickr.calendarContainer.classList.add(this.time);
        }
      },
      clear() {
        this.dataDefaultValue = '';
        this.$emit('update:defaultValue', this.dataDefaultValue);
        this.flatpickr.setDate(new Date());
      }
    },
    mounted() {
      this.init();
    },
    beforeDestroy() {
      this.flatpickr.destroy();
    }
  };
</script>

<style lang="less" scoped>
  @import '~flatpickr/dist/flatpickr.min.css';
  .vbl-dateTime {
    min-width: 160px;
    display: inline-block;
    position: relative;
    &:not(.is-empty):hover .vbl-icon {
      display: inherit;
    }
    .vbl-input input {
      padding-right: 25px;
    }
    .vbl-icon {
      display: none;
      position: absolute;
      right: 0;
      top: 0;
      padding: 6px;
      cursor: pointer;
      color: #666;
    }
    .icon-delete{
      position: absolute;
      display: none;
      width: 16px;
      height: 16px;
      border: 1px solid #ababab;
      color: #ababab;
      z-index: 2;
      line-height: 1;
      border-radius: 8px;
      right: 8px;
      top: 8px;
      text-align: center;
      cursor: pointer;
    }
    .is-show{
      display: block;
    }
  }
  .flatpickr-calendar {
    width: 268px !important;
    &.hour {
      .numInputWrapper:nth-of-type(1),
      .numInputWrapper:nth-of-type(2),
      .numInputWrapper:nth-of-type(3) {
        pointer-events: none;
      }
    }
    &.minute {
      .numInputWrapper:nth-of-type(3) {
        pointer-events: none;
      }
    }
    .flatpickr-day.today:hover {
      background: #e6e6e6;
      color: inherit;
    }
    .flatpickr-day.today {
      border-color: #badcff!important;
    }
    .flatpickr-day.selected {
      background: #1d86f4!important;
      border-color: #1d86f4!important;
    }
    .flatpickr-prev-month:hover svg,
    .flatpickr-next-month:hover svg {
      fill: #1d86f4;
    }
    .flatpickr-month {
      height: 32px;
      border-bottom: 1px solid #e1e1e1;
      .flatpickr-current-month {
        span.cur-month {
          font-size: 14px;
        }
        div.numInputWrapper {
          font-size: 14px;
        }
      }
    }
    .flatpickr-innerContainer {
      width: auto;
      .flatpickr-rContainer {
        width: 268px;
        .flatpickr-weekdays {
          height: 32px;
          border-bottom: 1px solid #e1e1e1;
          padding: 0 8px;
          box-sizing: border-box;
        }
        .flatpickr-days {
          width: auto;
          div.dayContainer {
            min-width: 268px;
            padding: 0 8px;
            .flatpickr-day {
              max-width: 32px;
              height: 32px;
              line-height: 32px - 1;
              margin: 2px 0;
              .dayContainer {
                width: 268px;
              }
            }
          }
        }
      }
    }
  }
</style>
<style>
.flatpickr-calendar.showTimeInput.hasTime .flatpickr-time{
  display: none!important;
  pointer-events: none!important;
}
</style>
