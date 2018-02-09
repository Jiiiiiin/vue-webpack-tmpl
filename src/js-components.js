import Toasted from 'vue-toasted'

let _Vue

/**
 * 常用工具函数模块
 */
const plugin = {
  uiToast(msg = '默认消息！') {
    _Vue.toasted.show(msg).goAway(1500)
    return this
  },
  uiDialog(content = '未知消息!') {
    alert(content)
    return this
  },
  uiHideDialog() {
    return this
  },
  uiConfirm(content = '确认消息!') {
    confirm(content)
    return this
  },
  uiHideConfirm() {
    return this
  },
  uiLoading() {
    return this
  },
  uiHideLoading() {
  },
  install(Vue) {
    _Vue = Vue
    Vue.use(Toasted)
  }
}

export default plugin
