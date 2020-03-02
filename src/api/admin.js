import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/admin/login",
    method: "post",
    data
  });
}

export function getInfo() {
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

// 修改个人信息
export function modify_info(data){
  return request({
    url: "/admin/admins/modify/info",
    method: "post",
    data
  });
}

// 图片（头像）上传
export function avatar_upload(data){
  return request({
    url: '/upload/pic/avatar',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}