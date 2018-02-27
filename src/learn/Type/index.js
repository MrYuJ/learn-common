/**
 * Created by yujiayu on 2018/2/24.
 */
import React from 'react'
const type = (data) => {
  const typeArr = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error', 'Null', 'Undefined'];
  const obj = typeArr.reduce((pre, cur) => {
    pre[`[object ${cur}]`] = cur.toLowerCase();
    return pre;
  }, {})
  const typeofData = typeof data;
  // ES6 新增的 Symbol、Map、Set 等类型，它们并不在 typeArr 列表中，所以使用 type 函数，返回的结果会是 object
  return typeofData === 'object' || typeofData === 'function' ? obj[Object.prototype.toString.call(data)] || 'object' : typeofData;
}
export {type};

export default class Type extends React.Component {
  componentDidMount() {

    console.log(type([1, 2]));
  }
  render() {
    return (
      <div>查看console</div>
    )
  }
}
