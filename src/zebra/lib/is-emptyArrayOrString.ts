/**
 * @description 检查值是否为空数组或空字符串
 * @param {Array<string | number> | string} value 要检查的值
 * @returns {boolean} 如果值为空数组或空字符串则返回true，否则返回false
 */
export const isEmptyArrayOrString = (value: Array<string | number> | string): boolean => {
  if(!value) return true
  // 是数组且是[''] 或 [] 的情况
  if(Array.isArray(value) && (value.length === 1 && value[0] === '' || value.length === 0)) return true;
  //  "" 空字符串的情况
  if(typeof value === 'string' && value === '') return true;
  return false;
};