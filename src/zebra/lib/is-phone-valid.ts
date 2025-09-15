

/**
 * @description 校验手机号是否合法
 * @param {string | number} phone 手机号
 * @returns {boolean} 是否合法
 */
export const isPhoneValid = (phone: number | string) => {
  if (typeof phone !== 'number' && typeof phone !== 'string') {
    return false;
  }
  const reg = /^1[3456789]\d{9}$/;
  return reg.test(phone.toString());
}