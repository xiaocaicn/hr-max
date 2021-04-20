<template>
  <el-card>
    <el-form label-width="100px">
      <el-form-item label="部门">
        <el-checkbox-group v-model="departmentChecks">
          <el-checkbox v-for="item in departmentList" :key="item.id" :label="item.id" @change="checkChange">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="社保城市">
        <el-checkbox-group v-model="socialSecurityChecks">
          <el-checkbox v-for="item in cityList" :key="item.id" :label="item.id" @change="checkChange">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="公积金城市">
        <el-checkbox-group v-model="providentFundChecks">
          <el-checkbox v-for="item in cityList" :key="item.id" :label="item.id" @change="checkChange">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { getCityList } from '@/api/common'
import { getDepartments } from '@/api/departments'

export default {
  data() {
    return {
      departmentChecks: [],
      socialSecurityChecks: [],
      providentFundChecks: [],
      cityList: [],
      departmentList: []
    }
  },
  created() {
    this.getCityList()
    this.getDepartments()
  },
  methods: {
    async getCityList() {
      this.cityList = await getCityList()
    },
    async getDepartments() {
      const { depts } = await getDepartments()
      this.departmentList = depts
    },
    checkChange() {
      const selectParams = {
        'departmentChecks': this.departmentChecks,
        'socialSecurityChecks': this.socialSecurityChecks,
        'providentFundChecks': this.providentFundChecks
      }
      this.$emit('checkChange', selectParams)
    }
  }
}
</script>

<style>

</style>
