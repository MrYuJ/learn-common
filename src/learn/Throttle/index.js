import React from 'react'
// const throttle = (fun, wait = 2000) => {
//   let time = 0;
//   return () => {
//     if (Date.now() - time > wait) {
//       fun && fun(arguments);
//       time = Date.now();
//     } 
//   }
// }

const throttle = (fun, wait = 2000) => {
  let timeoutId = '';
  let preTime = 0;
  return () => {
    let remainTime = wait - (Date.now() - preTime);
    if (remainTime <= 0) {
      preTime = Date.now();
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = '';
      }
      fun && fun(arguments);
    } else if (!timeoutId) {
      console.log()
      timeoutId = setTimeout(() => {
        timeoutId = '';
        preTime = Date.now();
        fun && fun(arguments);
      }, remainTime);
    }
  }
}

// function throttle(func, wait = 2000) {
//   var timeout, context, args, result;
//   var previous = 0;

//   var later = function() {
//       previous = +new Date();
//       timeout = null;
//       func.apply(context, args)
//   };

//   var throttled = function() {
//       var now = +new Date();
//       //下次触发 func 剩余的时间
//       var remaining = wait - (now - previous);
//       context = this;
//       args = arguments;
//        // 如果没有剩余的时间了或者你改了系统时间
//       if (remaining <= 0 || remaining > wait) {
//           if (timeout) {
//               clearTimeout(timeout);
//               timeout = null;
//           }
//           previous = now;
//           func.apply(context, args);
//       } else if (!timeout) {
//           timeout = setTimeout(later, remaining);
//       }
//   };
//   return throttled;
// }
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