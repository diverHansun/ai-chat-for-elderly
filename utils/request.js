// utils/request.js
const baseURL = "http://127.0.0.1:5000"; // 替换为你的后端地址

function request(url, method, data, successCallback, failCallback) {
  wx.request({
    url: baseURL + url,
    method: method,
    data: data,
    header: {
      'content-type': 'application/json'
    },
    success(res) {
      if (res.statusCode === 200) {
        successCallback(res.data);
      } else {
        console.error("API 返回错误：", res);
        failCallback && failCallback(res);
      }
    },
    fail(err) {
      console.error("请求失败：", err);
      failCallback && failCallback(err);
    }
  });
}

module.exports = {
  request
};
