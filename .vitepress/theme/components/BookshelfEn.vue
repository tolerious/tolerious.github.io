<script setup>
import { onMounted } from 'vue'

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

    .book-card.babel-zh .book-cover {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
    }

    .book-card.babel-en .book-cover {
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
    }

    .book-card.vue .book-cover {
      background: linear-gradient(135deg, #42b883, #35495e);
    }

    .book-card.react .book-cover {
      background: linear-gradient(135deg, #61dafb, #282c34);
    }

    .book-card.typescript .book-cover {
      background: linear-gradient(135deg, #3178c6, #235a9e);
    }

    .book-card.nextjs .book-cover {
      background: linear-gradient(135deg, #000000, #333333);
    }

    .book-card.nodejs .book-cover {
      background: linear-gradient(135deg, #68a063, #4c8545);
    }

    .book-card.webpack .book-cover {
      background: linear-gradient(135deg, #8dd6f9, #1c78c0);
    }

    .book-card.placeholder .book-cover {
      background: linear-gradient(135deg, #a0a0a0, #808080);
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
      <a href="/docs/babel-handbook/en/" class="book-card babel-en">
        <div class="book-cover">
          <span class="book-icon-large">📖</span>
          <span class="book-cover-title">Babel</span>
        </div>
        <div class="book-info">
          <div class="book-title">Babel Handbook</div>
          <div class="book-subtitle">English</div>
        </div>
      </a>

      <a href="/docs/babel-handbook/zh/" class="book-card babel-zh">
        <div class="book-cover">
          <span class="book-icon-large">📖</span>
          <span class="book-cover-title">Babel</span>
        </div>
        <div class="book-info">
          <div class="book-title">Babel Handbook</div>
          <div class="book-subtitle">中文</div>
        </div>
      </a>

      <div class="book-card vue">
        <div class="book-cover">
          <span class="book-icon-large">⚡</span>
          <span class="book-cover-title">Vue.js</span>
        </div>
        <div class="book-info">
          <div class="book-title">Vue.js</div>
          <div class="book-subtitle">Coming Soon</div>
        </div>
      </div>

      <div class="book-card react">
        <div class="book-cover">
          <span class="book-icon-large">⚛️</span>
          <span class="book-cover-title">React</span>
        </div>
        <div class="book-info">
          <div class="book-title">React</div>
          <div class="book-subtitle">Coming Soon</div>
        </div>
      </div>

      <div class="book-card typescript">
        <div class="book-cover">
          <span class="book-icon-large">📘</span>
          <span class="book-cover-title">TypeScript</span>
        </div>
        <div class="book-info">
          <div class="book-title">TypeScript</div>
          <div class="book-subtitle">Coming Soon</div>
        </div>
      </div>

      <div class="book-card nextjs">
        <div class="book-cover">
          <span class="book-icon-large">▲</span>
          <span class="book-cover-title">Next.js</span>
        </div>
        <div class="book-info">
          <div class="book-title">Next.js</div>
          <div class="book-subtitle">Coming Soon</div>
        </div>
      </div>

      <div class="book-card nodejs">
        <div class="book-cover">
          <span class="book-icon-large">🟢</span>
          <span class="book-cover-title">Node.js</span>
        </div>
        <div class="book-info">
          <div class="book-title">Node.js</div>
          <div class="book-subtitle">Coming Soon</div>
        </div>
      </div>

      <div class="book-card webpack">
        <div class="book-cover">
          <span class="book-icon-large">📦</span>
          <span class="book-cover-title">Webpack</span>
        </div>
        <div class="book-info">
          <div class="book-title">Webpack</div>
          <div class="book-subtitle">Coming Soon</div>
        </div>
      </div>

      <div class="book-card placeholder">
        <div class="book-cover">
          <span class="book-icon-large">📚</span>
          <span class="book-cover-title">More</span>
        </div>
        <div class="book-info">
          <div class="book-title">More Tutorials</div>
          <div class="book-subtitle">Stay Tuned</div>
        </div>
      </div>
    </div>
  </div>
</template>
