<template>
  <div class="main-area">
    <el-divider>设置提醒事件</el-divider>
    <el-row class="margin-top-10" v-for="(entity, index ) in remindList" :key="entity.key || entity.id">
      <el-col :span="2">
        <i class="el-icon-finished" style="color: #409eff;line-height: 28px;" v-if="entity.sendFlag === 1">已发送</i>
        <i class="el-icon-date" style="color: goldenrod;line-height: 28px;" v-if="entity.sendFlag === 0">未发送</i>
        <i class="el-icon-document-add" v-if="typeof entity.sendFlag === 'undefined'">未保存</i>
      </el-col>
      <el-col :span="2">
        <label class="search-label">
          <span v-if="!entity.sendFlag || (entity.sendFlag !== 1)" style="color:#FF0000;">*</span>提醒人员:
        </label>
      </el-col>
      <el-col :span="4">
        <el-select v-model="entity.personnelId"
                   :size="GLOBAL.config.systemSize"
                   placeholder="提醒人员"
                   style="width: 100%;"
                   :disabled="entity.sendFlag === 1"
                   filterable
                   :filter-method="serviceSearch"
        >
          <el-option label="--请选择--" value=""></el-option>
          <el-option :label="item.emplName +'(' + item.accountName + ')'"
                     :value="item.emplName + '(' +item.accountName + ')'"
                     v-for="item in dictionary.psPersonnelList" :key="item.accountName"></el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <label class="search-label">
          <span v-if="!entity.sendFlag || (entity.sendFlag !== 1)" style="color:#FF0000;">*</span>
          事件名称:
        </label>
      </el-col>
      <el-col :span="5">
        <el-input v-model="entity.eventTitle"
                  placeholder="事件名称"
                  maxlength="32"
                  :disabled="entity.sendFlag === 1"
                  :size="GLOBAL.config.systemSize"></el-input>
      </el-col>
      <el-col :span="2">
        <label class="search-label">
          <span v-if="!entity.sendFlag || (entity.sendFlag !== 1)" style="color:#FF0000;">*</span>
          提醒时间:
        </label>
      </el-col>
      <el-col :span="4">
        <el-date-picker
          style="width: 100%"
          v-model="entity.remindDate"
          type="datetime"
          :size="GLOBAL.config.systemSize"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          :disabled="entity.sendFlag === 1"
          placeholder="选择申请日期">
        </el-date-picker>
      </el-col>
      <el-col :span="3">
        <el-button v-if="index > 0 && (entity.sendFlag !== 1)"
                   title="删除"
                   style="float: left; margin-left: 10px"
                   type="danger"
                   icon="el-icon-delete"
                   @click.prevent="removeRemindProcess(entity)"
                   :size="GLOBAL.config.systemSize"
                   circle></el-button>
        <el-button v-if="(index === (remindList.length - 1) && remindList.length < GLOBAL.config.limitNum.remind)"
                   title="添加"
                   style="float: left; margin-left: 10px"
                   type="primary"
                   icon="el-icon-plus"
                   @click="addRemindProcess"
                   :size="GLOBAL.config.systemSize" circle></el-button>
      </el-col>
    </el-row>
    <el-row class="margin-top-20">
      <el-button type="primary" @click="saveRemind" :size="GLOBAL.config.systemSize">保存
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
        relationId: '',
        remindList: [],
        // 字典数据
        dictionary: {
          psPersonnelList: [],
        },
      }
    },
    methods: {
      init: function (id) {
        if (id) {
          this.relationId = id
          this.getList()
        } else {
          this.$message.warning('未获取到案件主键～')
        }

      },
      // 添加
      addRemindProcess: function () {
        this.remindList.push(
          {
            relationId: this.relationId,
            personnelId: '',
            eventTitle: '',
            targetEmail: '',
            remindDate: '',
            remindDateRegular: ''
          })
      },
      // 删除按钮
      removeRemindProcess (entity) {
        let index = this.remindList.indexOf(entity)
        if (index !== -1) {
          this.remindList.splice(index, 1)
        }
      },
      goBack: function () {
        this.$props.closeSelf && this.$props.closeSelf()
      },
      saveRemind: function () {
        // 全填校验========start================
        let allIn = true
        this.remindList.forEach(item => {
          if (!item.personnelId || !item.eventTitle || !item.remindDate) {
            allIn = false
          }
        })
        if (!allIn) {
          this.$message.warning('数据不完整')
          return
        }
        // 全填校验========end==================
        let _this = this
        this.FUNCTIONS.systemFunction.interactiveData(
          _this,
          _this.GLOBAL.config.businessFlag.remind,
          _this.GLOBAL.config.handleType.deleteAndAdd,
          _this.remindList,
          'list',
          resultData => {
            if (resultData) {
              _this.$message.success('保存成功～')
              _this.$props.closeSelf && _this.$props.closeSelf()
              _this.$props.refresh && _this.$props.refresh()
            } else {
              _this.$message.warn('保存失败～')
            }
          }
        )
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
      getList: function () {
        let _this = this
        this.relationId && this.FUNCTIONS.systemFunction.interactiveData(
          _this,
          _this.GLOBAL.config.businessFlag.remind,
          _this.GLOBAL.config.handleType.getListByCondition,
          {relationId: _this.relationId},
          null,
          resultData => {
            if (resultData && resultData.length > 0) {
              _this.remindList = resultData
            } else {
              _this.remindList = [{
                relationId: _this.relationId,
                personnelId: '',
                eventTitle: '',
                targetEmail: '',
                remindDate: '',
                remindDateRegular: ''
              }]
            }
          }
        )
      }
    }

  }
</script>
