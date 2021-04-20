<template>
  <div class="dashboard-container">
    <SetDialog :dialog-form-visible="dialogFormVisible" />
    <PageTools :show-before="true" :show-below="true">
      <span slot="before">有{{ attendInfo.tobeTaskCount }}条数据需要处理</span>
      <template slot="after">
        <el-button size="small" type="primary" @click="$router.push('/import?type=attendance')">导入</el-button>
        <el-button size="small" type="primary" @click="notice">提醒</el-button>
        <el-button size="small" type="primary" @click="setDialogFormVisible">设置</el-button>
        <el-button size="small" type="primary" @click="$router.push('/attendances/history')">历史归档</el-button>
        <el-button size="small" type="primary">3月份报表</el-button>
      </template>
      <div slot="below">
        <div>
          <h4>部门</h4>
          <el-checkbox-group v-model="departmentsList" @change="departmentsListLog">
            <el-checkbox
              v-for="dept in departments"
              :key="dept.id"
              :label="dept.name"
            >{{ dept.name }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="AttendanceStatusBox">
          <span class="AttendanceStatus">考勤状态</span>
          <el-radio-group v-model="formData.stateID" @change="holidayTypeLogID">
            <el-radio
              v-for="states in attendanceStatus"
              :key="states.id"
              :value="states.value"
              :label="states.id"
            >{{ states.value }}</el-radio>
          </el-radio-group>
        </div>
      </div>
    </PageTools>
    <el-card class="hr-block">
      <!-- 考勤列表 -->
      <div style="width:100%;position: relative;overflow-x: auto; overflow-y: hidden;">
        <div style="width: 3000px;">
          <table border="0" align="center" cellpadding="0" cellspacing="0" class="tableInfo">
            <tr>
              <th width="50">序号</th>
              <th width="100">姓名</th>
              <th width="100">工号</th>
              <th width="200">部门</th>
              <th width="100">手机</th>
              <th v-for="(it, ind) in monthOfReport" :key="ind" width="110">{{ attendInfo.month }}/{{ ind + 1 }}</th>
            </tr>
            <tr v-for="(item, index) in list" :key="item.id">
              <td width="50">{{ index + 1 }}</td>
              <td width="100">{{ item.username }}</td>
              <td width="100">{{ item.workNumber }}</td>
              <td width="200">{{ item.departmentName }}</td>
              <td width="100">{{ item.mobile }}</td>
              <td
                v-for="(it,ind) in item.attendanceRecord"
                :key="ind"
                width="110"
                @click="showChangeDialog(item,ind,it)"
              >
                <span v-if="it.adtStatu===1">√</span>
                <span v-if="it.adtStatu===2">旷工</span>
                <span v-if="it.adtStatu===3">迟到</span>
                <span v-if="it.adtStatu===4">早退</span>
                <span v-if="it.adtStatu===5">外出</span>
                <span v-if="it.adtStatu===6">出差</span>
                <span v-if="it.adtStatu===7">年假</span>
                <span v-if="it.adtStatu===8">事假</span>
                <span v-if="it.adtStatu===9">病假</span>
                <span v-if="it.adtStatu===10">婚假</span>
                <span v-if="it.adtStatu===11">丧假</span>
                <span v-if="it.adtStatu===12">产假</span>
                <span v-if="it.adtStatu===13">奖励产假</span>
                <span v-if="it.adtStatu===14">陪产假</span>
                <span v-if="it.adtStatu===15">探亲假</span>
                <span v-if="it.adtStatu===16">工伤假</span>
                <span v-if="it.adtStatu===17">调休</span>
                <span v-if="it.adtStatu===18">产检假</span>
                <span v-if="it.adtStatu===19">流产假2</span>
                <span v-if="it.adtStatu===20">长期病假</span>
                <span v-if="it.adtStatu===21">测试架</span>
                <span v-if="it.adtStatu===22">补签</span>
              </td>
            </tr>
          </table>
        </div>

      </div>
      <el-dialog
        :visible.sync="centerDialogVisible"
        width="30%"
        center
      >
        <span slot="title" style="color:#fff;">{{ attendInfo.name }} {{ attendInfo.month }}/{{ attendInfo.getDate }}（实际工作日考勤方案）</span>
        <div class="attenInfo">
          <p class="colRed">注：统计考勤时，异常状态优先正常状态</p>
          <p class="check">
            <el-radio-group v-model="modifyData.adtStatu">
              <el-radio
                v-for="item in stateData.vacationtype"
                :key="item.id"
                :label="item.id"
                :value="item.name"
              >{{ item.name }}</el-radio>
            </el-radio-group></p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="btnOK">确定</el-button>
          <el-button @click="centerDialogVisible = false">取消</el-button>
        </span>
      </el-dialog>
      <!-- 分页组件 -->
      <el-row type="flex" align="middle" justify="center" style="height: 60px">
        <el-pagination
          :page-size="page.pagesize"
          :current-page="page.page"
          layout="prev, pager, next"
          :total="page.total"
          @current-change="pageChange"
        />
      </el-row>
    </el-card>
    <el-dialog
      title="提醒"
      :visible.sync="tipsDialogVisible"
      width="280px"
      center
    >
      <div class="attenInfo">
        <p>系统将通过邮件与短信的形式，对全体员工中存在旷工的考勤进行提醒，该提醒每月仅可发送 1 次。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSub">我知道了</el-button>
        <el-button @click="tipsDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
import attendanceApi from '@/api/constant/attendance'
import { getAttendancesList, updateAttendance } from '@/api/attendances'
import SetDialog from './components/setDialog'
export default {
  components: {
    SetDialog
  },
  data() {
    return {
      attendanceStatus: [],
      departmentsList: [],
      list: [],
      selectData: [],
      stateData: attendanceApi,
      departments: [],
      total: 100,
      attendanceRecord: '',
      monthOfReport: '',
      centerDialogVisible: false,
      tipsDialogVisible: false,
      dialogFormVisible: false,
      month: '',
      yearMonth: '',
      loading: false,
      attendInfo: {
        month: '',
        getDate: '',
        getInfo: '',
        name: '',
        counts: '',
        tobeTaskCount: ''
      },
      formData: {
        page: 1,
        pagesize: 10,
        keyword: this.keyword,
        deptID: [], // 性别
        stateID: ''
      },
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      modifyData: {
        userId: '',
        day: '',
        adtStatu: ''
      }
      // showChangeDialog: false
    }
  },
  created() {
    this.getDepartments()
    this.getAttendancesList()
  },
  methods: {
    async getDepartments() {
      const { depts } = await getDepartments()
      this.departments = depts
    },
    holidayTypeLogID(id) {
      console.log(id)
    },
    departmentsListLog(value) {
      console.log(value)
      console.log(this.departmentsList)
    },
    async getAttendancesList() {
      this.loading = true
      const { data, monthOfReport, tobeTaskCount } = await getAttendancesList({ ...this.page })
      this.list = data.rows // 当前记录
      this.page.total = data.total // 总条数
      this.attendInfo.counts = data.total
      this.attendInfo.month = monthOfReport
      this.attendInfo.tobeTaskCount = tobeTaskCount

      var date = new Date()
      var year = date.getFullYear()
      const month = monthOfReport
      var d = new Date(year, month, 0) // 获取月份
      this.monthOfReport = d.getDate() // 获取日期
      this.yearMonth = year + ('' + month < 10 ? '0' + month : month)
      this.month = monthOfReport
      this.loading = false
    },
    pageChange(pageNum) {
      // console.log(pageNum)
      this.page.page = pageNum
      this.getAttendancesList()
    },
    async btnOK() {
      await updateAttendance(this.modifyData)
      this.$message.success('修改成功')
      this.getAttendancesList()
      this.centerDialogVisible = false
    },
    showChangeDialog(item, id, it) {
      this.modifyData.userId = item.id
      this.modifyData.day = it.day
      this.modifyData.departmentId = item.departmentId
      this.modifyData.adtStatu = it.adtStatu + '' // 数字转成字符串

      if (it.adtStatu !== '') {
        this.attendInfo.getDate = parseInt(id + 1)
        this.attendInfo.getInfo = it.adtStatu
        this.attendInfo.name = item.name
        this.centerDialogVisible = true
      }
    },
    setDialogFormVisible() {
      console.log(1)
      this.dialogFormVisible = true
    },
    notice() {
      this.tipsDialogVisible = true
    },
    handleSub() {
      this.tipsDialogVisible = false
    },
    setDialogOff() {
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.AttendanceStatusBox {
  margin-top: 20px;
  .AttendanceStatus {
    font-size: 14px;
    font-weight: bold;
    margin-right: 30px;
  }
}
.tableInfo {
    line-height: 36px;
    border: solid 1px #ebeef5;
    border-right: 0 none;
    border-bottom: 0 none;
    tr {
      th {
        height: 50px;
        text-align: center;
        border-right: solid 1px #ebeef5;
        border-bottom: solid 1px #ebeef5;
        border-bottom: 2px solid #e8e8e8;
        background: #fafafa;
        min-width:  100px;
      }
      td {
        height: 36px;
        text-align: center;
        border-right: solid 1px #ebeef5;
        border-bottom: solid 1px #ebeef5;
      }
    }
  }

.attenInfo {
  p {
    &.check {
      padding: 20px 0 0;
    }
    .el-radio {
        display: inline-block;
        width: 60px;
        padding: 5px 0;

    }
  }
}
</style>
