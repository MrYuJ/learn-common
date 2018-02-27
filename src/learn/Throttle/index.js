import React from 'react'
/**
 * 时间间隔 有头无尾
 * @param fun
 * @param wait
 * @returns {function()}
 */
// const throttle = (fun, wait = 2000) => {
//   let preTime = 0;
//   const handleFun = () => fun && fun(arguments);
//   return () => {
//     const arg = arguments;
//     const now = +new Date();
//     // 方法触发的时间间隔大于wait
//     if (now - preTime > wait) {
//       preTime = now;
//       handleFun(arg);
//     }
//   }
// }

/**
 * setTimeout 无头有尾
 * @param fun
 * @param wait
 * @returns {function()}
 */
// const throttle = (fun, wait = 2000) => {
//   const handleFun = () => fun && fun(arguments);
//   let id = '';
//   return () => {
//   const arg = arguments;
//     // 必须等上一个setTimeout执行完毕才执行下一个
//     if (!id) {
//       id = setTimeout(() => {
//         handleFun(arg);
//         id = '';
//       }, wait);
//     }
//   }
// }

/**
 * 综合两种 有头有尾
 * @param fun
 * @param wait
 * @returns {function()}
 */
const throttle = (fun, wait = 2000) => {
  let id = '';
  let preTime = 0;
  const handleFun = () => fun && fun(arguments);
  return () => {
    const now = +new Date();
    // 用剩余时间判断是关键
    const remainTime = wait - (now - preTime);
    const arg = arguments;
    if (remainTime > 0) {
      if (!id) {
        id = setTimeout(() => {
          preTime = +new Date();
          id = '';
          handleFun(arg);
        }, remainTime)
      }
    } else {
      if (id) {
        id = '';
        clearTimeout(id);
      }
      preTime = now;
      handleFun(arg);
    }
  }
}

export default class Throttle extends React.Component {
  onMousemove = (e) => {
    console.log(e)
  }
  render() {
    return (
      <div style={{height: '100px', background: 'red'}} onMouseMove={throttle(this.onMousemove)}>
        123
      </div>
    )
  }
}