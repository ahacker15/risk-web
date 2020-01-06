const urls = {
  root: '/lawrisk',
  index: {
    login: '/risk/index/login',
    logout: '/risk/index/logout',
    getMenu: '',
    getSource: ''
  },
  system: {
    upload: '/risk/system/upload',
    dowloadFastDFS: '/risk/system/downFastDFSFile',
    downFile: '/risk/system/downFile',
    getPsData: '/risk/system/getPsData'
  },
  business: {
    caseNone: '/risk/non-litigation-cases/base',
    case: '/risk/litigation-cases/base',
    risks: '/risk/risk/base',
    dictionary: '/risk/dictionary/base',
    enclosure: '/risk/enclosure/base',
    remind: '/risk/remind-todo/base'
  },
  NonoLaw: {
    //非诉讼案件地址
    baseUrl: '/lawrisk/risk/non-litigation-cases/base'
  },

}

export default {
  urls
}
