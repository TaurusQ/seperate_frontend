import request from "@/utils/request";

export function getList(query) {
  return request({
    url: "/admin/roles",
    method: "get",
    params: query
  });
}
