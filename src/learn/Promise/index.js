/**
 * Created by yujiayu on 2018/2/24.
 */
import React from 'react'

export default class Promise extends React.Component {
  componentDidMount() {
    // function Promise(fn) {
    //   var state = 'pending',
    //     value = null,
    //     callbacks = [];
    //   this.then = function (onFulfilled, onRejected) {
    //     return new Promise(function (resolve, reject) {
    //       handle({
    //         onFulfilled: onFulfilled || null,
    //         onRejected: onRejected || null,
    //         resolve: resolve,
    //         reject: reject
    //       });
    //     });
    //   };
    //   function handle(callback) {
    //     if (state === 'pending') {
    //       callbacks.push(callback);
    //       return;
    //     }
    //     var cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected,
    //       ret;
    //     if (cb === null) {
    //       cb = state === 'fulfilled' ? callback.resolve : callback.reject;
    //       cb(value);
    //       return;
    //     }
    //     try {
    //       ret = cb(value);
    //       callback.resolve(ret);
    //     } catch (e) {
    //       callback.reject(e);
    //     }
    //   }
    //   function resolve(newValue) {
    //     if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
    //       var then = newValue.then;
    //       if (typeof then === 'function') {
    //         then.call(newValue, resolve, reject);
    //         return;
    //       }
    //     }
    //     state = 'fulfilled';
    //     value = newValue;
    //     execute();
    //   }
    //   function reject(reason) {
    //     state = 'rejected';
    //     value = reason;
    //     execute();
    //   }
    //   function execute() {
    //     setTimeout(function () {
    //       callbacks.forEach(function (callback) {
    //         handle(callback);
    //       });
    //     }, 0);
    //   }
    //   fn(resolve, reject);
    // }
    //





    // class Promise {
    //   constructor(fn) {
    //     this.callbacks = [];
    //     fn(this.resolve);
    //   }
    //   then = (onFulfilled) => {
    //     this.callbacks.push(onFulfilled);
    //   }
    //   resolve = (value) => {
    //     this.callbacks.forEach(item => item(value))
    //   }
    // }
    class Promise {
      constructor(fn) {
        this.callbacks = [];
        fn(this.resolve);
      }
      then = (onFulfilled) => {
        this.callbacks.push(onFulfilled);
        return this;
      }
      resolve = (value) => {
        // setTimeout(() => {
          this.callbacks.forEach(item => item(value))
        // })
      }
    }
    const p = new Promise(resolve => {
      // setTimeout(() => {
        console.log(11111);
        resolve(123)
      // }, 1000)
    })
    p.then((resolveData) => {
      console.log(resolveData);
    }).then((resolveData) => {
      console.log(resolveData);
    })
  }
  render() {
    return (
      <div>Promise</div>
    )
  }
}
