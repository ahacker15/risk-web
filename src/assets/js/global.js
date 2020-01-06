/* 全局变量 */
const config = {
  dictionaryPre: 'fwfx_dictionary_',
  userConfigName: 'userInfo',
  appInfo: 'appInfo',
  userDetail: 'userDetail',
  authList: 'authList',
  sourceList: 'sourceList',
  psDataName: 'ps_personnel_list',
  systemSize: 'mini',
  dictionary: {
    caseType: 'caseType',
    disputeType: 'disputeType',
    serviceType: 'serviceType',
    riskGrade: 'riskGrade',
    appealType: 'appealType',
    outsideLawerFlag: 'outsideLawerFlag',
    costFlag: 'costFlag',
    caseState: 'caseState',
    riskType: 'riskType',
    eventState: 'eventState',
    hearingProcedure: 'hearingProcedure',
    closingMethod: 'closingMethod'
  },
  resultCode: {
    success: '0',
    fail: '1',
    noAuth: '2',
    operateRepeat: '3',
    notLogin: '4'
  },
  dataType: {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    null: 'null',
    undefined: 'undefined',
    array: 'array',
    object: 'object',
    function: 'function'
  },
  businessFlag: {
    caseNone: 'caseNone',
    case: 'case',
    risks: 'risks',
    dictionary: 'dictionary',
    enclosure: 'enclosure',
    remind: 'remind'
  },
  handleType: {
    // 系统默认
    add: 'add',
    addBatch: 'addBatch',
    updateAll: 'updateAll',
    updateSelect: 'updateSelect',
    updateAllBatch: 'updateAllBatch',
    updateSelectBatch: 'updateSelectBatch',
    deletePhysical: 'deletePhysical',
    deleteLogical: 'deleteLogical',
    deletePhysicalBatch: 'deletePhysicalBatch',
    deleteLogicalBatch: 'deleteLogicalBatch',
    getInfoById: 'getInfoById',
    getListByCondition: 'getListByCondition',
    getAll: 'getAll',
    getPage: 'getPage',
    // 新增操作
    deleteAndAdd: 'deleteAndAdd',
    updateSelfInfo: 'updateSelfInfo',
  },
  dateFormat: {
    ymd: 'YYYY-MM-DD',
    yMd: 'yyyy-MM-dd',
    yMDHm: 'yyyy-MM-DD HH:mm',
    yMdHm: 'yyyy-MM-dd HH:mm',
    ymdhm: 'YYYY-MM-DD HH:mm',
    ymdhms: 'YYYY-MM-DD HH:mm:ss'
  },
  // 最多条数限制
  limitNum: {
    remind: 10,
    process: 10,
    hear: 6
  },
  //文本字数限制
  textMaxlength: {
    threeThousand: 3000,
    twoThousand: 2000,
    oneThousand: 1000,
    oneThousandFiveHundred: 1500,
    twoHundred: 200
  },
  modeName: {
    noneLaw: '/noneLaw',
    cases: '/cases',
    risk: '/risk',
  },
  sourceName: {
    // 下载
    download: 'download',
    // 更换服务人员
    replace: 'replace',
    // 重启项目
    restart: 'restart',
    // 提醒人员
    remind: 'remind',
    // 导出人员
    emport: 'emport',
    // 删除
    delete: 'delete',
    // 修改
    update: 'update',
    // 心增
    add: 'add'
  },
  upload: {
    limit:5,
    fileType: '.zip,.7z,.rar,.ppt,.pptx,.pptm,.pdf,.doc,.docx,.docm,.xls,.xlsx,.xlsm,.image,.jpg,.jpeg,.png,.gif,.gpj'
  }
}
const message = {
  '登陆成功': ''
}
const columns = {}

export default {
  config,
  message,
  columns
}
