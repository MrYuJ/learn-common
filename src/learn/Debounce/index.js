import React from 'react'
const debounce = (fun, wait = 5000) => {
  let id = '';
  let first = false;
  // 点击后，取消防抖，立即执行一次
  debounce.reset = () => {
    first = false;
  }
  return () => {
    // 接收onMouseMove回调的参数event
    const args = arguments;
    // 第一次立即执行
    if (!first) {
      fun && fun(args);
      first = true;
    }
    // 防抖原理：在wait时间间隔内多次执行该方法，就以新的事件的时间为准，wait秒后才执行
    // 总之，就是要等你触发完事件wait秒内不再触发事件，才执行
    clearTimeout(id);
    id = setTimeout(() => {
      fun && fun(args);
    }, wait)
  }
}

export default class Debounce extends React.Component {
  onMousemove = (e) => {
    console.log(this)
  }
  render() {
    return (
      <div style={{height: '100px', background: 'red'}} onMouseMove={debounce(this.onMousemove)}>
        <button onClick={debounce.reset}>reset</button>
      </div>
    )
  }
}
