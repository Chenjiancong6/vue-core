
/**
 * 实现类似 Lodash 的 _merge 函数，深度合并多个对象
 * @param {Object} target 目标对象
 * @param {...Object} sources 源对象
 * @returns {Object} 合并后的对象
 */
export function _merge(target, ...sources) {
  return sources.reduce((result, source) => {
    if (source === null || source === undefined) return result;

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
          result[key] = [...targetValue, ...sourceValue];
        } else if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
          result[key] = _merge(targetValue, sourceValue);
        } else {
          result[key] = sourceValue;
        }
      }
    }

    return result;
  }, target);
}

/**
 * 检查是否为普通对象（非数组、非null）
 */
function isPlainObject(obj) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

// 使用示例
// const object1 = {
//   a: [{ b: 2 }, { d: 4 }],
//   x: { y: 10 }
// };

// const object2 = {
//   a: [{ c: 3 }, { e: 5 }],
//   x: { z: 20 }
// };

// const result = _merge({}, object1, object2);
// console.log(result);
/* 输出:
{
  a: [{ b: 2, c: 3 }, { d: 4, e: 5 }],
  x: { y: 10, z: 20 }
}
*/