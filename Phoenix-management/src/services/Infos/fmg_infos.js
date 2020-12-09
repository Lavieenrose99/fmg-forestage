/*
 * @Author: your name
 * @Date: 2020-11-30 12:08:35
 * @LastEditTime: 2020-12-09 10:44:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fmg-management/Phoenix-management/src/services/Infos/fmg_infos.js
 */
import request from '@/utils/request';

export async function createInfos(payload) {
  return request('/api.farm/news/info/create', {
    method: 'POST',
    data: payload,
  });
}

export async function adjInfos(payload, Iid) {
  return request(`/api.farm/news/info/put/${Iid}`, {
    method: 'PUT',
    data: payload,
  });
}
export async function getInfosList(payload) {
  return request('/api.farm/news/info/list', {
    method: 'GET',
    params: payload,
  });
}
export async function MgetInfosEnity(payload) {
  return request('/api.farm/news/info/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}
export async function DelInfos(payload) {
  return request(`/api.farm/news/info/del/${payload}`, {
    method: 'DELETE',
  });
}

//资讯标签

export async function createInfosTags(payload) {
  return request('/api.farm/news/info/tag', {
    method: 'POST',
    data: payload,
  });
} 

export async function getInfosTagsList(payload) {
  return request('/api.farm/news/info/tag/list', {
    method: 'GET',
    params: payload,
  });
}

export async function MgetInfosTagsEnity(payload) {
  return request('/api.farm/news/info/tag/_mget', {
    method: 'POST',
    data: { ids: payload },
  });
}

export async function InfosTagsDel(payload) {
  return request(`/api.farm/news/info/tag/${payload}`, {
    method: 'DELETE',
  });
}
