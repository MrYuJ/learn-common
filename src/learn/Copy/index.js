/**
 * Created by yujiayu on 2018/2/24.
 */
import React from 'react'
import {type} from '../Type';
export default class Copy extends React.Component {
  componentDidMount() {
    const obj = {a: 1, b: {c: 2}, d: {e: [1, 2]}, f: [{g: 'hh'}]};
    // 可以处理数组与对象，但不能处理函数
    // JSON.stringify(..) 在对象中遇到 undefined 、 function 和 symbol 时会自动将其忽略， 在 数组中则会返回 null （以保证单元位置不变）。
    // 对包含循环引用的对象执行 JSON.stringify(..) 会出错。
    const copy1 = (data) => {
      return JSON.parse(JSON.stringify(data));
    }
    const copy1Obj = copy1(obj);
    copy1Obj.b = 2
    console.log(obj, copy1Obj);
    // 深拷贝第一版
    const copy2 = (data) => {
      const handleFun = (data) => {
        let result = null;
        const typeofData = type(data);
        if (typeofData === 'object') {
          result = {};
        } else if (typeofData === 'array') {
          result = [];
        }
        for (let key in data) {
          const value = data[key];
          result[key] = typeof value === 'object' ? handleFun(value) : value;
        }
        return result;
      }
      return handleFun(data);
    }


    const copy2Obj = copy2(obj);
    copy2Obj.b = 2
    console.log(obj, copy2Obj);
  }
  render() {
    return (
      <div>查看console</div>
    )
  }
}
