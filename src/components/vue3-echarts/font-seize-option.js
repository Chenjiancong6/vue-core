import { merge, cloneDeep } from "lodash-es";

/**
 * 步骤：
 * 1. 对默认的配置项的字体和width 乘以系数，进行缩放
 * 2. 遍历sourceOption 配置项
 *  2.1 如果原配置属性在字体缩放的配置中没出现，则原封不动写回去
 *  2.2 对key === "series" 的配置项，遍历series 配置项， 生成一个数组对象数据格式
 *  2.3 在echarts配置中，xAxis横坐标和yAxis纵坐标都可能有多个， 当有多个时，就是把每个的字体大小进行合并
 *
 * @param { sourceOption } 传入的源option
 * @param { fontSizeScale } 字体缩放比例
 * @returns finalOption  一个新的option配置项，字体大小已经缩放
 */
export default function makeOption({ sourceOption, fontSizeScale = 1 }) {
  //如果缩放比例为1，直接返回源option
  if (fontSizeScale === 1) {
    return sourceOption;
  }

  // 默认的echarts配置项
  let fontSizeOption = {
    title: {
      textStyle: {
        fontSize: 18,
      },
      subtextStyle: {
        fontSize: 12,
      },
    },
    legend: {
      textStyle: {
        fontSize: 12,
      },
    },
    tooltip: {
      textStyle: {
        fontSize: 14,
      },
      axisPointer: {
        label: {
          fontSize: 12,
        },
      },
    },
    xAxis: {
      nameTextStyle: {
        fontSize: 12,
      },
      axisLabel: {
        fontSize: 12,
      },
    },
    yAxis: {
      nameTextStyle: {
        fontSize: 12,
      },
      axisLabel: {
        fontSize: 12,
      },
    },
    series: {
      line: {
        lineStyle: {
          width: 2,
        },
      },
      pie: {
        label: {
          fontSize: 12,
        },
      },
      bar: {
        label: {
          fontSize: 12,
        },
      },
      scatter: {
        markLine: {
          label: {
            fontSize: 12,
          },
        },
      },
      pictorialBar: {
        label: {
          fontSize: 12,
        },
      },
    },
  };

  /**
   * 递归遍历option 配置项，将字体大小和width 乘以系数，进行缩放
   * @param {*} option
   */
  function resetFontSizeOption(option) {
    if (typeof option !== "object") {
      return;
    }
    for (const key in option) {
      if (["width", "fontSize"].includes(key)) {
        option[key] *= fontSizeScale;
      }
      resetFontSizeOption(option[key]);
    }
  }
  resetFontSizeOption(fontSizeOption);

  // 创建一个新的对象，保存最终的配置项
  let finalOption = {};

  for (const key in sourceOption) {
    // 如果原配置属性在字体缩放的配置中没出现，则原封不动写回去
    if (!fontSizeOption[key]) {
      finalOption[key] = sourceOption[key];
      continue;
    }
    // 对key === "series" 的配置项，遍历series 配置项， 生成一个数组对象数据格式
    if (key === "series") {
      // series的配置项，生成一个数组对象数据格式
      finalOption.series = sourceOption[key].map((option) => {
        if (fontSizeOption.series[option.type]) {
          return merge(cloneDeep(fontSizeOption.series[option.type]), option);
        }
        return option;
      });
      continue;
    }

    // 在echarts配置中，xAxis横坐标和yAxis纵坐标都可能有多个， 当有多个时，就是把每个的字体大小进行合并
    if (Array.isArray(sourceOption[key])) {
      finalOption[key] = sourceOption[key].map((option) => {
        return merge(cloneDeep(fontSizeOption[key]), option);
      });
    } else {
      finalOption[key] = merge(
        cloneDeep(fontSizeOption[key]),
        sourceOption[key]
      );
    }
  }
  return finalOption;
}
