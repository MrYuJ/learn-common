/**
 * Created by yujiayu on 2018/2/28.
 */
import React from 'react'
import {type} from '../../Type';
export default class Observer extends React.Component {
  componentDidMount() {
    const cb = () => {
      console.log('update~');
    }
    const defineReactive = (data, key, val) => {
      Object.defineProperty(data, key, {
          get() {
            return val;
          },
          set(newVal) {
            if (val === newVal) return;
            cb();
          }
        }
      )
    }
    const observer = (data) => {
      const handleFun = (newData) => {
        if (type(newData) !== 'object') return;
        Object.keys(newData).forEach(key => {
          const value = {...newData[key]};
          type(value) === 'object' ? handleFun(value) : defineReactive(newData, key, value)
        })
      }
      handleFun(data);
    }
    class Vue {
      constructor(option) {
        this._data = option.data;
        observer(this._data);
      }
    }
    const Component = new Vue({
      data: {
        a: {b: 1},
        c: 2
      }
    })
    console.log(Component._data.a.b);
    console.log(Component._data.a);
    console.log(Component._data.c);
  }
  render() {
    return (
      <div>响应式系统的基本原理</div>
    )
  }
}
