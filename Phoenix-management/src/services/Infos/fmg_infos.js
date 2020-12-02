/*
 * @Author: your name
 * @Date: 2020-11-30 12:08:35
 * @LastEditTime: 2020-12-02 10:52:19
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
