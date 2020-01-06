<template>
  <div class="main-area">
    <el-row>
      <el-col :span="24">
        <el-select v-model="changeServicePersonal"
                   :size="GLOBAL.config.systemSize"
                   placeholder="服务人员"
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
      </el-col>
    </el-row>
    <el-row class="margin-top-20">
      <el-button type="primary" @click="saveServicePersonal" :size="GLOBAL.config.systemSize">保存
      </el-button>
      <el-button @click="goBack" :size="GLOBAL.config.systemSize">返回
      </el-button>
    </el-row>
  </div>
</template>
<script>
  export default {
    name: 'OperationRemind',
    props: {
      refresh: {
        type: Function
      },
      closeSelf: {
        type: Function
      }
    },
    data () {
      return {
        changeId: '',
        changeServicePersonal:[],
        // 字典数据
        dictionary: {
          psPersonnelList: [],
        },
      }
    },
    methods: {
      init: function (rowData) {
        if (rowData) {
          this.changeId = rowData.id
            if(rowData.servicePersonal) {
                this.changeServicePersonal = rowData.servicePersonal.split(',')
            }
        } else {
          this.$message.warning('数据为空～')
        }

      },
      goBack: function () {
        this.$props.closeSelf && this.$props.closeSelf()
      },
      saveServicePersonal: function () {
        let _this = this
        this.FUNCTIONS.systemFunction.interactiveData(
          _this,
          _this.GLOBAL.config.businessFlag.caseNone,
          _this.GLOBAL.config.handleType.updateSelfInfo,
          {id: _this.changeId, servicePersonal:_this.changeServicePersonal.join(',')},
          null,
          resultData => {
            if (resultData) {
              _this.$message.success('变更成功～')
              _this.$props.closeSelf && _this.$props.closeSelf()
              _this.$props.refresh && _this.$props.refresh()
            } else {
              _this.$message.warn('变更失败～')
            }
          }
        )
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
      }
    }

  }
</script>
