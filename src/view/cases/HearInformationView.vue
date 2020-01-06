<template>
  <el-form
    :inline="true"
    :model="formData"
    class="demo-ruleForm"
    label-width="145px"
    :rules="formRules"
    ref="formData"
    :size="GLOBAL.config.systemSize"
    :disabled="!editableFlag"
  >
    <el-row>
      <el-col :span="8">
        <el-form-item label="审理机构：" prop="hearingOrgan">
          <el-input v-model="formData.hearingOrgan" maxlength="128"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="审理程序：" prop="hearingProcedure">
          <el-select v-model="formData.hearingProcedure"
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
            :format="GLOBAL.config.dateFormat.yMd">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="开庭时间：" prop="openDate">
          <el-date-picker
            style="width: 100%"
            v-model="formData.openDate"
            type="date"
            :format="GLOBAL.config.dateFormat.yMd">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8"></el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="案件分析：" prop="caseAnalysis">
          <el-input
            type="textarea"
            autosize
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
        <el-form-item label="初步处理/答复意见：" prop="preliminaryOpinion">
          <el-input
            type="textarea"
            autosize
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
      <el-col :span="24">
        <el-form-item :label="'案件进展' + (index?(index+1):'') + '：'">
          <el-input
            type="textarea"
            autosize
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
    </el-row>
  </el-form>
</template>
<script>
  export default {
    name: 'HearInformation',
    props: {
      infoData: {}
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
          caseProcess: [{content: ''}]
        },
        //校验规则
        formRules: {
        },
        // 字典数据
        dictionary: {
          hearingProcedure: JSON.parse(unescape(localStorage.getItem(this.GLOBAL.config.dictionaryPre + this.GLOBAL.config.dictionary.hearingProcedure))),
        },
        editableFlag: false
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init: function () {
        this.$props.infoData && (this.formData = this.$props.infoData)
      },
      getData: function (validateFlag) {
        let _this = this, resultData = null
        if (validateFlag) {
          _this.$refs.formData.validate(valid => {
            if (valid) {
              resultData = _this.formData
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
          key: Date.now()
        })
      }
    }
  }
</script>
