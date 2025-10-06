// 工具函数

/**
 * 格式化时间
 */
const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join("/")} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(":")}`;
};

/**
 * 补零
 */
const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

/**
 * 格式化日期
 */
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${[year, month, day].map(formatNumber).join("-")}`;
};

/**
 * 格式化时长（秒转分钟）
 */
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${formatNumber(minutes)}:${formatNumber(secs)}`;
};

/**
 * 防抖函数
 */
const debounce = (func, wait) => {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
};

/**
 * 节流函数
 */
const throttle = (func, wait) => {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    }
  };
};

module.exports = {
  formatTime,
  formatDate,
  formatDuration,
  debounce,
  throttle,
};
