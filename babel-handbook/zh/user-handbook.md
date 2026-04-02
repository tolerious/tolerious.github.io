# Babel 用户手册

作者 [Jamie Kyle](https://jamie.build/)

本文档涵盖了您想了解的使用 [Babel](https://babeljs.io) 及相关工具的所有内容。

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

本手册有其他语言版本,请查看 [README](/README.md) 获取完整列表。

# 目录

- [简介](#toc-introduction)
- [设置 Babel](#toc-setting-up-babel)
  - [`babel-cli`](#toc-babel-cli)
    - [在项目中运行 Babel CLI](#toc-running-babel-cli-from-within-a-project)
  - [`babel-register`](#toc-babel-register)
  - [`babel-node`](#toc-babel-node)
  - [`babel-core`](#toc-babel-core)
- [配置 Babel](#toc-configuring-babel)
  - [`.babelrc`](#toc-babelrc)
  - [`babel-preset-es2015`](#toc-babel-preset-es2015)
  - [`babel-preset-react`](#toc-babel-preset-react)
  - [`babel-preset-stage-x`](#toc-babel-preset-stage-x)
- [执行 Babel 生成的代码](#toc-executing-babel-generated-code)
  - [`babel-polyfill`](#toc-babel-polyfill)
  - [`babel-runtime`](#toc-babel-runtime)
- [配置 Babel (高级)](#toc-configuring-babel-advanced)
  - [手动指定插件](#toc-manually-specifying-plugins)
  - [插件选项](#toc-plugin-options)
  - [基于环境自定义 Babel](#toc-customizing-babel-based-on-environment)
  - [创建自己的预设](#toc-making-your-own-preset)
- [Babel 和其他工具](#toc-babel-and-other-tools)
  - [静态分析工具](#toc-static-analysis-tools)
    - [代码检查](#toc-linting)
    - [代码风格](#toc-code-style)
    - [文档](#toc-documentation)
  - [框架](#toc-frameworks)
    - [React](#toc-react)
  - [文本编辑器和 IDE](#toc-text-editors-and-ides)
- [Babel 支持](#toc-babel-support)
  - [Babel 论坛](#toc-babel-forum)
  - [Babel 聊天](#toc-babel-chat)
  - [Babel 问题](#toc-babel-issues)
    - [创建优秀的 Babel 错误报告](#toc-creating-an-awesome-babel-bug-report)

# <a id="toc-introduction"></a>简介

Babel 是一个通用的多用途 JavaScript 编译器。使用 Babel,您可以使用(并创建)下一代 JavaScript,以及下一代 JavaScript 工具。

JavaScript 作为一种语言在不断演进,新的规范和提案不断带来新功能。使用 Babel 可以让您在这些功能普及之前数年就使用它们。

Babel 通过将使用最新标准编写的 JavaScript 代码编译成当前可在任何地方运行的版本来实现这一点。这个过程被称为源到源编译,也称为转译。

例如,Babel 可以将新的 ES2015 箭头函数语法从这样:

```js
const square = n => n * n;
```

转换成这样:

```js
const square = function square(n) {
  return n * n;
};
```

然而,Babel 的功能远不止于此,因为它支持语法扩展,例如 React 的 JSX 语法和用于静态类型检查的 Flow 语法支持。

更进一步,Babel 中的所有内容都只是一个插件,任何人都可以创建自己的插件,利用 Babel 的全部功能来做任何他们想做的事情。

*更进一步*,Babel 被分解为多个核心模块,任何人都可以使用这些模块来构建下一代 JavaScript 工具。

许多人也是如此,围绕 Babel 形成的生态系统非常庞大且多样化。在本手册中,我将涵盖内置 Babel 工具的工作原理以及社区中的一些有用内容。

----

# <a id="toc-setting-up-babel"></a>设置 Babel

由于 JavaScript 社区没有单一的构建工具、框架、平台等,Babel 为所有主要工具提供了官方集成。从 Gulp 到 Browserify,从 Ember 到 Meteor,无论您的设置如何,都可能有官方集成。

在本手册中,我们只介绍设置 Babel 的内置方法,但您也可以访问交互式[设置页面](http://babeljs.io/docs/setup)查看所有集成。

> **注意:** 本指南将引用命令行工具,如 `node` 和 `npm`。在继续之前,您应该熟悉这些工具。

## <a id="toc-babel-cli"></a>`babel-cli`

Babel 的 CLI 是从命令行使用 Babel 编译文件的简单方法。

让我们首先全局安装它来学习基础知识。

```sh
$ npm install --global babel-cli
```

我们可以像这样编译我们的第一个文件:

```sh
$ babel my-file.js
```

这将直接将编译输出转储到终端。要将其写入文件,我们需要指定 `--out-file` 或 `-o`。

```sh
$ babel example.js --out-file compiled.js
# 或
$ babel example.js -o compiled.js
```

如果我们想将整个目录编译到新目录中,可以使用 `--out-dir` 或 `-d`。

```sh
$ babel src --out-dir lib
# 或
$ babel src -d lib
```

### <a id="toc-running-babel-cli-from-within-a-project"></a>在项目中运行 Babel CLI

虽然您_可以_在机器上全局安装 Babel CLI,但最好在每个项目中**本地**安装它。

主要有两个原因:

  1. 同一台机器上的不同项目可以依赖不同版本的 Babel,允许您逐个更新。
  2. 这意味着您对工作环境没有隐式依赖。使您的项目更具可移植性且更易于设置。

我们可以通过运行以下命令在本地安装 Babel CLI:

```sh
$ npm install --save-dev babel-cli
```

> **注意:** 由于全局运行 Babel 通常是个坏主意,您可能希望通过运行以下命令卸载全局副本:
>
> ```sh
> $ npm uninstall --global babel-cli
> ```

安装完成后,您的 `package.json` 文件应该如下所示:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "devDependencies": {
    "babel-cli": "^6.0.0"
  }
}
```

现在我们不直接从命令行运行 Babel,而是将命令放在 **npm 脚本**中,这将使用我们的本地版本。

只需在 `package.json` 中添加一个 `"scripts"` 字段,并将 babel 命令作为 `build` 放入其中。

```diff
  {
    "name": "my-project",
    "version": "1.0.0",
+   "scripts": {
+     "build": "babel src -d lib"
+   },
    "devDependencies": {
      "babel-cli": "^6.0.0"
    }
  }
```

现在从终端我们可以运行:

```js
npm run build
```

这将像以前一样运行 Babel,只是现在我们使用的是本地副本。

## <a id="toc-babel-register"></a>`babel-register`

运行 Babel 的下一个最常见方法是通过 `babel-register`。此选项允许您通过 require 文件来运行 Babel,这可能与您的设置更好地集成。

请注意,这并非用于生产环境。部署以这种方式编译的代码被认为是不好的做法。最好在部署之前提前编译。但是,这对于构建脚本或您在本地运行的其他东西非常有效。

首先让我们在项目中创建一个 `index.js` 文件。

```js
console.log("Hello world!");
```

如果我们使用 `node index.js` 运行它,将不会使用 Babel 编译。所以我们不这样做,而是设置 `babel-register`。

首先安装 `babel-register`。

```sh
$ npm install --save-dev babel-register
```

接下来,在项目中创建一个 `register.js` 文件并编写以下代码:

```js
require("babel-register");
require("./index.js");
```

这样做的作用是在 Node 的模块系统中*注册* Babel 并开始编译每个被 `require` 的文件。

现在,我们可以使用 `register.js` 代替运行 `node index.js`。

```sh
$ node register.js
```

> **注意:** 您不能在要编译的同一文件中注册 Babel。因为 node 在 Babel 有机会编译文件之前执行该文件。
>
> ```js
> require("babel-register");
> // 未编译:
> console.log("Hello world!");
> ```

## <a id="toc-babel-node"></a>`babel-node`

如果您只是通过 `node` CLI 运行一些代码,集成 Babel 最简单的方法可能是使用 `babel-node` CLI,它很大程度上只是 `node` CLI 的替代品。

请注意,这并非用于生产环境。部署以这种方式编译的代码被认为是不好的做法。最好在部署之前提前编译。但是,这对于构建脚本或您在本地运行的其他东西非常有效。

首先确保您已安装 `babel-cli`。

```sh
$ npm install --save-dev babel-cli
```

> **注意:** 如果您想知道为什么我们在本地安装它,请阅读上面的[在项目中运行 Babel CLI](#toc-running-babel-cli-from-within-a-project)部分。

然后将您运行 `node` 的任何地方替换为 `babel-node`。

如果您使用 npm `scripts`,您可以简单地这样做:

```diff
  {
    "scripts": {
-     "script-name": "node script.js"
+     "script-name": "babel-node script.js"
    }
  }
```

否则,您需要写出 `babel-node` 本身的路径。

```diff
- node script.js
+ ./node_modules/.bin/babel-node script.js
```

> 提示:您也可以使用 [`npm-run`](https://www.npmjs.com/package/npm-run)。

## <a id="toc-babel-core"></a>`babel-core`

如果由于某种原因需要以编程方式使用 Babel,可以使用 `babel-core` 包本身。

首先安装 `babel-core`。

```sh
$ npm install babel-core
```

```js
var babel = require("babel-core");
```

如果您有一串 JavaScript,可以使用 `babel.transform` 直接编译它。

```js
babel.transform("code();", options);
// => { code, map, ast }
```

如果您正在处理文件,可以使用异步 api:

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

或同步 api:

```js
babel.transformFileSync("filename.js", options);
// => { code, map, ast }
```

如果您出于某种原因已经有了 Babel AST,可以直接从 AST 转换。

```js
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

对于以上所有方法,`options` 参考
https://babeljs.io/docs/usage/api/#options。

----

# <a id="toc-configuring-babel"></a>配置 Babel

您可能已经注意到,单独运行 Babel 似乎只是将 JavaScript 文件从一个位置复制到另一个位置。

这是因为我们还没有告诉 Babel 要做什么。

> 由于 Babel 是一个通用的编译器,以多种不同的方式使用,默认情况下它不做任何事情。您必须明确告诉 Babel 它应该做什么。

您可以通过安装**插件**或**预设**(插件组)来给 Babel 指示它应该做什么。

## <a id="toc-babelrc"></a>`.babelrc`

在我们开始告诉 Babel 要做什么之前,我们需要创建一个配置文件。您需要做的就是在项目根目录创建一个 `.babelrc` 文件。开始时像这样:

```js
{
  "presets": [],
  "plugins": []
}
```

此文件用于配置 Babel 以执行您想要的操作。

> **注意:**虽然您也可以通过其他方式向 Babel 传递选项,但 `.babelrc` 文件是约定俗成的,也是最好的方式。

## <a id="toc-babel-preset-es2015"></a>`babel-preset-es2015`

让我们首先告诉 Babel 将 ES2015(JavaScript 标准的最新版本,也称为 ES6)编译为 ES5(当今大多数 JavaScript 环境中可用的版本)。

我们将通过安装 "es2015" Babel 预设来做到这一点:

```sh
$ npm install --save-dev babel-preset-es2015
```

接下来我们修改 `.babelrc` 以包含该预设。

```diff
  {
    "presets": [
+     "es2015"
    ],
    "plugins": []
  }
```

## <a id="toc-babel-preset-react"></a>`babel-preset-react`

设置 React 同样简单。只需安装预设:

```sh
$ npm install --save-dev babel-preset-react
```

然后将预设添加到 `.babelrc` 文件中:

```diff
  {
    "presets": [
      "es2015",
+     "react"
    ],
    "plugins": []
  }
```

## <a id="toc-babel-preset-stage-x"></a>`babel-preset-stage-x`

JavaScript 还有一些提案正通过 TC39(ECMAScript 标准背后的技术委员会)的流程进入标准。

这个流程分为 5 个阶段(0-4)。随着提案获得更多支持并更有可能被接受为标准,它们会经历各个阶段,最终在第 4 阶段被接受为标准。

这些在 Babel 中打包为 4 个不同的预设:

- `babel-preset-stage-0`
- `babel-preset-stage-1`
- `babel-preset-stage-2`
- `babel-preset-stage-3`

> 请注意,没有 stage-4 预设,因为它只是上面的 `es2015` 预设。

每个预设都需要后面阶段的预设。即 `babel-preset-stage-1` 需要 `babel-preset-stage-2`,后者需要 `babel-preset-stage-3`。

只需安装您想要使用的阶段:

```sh
$ npm install --save-dev babel-preset-stage-2
```

然后您可以将其添加到 `.babelrc` 配置中。

```diff
  {
    "presets": [
      "es2015",
      "react",
+     "stage-2"
    ],
    "plugins": []
  }
```

----

# <a id="toc-executing-babel-generated-code"></a>执行 Babel 生成的代码

所以您已经用 Babel 编译了代码,但这还不是故事的结束。

## <a id="toc-babel-polyfill"></a>`babel-polyfill`

几乎所有的未来 JavaScript 语法都可以用 Babel 编译,但 API 并非如此。

例如,以下代码有一个需要编译的箭头函数:

```js
function addAll() {
  return Array.from(arguments).reduce((a, b) => a + b);
}
```

转换成这样:

```js
function addAll() {
  return Array.from(arguments).reduce(function(a, b) {
    return a + b;
  });
}
```

然而,这在所有地方仍然不起作用,因为 `Array.from` 并不是每个 JavaScript 环境中都存在的。

```
Uncaught TypeError: Array.from is not a function
```

为了解决这个问题,我们使用一种称为[Polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill)的东西。简而言之,polyfill 是一段代码,它复制了当前运行时中不存在的原生 api。允许您在 API 可用之前使用它们,如 `Array.from`。

Babel 使用优秀的 [core-js](https://github.com/zloirock/core-js) 作为其 polyfill,以及自定义的 [regenerator](https://github.com/facebook/regenerator) 运行时,使生成器和异步函数工作。

要包含 Babel polyfill,首先使用 npm 安装它:

```sh
$ npm install --save babel-polyfill
```

然后在任何需要它的文件顶部简单地包含 polyfill:

```js
import "babel-polyfill";
```

## <a id="toc-babel-runtime"></a>`babel-runtime`

为了实现 ECMAScript 规范的细节,Babel 将使用"辅助"方法来保持生成的代码整洁。

由于这些辅助方法可能会变得很长,并且它们被添加到每个文件的顶部,您可以将它们移动到一个单独的 "runtime" 中,该 runtime 被 require。

首先安装 `babel-plugin-transform-runtime` 和 `babel-runtime`:

```sh
$ npm install --save-dev babel-plugin-transform-runtime
$ npm install --save babel-runtime
```

然后更新您的 `.babelrc`:

```diff
  {
    "plugins": [
+     "transform-runtime",
      "transform-es2015-classes"
    ]
  }
```

现在 Babel 将编译如下代码:

```js
class Foo {
  method() {}
}
```

转换成这样:

```js
import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import _createClass from "babel-runtime/helpers/createClass";

let Foo = function () {
  function Foo() {
    _classCallCheck(this, Foo);
  }

  _createClass(Foo, [{
    key: "method",
    value: function method() {}
  }]);

  return Foo;
}();
```

而不是在每个需要的文件中放入 `_classCallCheck` 和 `_createClass` 辅助方法。

----

# <a id="toc-configuring-babel-advanced"></a>配置 Babel (高级)

大多数人可以仅使用内置预设来使用 Babel,但 Babel 暴露了更细粒度的功能。

## <a id="toc-manually-specifying-plugins"></a>手动指定插件

Babel 预设只是预配置插件的集合,如果您想做一些不同的事情,可以手动指定插件。这与预设的工作方式几乎完全相同。

首先安装一个插件:

```sh
$ npm install --save-dev babel-plugin-transform-es2015-classes
```

然后将 `plugins` 字段添加到 `.babelrc`。

```diff
  {
+   "plugins": [
+     "transform-es2015-classes"
+   ]
  }
```

这使您能够更细粒度地控制正在运行的确切转换。

有关官方插件的完整列表,请参阅 [Babel 插件页面](http://babeljs.io/docs/plugins/)。

还可以查看所有由[社区构建](https://www.npmjs.com/search?q=babel-plugin)的插件。如果您想了解如何编写自己的插件,请阅读 [Babel 插件手册](plugin-handbook.md)。

## <a id="toc-plugin-options"></a>插件选项

许多插件还有选项可以配置它们的行为不同。例如,许多转换都有一个 "loose" 模式,它会放弃一些规范行为,以支持更简单和更高性能的生成代码。

要向插件添加选项,只需进行以下更改:

```diff
  {
    "plugins": [
-     "transform-es2015-classes"
+     ["transform-es2015-classes", { "loose": true }]
    ]
  }
```

> 我将在未来几周内致力于更新插件文档,详细说明每个选项。
> [关注我获取更新](https://twitter.com/thejameskyle)。

## <a id="toc-customizing-babel-based-on-environment"></a>基于环境自定义 Babel

Babel 插件解决许多不同的任务。其中许多是开发工具,可以帮助您调试代码或与工具集成。还有许多插件旨在优化生产环境中的代码。

因此,通常需要基于环境的 Babel 配置。您可以使用 `.babelrc` 文件轻松完成此操作。

```diff
  {
    "presets": ["es2015"],
    "plugins": [],
+   "env": {
+     "development": {
+       "plugins": [...]
+     },
+     "production": {
+       "plugins": [...]
+     }
+   }
  }
```

Babel 将基于当前环境启用 `env` 内部的配置。

当前环境将使用 `process.env.BABEL_ENV`。当 `BABEL_ENV` 不可用时,它将回退到 `NODE_ENV`,如果也不可用,则默认为 `"development"`。

**Unix**

```sh
$ BABEL_ENV=production [COMMAND]
$ NODE_ENV=production [COMMAND]
```

**Windows**

```sh
$ SET BABEL_ENV=production
$ [COMMAND]
```

> **注意:** `[COMMAND]` 是您用来运行 Babel 的任何命令(即 `babel`、`babel-node`,或者如果您使用 register 钩子,可能只是 `node`)。
>
> **提示:**如果您希望命令在 unix 和 windows 平台上都能工作,请使用 [`cross-env`](https://www.npmjs.com/package/cross-env)。

## <a id="toc-making-your-own-preset"></a>创建自己的预设

手动指定插件?插件选项?基于环境的设置?所有这些配置在您的所有项目中可能会看起来像大量的重复。

因此,我们鼓励社区创建自己的预设。这可以是针对您运行的特定[node 版本](https://github.com/leebenson/babel-preset-node5)的预设,或者是针对您的[整个](https://github.com/cloudflare/babel-preset-cf)[公司](https://github.com/airbnb/babel-preset-airbnb)的预设。

创建预设很容易。假设您有这个 `.babelrc` 文件:

```js
{
  "presets": [
    "es2015",
    "react"
  ],
  "plugins": [
    "transform-flow-strip-types"
  ]
}
```

您需要做的就是创建一个新项目,遵循命名约定 `babel-preset-*`(请对这个命名空间负责),并创建两个文件。

首先,创建一个新的 `package.json` 文件,其中包含您的预设所需的必要 `dependencies`。

```js
{
  "name": "babel-preset-my-awesome-preset",
  "version": "1.0.0",
  "author": "James Kyle <me@thejameskyle.com>",
  "dependencies": {
    "babel-preset-es2015": "^6.3.13",
    "babel-preset-react": "^6.3.13",
    "babel-plugin-transform-flow-strip-types": "^6.3.15"
  }
}
```

然后创建一个 `index.js` 文件,导出 `.babelrc` 文件的内容,将插件/预设字符串替换为 `require` 调用。

```js
module.exports = function () {
  presets: [
    require("babel-preset-es2015"),
    require("babel-preset-react")
  ],
  plugins: [
    require("babel-plugin-transform-flow-strip-types")
  ]
};
```

然后只需将其发布到 npm,您就可以像使用任何预设一样使用它。

----

# <a id="toc-babel-and-other-tools"></a>Babel 和其他工具

一旦掌握了 Babel,设置就相当简单了,但在如何与其他工具设置方面可能会相当困难。然而,我们尝试与其他项目密切合作,以使体验尽可能简单。

## <a id="toc-static-analysis-tools"></a>静态分析工具

较新的标准为语言带来了许多新语法,静态分析工具才刚刚开始利用这些语法。

### <a id="toc-linting"></a>代码检查

最流行的代码检查工具之一是 [ESLint](http://eslint.org),因此我们维护了官方的 [`babel-eslint`](https://github.com/babel/babel-eslint) 集成。

首先安装 `eslint` 和 `babel-eslint`。

```sh
$ npm install --save-dev eslint babel-eslint
```

接下来在项目中创建或使用现有的 `.eslintrc` 文件,并将 `parser` 设置为 `babel-eslint`。

```diff
  {
+   "parser": "babel-eslint",
    "rules": {
      ...
    }
  }
```

现在将 `lint` 任务添加到 npm `package.json` 脚本中:

```diff
  {
    "name": "my-module",
    "scripts": {
+     "lint": "eslint my-files.js"
    },
    "devDependencies": {
      "babel-eslint": "...",
      "eslint": "..."
    }
  }
```

然后只需运行该任务,您就完成了设置。

```sh
$ npm run lint
```

有关更多信息,请参阅 [`babel-eslint`](https://github.com/babel/babel-eslint) 或 [`eslint`](http://eslint.org) 文档。

### <a id="toc-code-style"></a>代码风格

> JSCS 已与 ESLint 合并,因此请查看使用 ESLint 的代码样式。

JSCS 是一个非常流行的工具,用于将代码检查进一步用于检查代码本身的风格。Babel 和 JSCS 项目的核心维护者([@hzoo](https://github.com/hzoo))维护着与 JSCS 的官方集成。

更好的是,这个集成现在存在于 JSCS 本身中,在 `--esnext` 选项下。因此集成 Babel 很简单:

```
$ jscs . --esnext
```

从 cli,或在 `.jscsrc` 文件中添加 `esnext` 选项。

```diff
  {
    "preset": "airbnb",
+   "esnext": true
  }
```

有关更多信息,请参阅 [`babel-jscs`](https://github.com/jscs-dev/babel-jscs) 或 [`jscs`](http://jscs.info) 文档。

<!--
### Code Coverage

> [WIP]
-->

### <a id="toc-documentation"></a>文档

使用 Babel、ES2015 和 Flow,您可以推断出很多关于代码的信息。使用 [documentation.js](http://documentation.js.org),您可以非常容易地生成详细的 API 文档。

Documentation.js 在幕后使用 Babel 来支持所有最新的语法,包括 Flow 注释,以声明代码中的类型。

## <a id="toc-frameworks"></a>框架

所有主要的 JavaScript 框架现在都专注于将其 API 围绕语言的未来进行对齐。因此,在工具方面已经做了很多工作。

框架不仅有机会使用 Babel,还有机会以改善用户体验的方式扩展它。

### <a id="toc-react"></a>React

React 已显着改变了其 API 以与 ES2015 类对齐([在此阅读更新的 API](https://babeljs.io/blog/2015/06/07/react-on-es6-plus))。更进一步,React 依赖 Babel 来编译它的 JSX 语法,弃用自己的自定义工具以支持 Babel。您可以按照[上面的说明](#babel-preset-react)开始设置 `babel-preset-react` 包。

React 社区采用了 Babel 并使其运行。现在有许多由[社区构建](https://www.npmjs.com/search?q=babel-plugin+react)的转换。

最值得注意的是 [`babel-plugin-react-transform`](https://github.com/gaearon/babel-plugin-react-transform) 插件,它与许多 [React 特定转换](https://github.com/gaearon/babel-plugin-react-transform#transforms)结合,可以启用诸如*热模块重载*和其他调试实用程序之类的东西。

<!--
### Ember

> [WIP]
-->

## <a id="toc-text-editors-and-ides"></a>文本编辑器和 IDE

使用 Babel 引入 ES2015、JSX 和 Flow 语法可能会有所帮助,但如果您的文本编辑器不支持它,那可能是一个非常糟糕的体验。因此,您需要使用 Babel 插件设置文本编辑器或 IDE。

- [Sublime Text](https://github.com/babel/babel-sublime)
- [Atom](https://atom.io/packages/language-babel)
- [Vim](https://github.com/jbgutierrez/vim-babel)
- [WebStorm](https://babeljs.io/docs/setup/#webstorm)

<!--
# Debugging Babel

> [WIP]
-->

----

# <a id="toc-babel-support"></a>Babel 支持

Babel 拥有一个非常庞大且快速增长的社区,随着我们的发展,我们要确保人们拥有成功所需的所有资源。因此,我们提供了多种不同的渠道来获得支持。

请记住,在所有这些社区中,我们执行[行为准则](https://github.com/babel/babel/blob/master/CODE_OF_CONDUCT.md)。如果您违反行为准则,将会采取行动。所以请阅读它,在与他人互动时要意识到这一点。

我们还希望发展一个自我支持的社区,让那些留下来并支持他人的人。如果您发现有人提出了您知道答案的问题,请花几分钟帮助他们。在这样做时,尽量友善和理解。

## <a id="toc-babel-forum"></a>Babel 论坛

[Discourse](http://www.discourse.org) 为我们免费提供了他们论坛软件的托管版本(我们非常感谢他们!)。如果您喜欢论坛,请访问 [discuss.babeljs.io](https://discuss.babeljs.io)。

## <a id="toc-babel-chat"></a>Babel 聊天

每个人都喜欢 [Slack](https://slack.com)。如果您正在寻求社区的即时支持,请来 [slack.babeljs.io](https://slack.babeljs.io) 与我们聊天。

<!--
## Babel Stack Overflow

> [WIP]
-->

## <a id="toc-babel-issues"></a>Babel 问题

Babel 使用 [Github](http://github.com) 提供的问题跟踪器。

您可以在 [Github](https://github.com/babel/babel/issues) 上查看所有打开和关闭的问题。

如果您想打开一个新问题:

- [搜索现有问题](https://github.com/babel/babel/issues)
- [创建新的错误报告](https://github.com/babel/babel/issues/new)
  或 [请求新功能](https://github.com/babel/babel/issues/new)

### <a id="toc-creating-an-awesome-babel-bug-report"></a>创建优秀的 Babel 错误报告

Babel 问题有时可能很难远程调试,所以我们需要尽可能多的帮助。多花几分钟精心制作一个非常好的错误报告可以显着加快解决问题的速度。

首先,尝试隔离您的问题。您的设置的每个部分都在促成问题是不太可能的。如果您的问题是输入代码的一部分,请尝试删除尽可能多的代码,同时仍然会导致问题。

> [WIP]
