import request from "@/utils/request";
import {filterObjNullVal} from "@/utils/index"

export function getList(query) {
  return request({
    url: "/admin/admins",
    method: "get",
    params: query
  });
}

export function getDetail(id) {
  return request({
    url: "/admin/admins/" + id,
    method: "get"
  });
}

export function createAdmin(obj) {
  let data = filterObjNullVal(obj)
  return request({
    url: "/admin/admins",
    method: "post",
    data
  });
}

export function updateAdmin(id, obj) {
  let data = filterObjNullVal(obj)
  return request({
    url: "/admin/admins/" + id,
    method: "patch",
    data
  });
}

export function deleteAdmin(id) {
  return request({
    url: "/admin/admins/" + id,
    method: "delete"
  });
}

export function batchDeleteAdmin(data) {
  return request({
    url: "/admin/admins/batch",
    method: "delete",
    data
  });
}
