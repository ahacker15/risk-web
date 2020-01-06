<template>
  <div class="main-area">
    <el-page-header @back="goBack" content="非诉讼类案件编辑"></el-page-header>
    <el-form
      :inline="true"
      :model="formData"
      class="demo-ruleForm"
      label-width="145px"
      :rules="formRules"
      ref="formData"
      :size="GLOBAL.config.systemSize"
      element-loading-text="数据处理中...请稍等..."
      v-loading="loading"
    >
      <el-row class="margin-top-20">
        <el-col :span="8">
          <el-form-item label="流程编号：" prop="flowNo">
            <el-input v-model="formData.flowNo" placeholder="流程编号" maxlength="64" disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请日期：" prop="applyDate">
            <el-date-picker
              style="width: 100%"
              v-model="formData.applyDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择申请日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="纠纷发生法人主体：" prop="ascriptionCompany">
            <el-input v-model="formData.ascriptionCompany" placeholder="纠纷发生法人主体" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务所在部门：" prop="unitName">
            <el-input v-model="formData.unitName" placeholder="业务所在部门" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人：" prop="applicant">
            <el-input v-model="formData.applicant" placeholder="申请人" maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="对方名称：" prop="targetName">
            <el-input v-model="formData.targetName" placeholder="对方名称" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="金额：" prop="money">
            <el-input-number
              v-model="formData.money"
              :min="0"
              :precision="2"
              :step="0.5"
              style="width: 100%;"
              placeholder="金额">
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="纠纷类型：" prop="disputeType">
            <el-select v-model="formData.disputeType"
                       placeholder="纠纷类型"
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
                       placeholder="服务类型"
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
                       placeholder="服务人员"
                       style="width: 100%;"
                       filterable
                       :filter-method="serviceSearch"
                       disabled
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
                       placeholder="协作人员"
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
                       placeholder="诉求"
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
            <el-input v-model="formData.otherAppeal" placeholder="其他诉求" maxlength="1024"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="案件简介：" prop="caseBrief">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入案件简介"
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
                       placeholder="是否外聘律师"
                       style="width: 100%;"
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.name" :value="item.code"
                         v-for="item in dictionary.outsideLawerFlag" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="律所名称：" prop="lawFirmName"
                        :rules="formData.outsideLawyerFlag==='yes'?formRules.lawFirmName:[{required: false, message: '律所名称不可为空', trigger: 'blur'}]">
            <el-input v-model="formData.lawFirmName" placeholder="律所名称" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="律师姓名：" prop="lawerName"
                        :rules="formData.outsideLawyerFlag==='yes'?formRules.lawerName:[{required: false, message: '律师姓名不可为空', trigger: 'blur'}]">
            <el-input v-model="formData.lawerName" placeholder="律师姓名" maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否产生费用：" prop="costFlag">
            <el-select v-model="formData.costFlag"
                       placeholder="是否产生费用"
                       style="width: 100%;"
                       @change="costFlagChange">
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
              style="width: 100%;"
              placeholder="费用总额"
              v-bind:disabled="costDisabledInput" >
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
              style="width: 100%;"
              placeholder="保全费"
              v-bind:disabled="costDisabledInput">
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
              style="width: 100%;"
              placeholder="代理费"
              v-bind:disabled="costDisabledInput">
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
              style="width: 100%;"
              placeholder="其他费用"
              v-bind:disabled="costDisabledInput">
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="案件分析：" prop="caseAnalysis" :rules="caseStatusClosed?formRules.caseAnalysis:[{required: false, message: '请输入案件分析', trigger: 'blur'}]">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入案件分析"
              :maxlength="GLOBAL.config.textMaxlength.threeThousand"
              :autosize="{ minRows: 3}"
              v-model="formData.caseAnalysis">
            </el-input>
          </el-form-item>
          <span class="tips-max-length"
                :style="(formData.caseAnalysis && (formData.caseAnalysis.length === GLOBAL.config.textMaxlength.threeThousand))?'color: red;':''">{{formData.caseAnalysis?formData.caseAnalysis.length:0}}/{{GLOBAL.config.textMaxlength.threeThousand}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="初步处理/答复意见：" prop="preliminaryOpinion" :rules="caseStatusClosed?formRules.preliminaryOpinion:[{required: false, message: '请输入初步处理/答复意见', trigger: 'blur'}]">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入初步处理/答复意见"
              :maxlength="GLOBAL.config.textMaxlength.oneThousandFiveHundred"
              :autosize="{ minRows: 3}"
              v-model="formData.preliminaryOpinion">
            </el-input>
          </el-form-item>
          <span class="tips-max-length"
                :style="(formData.preliminaryOpinion && (formData.preliminaryOpinion.length === GLOBAL.config.textMaxlength.oneThousandFiveHundred))?'color: red;':''">{{formData.preliminaryOpinion?formData.preliminaryOpinion.length:0}}/{{GLOBAL.config.textMaxlength.oneThousandFiveHundred}}</span>
        </el-col>
      </el-row>
      <el-row v-for="(item, index) in formData.caseProcess" :key="item.id">
        <el-col :span="22">
          <el-form-item :label="'案件进展' + (index?(index+1):'') + '：'"
                        :prop="'caseProcess.' + index + '.content'"
                        :rules="caseStatusClosed?formRules.caseProcess:[{required: false, message: '请输入案件进展', trigger: 'blur'}]">
            <el-input
              type="textarea"
              autosize
              :placeholder="'案件进展' + (index?(index+1):'')"
              :key="'process_'+ index"
              :maxlength="GLOBAL.config.textMaxlength.threeThousand"
              :autosize="{ minRows: 2}"
              v-model="item.content"
            >
            </el-input>
          </el-form-item>
          <span class="tips-max-length"
                :style="(item.content && (item.content.length === GLOBAL.config.textMaxlength.threeThousand))?'color: red;':''">{{item.content?item.content.length:0}}/{{GLOBAL.config.textMaxlength.threeThousand}}</span>
        </el-col>
        <el-col :span="2">
          <el-button v-if="index > 0"
                     style="margin: 10px 0 10px 10px; float: left;"
                     title="删除"
                     type="danger"
                     icon="el-icon-delete"
                     @click.prevent="removeCaseProcess(item)"
                     :size="GLOBAL.config.systemSize"
                     circle></el-button>
          <el-button v-if="(index === formData.caseProcess.length - 1) && (index < GLOBAL.config.limitNum.process - 1)"
                     style="margin: 10px; float: left;"
                     title="添加案件进展"
                     type="primary"
                     icon="el-icon-plus"
                     @click="addCaseProcess"
                     :size="GLOBAL.config.systemSize" circle></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="回款/减损金：" prop="derogationAmount" :rules="caseStatusClosed?formRules.derogationAmount:[{required: false, message: '请输入回款/减损金', trigger: 'blur'}]">
            <el-input-number
              v-model="formData.derogationAmount"
              :min="0"
              :precision="2"
              :step="0.5"
              style="width: 100%;"
              placeholder="回款/减损金">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="风险等级：" prop="riskGrade" :rules="caseStatusClosed?formRules.riskGrade:[{required: false, message: '请选择风险等级', trigger: 'blur'}]">
            <el-select v-model="formData.riskGrade"
                       placeholder="风险等级"
                       style="width: 100%;"
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.name" :value="item.code"
                         v-for="item in dictionary.riskGrade" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="案件小结：" prop="summary" :rules="caseStatusClosed?formRules.summary:[{required: false, message: '请输入案件小结', trigger: 'blur'}]">
            <el-input
              type="textarea"
              autosize
              placeholder="案件小结"
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
          <el-form-item label="案件复盘：" prop="replay" :rules="caseStatusClosed?formRules.replay:[{required: false, message: '请输入案件复盘', trigger: 'blur'}]">
            <el-input
              type="textarea"
              autosize
              placeholder="案件复盘"
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
              @change="casesStatusChange"
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
              list-type="picture-card"
              :limit="GLOBAL.config.upload.limit"
              :on-exceed="FUNCTIONS.systemFunction.fileLimit"
              :before-upload="FUNCTIONS.systemFunction.fileBeforeUpload"
              :action="CONFIG.urls.root +  CONFIG.urls.system.upload"
              :on-success="fileUpload"
              :file-list="formData.filesCache"
              :size="GLOBAL.config.systemSize"
              ref="upload"
              multiple>
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{file}" class="upload-view">
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
                <span
                  class="el-upload-list__item-delete"
                  @click="fileRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
                <span>{{(file && file.response && file.response.data)?file.response.data.fileName:''}}</span>
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="margin-top-20">
        <el-button @click="goBack" style="float: right;margin-left: 20px;" :size="GLOBAL.config.systemSize">返回
        </el-button>
        <el-button type="primary" @click="saveForm" style="float: right;" :size="GLOBAL.config.systemSize">保存
        </el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'OperationEdit',
    props: {
      id: {type: String,},
      refresh: {type: Function},
      closeSelf: {type: Function}
    },
    data () {
      return {
        formData: {
          id: '',
          flowNo: '',
          applyDate: '',
          ascriptionCompany: '',
          unitName: '',
          applicant: '',
          targetName: '',
          money: 0,
          disputeType: '',
          serviceType: '',
          servicePersonal: '',
          cooperationPersonnel: '',
          appeal: '',
          otherAppeal: '',
          caseBrief: '',
          outsideLawyerFlag: 'no',
          lawFirmName: '',
          lawerName: '',
          costFlag: 'no',
          costAmount: 0,
          preservationAmount: 0,
          agentAmount: 0,
          otherAmount: 0,
          caseAnalysis: '',
          preliminaryOpinion: '',
          riskGrade: '',
          derogationAmount: 0,
          summary: '',
          replay: '',
          caseStatus: 'working',
          // 案件进展
          caseProcess: [{content: ''}],
          files: [],
          filesCache: []
        },
        //校验规则
        formRules: {
          flowNo: [
            {required: true, message: '请输入流程编号', trigger: 'blur'}
          ],
          applyDate: [
            {required: true, message: '请选择申请日期', trigger: 'blur'}
          ],
          ascriptionCompany: [
            {required: true, message: '请输入纠纷发生法人主体', trigger: 'blur'}
          ],
          unitName: [
            {required: true, message: '请输入业务所在部门', trigger: 'blur'}
          ],
          applicant: [
            {required: true, message: '请输入申请人', trigger: 'blur'}
          ],
          targetName: [
            {required: true, message: '请输入对方名称', trigger: 'blur'}
          ],
          money: [
            {required: true, message: '请输入金额', trigger: 'blur'}
          ],
          disputeType: [
            {required: true, message: '请选择纠纷类型', trigger: 'blur'}
          ],
          serviceType: [
            {required: true, message: '请选择服务类型', trigger: 'blur'}
          ],
          servicePersonal: [
            {required: true, message: '请选择服务人员', trigger: 'blur'}
          ],
          appeal: [
            {required: true, message: '请选择诉求', trigger: 'blur'}
          ],
          caseBrief: [
            {required: true, message: '请输入案件简介', trigger: 'blur'}
          ],
          outsideLawyerFlag: [
            {required: true, message: '请选择是否外聘律师', trigger: 'blur'}
          ],
          lawFirmName: [
            {required: true, message: '律所名称不可为空', trigger: 'blur'}
          ],
          lawerName: [
            {required: true, message: '律师姓名不可为空', trigger: 'blur'}
          ],
          costFlag: [
            {required: true, message: '请选择是否产生费用', trigger: 'blur'}
          ],
          derogationAmount: [
            {required: true, message: '请设置回款/减损金', trigger: 'blur'/*, validator: this.FUNCTIONS.systemFunction.checkMoneyNum*/}
          ],
          caseProcess: [
            {required: true, message: '案件进展不可为空', trigger: 'blur'}
          ],
          //结案：必填字段控制
          caseAnalysis: [
            {required: true, message: '请输入案件分析', trigger: 'blur'}
          ],
          preliminaryOpinion: [
            {required: true, message: '请输入初步处理/答复意见', trigger: 'blur'}
          ],
          riskGrade: [
            {required: true, message: '请选择风险等级', trigger: 'blur'}
          ],
          summary: [
            {required: true, message: '请输入案件小结', trigger: 'blur'}
          ],
          replay: [
            {required: true, message: '请输入案件复盘', trigger: 'blur'}
          ],
        },
        // 字典数据
        dictionary: {
          disputeType: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.disputeType))),
          serviceType: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.serviceType))),
          appealType: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.appealType))),
          outsideLawerFlag: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.outsideLawerFlag))),
          costFlag: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.costFlag))),
          riskGrade: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.riskGrade))),
          psPersonnelList: [],
        },
        loading: false,
        timer: null,
        costDisabledInput:true,
        caseStatusClosed:false,
        restartFlag: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.sourceList))) && !!JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.sourceList))).filter(item => !item.value.indexOf(this.GLOBAL.config.modeName.noneLaw) && (item.value.indexOf(this.GLOBAL.config.sourceName.restart) >= 0)).length
      }
    },
    mounted () {
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
          if(targetData && targetData.trim() && targetData.length>1) {
              let _this = this
              clearTimeout(this.timer);//清除定时器
              this.timer = setTimeout(() => {
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
              },1000)
          }
      },
      removeCaseProcess (item) {
        let index = this.formData.caseProcess.indexOf(item)
        if (index !== -1) {
          this.formData.caseProcess.splice(index, 1)
        }
      },
      addCaseProcess () {
        if (this.formData.caseProcess.length > (this.GLOBAL.config.limitNum.process - 1)) {
          this.$message.warning('案件进展最多只能增加' + this.GLOBAL.config.limitNum.process + '个')
          return
        }
        this.formData.caseProcess.push({
          content: '',
          key: Date.now()
        })
      },
      saveForm: function () {
        this.$refs.formData.validate(valid => {
          if (valid) {
            let params = this.formData
            // 参数处理======start==========
            ////////// 诉求，多选
            if (params.appeal && params.appeal.length > 0) {
              params.appeal = params.appeal.join(',')
            }
            ////////// 删除附件缓存数据
            delete params.filesCache
            // 参数处理======end============

            let _this = this
            _this.loading = true

            this.FUNCTIONS.systemFunction.interactiveData(
              _this,
              _this.GLOBAL.config.businessFlag.caseNone,
              _this.GLOBAL.config.handleType.updateAll,
              this.formData,
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
          _this.GLOBAL.config.businessFlag.caseNone,
          _this.GLOBAL.config.handleType.getInfoById,
          _this.formData.id,
          null,
          resultData => {
            _this.loading = false
            if (!resultData.caseProcess.length) {
              resultData.caseProcess = [{content: ''}]
            }
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
            _this.costDisabledInput = _this.formData.costFlag === 'no'?true:false
            _this.caseStatusClosed = _this.formData.caseStatus === 'closed'?true:false
          }
        )
      },
      casesStatusChange: function (target) {
        this.caseStatusClosed = false
        if (target === 'closed') {
          this.$confirm('确定已结案?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.formData.caseStatus = 'closed'
            this.caseStatusClosed = true
          }).catch(() => {
            this.formData.caseStatus = 'working'
          })
        }
      },
      fileUpload: function (response, file, fileList) {
        if (response && (response.code != this.GLOBAL.config.resultCode.success)) {
          this.$message.error('上传失败～')
        } else {
          this.formData.files.push(response.data)
        }
      },
      fileRemove: function (file) {
        let eg = file.response.data
        this.formData.files = this.formData.files.filter(item => (item.fileUrl !== eg.fileUrl))
        if (file.uid) {
          let fileList = this.$refs.upload.uploadFiles
          let index = fileList.findIndex(fileItem => {
            return fileItem.uid === file.uid
          })
          fileList.splice(index, 1)
        } else {
          this.formData.filesCache = this.formData.filesCache.filter(item => (item.response.data.fileUrl !== eg.fileUrl))
        }
      },
      //是否产生费用
      costFlagChange: function (target) {
        if (target === 'no') {
          this.costDisabledInput = true
        } else {
          this.costDisabledInput = false
        }
      }
    }
  }
</script>
