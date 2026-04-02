# Babel Handbook 📚

> 深入学习 Babel - 使用和创建 JavaScript 编译器插件

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

本手册由 [Jamie Kyle](https://jamie.build/) 编写，涵盖使用 [Babel](https://babeljs.io) 及其相关工具的所有知识。
源仓库中文版有些排版问题，PR 也就不更新了。故，开出一个新仓库供大家学习参考。

## 📖 简介

Babel 是一个通用的多用途 JavaScript 编译器。使用 Babel，您可以：

- 🚀 使用下一代 JavaScript 语法
- 🔧 创建自定义转换插件
- 🛠️ 构建强大的 JavaScript 工具
- 📦 转换 ES2015+、JSX、Flow 等语法

本手册分为两个部分，帮助您全面掌握 Babel。

## 📚 内容结构

### 用户手册

用户手册涵盖 Babel 的日常使用和配置：

- **Babel 简介**
  - JavaScript 编译的概念
  - 源到源编译 (Transpiling)
  - Babel 的应用场景

- **设置 Babel**
  - `babel-cli` - 命令行工具
  - `babel-register` - 运行时编译
  - `babel-node` - 替代 Node.js REPL
  - `babel-core` - 编程式 API

- **配置 Babel**
  - `.babelrc` 配置文件
  - Presets (预设) 的使用
  - `babel-preset-es2015`
  - `babel-preset-react`
  - `babel-preset-stage-x`

- **执行 Babel 生成代码**
  - `babel-polyfill` - API 支持
  - `babel-runtime` - 辅助函数优化

- **高级配置**
  - 手动指定插件
  - 插件选项
  - 基于环境的配置
  - 创建自定义 Preset

- **与其他工具集成**
  - ESLint、JSCS
  - React 框架
  - 文本编辑器和 IDE

### 插件手册

插件手册深入讲解如何创建自定义 Babel 插件：

- **基础概念**
  - 抽象语法树 (AST)
  - Babel 的三个阶段：解析、转换、生成
  - 词法分析和语法分析

- **遍历机制**
  - 访问者模式
  - 路径 (Paths)
  - 状态管理
  - 作用域和绑定

- **Babel API**
  - `babel-parser` - 解析代码
  - `babel-traverse` - 遍历 AST
  - `babel-types` - AST 节点操作
  - `babel-generator` - 代码生成
  - `babel-template` - 模板构建

- **插件开发**
  - 编写第一个 Babel 插件
  - 转换操作详解
  - 节点操作方法
  - 作用域处理
  - 插件选项和最佳实践

## 🌍 语言支持

本手册提供以下语言版本：

- 🇺🇸 **English** - 英文原版
- 🇨🇳 **简体中文** - 中文翻译版

## 🎯 适合谁阅读

- **前端开发者** - 想要了解和使用现代 JavaScript 语法
- **工具链开发者** - 需要创建代码转换工具
- **框架作者** - 需要理解 JavaScript 编译原理
- **Babel 用户** - 希望深入配置和优化 Babel
- **插件开发者** - 想要为 Babel 生态系统做贡献

## 💡 为什么选择 Babel

JavaScript 作为一门语言在不断演进，新的规范和提案不断推出新特性。Babel 让您能够在这些特性普及之前就使用它们，同时保持代码在现有环境中的兼容性。

通过 Babel，您可以：

- 使用最新的 JavaScript 语法特性
- 编译 JSX（用于 React）
- 支持 Flow 类型注解
- 创建自定义语法转换
- 构建代码分析工具

## 📖 阅读建议

### 初学者
1. 从用户手册开始，了解 Babel 的基本概念
2. 学习如何安装和配置 Babel
3. 尝试简单的代码转换示例
4. 逐步探索高级配置选项

### 进阶用户
1. 深入学习 AST 和编译原理
2. 阅读插件手册，学习插件开发
3. 实践编写自定义转换插件
4. 研究 Babel 内部实现机制

### 工具链开发者
1. 全面理解 Babel 的三个阶段
2. 掌握所有 Babel API
3. 学习性能优化最佳实践
4. 为 Babel 生态系统贡献代码

## 🔗 相关资源

- [Babel 官方网站](https://babeljs.io/)
- [Babel GitHub 仓库](https://github.com/babel/babel)
- [Babel 论坛](https://discuss.babeljs.io/)
- [Babel Slack](https://slack.babeljs.io/)

## 📝 内容贡献

如果您发现手册中有未翻译的英文部分，欢迎通过 PR 贡献翻译和补充内容。

## 📄 许可证

本手册采用 [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) 许可证发布。

---

**开始学习 Babel** - 掌握现代 JavaScript 开发的核心工具
