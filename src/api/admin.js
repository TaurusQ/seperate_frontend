import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/admin/login",
    method: "post",
    data
  });
}

export function getInfo(token) {
  return request({
    url: "/admin/me",
    method: "get"
  });
}

export function logout() {
  return request({
    url: "/admin/logout",
    method: "post"
  });
}

// 修改密码
export function modify_password(data) {
  return request({
    url: "/admin/admins/modify/password",
    method: "post",
    data
  });
}
