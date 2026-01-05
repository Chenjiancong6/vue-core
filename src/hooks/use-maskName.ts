
/**
 * 对姓名进行脱敏处理
 * @param name 姓名
 * @param MaxMaskLen 最大脱敏长度
 * @param maskChar 脱敏字符
 */
export function useMaskName(name: string, MaxMaskLen = 3, maskChar = '*') {
  if(arguments.length > 1 && isNaN(Number(arguments[1]))) {
    throw new Error('the second parameter must be a number');
  };
  if(arguments.length > 2 && typeof arguments[2] !== 'string') {
    throw new Error('the third parameter must be a string');
  };
  const len = name.length;
  if (len <= 1) return name;
  // 拿到姓名的第一个字符和最后一个字符
  const first = name[0];
  const last = name[len - 1];
  // 如果姓名只有两个字符,则直接返回第一个字符和最后一个字符
  if (len === 2) return `${first}${maskChar}${last}`;
  const middleLen = len - 2;
  // 计算脱敏长度,取中间长度和最大脱敏长度的较小值
  const maskLen = Math.min(middleLen, MaxMaskLen);
  return `${first}${maskChar.repeat(maskLen)}${last}`;
}

/**
 * 张三 -> 张*
 * 李四 -> 李*
 * 王五子 -> 王*子
 * 迪丽热巴 -> 迪**巴
 * 阿卜迪勒买哈买齐 -> 阿***齐
 */
// console.log('useMaskName', useMaskName('张'));
// console.log('useMaskName', useMaskName('张三'));
// console.log('useMaskName', useMaskName('李四'));
// console.log('useMaskName', useMaskName('王五子'));
// console.log('useMaskName', useMaskName('迪丽热巴'));
// console.log('useMaskName', useMaskName('阿卜迪勒买哈买齐'));
