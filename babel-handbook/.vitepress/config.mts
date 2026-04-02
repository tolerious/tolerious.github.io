import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Babel Handbook1",
  description: "Babel Handbook - Learn how to use and create Babel plugins",
  base: '/babel-handbook/',
  // 忽略死链接检查
  ignoreDeadLinks: true,

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'User Handbook', link: '/user-handbook.md' },
          { text: 'Plugin Handbook', link: '/plugin-handbook.md' }
        ],
        sidebar: [
          {
            text: 'Babel Handbook',
            items: [
              { text: 'Introduction', link: '/' },
              { text: 'User Handbook', link: '/user-handbook.md' },
              { text: 'Plugin Handbook', link: '/plugin-handbook.md' }
            ]
          }
        ],
        socialLinks: [
          { icon: 'github', link: 'https://github.com/babel/babel' }
        ]
      }
    },

    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: "Babel Handbook",
      description: "Babel Handbook - Learn how to use and create Babel plugins",
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '用户手册', link: '/zh/user-handbook.md' },
          { text: '插件手册', link: '/zh/plugin-handbook.md' }
        ],
        sidebar: [
          {
            text: 'Babel Handbook',
            items: [
              { text: '简介', link: '/zh/' },
              { text: '用户手册', link: '/zh/user-handbook.md' },
              { text: '插件手册', link: '/zh/plugin-handbook.md' }
            ]
          }
        ],
        socialLinks: [
          { icon: 'github', link: 'https://github.com/babel/babel' }
        ]
      }
    }
  },

  themeConfig: {
    outline: {
      level: 2,
      label: 'On this page'
    },
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/babel/babel/edit/main/packages/babel-handbook/docs/:path',
      text: 'Edit this page on GitHub'
    },
    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'short'
      }
    },
    footer: {
      message: 'Released under the CC BY 4.0 License.',
      copyright: 'Copyright © 2019-present Babel Contributors'
    }
  }
})
