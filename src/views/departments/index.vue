<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <treeTools
          :tree-node="company"
          :is-root="true"
          @addDepartment="addDepartment"
          @editAddDepts="editAddDepts"
        />
        <hr>
        <el-tree default-expand-all :data="departs" :props="defaultProps">
          <treeTools
            slot-scope="{data}"
            :tree-node="data"
            @addDepartment="addDepartment"
            @deleDepartments="getDepartments"
            @editAddDepts="editAddDepts"
          />
        </el-tree>
      </el-card>
      <addDialog
        ref="addDepts"
        :show-dailog.sync="showDialog"
        :node="node"
        @closeAddDepart="closeAddDepart"
        @addDepartment="getDepartments"
      />
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import addDialog from './components/addDialog'
import { getDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools, addDialog },
  data() {
    return {
      departs: [],
      company: {
        name: 'XXXX公司',
        manager: '负责人',
        id: ''
      },
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      showDialog: false,
      node: {
      }
    }
  },
  created() {
    this.getDepartments()
  }, methods: {
    // transListToTreeData(list, pid) {
    //   const res = []
    //   list.forEach(item => {
    //     if (item.pid === pid) {
    //       const children = this.transListToTreeData(list, item.id)
    //       if (children.length) {
    //         item.children = children
    //       }
    //       res.push(item)
    //     }
    //   })
    //   return res
    // },
    async getDepartments() {
      const res = await getDepartments()
      // console.log(res)
      this.departs = transListToTreeData(res.depts, '')
      // console.log(this.departs)
    },
    addDepartment(treeNode) {
      // console.log(treeNode.id)
      this.showDialog = true
      this.node = treeNode
    }, closeAddDepart() {
      this.showDialog = false
    }, async editAddDepts(treeNode) {
      console.log(treeNode.id)
      await this.$refs.addDepts.getDepartmentsDetail(treeNode.id)
      this.showDialog = true
      this.node = treeNode
    }
  }
}
</script>

<style>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
