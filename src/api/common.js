import request from '@/utils/request'

export function getCityList() {
  return request({
    url: '/sys/city'
  })
}

export function getSocialList(data) {
  return request({
    url: '/social_securitys/list',
    method: 'post',
    data
  })
}

export function getSettings() {
  return request({
    url: '/social_securitys/settings'
  })
}
