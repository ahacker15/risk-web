<template>
  <el-form
    :inline="true"
    :model="formData"
    class="demo-ruleForm"
    label-width="145px"
    :rules="formRules"
    ref="formData"
    :size="GLOBAL.config.systemSize"
  >
    <el-row>
      <el-col :span="8">
        <el-form-item label="审理机构：" prop="hearingOrgan">
          <el-input v-model="formData.hearingOrgan" placeholder="审理机构" maxlength="128"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="审理程序：" prop="hearingProcedure" :rules="caseStatusClosed?formRules.caseAnalysis:[{required: false, message: '审理程序不可为空', trigger: 'blur'}]">
          <el-select v-model="formData.hearingProcedure"
                     placeholder="审理程序"
                     style="width: 100%;"
          >
            <el-option label="--请选择--" value=""></el-option>
            <el-option :label="item.name" :value="item.code"
                       v-for="item in dictionary.hearingProcedure" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="立案受理时间：" prop="filingDate">
          <el-date-picker
            style="width: 100%"
            v-model="formData.filingDate"
            type="date"
            :format="GLOBAL.config.dateFormat.yMd"
            placeholder="立案受理时间">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="开庭时间：" prop="openDate">
          <el-date-picker
            style="width: 100%"
            v-model="formData.openDate"
            type="date"
            :format="GLOBAL.config.dateFormat.yMd"
            placeholder="开庭时间">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8"></el-col>
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
        <el-form-item label="初步处理/答复意见：" prop="preliminaryOpinion" :rules="caseStatusClosed?formRules.preliminaryOpinion:[{required: false, message: '请输入案件分析', trigger: 'blur'}]">
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
  </el-form>
</template>
<script>
  export default {
    name: 'HearInformation',
    props: {
      infoData: {},
      caseStatus:'',
      disabled: {}
    },
    data () {
      return {
        formData: {
          id: '',
          relationId: '',
          hearingOrgan: '',
          hearingProcedure: '',
          filingDate: '',
          openDate: '',
          caseAnalysis: '',
          preliminaryOpinion: '',
          caseProcess: [{content: '',sort:''}],
          sort:1
        },
        //校验规则
        formRules: {
          //结案：必填字段控制
          caseAnalysis: [
            {required: true, message: '请输入案件分析', trigger: 'blur'}
          ],
          preliminaryOpinion: [
            {required: true, message: '请输入初步处理/答复意见', trigger: 'blur'}
          ],
          caseProcess: [
            {required: true, message: '案件进展不可为空', trigger: 'blur'}
          ],
          hearingProcedure: [
              {required: true, message: '审理程序不可为空', trigger: 'blur'}
          ],
        },
        // 字典数据
        dictionary: {
          hearingProcedure: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.hearingProcedure))),
        },
        caseStatusClosed:false
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init: function () {
        this.$props.infoData && (this.formData = this.$props.infoData)
        this.caseStatusClosed = (this.$props.caseStatus === 'closed'?true:false)
      },
      getData: function (validateFlag) {
        let _this = this, resultData = null
        if (validateFlag) {
          _this.$refs.formData.validate(valid => {
            if (valid) {
              resultData = _this.formData
            } else {
              _this.$message.error('校验失败～')
            }
          })
        } else {
          resultData = _this.formData
        }
        return resultData
      },
      removeCaseProcess (item) {
        let index = this.formData.caseProcess.indexOf(item)
        if (index !== -1) {
          this.formData.caseProcess.splice(index, 1)
        }
      },
      addCaseProcess () {
        this.formData.caseProcess.push({
          content: '',
            sort:'',
          key: Date.now()
        })
      }
    }
  }
</script>
