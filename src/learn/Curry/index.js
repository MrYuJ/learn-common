/**
 * Created by yujiayu on 2018/2/26.
 */
import React from 'react'
export default class Curry extends React.Component {
  componentDidMount() {
    const curry = (fn, ...arg) => {
      const length = fn.length;
      return function (...newArg) {
        // 合并汇总参数
        const combine = [...arg, ...newArg];
        // 用闭包把参数保存起来，当参数的数量足够执行函数了，就开始执行函数
        return combine.length < length ? curry.call(this, fn, ...combine) : fn.apply(this, combine);
      }
    }
    // 柯里化是将一个多参数函数转换成多个单参数函数，也就是将一个 n 元函数转换成 n 个一元函数。
    // 偏函数则是固定一个函数的一个或者多个参数，也就是将一个 n 元函数转换成一个 n - x 元函数。
    // 感觉是这里用的时候curry((a,b,c) => a + b + c)为柯里化，curry((a,b,c) => a + b + c, 3, 4)为偏函数
    const fun = curry((a, b, c) => {
      console.log(this);
      return a + b + c
    }, 3, 4)
    console.log(fun(5));
    // 为什么要使用call或者apply，如下这个时候的 this 的值为 obj 对象，如果设置成 null ，就会变成打印 window 对象
    // var obj = {
    //   value: 1,
    //   fun: fun
    // }
    // obj.fun(1, 2, 3);
  }
  render() {
    return (
      <div>查看console</div>
    )
  }
}
