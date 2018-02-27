/**
 * Created by yujiayu on 2018/2/26.
 */
import React from 'react'
import type from '../Type'
export default class Each extends React.Component {
  componentDidMount() {
    const each = (data, cb) => {
      if (type === 'object') {
        for (let key in data) {
          cb.call(data[key], data[key], key)
        }
      } else {
        for (let key = 0, len = data.length; key < len; key++) {
          cb.call(data[key], data[key], key)
        }
      }
    }
    each([1, 2, 3], function (value) {
      console.log(this, value);
    })
  }
  render() {
    return (
      <div>查看console</div>
    )
  }
}
