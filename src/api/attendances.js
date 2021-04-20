import request from '@/utils/request'

export function getAttendancesList(params) {
  return request({
    url: '/attendances',
    params
  })
}
export function updateAttendance(data) {
  return request({
    url: `/attendances/${data.userId}`,
    method: 'put',
    data
  })
}
// 考勤数据保存
export function attendanceSave(data) {
  return request({
    url: '/cfg/atte',
    method: 'put',
    data
  })
}
// 考勤数据查询
export function getAttendance(data) {
  return request({
    url: '/cfg/atte/item',
    method: 'post',
    data
  })
}
// 请假数据保存和更新查询
export function updataAttendanceLeave(data) {
  return request({
    url: '/cfg/leave',
    method: 'put',
    data
  })
}
// 请假请求
export function getAttendanceLeave(data) {
  return request({
    url: '/cfg/leave/list',
    method: 'post',
    data
  })
}
// 扣款设置保存
export function deductionsSave(data) {
  return request({
    url: '/cfg/deduction',
    method: 'put',
    data
  })
}
// 获取扣款设置
export function getDeductions(data) {
  return request({
    url: '/cfg/ded/list',
    method: 'post',
    data
  })
}
// 加班配置保存
export function overtimeSave(data) {
  return request({
    url: '/cfg/extDuty',
    method: 'put',
    data
  })
}

// 获取加班配置
export function getOvertime(data) {
  return request({
    url: '/cfg/extDuty/item',
    method: 'post',
    data
  })
}
export function getArchivingList(params) {
  return request({
    url: '/attendances/reports/year',
    params
  })
}
export function getArchivingCont(params) {
  return request({
    url: `/attendances/reports/${params.atteArchiveMonthlyId}`,
    params
  })
}
// 获取考勤详情
export function getAtteArchiveDetail(data) {
  return request({
    url: `/attendances/archive/${data.userId}/${data.yearMonth}`
  })
}
