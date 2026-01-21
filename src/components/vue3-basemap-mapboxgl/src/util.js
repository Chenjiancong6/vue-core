function isLngLatArray(item) {
  return (
    Array.isArray(item) &&
    // 有些经纬度可能有高程
    (item.length === 2 || item.length === 3) &&
    !Array.isArray(item[0]) &&
    !Array.isArray(item[1])
  );
}

function flattern(arr) {
  if (!Array.isArray(arr)) {
    return;
  }
  if (isLngLatArray(arr)) {
    return [arr];
  }
  // 层次遍历
  let tmpArr = [...arr];
  let result = [];
  while (tmpArr.length > 0) {
    let lastItem = tmpArr.shift();
    if (Array.isArray(lastItem)) {
      if (isLngLatArray(lastItem)) {
        result.push(lastItem);
      } else {
        tmpArr = tmpArr.concat(lastItem);
      }
    }
  }
  return result;
}

export { flattern };
