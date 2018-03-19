/**
 * Created by yujiayu on 2018/2/26.
 */
import React from 'react'

export default class Flatten extends React.Component {
  componentDidMount() {
    const flatten = (data) => {
      return data.reduce((pre, cur) => {
        return Array.isArray(cur) ? [...pre, ...flatten(cur)] : [...pre, cur];
      }, [])
    }
  }
  render() {
    return (
      <div>查看console</div>
    )
  }
}
