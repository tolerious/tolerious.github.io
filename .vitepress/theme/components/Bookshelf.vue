<script setup>
import {onMounted} from 'vue'

const books = [
  {
    id: 'babel-zh',
    icon: '📖',
    coverTitle: 'Babel',
    title: 'Babel Handbook',
    subtitle: '中文维护版',
    link: '/docs/babel-handbook/zh/',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
  },
]

onMounted(() => {
  const style = document.createElement('style')
  style.textContent = `
    .VPHome {
      background: #ffffff;
    }

    .VPContent {
      padding: 0;
    }

    .bookshelf-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 24px;
      margin-top: 20px;
    }

    .book-card {
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      display: block;
    }

    .book-card:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    .book-cover {
      width: 100%;
      aspect-ratio: 3/4;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .book-cover::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%);
      pointer-events: none;
    }

    .book-icon-large {
      font-size: 48px;
      margin-bottom: 12px;
      z-index: 1;
    }

    .book-cover-title {
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      z-index: 1;
    }

    .book-info {
      padding: 12px;
      text-align: center;
    }

    .book-title {
      font-size: 15px;
      font-weight: 600;
      color: #333333;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .book-subtitle {
      font-size: 13px;
      color: #999999;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .book-card.placeholder .book-cover-title,
    .book-card.placeholder .book-title {
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .books-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 16px;
      }
    }
  `
  document.head.appendChild(style)
})
</script>

<template>
  <div class="bookshelf-container">
    <div class="books-grid">
      <template v-for="book in books" :key="book.id">
        <a v-if="book.link" :href="book.link" class="book-card" :class="{ placeholder: book.isPlaceholder }"
           :style="{ '--book-gradient': book.gradient }">
          <div class="book-cover" :style="{ background: book.gradient }">
            <span class="book-icon-large">{{ book.icon }}</span>
            <span class="book-cover-title">{{ book.coverTitle }}</span>
          </div>
          <div class="book-info">
            <div class="book-title">{{ book.title }}</div>
            <div class="book-subtitle">{{ book.subtitle }}</div>
          </div>
        </a>

        <div v-else class="book-card" :class="{ placeholder: book.isPlaceholder }">
          <div class="book-cover" :style="{ background: book.gradient }">
            <span class="book-icon-large">{{ book.icon }}</span>
            <span class="book-cover-title">{{ book.coverTitle }}</span>
          </div>
          <div class="book-info">
            <div class="book-title">{{ book.title }}</div>
            <div class="book-subtitle">{{ book.subtitle }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
