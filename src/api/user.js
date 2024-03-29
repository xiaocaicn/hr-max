import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
// 获取用户的基本资料
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 根据用户id获取用户详情信息
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
