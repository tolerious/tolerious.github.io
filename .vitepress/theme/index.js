import DefaultTheme from 'vitepress/theme'
import Bookshelf from './components/Bookshelf.vue'
import BookshelfEn from './components/BookshelfEn.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Bookshelf', Bookshelf)
    app.component('BookshelfEn', BookshelfEn)
  }
}
