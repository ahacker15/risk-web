<template>
  <div class="main-area">
    <el-page-header @back="goBack" content="风险信息查看"></el-page-header>
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
      :disabled="!editableFlag"
    >
      <el-row class="margin-top-20">
        <el-col :span="12">
          <el-form-item label="登记日期：" prop="registrateTime">
            <el-date-picker
              style="width: 100%"
              v-model="formData.registrateTime"
              type="date"
              format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纠纷发生法人主体：" prop="legalEntity">
            <el-input v-model="formData.legalEntity" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="业务所在部门：" prop="businessUnit">
            <el-input v-model="formData.businessUnit" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="风险等级：" prop="riskGrade">
            <el-select v-model="formData.riskGrade"
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
          <el-form-item label="风险类型：" prop="riskType">
            <el-select v-model="formData.riskType"
                       style="width: 100%;"
            >
              <el-option label="--请选择--" value=""></el-option>
              <el-option :label="item.name" :value="item.code"
                         v-for="item in dictionary.riskType" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
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
        <el-col :span="12">
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
        <el-col :span="24">
          <el-form-item label="风险事项：" prop="riskMatter">
            <el-input
              type="textarea"
              autosize
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
          <el-form-item label="风险分析：" prop="riskAnalysis">
            <el-input
              type="textarea"
              autosize
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
          <el-form-item label="初步应对策略：" prop="preliminaryOpinion">
            <el-input
              type="textarea"
              autosize
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
        <el-col :span="24">
          <el-form-item :label="'事件进展' + (index?(index+1):'') + '：'">
            <el-input
              type="textarea"
              autosize
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
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="总结/复盘：" prop="summary">
            <el-input
              type="textarea"
              autosize
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
              ref="upload"
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
  export default {
    name: 'OperationEdit',
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
          id: '',
          registrateTime: '',
          legalEntity: '',
          businessUnit: '',
          riskGrade: '',
          riskType: '',
          riskMatter: '',
          servicePersonal: '',
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
        loading: false,
        editableFlag: false,
        restartFlag: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.sourceList))) && !!JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.sourceList))).filter(item => !item.value.indexOf(this.GLOBAL.config.modeName.risk) && (item.value.indexOf(this.GLOBAL.config.sourceName.restart) >= 0)).length
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
      saveForm: function () {
        this.$refs.formData.validate(valid => {
          if (valid) {
            let params = this.formData
            let _this = this
            _this.loading = true

            this.FUNCTIONS.systemFunction.interactiveData(
              _this,
              _this.GLOBAL.config.businessFlag.risks,
              _this.GLOBAL.config.handleType.updateAll,
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
      getInfo: function () {
        let _this = this
        this.formData.id && this.FUNCTIONS.systemFunction.interactiveData(
          _this,
          _this.GLOBAL.config.businessFlag.risks,
          _this.GLOBAL.config.handleType.getInfoById,
          _this.formData.id,
          null,
          resultData => {
            _this.loading = false
            if (!resultData.eventProgress.length) {
              resultData.eventProgress = [{content: ''}]
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
             _this.restartFlag = _this.formData.eventStatus==="closed" && this.restartFlag
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
              this.formData.eventStatus = 'working'
              let _this = this
              _this.loading = true
              this.FUNCTIONS.systemFunction.interactiveData(
                  _this,
                  _this.GLOBAL.config.businessFlag.risks,
                  _this.GLOBAL.config.handleType.updateSelfInfo,
                  {id: _this.formData.id, eventStatus: _this.formData.eventStatus},
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
              this.formData.eventStatus = 'closed'
          })
      }
    }
  }
</script>
