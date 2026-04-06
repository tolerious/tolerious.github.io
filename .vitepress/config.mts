import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',

  // 忽略子项目中的死链检查（如 /README, /CONTRIBUTING）
  ignoreDeadLinks: true,

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: "前端范儿",
      description: "VitePress 站点",
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: 'Babel 手册', link: '/docs/babel-handbook/zh/' }
        ],

        sidebar: [
          {
            text: 'Babel 手册',
            items: [
              { text: '中文', link: '/docs/babel-handbook/zh/' },
              { text: 'English', link: '/docs/babel-handbook/en/' }
            ]
          }
        ],

        socialLinks: [
          { icon: 'github', link: 'https://github.com/tolerious/tolerious.github.io' }
        ]
      }
    },

    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en',
      title: "Frontend Fan",
      description: "A VitePress Site",
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en' },
          { text: 'Babel Handbook', link: '/docs/babel-handbook/en/' }
        ],

        sidebar: [
          {
            text: 'Babel Handbook',
            items: [
              { text: 'English', link: '/docs/babel-handbook/en/' },
              { text: '中文', link: '/docs/babel-handbook/zh/' }
            ]
          }
        ],

        socialLinks: [
          { icon: 'github', link: 'https://github.com/tolerious/tolerious.github.io' }
        ]
      }
    }
  }
})
