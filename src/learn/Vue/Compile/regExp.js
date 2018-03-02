/**
 * Created by yujiayu on 2018/3/1.
 */
// 匹配标签名 即以英文字母或下划线开头([a-zA-Z_])接若干个单词字符或斜线([\w\-\.]*)的字符串。
const ncname = '[a-zA-Z_][\\w\\-\\.]*';
// 匹配属性标识符  即一个或多个 非【空白字符 " ' < > / =】 的字符
const singleAttrIdentifier = /([^\s"'<>/=]+)/
// 匹配属性赋值赋（就是匹配等号） (?:pattern)匹配 pattern 但不获取匹配结果，也就是说这是一个非获取匹配，不进行存储供以后使用
const singleAttrAssign = /(?:=)/
// source 属性返回一个值为当前正则表达式对象的模式文本的字符串，该字符串不会包含正则字面量两边的斜杠以及任何的标志字符。
const singleAttrValues = [
  // 匹配" 0或任意次除了"的字符 一次以上的"
  /"([^"]*)"+/.source,
  /'([^']*)'+/.source,
  // 即一个或多个 非【空白字符 " ' =< >】 的字符
  /([^\s"'=<>`]+)/.source
]
// 匹配属性如 id="test"、id='test'、id=test
// 完整是/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
)
const qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')'
// 匹配标签开头 即 <div id="index">{{msg}}</div> 的 <div 部分。
const startTagOpen = new RegExp('^<' + qnameCapture)
// 匹配开始标签的右边闭合部分，即 >{{msg}}</div> 左边开头的 > 部分
const startTagClose = /^\s*(\/?)>/
// 匹配结束标签 正则式中 ^ 放在首位表示匹配行首。因此该正则式可匹配到 </div><h1></h1> 的 </div>。
const endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>')
// 匹配{{xxx}}
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g
// 匹配for指令 即 xxx in/of xxx
const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/
export {
  ncname,
  singleAttrIdentifier,
  singleAttrAssign,
  singleAttrValues,
  attribute,
  qnameCapture,
  startTagOpen,
  startTagClose,
  endTag,
  defaultTagRE,
  forAliasRE
}