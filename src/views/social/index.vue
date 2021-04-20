<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <span slot="before">本月：社保缴纳 公积金在缴 增员 减员 入职 离职</span>
        <template slot="after">
          <el-button type="danger" size="mini">历史回档</el-button>
          <el-button type="primary" size="mini">202104报表</el-button>
        </template>
      </PageTools>
      <SocialTool @checkChange="checkChange" />
      <el-card>
        <el-table :data="list">
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" sortable prop="username" />
          <el-table-column label="手机" sortable prop="mobile" />
          <el-table-column label="工号" sortable prop="workNumber" />
          <el-table-column label="部门" sortable prop="departmentName" />
          <el-table-column label="入职时间" sortable prop="timeOfEntry" />
          <el-table-column label="离职时间" sortable prop="leaveTime" />
          <el-table-column label="社保城市" prop="participatingInTheCity" />
          <el-table-column label="公积金城市" prop="providentFundCity" />
          <el-table-column label="社保基数" prop="socialSecurityBase" />
          <el-table-column label="公积金基数" prop="providentFundBase" />
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button type="text" size="mini" @click="$router.push(`/social/detail/${row.id}`)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination :total="page.total" :current-page="page.page" :page-size="page.pageSize" layout="prev, pager, next" @current-change="pageChange" />
      </el-row>
    </div>
  </div>
</template>

<script>
import { getSettings, getSocialList } from '@/api/common'
import SocialTool from './components/social-tool'

export default {
  components: {
    SocialTool
  },
  data() {
    return {
      list: [],
      page: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      selectParams: {}
    }
  },
  created() {
    this.getSocialList()
    this.getSettings()
  },
  methods: {
    async getSocialList() {
      const { rows, total } = await getSocialList({ ...this.page, ...this.selectParams })
      this.list = rows
      this.page.total = total
      console.log(this.list)
    },
    async getSettings() {
      const res = await getSettings()
      console.log(res)
    },
    checkChange(selectParams) {
      this.selectParams.departmentChecks = selectParams.departmentChecks
      this.selectParams.providentFundChecks = selectParams.providentFundChecks
      this.selectParams.socialSecurityChecks = selectParams.socialSecurityChecks
      this.page.page = 1
      this.getSocialList()
    },
    pageChange(newPage) {
      this.page.page = newPage
      this.getSocialList()
    }
  }
}
</script>

<style>

</style>
