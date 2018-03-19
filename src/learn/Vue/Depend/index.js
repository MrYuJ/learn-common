/**
 * Created by yujiayu on 2018/2/28.
 */
import React from 'react'
import {type} from '../../Type';

export default class Depend extends React.Component {
  componentDidMount() {

    // 定义对象单个key的getter与setter
    const defineReactive = (data, key, val) => {
      const dep = new Dep();
      Object.defineProperty(data, key, {
        get() {
          // 进行依赖收集
          dep.addWatcher(Dep.target);
          return val;
        },
        set(newVal) {
          if (val === newVal) return;
          // 触发收集到的所有依赖 更新视图
          dep.notifyWatcher();
        }
      })
    }
    // 将对象的全部属性都变成响应式
    const observer = (data) => {
      const isObject = (data) => type(data) === 'object';
      const handleFun = (newData) => {
        if (!isObject(newData)) return;
        Object.keys(newData).forEach(key => {
          let value = newData[key];
          // 递归
          isObject(value) ? defineReactive(newData, key, value) && handleFun({...value}) : defineReactive(newData, key, value);
        })
      }
      handleFun(data);
    }
    class Watcher {
      constructor() {
        Dep.target = this;
      }
      update() {
        console.log("update view");
      }
    }
    class Dep {
      watchers = [];
      addWatcher(watcher) {
        this.watchers.push(watcher);
      }
      notifyWatcher() {
        this.watchers.forEach(watcher => watcher.update())
      }
    }
    class Vue {
      constructor(option) {
        this._data = option.data;
        // 完成响应式
        observer(this._data);
        // 创建Watcher
        new Watcher();
      }
    }
    const global = {
      a: {b: 1},
      c: 2
    }
    const Component1 = new Vue({
      data: global
    })
    const Component2 = new Vue({
      data: global
    })
    // 触发getter完成依赖收集
    console.log("Component1:" + Component1._data.c);
    console.log("Component2:" + Component2._data.c);
    // 触发setter更新所有依赖的Watcher的视图 这里是更新全局数据 触发两个视图更新
    global.c = 22;

  }
  render() {
    return (
      <div>依赖收集</div>
    )
  }
}
