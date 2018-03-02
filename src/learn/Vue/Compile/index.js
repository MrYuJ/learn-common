/**
 * Created by yujiayu on 2018/3/1.
 */
import React from 'react'
import * as regExp from './regExp'
export default class Compile extends React.Component {
  componentDidMount() {
    const {
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
    } = regExp;

    // 需要编译的模板字符串
    let html = '<div :class="c" class="demo" v-if="isShow"><span v-for="item in sz">{{item}}</span></div>';

    const stack = [];
    let currentParent, root;

    let index = 0;
    /**
     * 解析 template 采用循环进行字符串匹配的方式，所以每匹配解析完一段我们需要将已经匹配掉的去掉，头部的指针指向接下来需要匹配的部分。
     * @param {*} n 
     */
    function advance (n) {
      index += n
      html = html.substring(n)
    }
    /**
     * 数组转map
     * @param {*} attrs 
     */
    function makeAttrsMap (attrs) {
      const map = {}
      for (let i = 0, l = attrs.length; i < l; i++) {
        map[attrs[i].name] = attrs[i].value;
      }
      return map
    }
    /** 
     * 解析开始标签 
     */
    function parseStartTag () {
      // 匹配开始标签 得到["<div", "div"]
      const start = html.match(startTagOpen);
      if (start) {
        const match = {
          tagName: start[1],
          attrs: [],
          start: index
        }
        advance(start[0].length);

        let end, attr
        // 循环处理 直到匹配到开始标签的结束标志
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length)
          match.attrs.push({
            name: attr[1],
            value: attr[3]
          });
        }
        // 已经匹配到开始标签的结束标志
        if (end) {
          // 结束的地方有没有/ 即>或/>
          match.unarySlash = end[1];
          advance(end[0].length);
          match.end = index;
          return match
        }
      }
    }
    /**
     * 解析结束标签
     * @param {*} tagName 标签名
     */
    function parseEndTag (tagName) {
      let pos;
      // 从 stack 栈中取出最近的跟自己标签名一致的那个元素
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === tagName.toLowerCase()) {
          break;
        }
      }
      // 将 currentParent 指向那个元素，并将该元素之前的元素都从 stack 中出栈。
      if (pos >= 0) {
        stack.length = pos;
        currentParent = stack[pos];
      }
    }
    /**
     * 解析文本
     * @param {*} text 
     */
    function parseText (text) {
      // 必须匹配到{{}}这种格式
      if (!defaultTagRE.test(text)) return;

      const tokens = [];
      let lastIndex = defaultTagRE.lastIndex = 0
      let match, index
      while ((match = defaultTagRE.exec(text))) {
        index = match.index

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        // match = ["{{item}}", "item"]
        const exp = match[1].trim()
        tokens.push(`_s(${exp})`)
        lastIndex = index + match[0].length
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return tokens.join('+');
    }
    /**
     * 获取如 v-if=isShow 中的isShow
     * @param {*} el 
     * @param {*} name 
     */
    function getAndRemoveAttr (el, name) {
      let val
      if ((val = el.attrsMap[name]) != null) {
        const list = el.attrsList
        for (let i = 0, l = list.length; i < l; i++) {
          if (list[i].name === name) {
            list.splice(i, 1)
            break
          }
        }
      }
      return val
    }
    /**
     * 处理v-for
     * @param {*} el 
     */
    function processFor (el) {
      let exp;
      if ((exp = getAndRemoveAttr(el, 'v-for'))) {
        const inMatch = exp.match(forAliasRE);
        el.for = inMatch[2].trim();
        el.alias = inMatch[1].trim();
      }
    }
    /**
     * 处理v-if
     * @param {*} el 
     */
    function processIf (el) {
      const exp = getAndRemoveAttr(el, 'v-if');
      if (exp) {
        el.if = exp;
        if (!el.ifConditions) {
          el.ifConditions = [];
        }
        el.ifConditions.push({
          exp: exp,
          block: el
        });
      }
    }
    /** 
     * 解析模板html 
     */
    function parseHTML () {
      while(html) {
        let textEnd = html.indexOf('<');
        // 如果textEnd为0 则匹配到的情况是如 <div xxx
        // 如果不为0 则匹配到的情况是如 {{item}}</span> 这时候就可以提取到文本信息{{item}}
        if (textEnd === 0) {
          // 匹配结束标签
          const endTagMatch = html.match(endTag)
          if (endTagMatch) {
            advance(endTagMatch[0].length);
            parseEndTag(endTagMatch[1]);
            continue;
          }
          // 匹配开始标签
          if (html.match(startTagOpen)) {
            // 解析开始标签获取到的信息
            /*
              {
                attrs: [
                  {name: ":class", value: "c"},
                  {name: "class", value: "demo"},
                  {name: "v-if", value: "isShow"},
                ],
                end: 43,
                start: 0,
                tagName: "div",
                unarySlash: ""
              }
            */
            const startTagMatch = parseStartTag();
            // 生成AST元素节点
            const element = {
              type: 1,
              tag: startTagMatch.tagName,
              lowerCasedTag: startTagMatch.tagName.toLowerCase(),
              attrsList: startTagMatch.attrs,
              attrsMap: makeAttrsMap(startTagMatch.attrs),
              parent: currentParent,
              children: []
            }

            processIf(element);
            processFor(element);

            if(!root){
              root = element
            }

            if(currentParent){
              currentParent.children.push(element);
            }
            // 维护一个 stack 栈来保存已经解析好的标签头
            stack.push(element);
            currentParent = element;
            continue;
          }
        } else {
          let text = html.substring(0, textEnd)
          advance(textEnd)
          // 解析成_s(item)
          let expression;
          if (expression = parseText(text)) {
            currentParent.children.push({
              type: 2,
              text,
              expression
            });
          } else {
            currentParent.children.push({
              type: 3,
              text,
            });
          }
          continue;
        }
      }
      // 返回顶节点
      return root;
    }

    function parse () {
      return parseHTML();
    }

    function optimize (rootAst) {
      /**
       * 判断静态节点的标准是当 type 为 2（表达式节点）则是非静态节点，
       * 当 type 为 3（文本节点）的时候则是静态节点，
       * 如果存在 if 或者 for这样的条件的时候（表达式节点），也是非静态节点。
       * @param {*} node 
       */
      function isStatic (node) {
        if (node.type === 2) {
          return false
        }
        if (node.type === 3) {
          return true
        }
        return (!node.if && !node.for);
      }
      /**
       * markStatic 为所有的节点标记上 static，遍历所有节点通过 isStatic 来判断当前节点是否是静态节点，
       * 此外，会遍历当前节点的所有子节点，如果子节点是非静态节点，那么当前节点也是非静态节点。
       * @param {*} node 
       */
      function markStatic (node) {
        node.static = isStatic(node);
        if (node.type === 1) {
          for (let i = 0, l = node.children.length; i < l; i++) {
            const child = node.children[i];
            markStatic(child);
            if (!child.static) {
              node.static = false;
            }
          }
        }
      }
      /**
       * 标记顶节点的static
       * @param {*} node 
       */
      function markStaticRoots (node) {
        if (node.type === 1) {
          if (node.static && node.children.length && !(
              node.children.length === 1 &&
              node.children[0].type === 3
            )) {
            node.staticRoot = true;
            return;
          } else {
            node.staticRoot = false;
          }
        }
      }

      markStatic(rootAst);
      markStaticRoots(rootAst);
    }
    /**
     * generate 会将 AST 转化成 render funtion 字符串，
     * 最终得到 render 的字符串以及 staticRenderFns 字符串。
     * @param {*} rootAst 
     */
    function generate (rootAst) {

      function genIf (el) {
        el.ifProcessed = true;
        if (!el.ifConditions.length) {
          return '_e()';
        }
        return `(${el.ifConditions[0].exp})?${genElement(el.ifConditions[0].block)}: _e()`
      }

      function genFor (el) {
        el.forProcessed = true;

        const exp = el.for;
        const alias = el.alias;
        const iterator1 = el.iterator1 ? `,${el.iterator1}` : '';
        const iterator2 = el.iterator2 ? `,${el.iterator2}` : '';

        return `_l((${exp}),` +
          `function(${alias}${iterator1}${iterator2}){` +
          `return ${genElement(el)}` +
          '})';
      }

      function genText (el) {
        return `_v(${el.expression})`;
      }

      function genNode (el) {
        if (el.type === 1) {
          return genElement(el);
        } else {
          return genText(el);
        }
      }

      function genChildren (el) {
        const children = el.children;

        if (children && children.length > 0) {
          return `${children.map(genNode).join(',')}`;
        }
      }

      function genElement (el) {
        if (el.if && !el.ifProcessed) {
          return genIf(el);
        } else if (el.for && !el.forProcessed) {
          return genFor(el);
        } else {
          const children = genChildren(el);
          let code;
          code = `_c('${el.tag},'{
                staticClass: ${el.attrsMap && el.attrsMap[':class']},
                class: ${el.attrsMap && el.attrsMap['class']},
            }${
            children ? `,${children}` : ''
            })`
          return code;
        }
      }

      const code = rootAst ? genElement(rootAst) : '_c("div")'
      return {
        render: `with(this){return ${code}}`,
      }
    }
    /* 
    * 解析出来的AST如下
    {
      //标签属性的map，记录了标签上属性 
      'attrsMap': {
          ':class': 'c',
          'class': 'demo',
          'v-if': 'isShow'
      },
      //解析得到的:class 
      'classBinding': 'c',
      //标签属性v-if 
      'if': 'isShow',
      //v-if的条件 
      'ifConditions': [
          'exp': 'isShow'
      ],
      //标签属性class 
      'staticClass': 'demo',
      //标签的tag 
      'tag': 'div',
      //子标签数组 
      'children': [
        {
          'attrsMap': {
              'v-for': "item in sz"
          },
          //for循环的参数 
          'alias': "item",
          //for循环的对象 
          'for': 'sz',
          //for循环是否已经被处理的标记位 
          'forProcessed': true,
          'tag': 'span',
          'children': [
              {
                  //表达式，_s是一个转字符串的函数 
                  'expression': '_s(item)',
                  'text': '{{item}}'
              }
          ]
        }
      ]
    }
    */
    const ast = parse();
    optimize(ast);
    const code = generate(ast);
    console.log(code);
  }
  render() {
    return (
      <div>Compile</div>
    )
  }
}
