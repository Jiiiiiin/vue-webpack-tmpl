import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Navigation from 'vue-navigation'
import ViewPlus from 'vue-viewplus'
import jsComponents from './js-components'

Vue.config.productionTip = false

Vue.use(Navigation, { router, store })

// 虚拟标识，需要根据应用本身的返回值来确认，不是必须
const STATUS_CODE_KEY = 'ReturnCode'
const STATUS_CODE = '000000'

ViewPlus.mixin(Vue, jsComponents)

Vue.use(ViewPlus, {
  router,
  store,
  errorHandler(err) {
    console.error('vp errorHandler->', err)
    if (err) {
      if (err instanceof window.JsBridgeError) {
        switch (err.code) {
          case 'INSTALL_FAIL':
            this.uiToast(err.message, {width: '70%'})
            break
          case 'ANDROID_OS_NATIVE_CONTEXT_NOT_FOUND':
            this.uiDialog(err.message, {title: '捕获到全局错误'})
            break
          case 'CLIENT_ENV_NOT_SUPPORT_WEBKIT_OR_WEBKIT_MESSAGEHANDLERS':
            this.uiDialog(err.message, {title: '捕获到全局错误'})
            break
          default:
            console.error(err)
        }
      } else if (err instanceof Error) {
        this.uiDialog(err.message, {title: '捕获到全局错误'})
      }
    } else {
      this.uiDialog('err参数错误', {title: '捕获到全局错误'})
    }
  },
  env: 'BROWSER',
  // env: 'MOBILE_PHONE',
  debug: process.env.NODE_ENV !== 'production',
  appUrl: 'http://localhost:8888',
  eventBus: {
    enable: true,
    onInitComplete() {
      const _$bus = Vue.prototype.$bus
      console.log(`example on eventBus onInitComplete callback: eventBus: ${_$bus instanceof Vue} | eventBusInitState: ${store.state.vplus.eventBusInitState}`)
    }
  },
  utilDom: {
    enable: true,
    onInitComplete() {
      console.log('example on utilDom onInitComplete callback', this)
    }
  },
  utilCache: {
    enable: true,
    onInitComplete() {
      console.log('example on utilCache onInitComplete callback', this)
    }
  },
  cacheUserInfo: {
    enable: true,
    onInitComplete() {
      console.log('example on cacheUserInfo onInitComplete callback', this)
    }
  },
  jsBridge: {
    onRespParse(res) {
      let flag = false
      if (this.utilIs('Object', res) && res[STATUS_CODE_KEY] === STATUS_CODE) {
        flag = true
      }
      return flag
    },
    protocol: {
      enable: true,
      protocolPrefix: 'bs',
      protocolDelimiter: '?',
      onInitComplete() {
        console.log('example on jsBridge protocol onInitComplete callback', this)
      }
    },
    context: {
      // 默认是开启的，该模块是预加载的，如果要使用protocol模式需要将enable设置为false
      enable: true,
      name: 'ViewPlus'
    }
  },
  loginStateCheck: {
    checkPaths: [
      /Manage/
    ],
    onLoginStateCheckFaild(to, from, next) {
      this.uiDialog(`onLoginStateCheckFaild回调应用处理：当前访问的资源${to.path}是需要登录才能访问，请先登录`, {
        title: '权限不足',
        action() {
          next(false)
        }
      })
      // 更新状态进度条
      store.commit('updateLoadingStatus', false)
    }
  },
  utilHttp: {
    baseURL: 'http://localhost:3000',
    // withCredentials: true,
    timeout: '3000',
    headers: {
      Accept: 'application/json, text/plain, */*'
    },
    params: {
      BankId: '9999',
      LoginType: 'K',
      _locale: 'zh_CN'
    },
    dataKey: 'ResData',
    statusCodeKey: 'ReturnCode',
    statusCode: '000000',
    msgKey: 'ReturnMessage',
    needBase64DecodeMsg: false,
    defShowLoading: true,
    onPageTo: null,
    onPageReplace: null,
    onPageNext: null,
    onPageGoBack: null,
    onPageHref: null,
    onSendAjaxRespErr: (response) => {
      console.log(`example on onSendAjaxRespErr called ${response}`)
      return false
    },
    onReqErrPaserMsg: (response, errMsg) => {
      console.log(`example on onReqErrPaserMsg called: ${response} ${errMsg}`)
      // 返回空标识不处理错误消息解析
      return `onReqErrPaserMsg回调应用处理返回：${errMsg}`
    },
    errDialog(content = '错误消息未定义', {action, title = '错误提示', hideOnBlur = false} = {}) {
      jsComponents.uiDialog(content, {title, action, hideOnBlur})
      return this
    },
    // loading(_showLoading) {
    //   if (_showLoading) {
    //     this.uiLoading()
    //   }
    // },
    // hideLoading() {
    //   this.uiHideLoading()
    // },
    accessRules: {
      sessionTimeOut: ['role.invalid_user', 'validation.user.force.logout.exception'],
      onSessionTimeOut(response) {
        this.uiDialog(`onSessionTimeOut回调应用处理：${response.ReturnMessage}`, {
          title: '错误回调'
        })
      },
      unauthorized: ['core_error_unauthorized'],
      onUnauthorized(response) {
        this.uiDialog(`onUnauthorized回调应用处理：${response.ReturnMessage}`, {
          title: '错误回调'
        })
      }
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
