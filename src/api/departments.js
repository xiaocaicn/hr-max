import request from '@/utils/request'

// 获取阻止架构数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 根据id删除部门
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 新增部门
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data

  })
}

// 获取部门详请
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 编辑部门
export function updataDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data

  })
}
