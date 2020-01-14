<template>
  <div class="main-area">
    <el-page-header @back="goBack" content="风险信息新增"></el-page-header>
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
        <el-col :span="12">
          <el-form-item label="登记日期：" prop="registrateTime">
            <el-date-picker
              style="width: 100%"
              v-model="formData.registrateTime"
              type="date"
              :format="GLOBAL.config.dateFormat.yMdHm"
              disabled
              placeholder="登记日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纠纷发生法人主体：" prop="legalEntity">
            <el-input v-model="formData.legalEntity" placeholder="纠纷发生法人主体" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="业务所在部门：" prop="businessUnit">
            <el-input v-model="formData.businessUnit" placeholder="业务所在部门" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门联系人：" prop="orgContact">
            <el-input v-model="formData.orgContact" placeholder="部门联系人" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="风险类型：" prop="riskType">
            <el-select v-model="formData.riskType"
                       placeholder="风险类型"
                       style="width: 100%;"
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.name" :value="item.code"
                         v-for="item in dictionary.riskType" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="风险等级：" prop="riskGrade">
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
        <el-col :span="12">
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
        <el-col :span="12">
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
        <el-col :span="24">
          <el-form-item label="风险事项：" prop="riskMatter"
                        :rules="eventStatusClosed?formRules.riskMatter:[{required: false, message: '请输入风险事项', trigger: 'blur'}]">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入风险事项"
              :maxlength="GLOBAL.config.textMaxlength.oneThousand"
              v-model="formData.riskMatter">
            </el-input>
          </el-form-item>
          <span class="tips-max-length"
                :style="(formData.riskMatter && (formData.riskMatter.length === GLOBAL.config.textMaxlength.oneThousand))?'color: red;':''">{{formData.riskMatter?formData.riskMatter.length:0}}/{{GLOBAL.config.textMaxlength.oneThousand}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="风险分析：" prop="riskAnalysis"
                        :rules="eventStatusClosed?formRules.riskAnalysis:[{required: false, message: '请输入风险分析', trigger: 'blur'}]">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入风险分析"
              :maxlength="GLOBAL.config.textMaxlength.twoThousand"
              :autosize="{ minRows: 3}"
              v-model="formData.riskAnalysis">
            </el-input>
          </el-form-item>
          <span class="tips-max-length"
                :style="(formData.riskAnalysis && (formData.riskAnalysis.length === GLOBAL.config.textMaxlength.twoThousand))?'color: red;':''">{{formData.riskAnalysis?formData.riskAnalysis.length:0}}/{{GLOBAL.config.textMaxlength.twoThousand}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="初步应对策略：" prop="preliminaryOpinion"
                        :rules="eventStatusClosed?formRules.preliminaryOpinion:[{required: false, message: '请输入初步应对策略', trigger: 'blur'}]">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入初步应对策略"
              :maxlength="GLOBAL.config.textMaxlength.twoThousand"
              :autosize="{ minRows: 3}"
              v-model="formData.preliminaryOpinion">
            </el-input>
          </el-form-item>
          <span class="tips-max-length"
                :style="(formData.preliminaryOpinion && (formData.preliminaryOpinion.length === GLOBAL.config.textMaxlength.twoThousand))?'color: red;':''">{{formData.preliminaryOpinion?formData.preliminaryOpinion.length:0}}/{{GLOBAL.config.textMaxlength.twoThousand}}</span>
        </el-col>
      </el-row>
      <el-row v-for="(item, index) in formData.eventProgress" :key="item.id">
        <el-col :span="22">
          <el-form-item :label="'事件进展' + (index?(index+1):'') + '：'" :prop="'eventProgress.'+index+'.content'"
                        :rules="eventStatusClosed?formRules.eventProgress:[{required: false, message: '请输入事件进展', trigger: 'blur'}]">
            <el-input
              type="textarea"
              autosize
              :placeholder="'事件进展' + (index?(index+1):'')"
              :key="'process_'+ index"
              :maxlength="GLOBAL.config.textMaxlength.twoThousand"
              :autosize="{ minRows: 2}"
              v-model="item.content"
            >
            </el-input>
          </el-form-item>
          <span class="tips-max-length"
                :style="(item.content && (item.content.length === GLOBAL.config.textMaxlength.twoThousand))?'color: red;':''">{{item.content?item.content.length:0}}/{{GLOBAL.config.textMaxlength.twoThousand}}</span>
        </el-col>
        <el-col :span="2">
          <el-button v-if="index > 0"
                     style="margin: 10px 0 10px 10px; float: left;"
                     title="删除"
                     type="danger"
                     icon="el-icon-delete"
                     @click.prevent="removeeventProgress(item)"
                     :size="GLOBAL.config.systemSize"
                     circle></el-button>
          <el-button
            v-if="(index === formData.eventProgress.length - 1) && (index < GLOBAL.config.limitNum.process - 1)"
            style="margin: 10px; float: left;"
            title="添加"
            type="primary"
            icon="el-icon-plus"
            @click="addeventProgress"
            :size="GLOBAL.config.systemSize" circle></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="总结/复盘：" prop="summary"
                        :rules="eventStatusClosed?formRules.summary:[{required: false, message: '总结/复盘', trigger: 'blur'}]">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入总结/复盘"
              :maxlength="GLOBAL.config.textMaxlength.twoThousand"
              :autosize="{ minRows: 3}"
              v-model="formData.summary">
            </el-input>
          </el-form-item>
          <span class="tips-max-length"
                :style="(formData.summary && (formData.summary.length === GLOBAL.config.textMaxlength.twoThousand))?'color: red;':''">{{formData.summary?formData.summary.length:0}}/{{GLOBAL.config.textMaxlength.twoThousand}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="事件状态：" prop="eventStatus">
            <el-switch
              style="float: left;"
              v-model="formData.eventStatus"
              inactive-color="#13ce66"
              active-color="#ececec"
              active-value="closed"
              inactive-value="working"
              active-text="结案"
              inactive-text="在办"
              @change="eventStatusChange"
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
    name: 'OperationAdd',
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
    data () {
      return {
        formData: {
          registrateTime: '',
          legalEntity: '',
          orgContact: '',
          businessUnit: '',
          riskGrade: '',
          riskType: '',
          riskMatter: '',
          servicePersonal: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.userConfigName))).name + '(' + JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.userConfigName))).accountName + ')',
          cooperationPersonnel: '',
          riskAnalysis: '',
          preliminaryOpinion: '',
          summary: '',
          eventStatus: 'working',
          // 案件进展
          eventProgress: [{content: ''}],
          files: [],
          filesCache: []
        },
        //校验规则
        formRules: {
          registrateTime: [
            {required: true, message: '请输入登记日期', trigger: 'blur'}
          ],
          legalEntity: [
            {required: true, message: '请输入纠纷发生法人主体', trigger: 'blur'}
          ],
          businessUnit: [
            {required: true, message: '请输入业务所在部门', trigger: 'blur'}
          ],
          riskType: [
            {required: true, message: '请输入风险类型', trigger: 'blur'}
          ],
          servicePersonal: [
            {required: true, message: '请输入服务人员', trigger: 'blur'}
          ],
          //结案 必填项
          riskMatter: [
            {required: true, message: '请输入风险事项', trigger: 'blur'}
          ],
          riskAnalysis: [
            {required: true, message: '请输入风险分析', trigger: 'blur'}
          ],
          preliminaryOpinion: [
            {required: true, message: '请输入初步应对策略', trigger: 'blur'}
          ],
          eventProgress: [
            {required: true, message: '请输入事件进展', trigger: 'blur'}
          ],
          summary: [
            {required: true, message: '请输入复盘总结', trigger: 'blur'}
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
          riskType: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.riskType))),
          psPersonnelList: [],
        },
        eventStatusClosed: false,
        loading: false,
          timer: null
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init: function () {
          this.formData.registrateTime = this.getCurrentDate();
      },
      goBack: function () {
        this.$props.closeSelf && this.$props.closeSelf()
      },
      removeeventProgress (item) {
        let index = this.formData.eventProgress.indexOf(item)
        if (index !== -1) {
          this.formData.eventProgress.splice(index, 1)
        }
      },
      addeventProgress () {
        this.formData.eventProgress.push({
          content: '',
          key: Date.now()
        })
      },
      saveForm: function () {
        this.$refs.formData.validate(valid => {
          if (valid) {
            let params = this.formData
            let _this = this
            _this.loading = true
            //////////  删除附件缓存数据
            delete params.filesCache
            this.FUNCTIONS.systemFunction.interactiveData(
              _this,
              _this.GLOBAL.config.businessFlag.risks,
              _this.GLOBAL.config.handleType.add,
              _this.FUNCTIONS.systemFunction.removeNullFields(params),
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
      eventStatusChange: function (target) {
        this.eventStatusClosed = false
        if (target === 'closed') {
          this.$confirm('确定已结案?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.formData.eventStatus = 'closed'
            this.eventStatusClosed = true
          }).catch(() => {
            this.formData.eventStatus = 'working'
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
        this.formData.files = this.formData.files.filter(item => (item.fileUrl !== eg.fileUrl)
        )
        let fileList = this.$refs.upload.uploadFiles
        let index = fileList.findIndex(fileItem => {
            return fileItem.uid === file.uid
          }
        )
        fileList.splice(index, 1)
      },
      getCurrentDate: function () {
          var date = new Date();
          var seperator1 = "-";
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var strDate = date.getDate();
          if (month >= 1 && month <= 9) {
              month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
          }
          var currentdate = year + seperator1 + month + seperator1 + strDate;
          return currentdate;
      }
    }
  }
</script>
