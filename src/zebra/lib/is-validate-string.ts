

/**
 * @description 校验字符串是否合法, 校验函数：仅支持中文、英文、数字
 * @param str 字符串
 * @returns 是否合法
 */
export function validateString(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return false;
  }
  return /^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(str);
}


// 测试用例
// console.log(validateString("中文English123")); // true
// console.log(validateString("HelloWorld"));     // true
// console.log(validateString("123456"));         // true
// console.log(validateString("中文"));           // true
// console.log(validateString("abc123"));         // true
// console.log(validateString("a b c"));          // false (包含空格)
// console.log(validateString("hello@world"));    // false (包含@符号)
// console.log(validateString("测试_符号"));       // false (包含下划线)
// console.log(validateString(""));               // false (空字符串)
// console.log(validateString("   "));            // false (包含空格)
// console.log(validateString("。。。"));          // false (包含句号)
// console.log(validateString("...."));          // false (包含句号)
