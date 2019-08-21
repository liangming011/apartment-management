import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/apartmentList',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function patternList() {
  return request({
    url: '/selectPattern',
    method: 'get'
  })
}

export function faceList() {
  return request({
    url: '/selectFaceList',
    method: 'get'
  })
}

export function houseTypeList() {
  return request({
    url: '/selectHouseType',
    method: 'get'
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createApartment(params) {
  return request({
    url: '/createApartment',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function updateApartment(params) {
  return request({
    url: '/updateApartment',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function deleteApartment(id) {
  return request({
    url: '/deleteApartment',
    method: 'post',
    data: id,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

