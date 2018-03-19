/**
 * Created by yujiayu on 2018/3/17.
 */
import React from 'react'

export default class EventSys extends React.Component {
  componentDidMount() {
    class EventSys {
      events = {}
      on(eventName, fn) {
        if (!this.events[eventName]) {
          this.events[eventName] = [];
        }
        this.events[eventName].push(fn);
      }
      emit(eventName, ...arg) {
        const events = this.events[eventName];
        if (events && events.length !== 0) {
          events.forEach(fn => {
            fn(...arg);
          })
        }
      }
      off(eventName, fn) {
        const events = this.events[eventName];
        if (events && events.length !== 0) {
          this.events[eventName] = events.filter(item => item !== fn);
        }
      }
    }

    const Event = new EventSys();
    Event.on('test', function (result) {
      console.log(result);
    });
    Event.on('test', function () {
      console.log('test');
    });
    Event.emit('test', 'hello world'); // 输出 'hello world' 和 'test'
  }
  render() {
    return (
      <div>观察者模式自定义事件</div>
    )
  }
}
