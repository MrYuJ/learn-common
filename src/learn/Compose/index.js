/**
 * Created by yujiayu on 2018/2/27.
 */
import React from 'react'

export default class Compose extends React.Component {
  componentDidMount() {
    // 从右到左执行函数
    const compose = (...arg) => {
      // 获取第一个参数
      const start = arg.length - 1;
      return function () {
        let i = start;
        // 第一个参数执行结果
        let result = arg[start].call(this, ...arguments);
        while (i--) {
          // 将第一个参数执行结果传入第二个参数去执行
          result = arg[i].call(this, result)
        }
        // 返回最后结果
        return result;
      }
    }

    var toUpperCase = function(x) { return x.toUpperCase(); };
    var hello = function(x) { return 'HELLO, ' + x; };

    var greet = compose(hello, toUpperCase);
    console.log(greet('kevin'));
  }
  render() {
    return (
      <div>查看console</div>
    )
  }
}
