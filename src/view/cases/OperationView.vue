<template>
  <div class="main-area">
    <el-page-header @back="goBack" content="诉讼类案件查看"></el-page-header>
    <el-form
      :inline="true"
      :model="formData"
      class="myClass"
      label-width="145px"
      :rules="formRules"
      ref="formData"
      :size="GLOBAL.config.systemSize"
      element-loading-text="数据处理中...请稍等..."
      v-loading="loading"
      :disabled="!editableFlag"
    >
      <el-row class="margin-top-20">
        <el-col :span="8">
          <el-form-item label="流程编号：" prop="flowNo">
            <el-input v-model="formData.flowNo" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请日期：" prop="applyDate">
            <el-date-picker
              style="width: 100%"
              v-model="formData.applyDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="纠纷发生法人主体：" prop="ascriptionCompany">
            <el-input v-model="formData.ascriptionCompany" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务所在部门：" prop="unitName">
            <el-input v-model="formData.unitName" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人：" prop="applicant">
            <el-input v-model="formData.applicant" maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="对方名称：" prop="targetName">
            <el-input v-model="formData.targetName" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="金额：" prop="money">
            <el-input-number
              v-model="formData.money"
              :min="0"
              :precision="2"
              :step="0.5"
              style="width: 100%;">
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="案件类型：" prop="caseType">
            <el-select v-model="formData.caseType"
                       style="width: 100%;"
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.name" :value="item.code"
                         v-for="item in dictionary.caseType" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="纠纷类型：" prop="disputeType">
            <el-select v-model="formData.disputeType"
                       style="width: 100%;"
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.name" :value="item.code"
                         v-for="item in dictionary.disputeType" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="服务类型：" prop="serviceType">
            <el-select v-model="formData.serviceType"
                       style="width: 100%;"
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.name" :value="item.code"
                         v-for="item in dictionary.serviceType" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="服务人员：" prop="servicePersonal">
            <el-select v-model="formData.servicePersonal"
                       style="width: 100%;"
                       filterable
                       :filter-method="serviceSearch"
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.emplName +'(' + item.accountName + ')'"
                         :value="item.emplName + '(' +item.accountName + ')'"
                         v-for="item in dictionary.psPersonnelList" :key="item.accountName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="协作人员：" prop="cooperationPersonnel">
            <el-select v-model="formData.cooperationPersonnel"
                       style="width: 100%;"
                       filterable
                       multiple
                       :filter-method="serviceSearch"
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.emplName +'(' + item.accountName + ')'"
                         :value="item.emplName + '(' +item.accountName + ')'"
                         v-for="item in dictionary.psPersonnelList" :key="item.accountName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="诉求：" prop="appeal">
            <el-select v-model="formData.appeal"
                       style="width: 100%;"
                       filterable
                       multiple
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.name" :value="item.code"
                         v-for="item in dictionary.appealType" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="其他诉求：" prop="otherAppeal">
            <el-input v-model="formData.otherAppeal" maxlength="1024"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="案件简介：" prop="caseBrief">
            <el-input
              type="textarea"
              autosize
              :maxlength="GLOBAL.config.textMaxlength.oneThousand"
              v-model="formData.caseBrief">
            </el-input>
          </el-form-item>
          <span class="tips-max-length"
                :style="(formData.caseBrief && (formData.caseBrief.length === GLOBAL.config.textMaxlength.oneThousand))?'color: red;':''">{{formData.caseBrief?formData.caseBrief.length:0}}/{{GLOBAL.config.textMaxlength.oneThousand}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否外聘律师：" prop="outsideLawyerFlag">
            <el-select v-model="formData.outsideLawyerFlag"
                       style="width: 100%;"
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.name" :value="item.code"
                         v-for="item in dictionary.outsideLawerFlag" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="律所名称：" prop="lawFirmName">
            <el-input v-model="formData.lawFirmName" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="律师姓名：" prop="lawerName">
            <el-input v-model="formData.lawerName" maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否产生费用：" prop="costFlag">
            <el-select v-model="formData.costFlag"
                       style="width: 100%;"
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.name" :value="item.code"
                         v-for="item in dictionary.costFlag" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="费用总额：" prop="costAmount">
            <el-input-number
              v-model="formData.costAmount"
              :min="0"
              :precision="2"
              :step="0.5"
              style="width: 100%;">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保全费：" prop="preservationAmount">
            <el-input-number
              v-model="formData.preservationAmount"
              :min="0"
              :precision="2"
              :step="0.5"
              style="width: 100%;">
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="代理费：" prop="agentAmount">
            <el-input-number
              v-model="formData.agentAmount"
              :min="0"
              :precision="2"
              :step="0.5"
              style="width: 100%;">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="诉讼费：" prop="litigationAmount">
            <el-input-number
              v-model="formData.litigationAmount"
              :min="0"
              :precision="2"
              :step="0.5"
              style="width: 100%;">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="其他费用：" prop="otherAmount">
            <el-input-number
              v-model="formData.otherAmount"
              :min="0"
              :precision="2"
              :step="0.5"
              style="width: 100%;">
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-for="(item, index) in formData.hearInformationList" :key="Date.now()">
        <el-divider content-position="left">
          审理信息{{index + 1}}
        </el-divider>
        <hearInformationView :info-data="item" :key="Date.now()" ref="hearInformationView" :disabled="!editableFlag"/>
        <el-divider></el-divider>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="回款/减损金：" prop="derogationAmount">
            <el-input-number
              v-model="formData.derogationAmount"
              :min="0"
              :precision="2"
              :step="0.5"
              style="width: 100%;">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结案方式：" prop="closingMethod">
            <el-select v-model="formData.closingMethod"
                       style="width: 100%;"
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.name" :value="item.code"
                         v-for="item in dictionary.closingMethod" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="案件小结：" prop="summary">
            <el-input
              type="textarea"
              autosize
              :maxlength="GLOBAL.config.textMaxlength.threeThousand"
              :autosize="{ minRows: 3}"
              v-model="formData.summary">
            </el-input>
          </el-form-item>
          <span class="tips-max-length"
                :style="(formData.summary && (formData.summary.length === GLOBAL.config.textMaxlength.threeThousand))?'color: red;':''">{{formData.summary?formData.summary.length:0}}/{{GLOBAL.config.textMaxlength.threeThousand}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="案件复盘：" prop="replay">
            <el-input
              type="textarea"
              autosize
              :maxlength="GLOBAL.config.textMaxlength.threeThousand"
              :autosize="{ minRows: 3}"
              v-model="formData.replay">
            </el-input>
          </el-form-item>
          <span class="tips-max-length"
                :style="(formData.replay && (formData.replay.length === GLOBAL.config.textMaxlength.threeThousand))?'color: red;':''">{{formData.replay?formData.replay.length:0}}/{{GLOBAL.config.textMaxlength.threeThousand}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="案件状态：" prop="caseStatus">
            <el-switch
              style="float: left;"
              v-model="formData.caseStatus"
              inactive-color="#13ce66"
              active-color="#ececec"
              active-value="closed"
              inactive-value="working"
              active-text="结案"
              inactive-text="在办"
            >
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="附件：">
            <el-upload
              style="float: left;"
              class="upload-demo"
              list-type="picture-card"
              :action="CONFIG.urls.root +  CONFIG.urls.system.upload"
              :file-list="formData.filesCache"
              multiple>
              <div slot="file" slot-scope="{file}" class="upload-view" v-show="file">
                <img
                  style="display: block;"
                  class="el-upload-list__item-thumbnail"
                  :src="FUNCTIONS.systemFunction.fileTypeView(this, file)"
                >
                <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-delete"
                  @click="FUNCTIONS.systemFunction.fileDownload(file)"
                >
                  <i class="el-icon-download"></i>
                </span>
              </span>
                <span>{{file.response.data.fileName}}</span>
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="margin-top-20">
      <el-button @click="goBack" style="float: right;margin-left: 20px;" :size="GLOBAL.config.systemSize">返回
      </el-button>
      <el-button type="primary" @click="restartCase" style="float: right;" :size="GLOBAL.config.systemSize" v-if="restartFlag">案件重启
      </el-button>
    </el-row>
  </div>
</template>
<script>
    import hearInformationView from './HearInformationView'

    export default {
        name: 'OperationView',
        props: {
            id: {
                type: String,
            },
            refresh: {
                type: Function
            },
            closeSelf: {
                type: Function
            }
        },
        data() {
            return {
                formData: {
                    flowNo: '',
                    applyDate: '',
                    ascriptionCompany: '',
                    unitName: '',
                    applicant: '',
                    targetName: '',
                    money: 0,
                    caseType: '',
                    disputeType: '',
                    serviceType: '',
                    servicePersonal: '',
                    cooperationPersonnel: '',
                    appeal: '',
                    otherAppeal: '',
                    caseBrief: '',
                    outsideLawyerFlag: '',
                    lawFirmName: '',
                    lawerName: '',
                    costFlag: '',
                    costAmount: 0,
                    preservationAmount: 0,
                    agentAmount: 0,
                    litigationAmount: 0,
                    otherAmount: 0,
                    caseAnalysis: '',
                    closingMethod: '',
                    derogationAmount: 0,
                    summary: '',
                    replay: '',
                    caseStatus: '',
                    // 审理信息
                    hearInformationList: [
                        {
                            id: '',
                            relationId: '',
                            hearingOrgan: '',
                            hearingProcedure: '',
                            filingDate: '',
                            openDate: '',
                            caseAnalysis: '',
                            preliminaryOpinion: '',
                            caseProcess: [{content: ''}]
                        }
                    ],
                    files: [],
                    filesCache: []
                },
                //校验规则
                formRules: {
                    flowNo: []
                },
                // 字典数据
                dictionary: {
                    caseType: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.caseType))),
                    disputeType: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.disputeType))),
                    serviceType: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.serviceType))),
                    appealType: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.appealType))),
                    outsideLawerFlag: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.outsideLawerFlag))),
                    costFlag: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.costFlag))),
                    closingMethod: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.closingMethod))),
                    psPersonnelList: [],
                },
                loading: false,
                editableFlag: false,
                restartFlag: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.sourceList))) && !!JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.sourceList))).filter(item => !item.value.indexOf(this.GLOBAL.config.modeName.cases) && (item.value.indexOf(this.GLOBAL.config.sourceName.restart) >= 0)).length
            }
        },
        mounted() {
        },
        components: {
            hearInformationView
        },
        methods: {
            init: function (id) {
                if (!id) {
                    this.$message.warning('参数主键为空～请联系管理员')
                } else {
                    this.formData.id = id
                    this.getInfo()
                }
            },
            goBack: function () {
                this.$props.closeSelf && this.$props.closeSelf()
            },
            serviceSearch: function (targetData) {
                let _this = this
                targetData && this.FUNCTIONS.systemFunction.jsonPost(
                    this.CONFIG.urls.root + this.CONFIG.urls.system.getPsData,
                    {
                        type: '',
                        info: targetData
                    },
                    resultData => {
                        if (resultData.code === _this.GLOBAL.config.resultCode.success) {
                            this.dictionary.psPersonnelList = resultData.data
                        } else {
                            _this.$message.warning('获取数据失败')
                        }
                    },
                    exceptionData => {
                        _this.$message.error('接口异常，请联系管理员')
                    }
                )
            },
            removeHearProcess(item) {
                let index = this.formData.hearInformationList.indexOf(item)
                if (index !== -1) {
                    this.formData.hearInformationList.splice(index, 1)
                }
            },
            addHearProcess() {
                for (let i = 0; i < this.formData.hearInformationList.length; i++) {
                    this.formData.hearInformationList[i] = this.$refs.hearInformationView[i].getData()
                }
                this.formData.hearInformationList.push({
                    id: '',
                    relationId: '',
                    hearingOrgan: '',
                    hearingProcedure: '',
                    filingDate: '',
                    openDate: '',
                    caseAnalysis: '',
                    preliminaryOpinion: '',
                    caseProcess: [{content: ''}]
                })
            },
            saveForm: function () {
                this.$refs.formData.validate(valid => {
                    if (valid) {
                        let params = this.formData
                        // 参数处理======start==========
                        ////////// 1、诉求，多选
                        if (params.appeal && params.appeal.length > 0) {
                            params.appeal = params.appeal.join(',')
                        }
                        ////////// 2、审理信息,涉及多次嵌套，所以需要处理下
                        for (let i = 0; i < this.formData.hearInformationList.length; i++) {
                            this.formData.hearInformationList[i] = this.$refs.hearInformationView[i].getData('validate')
                        }
                        // 参数处理======end============

                        let _this = this
                        _this.loading = true

                        this.FUNCTIONS.systemFunction.interactiveData(
                            _this,
                            _this.GLOBAL.config.businessFlag.case,
                            _this.GLOBAL.config.handleType.updateAll,
                            _this.FUNCTIONS.systemFunction.removeNullFields(this.formData),
                            null,
                            resultData => {
                                _this.loading = false
                                if (resultData) {
                                    _this.$props.closeSelf && _this.$props.closeSelf()
                                    _this.$props.refresh && _this.$props.refresh()
                                    _this.$message.success('保存成功～')
                                } else {
                                    _this.$message.warning('保存失败～')
                                }
                            }
                        )
                    } else {
                        this.$message.error('校验失败～')
                        return false
                    }
                })
            },
            getInfo: function () {
                let _this = this
                this.formData.id && this.FUNCTIONS.systemFunction.interactiveData(
                    _this,
                    _this.GLOBAL.config.businessFlag.case,
                    _this.GLOBAL.config.handleType.getInfoById,
                    _this.formData.id,
                    null,
                    resultData => {
                        _this.loading = false
                        // 附件数据处理
                        if (resultData.files && resultData.files.length > 0) {
                            resultData.files.forEach(item => {
                                _this.formData.filesCache.push({
                                    response: {
                                        code: '0',
                                        data: item
                                    }
                                })
                            })
                        }
                        Object.assign(_this.formData, resultData)
                        _this.restartFlag = _this.formData.caseStatus==="closed" && this.restartFlag
                    }
                )
            },
            //案件重启
            restartCase: function () {
                this.$confirm('确定重启案件?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.formData.caseStatus = 'working'
                    let _this = this
                    _this.loading = true
                    this.FUNCTIONS.systemFunction.interactiveData(
                        _this,
                        _this.GLOBAL.config.businessFlag.case,
                        _this.GLOBAL.config.handleType.updateSelfInfo,
                        {id: _this.formData.id, caseStatus: _this.formData.caseStatus},
                        null,
                        resultData => {
                            _this.loading = false
                            if (resultData) {
                                _this.$props.closeSelf && _this.$props.closeSelf()
                                _this.$props.refresh && _this.$props.refresh()
                                _this.$message.success('重启成功～')
                            } else {
                                _this.$message.warning('重启失败～')
                            }
                        }
                    )
                }).catch(() => {
                    this.formData.caseStatus = 'closed'
                })
            }
        }
    }
</script>
<style lang="css" scoped>
  .myClass /deep/ input.el-input__inner {
    color: #606266;
  }
  .myClass /deep/ textarea.el-textarea__inner{
    color: #606266;
  }
</style>
