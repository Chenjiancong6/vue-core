// 递归替换关闭标记的辅助函数
// string: 原始字符串
// close: 需要替换的关闭标记
// replace: 替换后的新标记
// index: 当前查找起始位置
let replaceClose = (string, close, replace, index) => {
	// 分割字符串为前段+替换标记
	let start = string.substring(0, index) + replace;
	// 获取剩余未处理部分
	let end = string.substring(index + close.length);
	// 查找下一个关闭标记位置
	let nextIndex = end.indexOf(close);
	// 递归处理直到没有更多关闭标记
	return ~nextIndex ? start + replaceClose(end, close, replace, nextIndex) : start + end
};

// 创建样式格式化器的工厂函数
// open: ANSI开始转义码 (例如\x1b[1m)
// close: ANSI结束转义码 (例如\x1b[22m)
// replace: 可选参数，用于嵌套样式时的替换标记
let formatter =
	(open, close, replace = open) =>
	// 返回的格式化函数接受输入内容
	input => {
		let string = "" + input;
		// 查找第一个关闭标记的位置
		let index = string.indexOf(close, open.length);
		// 如果找到关闭标记，使用replaceClose处理嵌套样式
		// 否则直接包裹内容
		return ~index
			? open + replaceClose(string, close, replace, index) + close
			: open + string + close
	};

// 创建颜色样式集合
// enabled: 是否启用ANSI颜色输出
let createColors = (enabled = true) => ({
	// 颜色支持标志
	isColorSupported: enabled,
	// 重置所有样式的格式化器
	reset: enabled ? s => `\x1b[0m${s}\x1b[0m` : String,
	// 加粗样式示例说明：
	// \x1b[1m 启用加粗，\x1b[22m 关闭加粗
	// 第三个参数指定在嵌套样式时的替换规则
	bold: enabled ? formatter("\x1b[1m", "\x1b[22m", "\x1b[22m\x1b[1m") : String,
	// 暗淡样式：\x1b[2m开启，\x1b[22m关闭
	// 替换参数确保嵌套样式正确重置
	dim: enabled ? formatter("\x1b[2m", "\x1b[22m", "\x1b[22m\x1b[2m") : String,
	// 斜体样式：\x1b[3m开启，\x1b[23m关闭
	italic: enabled ? formatter("\x1b[3m", "\x1b[23m") : String,
	// 下划线样式：\x1b[4m开启，\x1b[24m关闭
	underline: enabled ? formatter("\x1b[4m", "\x1b[24m") : String,
	inverse: enabled ? formatter("\x1b[7m", "\x1b[27m") : String,
	hidden: enabled ? formatter("\x1b[8m", "\x1b[28m") : String,
	strikethrough: enabled ? formatter("\x1b[9m", "\x1b[29m") : String,
	black: enabled ? formatter("\x1b[30m", "\x1b[39m") : String,
	red: enabled ? formatter("\x1b[31m", "\x1b[39m") : String,
	green: enabled ? formatter("\x1b[32m", "\x1b[39m") : String,
	yellow: enabled ? formatter("\x1b[33m", "\x1b[39m") : String,
	blue: enabled ? formatter("\x1b[34m", "\x1b[39m") : String,
	magenta: enabled ? formatter("\x1b[35m", "\x1b[39m") : String,
	cyan: enabled ? formatter("\x1b[36m", "\x1b[39m") : String,
	white: enabled ? formatter("\x1b[37m", "\x1b[39m") : String,
	gray: enabled ? formatter("\x1b[90m", "\x1b[39m") : String,
	bgBlack: enabled ? formatter("\x1b[40m", "\x1b[49m") : String,
	bgRed: enabled ? formatter("\x1b[41m", "\x1b[49m") : String,
	bgGreen: enabled ? formatter("\x1b[42m", "\x1b[49m") : String,
	bgYellow: enabled ? formatter("\x1b[43m", "\x1b[49m") : String,
	bgBlue: enabled ? formatter("\x1b[44m", "\x1b[49m") : String,
	bgMagenta: enabled ? formatter("\x1b[45m", "\x1b[49m") : String,
	bgCyan: enabled ? formatter("\x1b[46m", "\x1b[49m") : String,
	bgWhite: enabled ? formatter("\x1b[47m", "\x1b[49m") : String,
});

const pixelColor = createColors();

export default pixelColor;