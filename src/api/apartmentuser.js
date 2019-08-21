import request from '@/utils/request'

export function userInfoList(username) {
  return request({
    url: '/user/selectUserByName',
    method: 'post',
    data: username,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function userInfoById(id) {
  return request({
    url: '/user/selectUserById',
    method: 'post',
    data: id,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function userList(params) {
  return request({
    url: '/user/userList',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

