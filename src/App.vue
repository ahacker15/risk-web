<template>
  <div id="app" class="app">
    <indexPage v-if="hasLogin"/>
  </div>
</template>

<script>
  import indexPage from './Index'

  export default {
    name: 'App',
    data () {
      return {
        hasLogin: false
      }
    },
    components: {
      indexPage
    },
    created: async function () {
      this.hasLogin = false
      let _this = this
      validateAndInitData()

      // 登陆及初始化页面数据
      function validateAndInitData () {
        _this.FUNCTIONS.systemFunction.commonGet(
          _this.CONFIG.urls.root + _this.CONFIG.urls.index.login,
          result => {
            if (result.code === _this.GLOBAL.config.resultCode.notLogin) {
              window.location.href = result.data
            } else if (result.code === _this.GLOBAL.config.resultCode.success) {
              // 基本数据缓存-----start--------------
              let userInfo = result.data.userInfo,
                dictionaryList = result.data.dictionaryList,
                appInfo = result.data.appInfo,
                authList = result.data.authList,
                sourceList = result.data.sourceList,
                userDetail = result.data.userDetail
              userInfo && localStorage.setItem(_this.GLOBAL.config.userConfigName, escape(JSON.stringify(userInfo)))
              appInfo && localStorage.setItem(_this.GLOBAL.config.appInfo, escape(JSON.stringify(appInfo)))
              authList && authList.length && localStorage.setItem(_this.GLOBAL.config.authList, escape(JSON.stringify(authList)))
              sourceList && sourceList.length && localStorage.setItem(_this.GLOBAL.config.sourceList, escape(JSON.stringify(sourceList)))
              userDetail && localStorage.setItem(_this.GLOBAL.config.userDetail, escape(JSON.stringify(userDetail)))

              dictionaryList && dictionaryCache(dictionaryList)
              // 基本数据缓存-----end----------------

              _this.hasLogin = true
            } else if (typeof result === _this.GLOBAL.config.dataType.string) {
              validateAndInitData()
            } else {
              _this.$message.error('登陆校验失败～请联系管理员')
            }
          }
        )
      }

      // 缓存字典数据
      function dictionaryCache (dictionaryList) {
        if (dictionaryList && dictionaryList.length > 0) {
          let parents = dictionaryList.filter(item => !item.parentCode)
          parents && parents.length > 0 && parents.forEach(dictionary => {
            let _parentCode = dictionary.code
            let dictionaryDetails = dictionaryList.filter(item => item.parentCode === _parentCode).sort((a, b) => a.sort - b.sort)
            localStorage.removeItem(_this.GLOBAL.config.dictionaryPre + _parentCode)
            localStorage.setItem(_this.GLOBAL.config.dictionaryPre + _parentCode, escape(JSON.stringify(dictionaryDetails)))
          })
          // ps对接册书数据
          let testData = [
            {name: '张三', id: '123', email: '123@163.com', domainName: 'zhangs'},
            {name: '李四', id: '456', email: '456@163.com', domainName: 'lis'},
            {name: '王五', id: '789', email: '789@163.com', domainName: 'wangw'},
            {name: '赵六', id: '135', email: '135@163.com', domainName: 'zhaol'},
            {name: '黄智强', id: '246', email: '246@163.com', domainName: 'huangzq'},
            {name: '黄三郎', id: '198', email: '198@163.com', domainName: 'huangsl'}
          ]
          localStorage.removeItem(_this.GLOBAL.config.psDataName)
          localStorage.setItem(_this.GLOBAL.config.psDataName, escape(JSON.stringify(testData)))
        }
      }
    }
  }
</script>
