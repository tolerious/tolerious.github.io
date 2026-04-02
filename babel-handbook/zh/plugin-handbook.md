# Babel 插件手册

作者 [Jamie Kyle](https://jamie.build/)

本文档涵盖如何创建 [Babel](https://babeljs.io) [插件](https://babeljs.io/docs/advanced/plugins/)。

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

本手册有其他语言版本,请查看 [README](/README.md) 获取完整列表。

# 目录

- [简介](#toc-introduction)
- [基础](#toc-basics)
  - [AST](#toc-asts)
  - [Babel 的阶段](#toc-stages-of-babel)
    - [解析](#toc-parse)
      - [词法分析](#toc-lexical-analysis)
      - [语法分析](#toc-syntactic-analysis)
    - [转换](#toc-transform)
    - [生成](#toc-generate)
  - [遍历](#toc-traversal)
    - [访问者](#toc-visitors)
    - [路径](#toc-paths)
      - [访问者中的路径](#toc-paths-in-visitors)
    - [状态](#toc-state)
    - [作用域](#toc-scopes)
      - [绑定](#toc-bindings)
- [API](#toc-api)
  - [babel-parser](#toc-babel-parser)
  - [babel-traverse](#toc-babel-traverse)
  - [babel-types](#toc-babel-types)
    - [定义](#toc-definitions)
    - [构建器](#toc-builders)
    - [验证器](#toc-validators)
    - [转换器](#toc-converters)
  - [babel-generator](#toc-babel-generator)
  - [babel-template](#toc-babel-template)
- [编写您的第一个 Babel 插件](#toc-writing-your-first-babel-plugin)
- [转换操作](#toc-transformation-operations)
  - [访问](#toc-visiting)
    - [获取子节点的路径](#toc-get-the-path-of-a-sub-node)
    - [检查节点是否为特定类型](#toc-check-if-a-node-is-a-certain-type)
    - [检查路径是否为特定类型](#toc-check-if-a-path-is-a-certain-type)
    - [检查标识符是否被引用](#toc-check-if-an-identifier-is-referenced)
    - [查找特定的父路径](#toc-find-a-specific-parent-path)
    - [获取兄弟路径](#toc-get-sibling-paths)
    - [停止遍历](#toc-stopping-traversal)
  - [操作](#toc-manipulation)
    - [替换节点](#toc-replacing-a-node)
    - [用多个节点替换单个节点](#toc-replacing-a-node-with-multiple-nodes)
    - [用源字符串替换节点](#toc-replacing-a-node-with-a-source-string)
    - [插入兄弟节点](#toc-inserting-a-sibling-node)
    - [插入到容器中](#toc-inserting-into-a-container)
    - [删除节点](#toc-removing-a-node)
    - [替换父节点](#toc-replacing-a-parent)
    - [删除父节点](#toc-removing-a-parent)
  - [作用域](#toc-scope)
    - [检查局部变量是否被绑定](#toc-checking-if-a-local-variable-is-bound)
    - [生成 UID](#toc-generating-a-uid)
    - [将变量声明推送到父作用域](#toc-pushing-a-variable-declaration-to-a-parent-scope)
    - [重命名绑定及其引用](#toc-rename-a-binding-and-its-references)
- [插件选项](#toc-plugin-options)
  - [插件中的 Pre 和 Post](#toc-pre-and-post-in-plugins)
  - [在插件中启用语法](#toc-enabling-syntax-in-plugins)
- [构建节点](#toc-building-nodes)
- [最佳实践](#toc-best-practices)
  - [尽可能避免遍历 AST](#toc-avoid-traversing-the-ast-as-much-as-possible)
    - [尽可能合并访问者](#toc-merge-visitors-whenever-possible)
    - [手动查找可以时不要遍历](#toc-do-not-traverse-when-manual-lookup-will-do)
  - [优化嵌套访问者](#toc-optimizing-nested-visitors)
  - [注意嵌套结构](#toc-being-aware-of-nested-structures)
  - [单元测试](#toc-unit-testing)

# <a id="toc-introduction"></a>简介

Babel 是一个通用的多用途 JavaScript 编译器。不仅如此,它是一系列模块,可以用于许多不同形式的静态分析。

> 静态分析是在不执行代码的情况下分析代码的过程。
> (在执行代码时分析代码称为动态分析)。静态分析的目的差异很大。它可用于代码检查、编译、代码高亮、代码转换、优化、压缩等。

您可以使用 Babel 构建许多不同类型的工具,帮助您提高生产力并编写更好的程序。

> ***为了获取未来更新,请在 Twitter 上关注 [@thejameskyle](https://twitter.com/thejameskyle)。***

----

# <a id="toc-basics"></a>基础

Babel 是一个 JavaScript 编译器,具体来说是源到源编译器,通常称为"转译器"。这意味着您给 Babel 一些 JavaScript 代码,Babel 修改代码,并生成新代码。

## <a id="toc-asts"></a>AST

这些步骤中的每一步都涉及创建或使用[抽象语法树](https://en.wikipedia.org/wiki/Abstract_syntax_tree)或 AST。

> Babel 使用从 [ESTree](https://github.com/estree/estree) 修改的 AST,核心规范位于[这里](https://github.com/babel/babel/blob/master/packages/babel-parser/ast/spec.md)。

```js
function square(n) {
  return n * n;
}
```

> 查看 [AST Explorer](http://astexplorer.net/) 以更好地了解 AST 节点。[这里](http://astexplorer.net/#/Z1exs6BWMq)是粘贴了上面示例代码的链接。

同样的程序可以表示为这样的树:

```md
- FunctionDeclaration:
  - id:
    - Identifier:
      - name: square
  - params [1]
    - Identifier
      - name: n
  - body:
    - BlockStatement
      - body [1]
        - ReturnStatement
          - argument
            - BinaryExpression
              - operator: *
              - left
                - Identifier
                  - name: n
              - right
                - Identifier
                  - name: n
```

或者像这样的 JavaScript 对象:

```js
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "square"
  },
  params: [{
    type: "Identifier",
    name: "n"
  }],
  body: {
    type: "BlockStatement",
    body: [{
      type: "ReturnStatement",
      argument: {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "Identifier",
          name: "n"
        },
        right: {
          type: "Identifier",
          name: "n"
        }
      }
    }]
  }
}
```

您会注意到 AST 的每一层都有类似的结构:

```js
{
  type: "FunctionDeclaration",
  id: {...},
  params: [...],
  body: {...}
}
```

```js
{
  type: "Identifier",
  name: ...
}
```

```js
{
  type: "BinaryExpression",
  operator: ...,
  left: {...},
  right: {...}
}
```

> 注意:为了简单起见,已删除某些属性。

这些都是**节点**。AST 可以由单个节点组成,或者如果不是成千上万个节点。它们共同能够描述可用于静态分析的程序的语法。

每个节点都有这个接口:

```typescript
interface Node {
  type: string;
}
```

`type` 字段是一个字符串,表示对象的节点类型(例如 `"FunctionDeclaration"`、`"Identifier"` 或 `"BinaryExpression"`)。每种类型的节点定义了一组额外的属性,用于描述该特定的节点类型。

Babel 生成的每个节点上都有额外的属性,用于描述节点在原始源代码中的位置。

```js
{
  type: ...,
  start: 0,
  end: 38,
  loc: {
    start: {
      line: 1,
      column: 0
    },
    end: {
      line: 3,
      column: 1
    }
  },
  ...
}
```

这些属性 `start`、`end`、`loc` 出现在每个节点中。

## <a id="toc-stages-of-babel"></a>Babel 的阶段

Babel 的三个主要阶段是**解析**、**转换**、**生成**。

### <a id="toc-parse"></a>解析

**解析**阶段接受代码并输出 AST。Babel 中的解析有两个阶段:[**词法分析**](https://en.wikipedia.org/wiki/Lexical_analysis)和[**语法分析**](https://en.wikipedia.org/wiki/Parsing)。

#### <a id="toc-lexical-analysis"></a>词法分析

词法分析将一串代码并将其转换为**令牌**流。

您可以将令牌视为语言语法片段的平面数组。

```js
n * n;
```

```js
[
  { type: { ... }, value: "n", start: 0, end: 1, loc: { ... } },
  { type: { ... }, value: "*", start: 2, end: 3, loc: { ... } },
  { type: { ... }, value: "n", start: 4, end: 5, loc: { ... } },
  ...
]
```

这些 `type` 中的每个都有一组描述令牌的属性:

```js
{
  type: {
    label: 'name',
    keyword: undefined,
    beforeExpr: false,
    startsExpr: true,
    rightAssociative: false,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: null
  },
  ...
}
```

像 AST 节点一样,它们也有 `start`、`end` 和 `loc`。

#### <a id="toc-syntactic-analysis"></a>语法分析

语法分析将令牌流并将其转换为 AST 表示。使用令牌中的信息,此阶段将它们重新格式化为 AST,以一种更容易使用的方式表示代码的结构。

### <a id="toc-transform"></a>转换

[转换](https://en.wikipedia.org/wiki/Program_transformation)阶段接受 AST 并遍历它,沿途添加、更新和删除节点。这是到目前为止 Babel 或任何编译器中最复杂的部分。这是插件运行的地方,所以它将是本手册的大部分内容。所以我们现在不会太深入。

### <a id="toc-generate"></a>生成

[代码生成](https://en.wikipedia.org/wiki/Code_generation_(compiler))阶段接受最终的 AST 并将其转换回代码字符串,还创建[源映射](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)。

代码生成非常简单:您深度优先地遍历 AST,构建一个表示转换后代码的字符串。

## <a id="toc-traversal"></a>遍历

当您想要转换 AST 时,您必须递归地[遍历树](https://en.wikipedia.org/wiki/Tree_traversal)。

假设我们有类型 `FunctionDeclaration`。它有几个属性:`id`、`params` 和 `body`。每个都有嵌套节点。

```js
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "square"
  },
  params: [{
    type: "Identifier",
    name: "n"
  }],
  body: {
    type: "BlockStatement",
    body: [{
      type: "ReturnStatement",
      argument: {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "Identifier",
          name: "n"
        },
        right: {
          type: "Identifier",
          name: "n"
        }
      }
    }]
  }
}
```

所以我们从 `FunctionDeclaration` 开始,我们知道它的内部属性,所以我们按顺序访问每个属性及其子节点。

接下来我们转到 `id`,它是一个 `Identifier`。`Identifier` 没有任何子节点属性,所以我们继续。

之后是 `params`,它是一个节点数组,所以我们访问每个节点。在这种情况下,它是一个也是 `Identifier` 的单个节点,所以我们继续。

然后我们命中 `body`,它是一个带有属性 `body` 的 `BlockStatement`,该属性是一个节点数组,所以我们转到每个节点。

这里唯一的项目是一个带有 `argument` 的 `ReturnStatement` 节点,我们转到 `argument` 并找到一个 `BinaryExpression`。

`BinaryExpression` 有一个 `operator`、一个 `left` 和一个 `right`。运算符不是节点,只是一个值,所以我们不转到它,而是只访问 `left` 和 `right`。

这个遍历过程在整个 Babel 转换阶段发生。

### <a id="toc-visitors"></a>访问者

当我们谈论"去"一个节点时,实际上意味着我们正在**访问**它们。我们使用这个术语是因为有[**访问者**](https://en.wikipedia.org/wiki/Visitor_pattern)这个概念。

访问者是一种在 AST 遍历中跨语言使用的模式。简单地说,它们是一个对象,具有为接受树中的特定节点类型而定义的方法。这有点抽象,所以让我们看一个例子。

```js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};

// 您也可以创建一个访问者并在其后添加方法
let visitor = {};
visitor.MemberExpression = function() {};
visitor.FunctionDeclaration = function() {}
```

> **注意:** `Identifier() { ... }` 是 `Identifier: { enter() { ... } }` 的简写。

这是一个基本的访问者,在遍历期间使用时将为树中的每个 `Identifier` 调用 `Identifier()` 方法。

所以对于这段代码,`Identifier()` 方法将被调用四次,每个 `Identifier`(包括 `square`)一次。

```js
function square(n) {
  return n * n;
}
```
```js
path.traverse(MyVisitor);
Called!
Called!
Called!
Called!
```

这些调用都在节点**进入**时。但是也有可能在**退出**时调用访问者方法。

想象我们有这个树结构:

```js
- FunctionDeclaration
  - Identifier (id)
  - Identifier (params[0])
  - BlockStatement (body)
    - ReturnStatement (body)
      - BinaryExpression (argument)
        - Identifier (left)
        - Identifier (right)
```

当我们沿着树的每个分支向下遍历时,我们最终会走到死胡同,需要遍历回到树上以到达下一个节点。沿着树向下我们**进入**每个节点,然后向上我们**退出**每个节点。

让我们_遍历_这个过程对上面的树是什么样子的。

- 进入 `FunctionDeclaration`
  - 进入 `Identifier (id)`
    - 命中死胡同
  - 退出 `Identifier (id)`
  - 进入 `Identifier (params[0])`
    - 命中死胡同
  - 退出 `Identifier (params[0])`
  - 进入 `BlockStatement (body)`
    - 进入 `ReturnStatement (body)`
      - 进入 `BinaryExpression (argument)`
        - 进入 `Identifier (left)`
          - 命中死胡同
        - 退出 `Identifier (left)`
        - 进入 `Identifier (right)`
          - 命中死胡同
        - 退出 `Identifier (right)`
      - 退出 `BinaryExpression (argument)`
    - 退出 `ReturnStatement (body)`
  - 退出 `BlockStatement (body)`
- 退出 `FunctionDeclaration`

所以在创建访问者时,您有机会访问一个节点两次。

```js
const MyVisitor = {
  Identifier: {
    enter() {
      console.log("Entered!");
    },
    exit() {
      console.log("Exited!");
    }
  }
};
```

如果需要,您还可以通过用 `|` 作为字符串分隔方法名中的多个访问者节点来应用相同的函数。

[flow-comments](https://github.com/babel/babel/blob/2b6ff53459d97218b0cf16f8a51c14a165db1fd2/packages/babel-plugin-transform-flow-comments/src/index.js#L47) 插件中的示例用法

```js
const MyVisitor = {
  "ExportNamedDeclaration|Flow"(path) {}
};
```

您还可以使用别名作为访问者节点(在 [babel-types](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions) 中定义)。

例如,

`Function` 是 `FunctionDeclaration`、`FunctionExpression`、`ArrowFunctionExpression`、`ObjectMethod` 和 `ClassMethod` 的别名。

```js
const MyVisitor = {
  Function(path) {}
};
```

### <a id="toc-paths"></a>路径

AST 通常有许多节点,但节点如何相互关联?我们可以有一个巨大的可变对象供您操作并完全访问,或者我们可以用**路径**简化这一点。

**路径**是两个节点之间链接的对象表示。

例如,如果我们采用以下节点及其子节点:

```js
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "square"
  },
  ...
}
```

并将子 `Identifier` 表示为路径,它看起来像这样:

```js
{
  "parent": {
    "type": "FunctionDeclaration",
    "id": {...},
    ....
  },
  "node": {
    "type": "Identifier",
    "name": "square"
  }
}
```

它还有关于路径的额外元数据:

```js
{
  "parent": {...},
  "node": {...},
  "hub": {...},
  "contexts": [],
  "data": {},
  "shouldSkip": false,
  "shouldStop": false,
  "removed": false,
  "state": null,
  "opts": null,
  "skipKeys": null,
  "parentPath": null,
  "context": null,
  "container": null,
  "listKey": null,
  "inList": false,
  "parentKey": null,
  "key": null,
  "scope": null,
  "type": null,
  "typeAnnotation": null
}
```

以及大量与添加、更新、移动和删除节点相关的方法,但我们稍后会介绍这些。

在某种意义上,路径是节点在树中位置的**反应性**表示以及关于节点的各种信息。每当您调用修改树的方法时,此信息都会更新。Babel 为您管理所有这些,以便使节点工作变得容易且尽可能无状态。

#### <a id="toc-paths-in-visitors"></a>访问者中的路径

当您有一个带有 `Identifier()` 方法的访问者时,您实际上是在访问路径而不是节点。这样,您主要是在处理节点的反应性表示,而不是节点本身。

```js
const MyVisitor = {
  Identifier(path) {
    console.log("Visiting: " + path.node.name);
  }
};
```

```js
a + b + c;
```

```js
path.traverse(MyVisitor);
Visiting: a
Visiting: b
Visiting: c
```

### <a id="toc-state"></a>状态

状态是 AST 转换的敌人。状态会一次又一次地咬您,您对状态的假设几乎总是会被您没有考虑到的某些语法证明是错误的。

以下面这段代码为例:

```js
function square(n) {
  return n * n;
}
```

让我们编写一个快速而粗糙的访问者,将 `n` 重命名为 `x`。

```js
let paramName;

const MyVisitor = {
  FunctionDeclaration(path) {
    const param = path.node.params[0];
    paramName = param.name;
    param.name = "x";
  },

  Identifier(path) {
    if (path.node.name === paramName) {
      path.node.name = "x";
    }
  }
};
```

这可能适用于上面的代码,但我们可以通过这样做来轻松破坏它:

```js
function square(n) {
  return n * n;
}
n;
```

更好的方法是递归。所以让我们像 Christopher Nolan 的电影一样,在访问者里面放一个访问者。

```js
const updateParamNameVisitor = {
  Identifier(path) {
    if (path.node.name === this.paramName) {
      path.node.name = "x";
    }
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    const param = path.node.params[0];
    const paramName = param.name;
    param.name = "x";

    path.traverse(updateParamNameVisitor, { paramName });
  }
};

path.traverse(MyVisitor);
```

当然,这是一个人为的例子,但它演示了如何从访问者中消除全局状态。

### <a id="toc-scopes"></a>作用域

接下来让我们介绍[**作用域**](https://en.wikipedia.org/wiki/Scope_(computer_science))的概念。JavaScript 具有[词法作用域](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping_vs._dynamic_scoping),这是一个树结构,其中块创建新的作用域。

```js
// 全局作用域

function scopeOne() {
  // 作用域 1

  function scopeTwo() {
    // 作用域 2
  }
}
```

每当您在 JavaScript 中创建引用时,无论是通过变量、函数、类、参数、导入、标签等,它都属于当前作用域。

```js
var global = "我在全局作用域中";

function scopeOne() {
  var one = "我在由 `scopeOne()` 创建的作用域中";

  function scopeTwo() {
    var two = "我在由 `scopeTwo()` 创建的作用域中";
  }
}
```

更深作用域中的代码可能会使用更高作用域中的引用。

```js
function scopeOne() {
  var one = "我在由 `scopeOne()` 创建的作用域中";

  function scopeTwo() {
    one = "我在 `scopeTwo` 中更新 `scopeOne` 中的引用";
  }
}
```

较低的作用域也可能创建同名的引用而不修改它。

```js
function scopeOne() {
  var one = "我在由 `scopeOne()` 创建的作用域中";

  function scopeTwo() {
    var one = "我在创建一个新的 `one`,但不修改 `scopeOne()` 中的引用。";
  }
}
```

在编写转换时,我们要注意作用域。我们需要确保在修改不同部分时不会破坏现有代码。

我们可能想要添加新的引用并确保它们不会与现有引用冲突。或者我们可能只想找到变量被引用的位置。我们希望能够跟踪给定作用域内的这些引用。

作用域可以表示为:

```js
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```

当您创建新作用域时,您通过给它一个路径和一个父作用域来实现。然后在遍历过程中,它收集该作用域内的所有引用("绑定")。

完成后,您可以在作用域上使用各种方法。我们稍后会介绍这些。

#### <a id="toc-bindings"></a>绑定

所有引用都属于特定的作用域;这种关系称为**绑定**。

```js
function scopeOnce() {
  var ref = "这是一个绑定";

  ref; // 这是对绑定的引用

  function scopeTwo() {
    ref; // 这是对较低作用域中绑定的引用
  }
}
```

单个绑定看起来像这样:

```js
{
  identifier: node,
  scope: scope,
  path: path,
  kind: 'var',

  referenced: true,
  references: 3,
  referencePaths: [path, path, path],

  constant: false,
  constantViolations: [path]
}
```

有了这些信息,您可以找到对绑定的所有引用,查看它是什么类型的绑定(参数、声明等),查找它属于哪个作用域,或获取其标识符的副本。您甚至可以判断它是否是常量,如果不是,查看是哪些路径导致它不是常量。

能够判断绑定是否是常量对于许多目的很有用,其中最大的是压缩。

```js
function scopeOne() {
  var ref1 = "这是一个常量绑定";

  becauseNothingEverChangesTheValueOf(ref1);

  function scopeTwo() {
    var ref2 = "这*不是*一个常量绑定";
    ref2 = "因为这会更改值";
  }
}
```

----

# <a id="toc-api"></a>API

Babel 实际上是一系列模块。在本节中,我们将介绍主要模块,解释它们的作用以及如何使用它们。

> 注意:这不能替代详细的 API 文档,可在[这里](https://babeljs.io/docs/usage/api/)获取。

## <a id="toc-babel-parser"></a>[`babel-parser`](https://github.com/babel/babel/tree/master/packages/babel-parser)

最初是 Acorn 的一个分支,Babel 解析器速度快,易于使用,具有用于非标准功能(以及未来标准)的基于插件的架构。

首先,让我们安装它。

```sh
$ npm install --save @babel/parser
```

让我们从简单地解析一串代码开始:

```js
import parser from "@babel/parser";

const code = `function square(n) {
  return n * n;
}`;

parser.parse(code);
// Node {
//   type: "File",
//   start: 0,
//   end: 38,
//   loc: SourceLocation {...},
//   program: Node {...},
//   comments: [],
//   tokens: [...]
// }
```

我们还可以像这样向 `parse()` 传递选项:

```js
parser.parse(code, {
  sourceType: "module", // 默认: "script"
  plugins: ["jsx"] // 默认: []
});
```

`sourceType` 可以是 `"module"` 或 `"script"`,这是 Babel 解析器应该解析的模式。`"module"` 将在严格模式下解析并允许模块声明,`"script"` 不会。

> **注意:** `sourceType` 默认为 `"script"`,当它找到 `import` 或 `export` 时会出错。传递 `sourceType: "module"` 以消除这些错误。

由于 Babel 解析器是基于插件架构构建的,因此还有一个 `plugins` 选项可以启用内部插件。请注意,Babel 解析器尚未向外部插件开放此 API,尽管将来可能会这样做。

要查看完整的插件列表,请参阅 [Babel 解析器文档](https://babeljs.io/docs/en/babel-parser#plugins)。

## <a id="toc-babel-traverse"></a>[`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

Babel 遍历模块维护整体树状态,并负责替换、删除和添加节点。

通过运行以下命令安装它:

```sh
$ npm install --save @babel/traverse
```

我们可以与它一起使用来遍历和更新节点:

```js
import parser from "@babel/parser";
import traverse from "@babel/traverse";

const code = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(code);

traverse(ast, {
  enter(path) {
    if (
      path.node.type === "Identifier" &&
      path.node.name === "n"
    ) {
      path.node.name = "x";
    }
  }
});
```

## <a id="toc-babel-types"></a>[`babel-types`](https://github.com/babel/babel/tree/master/packages/babel-types)

Babel Types 是一个类似 Lodash 的 AST 节点实用程序库。它包含用于构建、验证和转换 AST 节点的方法。它对于用经过深思熟虑的实用程序方法清理 AST 逻辑很有用。

您可以通过运行以下命令来安装它:

```sh
$ npm install --save @babel/types
```

然后开始使用它:

```js
import traverse from "@babel/traverse";
import * as t from "@babel/types";

traverse(ast, {
  enter(path) {
    if (t.isIdentifier(path.node, { name: "n" })) {
      path.node.name = "x";
    }
  }
});
```

### <a id="toc-definitions"></a>定义

Babel Types 对每种节点类型都有定义,包含哪些属性属于哪里,哪些值是有效的,如何构建该节点,应该如何遍历该节点以及节点的别名等信息。

单个节点类型定义看起来像这样:

```js
defineType("BinaryExpression", {
  builder: ["operator", "left", "right"],
  fields: {
    operator: {
      validate: assertValueType("string")
    },
    left: {
      validate: assertNodeType("Expression")
    },
    right: {
      validate: assertNodeType("Expression")
    }
  },
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"]
});
```

### <a id="toc-builders"></a>构建器

您会注意到上面 `BinaryExpression` 的定义有一个 `builder` 字段。

```js
builder: ["operator", "left", "right"]
```

这是因为每种节点类型都有一个构建器方法,使用时看起来像这样:

```js
t.binaryExpression("*", t.identifier("a"), t.identifier("b"));
```

它创建一个这样的 AST:

```js
{
  type: "BinaryExpression",
  operator: "*",
  left: {
    type: "Identifier",
    name: "a"
  },
  right: {
    type: "Identifier",
    name: "b"
  }
}
```

打印时看起来像这样:

```js
a * b
```

构建器还将验证它们正在创建的节点,如果使用不当会抛出描述性错误。这引出了下一种方法类型。

### <a id="toc-validators"></a>验证器

`BinaryExpression` 的定义还包括有关节点 `fields` 和如何验证它们的信息。

```js
fields: {
  operator: {
    validate: assertValueType("string")
  },
  left: {
    validate: assertNodeType("Expression")
  },
  right: {
    validate: assertNodeType("Expression")
  }
}
```

这用于创建两种类型的验证方法。第一个是 `isX`。

```js
t.isBinaryExpression(maybeBinaryExpressionNode);
```

这测试以确保节点是二元表达式,但您还可以传递第二个参数以确保节点包含某些属性和值。

```js
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
```

还有这些方法的更,_嗯_,断言版本,将抛出错误而不是返回 `true` 或 `false`。

```js
t.assertBinaryExpression(maybeBinaryExpressionNode);
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
// Error: Expected type "BinaryExpression" with option { "operator": "*" }
```

### <a id="toc-converters"></a>转换器

> [WIP]

## <a id="toc-babel-generator"></a>[`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

Babel Generator 是 Babel 的代码生成器。它接受 AST 并将其转换为带有源映射的代码。

运行以下命令安装它:

```sh
$ npm install --save @babel/generator
```

然后使用它

```js
import parser from "@babel/parser";
import generate from "@babel/generator";

const code = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(code);

generate(ast, {}, code);
// {
//   code: "...",
//   map: "..."
// }
```

您还可以向 `generate()` 传递选项。

```js
generate(ast, {
  retainLines: false,
  compact: "auto",
  concise: false,
  quotes: "double",
  // ...
}, code);
```

## <a id="toc-babel-template"></a>[`babel-template`](https://github.com/babel/babel/tree/master/packages/babel-template)

Babel Template 是另一个微小但非常有用的模块。它允许您编写带有占位符的代码字符串,您可以使用它们而不是手动构建庞大的 AST。在计算机科学中,这种能力称为准引用。

```sh
$ npm install --save @babel/template
```

```js
import template from "@babel/template";
import generate from "@babel/generator";
import * as t from "@babel/types";

const buildRequire = template(`
  var IMPORT_NAME = require(SOURCE);
`);

const ast = buildRequire({
  IMPORT_NAME: t.identifier("myModule"),
  SOURCE: t.stringLiteral("my-module")
});

console.log(generate(ast).code);
```

```js
var myModule = require("my-module");
```

# <a id="toc-writing-your-first-babel-plugin"></a>编写您的第一个 Babel 插件

现在您已经熟悉了 Babel 的所有基础知识,让我们将其与插件 API 联系起来。

从一个接受当前 [`babel`](https://github.com/babel/babel/tree/master/packages/babel-core) 对象的 `function` 开始。

```js
export default function(babel) {
  // 插件内容
}
```

由于您将经常使用它,您可能想要像这样抓取 `babel.types`:

```js
export default function({ types: t }) {
  // 插件内容
}
```

然后您返回一个带有属性 `visitor` 的对象,该对象是插件的主要访问者。

```js
export default function({ types: t }) {
  return {
    visitor: {
      // 访问者内容
    }
  };
};
```

访问者中的每个函数接收 2 个参数:`path` 和 `state`

```js
export default function({ types: t }) {
  return {
    visitor: {
      Identifier(path, state) {},
      ASTNodeTypeHere(path, state) {}
    }
  };
};
```

让我们编写一个快速插件来展示它是如何工作的。这是我们的源代码:

```js
foo === bar;
```

或 AST 形式:

```js
{
  type: "BinaryExpression",
  operator: "===",
  left: {
    type: "Identifier",
    name: "foo"
  },
  right: {
    type: "Identifier",
    name: "bar"
  }
}
```

我们首先添加一个 `BinaryExpression` 访问者方法。

```js
export default function({ types: t }) {
  return {
    visitor: {
      BinaryExpression(path) {
        // ...
      }
    }
  };
}
```

然后让我们将其缩小到仅使用 `===` 运算符的 `BinaryExpression`。

```js
visitor: {
  BinaryExpression(path) {
    if (path.node.operator !== "===") {
      return;
    }

    // ...
  }
}
```

现在让我们用新的标识符替换 `left` 属性:

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  // ...
}
```

如果我们已经运行这个插件,我们将得到:

```js
sebmck === bar;
```

现在让我们只替换 `right` 属性。

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  path.node.right = t.identifier("dork");
}
```

现在我们的最终结果是:

```js
sebmck === dork;
```

太棒了!我们的第一个 Babel 插件。

----

# <a id="toc-transformation-operations"></a>转换操作

## <a id="toc-visiting"></a>访问

### <a id="toc-get-the-path-of-a-sub-node"></a>获取子节点的路径

要访问 AST 节点的属性,通常先访问节点然后访问属性。`path.node.property`

```js
// BinaryExpression AST 节点有属性:`left`、`right`、`operator`
BinaryExpression(path) {
  path.node.left;
  path.node.right;
  path.node.operator;
}
```

如果您需要访问该属性的 `path`,请使用路径的 `get` 方法,将字符串传递给属性。

```js
BinaryExpression(path) {
  path.get('left');
}
Program(path) {
  path.get('body.0');
}
```

您当前不能在容器(`BlockStatement` 的 `body` 数组)上使用 `get`,但可以链接点语法。

```js
export default function f() {
  return bar;
}
```

对于上面的示例,如果您想获取对应于 `return` 的路径,可以通过在遍历数组时使用数字作为索引来链接各种属性。

```js
ExportDefaultDeclaration(path) {
  path.get("declaration.body.body.0");
}
```

### <a id="toc-check-if-a-node-is-a-certain-type"></a>检查节点是否为特定类型

如果您想检查节点的类型,首选方法是:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```

您还可以对该节点上的属性进行浅检查:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

这在功能上等同于:

```js
BinaryExpression(path) {
  if (
    path.node.left != null &&
    path.node.left.type === "Identifier" &&
    path.node.left.name === "n"
  ) {
    // ...
  }
}
```

### <a id="toc-check-if-a-path-is-a-certain-type"></a>检查路径是否为特定类型

路径具有相同的方法来检查节点的类型:

```js
BinaryExpression(path) {
  if (path.get('left').isIdentifier({ name: "n" })) {
    // ...
  }
}
```

等同于:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

### <a id="toc-check-if-an-identifier-is-referenced"></a>检查标识符是否被引用

```js
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}
```

或者:

```js
Identifier(path) {
  if (t.isReferenced(path.node, path.parent)) {
    // ...
  }
}
```

### <a id="toc-find-a-specific-parent-path"></a>查找特定的父路径

有时您需要从路径向上遍历树,直到满足条件。

使用所有父节点的 `NodePath` 调用提供的 `callback`。当 `callback` 返回真值时,我们返回该 `NodePath`。

```js
path.findParent((path) => path.isObjectExpression());
```

如果当前路径也应该包括在内:

```js
path.find((path) => path.isObjectExpression());
```

查找最接近的父函数或程序:

```js
path.getFunctionParent();
```

向上遍历树,直到我们命中列表中的父节点路径

```js
path.getStatementParent();
```

### <a id="toc-get-sibling-paths"></a>获取兄弟路径

如果路径在列表中,如 `Function`/`Program` 的主体,它将有"兄弟"。

- 使用 `path.inList` 检查路径是否是列表的一部分
- 您可以使用 `path.getSibling(index)` 获取周围的兄弟,
- 使用 `path.key` 获取容器中当前路径的索引
- 使用 `path.container` 获取路径的容器(所有兄弟节点的数组)
- 使用 `path.listKey` 获取列表容器的键名

> 这些 API 在 [babel-minify](https://github.com/babel/babili) 中使用的 [transform-merge-sibling-variables](https://github.com/babel/babili/blob/master/packages/babel-plugin-transform-merge-sibling-variables/src/index.js) 插件中使用。

```js
var a = 1; // pathA, path.key = 0
var b = 2; // pathB, path.key = 1
var c = 3; // pathC, path.key = 2
```

```js
export default function({ types: t }) {
  return {
    visitor: {
      VariableDeclaration(path) {
        // 如果当前路径是 pathA
        path.inList // true
        path.listKey // "body"
        path.key // 0
        path.getSibling(0) // pathA
        path.getSibling(path.key + 1) // pathB
        path.container // [pathA, pathB, pathC]
        path.getPrevSibling() // path(undefined) *
        path.getNextSibling() // pathB
        path.getAllPrevSiblings() // []
        path.getAllNextSiblings() // [pathB, pathC]
      }
    }
  };
}
```

* `path(undefined)` 是一个 `NodePath`,其中 `path.node === undefined`

### <a id="toc-stopping-traversal"></a>停止遍历

如果您的插件不需要在某种情况下运行,最简单的方法是编写早期返回。

```js
BinaryExpression(path) {
  if (path.node.operator !== '**') return;
}
```

如果您在顶级路径中进行子遍历,可以使用 2 个提供的 API 方法:

`path.skip()` 跳过遍历当前路径的子节点。
`path.stop()` 完全停止遍历。

```js
outerPath.traverse({
  Function(innerPath) {
    innerPath.skip(); // 如果检查子节点无关紧要
  },
  ReferencedIdentifier(innerPath, state) {
    state.iife = true;
    innerPath.stop(); // 如果您想保存一些状态然后停止遍历,或去优化
  }
});
```

## <a id="toc-manipulation"></a>操作

### <a id="toc-replacing-a-node"></a>替换节点

```js
BinaryExpression(path) {
  path.replaceWith(
    t.binaryExpression("**", path.node.left, t.numberLiteral(2))
  );
}
```

```diff
  function square(n) {
-   return n * n;
+   return n ** 2;
  }
```

### <a id="toc-replacing-a-node-with-multiple-nodes"></a>用多个节点替换单个节点

```js
ReturnStatement(path) {
  path.replaceWithMultiple([
    t.expressionStatement(t.stringLiteral("Is this the real life?")),
    t.expressionStatement(t.stringLiteral("Is this just fantasy?")),
    t.expressionStatement(t.stringLiteral("(Enjoy singing the rest of the song in your head)")),
  ]);
}
```

```diff
  function square(n) {
-   return n * n;
+   "Is this the real life?";
+   "Is this just fantasy?";
+   "(Enjoy singing the rest of the song in your head)";
  }
```

> **注意:**当用多个节点替换表达式时,它们必须是语句。这是因为 Babel 在替换节点时广泛使用启发式,这意味着您可以做一些非常疯狂的转换,否则会非常冗长。

### <a id="toc-replacing-a-node-with-a-source-string"></a>用源字符串替换节点

```js
FunctionDeclaration(path) {
  path.replaceWithSourceString(`function add(a, b) {
    return a + b;
  }`);
}
```

```diff
- function square(n) {
-   return n * n;
+ function add(a, b) {
+   return a + b;
  }
```

> **注意:**除非您处理动态源字符串,否则不建议使用此 API,否则在访问者之外解析代码更有效。

### <a id="toc-inserting-a-sibling-node"></a>插入兄弟节点

```js
FunctionDeclaration(path) {
  path.insertBefore(t.expressionStatement(t.stringLiteral("Because I'm easy come, easy go.")));
  path.insertAfter(t.expressionStatement(t.stringLiteral("A little high, little low.")));
}
```

```diff
+ "Because I'm easy come, easy go.";
  function square(n) {
    return n * n;
  }
+ "A little high, little low.";
```

> **注意:**这应该始终是一个语句或语句数组。这使用了[用多个节点替换节点](#replacing-a-node-with-multiple-nodes)中提到的相同启发式。

### <a id="toc-inserting-into-a-container"></a>插入到容器中

如果您想插入到一个数组(如 `body`)的 AST 节点中。类似于 `insertBefore`/`insertAfter`,除了您必须指定 `listKey`,通常是 `body`。

```js
ClassMethod(path) {
  path.get('body').unshiftContainer('body', t.expressionStatement(t.stringLiteral('before')));
  path.get('body').pushContainer('body', t.expressionStatement(t.stringLiteral('after')));
}
```

```diff
 class A {
  constructor() {
+   "before"
    var a = 'middle';
+   "after"
  }
 }
```

### <a id="toc-removing-a-node"></a>删除节点

```js
FunctionDeclaration(path) {
  path.remove();
}
```

```diff
- function square(n) {
-   return n * n;
- }
```

### <a id="toc-replacing-a-parent"></a>替换父节点

只需使用 parentPath 调用 `replaceWith`: `path.parentPath`

```js
BinaryExpression(path) {
  path.parentPath.replaceWith(
    t.expressionStatement(t.stringLiteral("Anyway the wind blows, doesn't really matter to me, to me."))
  );
}
```

```diff
  function square(n) {
-   return n * n;
+   "Anyway the wind blows, doesn't really matter to me, to me.";
  }
```

### <a id="toc-removing-a-parent"></a>删除父节点

```js
BinaryExpression(path) {
  path.parentPath.remove();
}
```

```diff
  function square(n) {
-   return n * n;
  }
```

## <a id="toc-scope"></a>作用域

### <a id="toc-checking-if-a-local-variable-is-bound"></a>检查局部变量是否被绑定

```js
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
```

这将向上遍历作用域树并检查该特定的绑定。

您还可以检查作用域是否有自己的**绑定**:

```js
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}
```

### <a id="toc-generating-a-uid"></a>生成 UID

这将生成一个不与任何局部定义的变量冲突的标识符。

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### <a id="toc-pushing-a-variable-declaration-to-a-parent-scope"></a>将变量声明推送到父作用域

有时您可能想要推送一个 `VariableDeclaration` 以便您可以赋值给它。

```js
FunctionDeclaration(path) {
  const id = path.scope.generateUidIdentifierBasedOnNode(path.node.id);
  path.remove();
  path.scope.parent.push({ id, init: path.node });
}
```

```diff
- function square(n) {
+ var _square = function square(n) {
    return n * n;
- }
+ };
```

### <a id="toc-rename-a-binding-and-its-references"></a>重命名绑定及其引用

```js
FunctionDeclaration(path) {
  path.scope.rename("n", "x");
}
```

```diff
- function square(n) {
-   return n * n;
+ function square(x) {
+   return x * x;
  }
```

或者,您可以将绑定重命名为生成的唯一标识符:

```js
FunctionDeclaration(path) {
  path.scope.rename("n");
}
```

```diff
- function square(n) {
-   return n * n;
+ function square(_n) {
+   return _n * _n;
  }
```

----

# <a id="toc-plugin-options"></a>插件选项

如果您想让用户自定义 Babel 插件的行为,您可以接受特定于插件的选项,用户可以像这样指定:

```js
{
  plugins: [
    ["my-plugin", {
      "option1": true,
      "option2": false
    }]
  ]
}
```

这些选项然后通过 `state` 对象传递到插件访问者:

```js
export default function({ types: t }) {
  return {
    visitor: {
      FunctionDeclaration(path, state) {
        console.log(state.opts);
        // { option1: true, option2: false }
      }
    }
  }
}
```

这些选项是特定于插件的,您无法访问其他插件的选项。

## <a id="toc-pre-and-post-in-plugins"></a> 插件中的 Pre 和 Post

插件可以拥有在插件之前或之后运行的函数。它们可以用于设置或清理/分析目的。

```js
export default function({ types: t }) {
  return {
    pre(state) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral(path) {
        this.cache.set(path.node.value, 1);
      }
    },
    post(state) {
      console.log(this.cache);
    }
  };
}
```

## <a id="toc-enabling-syntax-in-plugins"></a> 在插件中启用语法

Babel 插件本身可以启用[解析器插件](https://babeljs.io/docs/en/babel-parser#plugins),这样用户就不需要安装/启用它们。这可以防止解析错误而不继承语法插件。

```js
export default function({ types: t }) {
  return {
    inherits: require("babel-plugin-syntax-jsx")
  };
}
```

## <a id="toc-throwing-a-syntax-error"></a> 抛出语法错误

如果您想使用 babel-code-frame 和消息抛出错误:

```js
export default function({ types: t }) {
  return {
    visitor: {
      StringLiteral(path) {
        throw path.buildCodeFrameError("Error message here");
      }
    }
  };
}
```

错误看起来像:

```
file.js: Error message here
   7 |
   8 | let tips = [
>  9 |   "Click on any AST node with a '+' to expand it",
     |   ^
  10 |
  11 |   "Hovering over a node highlights the \
    12 |    corresponding part in the source code",
```

----

# <a id="toc-building-nodes"></a>构建节点

在编写转换时,您经常需要构建一些节点以插入到 AST 中。如前所述,您可以使用 [`babel-types`](#babel-types) 包中的[构建器](#builders)方法来实现这一点。

构建器的方法名称只是您想要构建的节点类型的名称,只是首字母小写。例如,如果您想构建一个 `MemberExpression`,您将使用 `t.memberExpression(...)`。

这些构建器的参数由节点定义决定。有一些工作正在生成关于定义的易于阅读的文档,但目前它们都可以在[这里](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)找到。

节点定义如下所示:

```js
defineType("MemberExpression", {
  builder: ["object", "property", "computed"],
  visitor: ["object", "property"],
  aliases: ["Expression", "LVal"],
  fields: {
    object: {
      validate: assertNodeType("Expression")
    },
    property: {
      validate(node, key, val) {
        let expectedType = node.computed ? "Expression" : "Identifier";
        assertNodeType(expectedType)(node, key, val);
      }
    },
    computed: {
      default: false
    }
  }
});
```

在这里您可以看到关于这个特定节点类型的所有信息,包括如何构建它、遍历它和验证它。

通过查看 `builder` 属性,您可以看到调用构建器方法(`t.memberExpression`)所需的 3 个参数。

```js
builder: ["object", "property", "computed"],
```

> 请注意,有时您可以在节点上自定义的属性比 `builder` 数组包含的属性更多。这是为了保持构建器参数不会太多。在这些情况下,您需要手动设置属性。一个例子是 [`ClassMethod`](https://github.com/babel/babel/blob/bbd14f88c4eea88fa584dd877759dd6b900bf35e/packages/babel-types/src/definitions/es2015.js#L238-L276)。

```js
// 示例
// 因为构建器不包含 `async` 作为属性
var node = t.classMethod(
  "constructor",
  t.identifier("constructor"),
  params,
  body
)
// 在创建后手动设置
node.async = true;
```

您可以通过 `fields` 对象看到构建器参数的验证。

```js
fields: {
  object: {
    validate: assertNodeType("Expression")
  },
  property: {
    validate(node, key, val) {
      let expectedType = node.computed ? "Expression" : "Identifier";
      assertNodeType(expectedType)(node, key, val);
    }
  },
  computed: {
    default: false
  }
}
```

您可以看到 `object` 需要是一个 `Expression`,`property` 需要是 `Expression` 或 `Identifier`,具体取决于成员表达式是否是 `computed`,`computed` 只是一个默认为 `false` 的布尔值。

所以我们可以通过以下方式构造一个 `MemberExpression`:

```js
t.memberExpression(
  t.identifier('object'),
  t.identifier('property')
  // `computed` 是可选的
);
```

这将导致:

```js
object.property
```

然而,我们说 `object` 需要是一个 `Expression`,那么为什么 `Identifier` 是有效的?

好吧,如果我们查看 `Identifier` 的定义,我们可以看到它有一个 `aliases` 属性,说明它也是一个表达式。

```js
aliases: ["Expression", "LVal"],
```

所以由于 `MemberExpression` 是一种 `Expression`,我们可以将其设置为另一个 `MemberExpression` 的 `object`:

```js
t.memberExpression(
  t.memberExpression(
    t.identifier('member'),
    t.identifier('expression')
  ),
  t.identifier('property')
)
```

这将导致:

```js
member.expression.property
```

您不太可能记住每种节点类型的构建器方法签名。所以您应该花一些时间了解它们是如何从节点定义生成的。

您可以在[这里](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)找到所有实际定义,并可以[在这里](https://github.com/babel/babel/blob/master/doc/ast/spec.md)查看它们的文档

----

# <a id="toc-best-practices"></a>最佳实践

## <a id="toc-create-helper-builders-and-checkers"></a> 创建辅助构建器和检查器

将某些检查(节点是否为特定类型)提取到自己的辅助函数中以及提取特定节点类型的辅助函数是非常简单的。

```js
function isAssignment(node) {
  return node && node.operator === opts.operator + "=";
}

function buildAssignment(left, right) {
  return t.assignmentExpression("=", left, right);
}
```

## <a id="toc-avoid-traversing-the-ast-as-much-as-possible"></a>尽可能避免遍历 AST

遍历 AST 是昂贵的,并且很容易意外地遍历 AST 超过必要的次数。这可能是数千甚至数万次额外操作。

Babel 尽可能优化这一点,如果可以合并访问者,以便在一次遍历中完成所有操作。

### <a id="toc-merge-visitors-whenever-possible"></a>尽可能合并访问者

在编写访问者时,可能在多个逻辑上必要的地方调用 `path.traverse`。

```js
path.traverse({
  Identifier(path) {
    // ...
  }
});

path.traverse({
  BinaryExpression(path) {
    // ...
  }
});
```

但是,最好将这些编写为只运行一次的单个访问者。否则,您无缘无故地多次遍历同一棵树。

```js
path.traverse({
  Identifier(path) {
    // ...
  },
  BinaryExpression(path) {
    // ...
  }
});
```

### <a id="toc-do-not-traverse-when-manual-lookup-will-do"></a>手动查找可以时不要遍历

在寻找特定节点类型时也可能想要调用 `path.traverse`。

```js
const nestedVisitor = {
  Identifier(path) {
    // ...
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    path.get('params').traverse(nestedVisitor);
  }
};
```

但是,如果您正在寻找特定的和浅层的东西,很有可能您可以手动查找所需的节点而不执行昂贵的遍历。

```js
const MyVisitor = {
  FunctionDeclaration(path) {
    path.node.params.forEach(function() {
      // ...
    });
  }
};
```

## <a id="toc-optimizing-nested-visitors"></a>优化嵌套访问者

当嵌套访问者时,可能有必要在代码中嵌套编写它们。

```js
const MyVisitor = {
  FunctionDeclaration(path) {
    path.traverse({
      Identifier(path) {
        // ...
      }
    });
  }
};
```

然而,这会在每次调用 `FunctionDeclaration()` 时创建一个新的访问者对象。这可能是昂贵的,因为 Babel 在每次传入新的访问者对象时都会进行一些处理(例如分解包含多个类型的键,执行验证和调整对象结构)。由于 Babel 在访问者对象上存储标志,指示它已经执行了该处理,因此最好将访问者存储在变量中并每次传递相同的对象。

```js
const nestedVisitor = {
  Identifier(path) {
    // ...
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    path.traverse(nestedVisitor);
  }
};
```

如果您在嵌套访问者中需要一些状态,如下所示:

```js
const MyVisitor = {
  FunctionDeclaration(path) {
    var exampleState = path.node.params[0].name;

    path.traverse({
      Identifier(path) {
        if (path.node.name === exampleState) {
          // ...
        }
      }
    });
  }
};
```

您可以将其作为状态传递给 `traverse()` 方法,并在访问者中的 `this` 上访问它。

```js
const nestedVisitor = {
  Identifier(path) {
    if (path.node.name === this.exampleState) {
      // ...
    }
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    var exampleState = path.node.params[0].name;
    path.traverse(nestedVisitor, { exampleState });
  }
};
```

## <a id="toc-being-aware-of-nested-structures"></a>注意嵌套结构

有时在考虑给定的转换时,您可能会忘记给定结构可以被嵌套。

例如,假设我们想从 `Foo` `ClassDeclaration` 中查找 `constructor` `ClassMethod`。

```js
class Foo {
  constructor() {
    // ...
  }
}
```

```js
const constructorVisitor = {
  ClassMethod(path) {
    if (path.node.name === 'constructor') {
      // ...
    }
  }
}

const MyVisitor = {
  ClassDeclaration(path) {
    if (path.node.id.name === 'Foo') {
      path.traverse(constructorVisitor);
    }
  }
}
```

我们忽略了类可以被嵌套的事实,使用上面的遍历我们也会命中嵌套的 `constructor`:

```js
class Foo {
  constructor() {
    class Bar {
      constructor() {
        // ...
      }
    }
  }
}
```

## <a id="toc-unit-testing"></a>单元测试

有几种主要方法可以测试 babel 插件:快照测试、AST 测试和 exec 测试。我们将在此示例中使用 [jest](http://facebook.github.io/jest/),因为它开箱即支持快照测试。我们在这里创建的示例托管在[这个仓库](https://github.com/brigand/babel-plugin-testing-example)中。

首先我们需要一个 babel 插件,我们将把它放在 src/index.js 中。

```js

module.exports = function testPlugin(babel) {
  return {
    visitor: {
      Identifier(path) {
        if (path.node.name === 'foo') {
          path.node.name = 'bar';
        }
      }
    }
  };
};
```

### 快照测试

接下来,使用 `npm install --save-dev babel-core jest` 安装我们的依赖项,然后我们可以开始编写第一个测试:快照。快照测试允许我们直观地检查 babel 插件的输出。我们给它一个输入,告诉它制作一个快照,并将它保存到一个文件中。我们将快照检查到 git 中。这使我们能够看到我们何时影响了任何测试用例的输出。它还为我们提供了拉取请求中的差异。当然您可以使用任何测试框架来做到这一点,但是对于 jest 来说,更新快照就像 `jest -u` 一样简单。

```js
// src/__tests__/index-test.js
const babel = require('babel-core');
const plugin = require('../');

var example = `
var foo = 1;
if (foo) console.log(foo);
`;

it('works', () => {
  const {code} = babel.transform(example, {plugins: [plugin]});
  expect(code).toMatchSnapshot();
});
```

这为我们在 `src/__tests__/__snapshots__/index-test.js.snap` 中提供了一个快照文件。

```js
exports[`test works 1`] = `
"
var bar = 1;
if (bar) console.log(bar);"
`;
```

如果我们在插件中将 'bar' 更改为 'baz' 并再次运行 jest,我们会得到:

```diff
Received value does not match stored snapshot 1.

    - Snapshot
    + Received

    @@ -1,3 +1,3 @@
     "
    -var bar = 1;
    -if (bar) console.log(bar);"
    +var baz = 1;
    +if (baz) console.log(baz);"
```

我们看到我们对插件代码的更改如何影响插件的输出,如果输出对我们来说看起来不错,我们可以运行 `jest -u` 来更新快照。

### AST 测试

除了快照测试,我们还可以手动检查 AST。这是一个简单但脆弱的例子。对于更复杂的情况,您可能希望利用 babel-traverse。它允许您指定一个带有 `visitor` 键的对象,就像插件本身一样。

```js
it('contains baz', () => {
  const {ast} = babel.transform(example, {plugins: [plugin]});
  const program = ast.program;
  const declaration = program.body[0].declarations[0];
  assert.equal(declaration.id.name, 'baz');
  // 或 babelTraverse(program, {visitor: ...})
});
```

### Exec 测试

在这里我们将转换代码,然后评估它的行为是否正确。请注意,我们在测试中没有使用 `assert`。这确保如果我们的插件做了奇怪的事情,比如意外删除了 assert 行,测试仍然会失败。


```js
it('foo is an alias to baz', () => {
  var input = `
    var foo = 1;
    // test that foo was renamed to baz
    var res = baz;
  `;
  var {code} = babel.transform(input, {plugins: [plugin]});
  var f = new Function(`
    ${code};
    return res;
  `);
  var res = f();
  assert(res === 1, 'res is 1');
});
```

Babel 核心使用[类似方法](https://github.com/babel/babel/blob/7.0/CONTRIBUTING.md#writing-tests)进行快照和 exec 测试。

### [`babel-plugin-tester`](https://github.com/kentcdodds/babel-plugin-tester)

这个包使测试插件更容易。如果您熟悉 ESLint 的 [RuleTester](http://eslint.org/docs/developer-guide/working-with-rules#rule-unit-tests),这应该很熟悉。您可以查看[文档](https://github.com/kentcdodds/babel-plugin-tester/blob/master/README.md)以获得完整的功能感,但这里有一个简单的示例:

```js
import pluginTester from 'babel-plugin-tester';
import identifierReversePlugin from '../identifier-reverse-plugin';

pluginTester({
  plugin: identifierReversePlugin,
  fixtures: path.join(__dirname, '__fixtures__'),
  tests: {
    'does not change code with no identifiers': '"hello";',
    'changes this code': {
      code: 'var hello = "hi";',
      output: 'var olleh = "hi";',
    },
    'using fixtures files': {
      fixture: 'changed.js',
      outputFixture: 'changed-output.js',
    },
    'using jest snapshots': {
      code: `
        function sayHi(person) {
          return 'Hello ' + person + '!'
        }
      `,
      snapshot: true,
    },
  },
});
```
