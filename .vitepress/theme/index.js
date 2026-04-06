import DefaultTheme from 'vitepress/theme'
import Bookshelf from './components/Bookshelf.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Bookshelf', Bookshelf)
  }
}
