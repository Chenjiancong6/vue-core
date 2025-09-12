/**
 * @description 获取浏览器hash参数
 * @param {string} name - 参数名
 * @returns {string} - 参数值
 * @example
 * http://localhost:5173/#/index?name=张三
 * getHashParam('name') // '张三'
 */
export const getHashParam = (name) => {
  // 匹配hash的?和&后面的键值对
  let matchResult = window.location.hash.match(/[\?\&]{1}(((?!&)[\S])+)/g);
  if(!matchResult) return null;

  // 匹配到的键值对数组
  let hashParamsArr = matchResult.map(item => {
    // item.substring(1) 去掉hash 前面的 ? 符号
    let [key, value] = item.substring(1).split('=');
    return {
      key,
      value
    }
  })

  // 遍历键值对数组转换为对象
  let hashParamsObj = hashParamsArr.reduce((pre, cur) => {
    pre[cur.key] = cur.value;
    return pre;
  }, {});

  // 返回指定参数值
  return hashParamsObj[name];
}