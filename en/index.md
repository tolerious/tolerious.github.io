---
layout: home
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const style = document.createElement('style')
  style.textContent = `
    .VPHome {
      background: linear-gradient(to bottom, #f8f8f8, #f0f0f0);
      min-height: calc(100vh - var(--vp-nav-height));
    }

    .VPContent {
      padding: 40px 20px;
    }

    .bookshelf-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .bookshelf-title {
      text-align: center;
      font-size: 2rem;
      font-weight: bold;
      color: #1a1a2e;
      margin-bottom: 40px;
      font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    }

    .shelf {
      position: relative;
      margin-bottom: 60px;
      padding: 0 20px;
    }

    .shelf-board {
      position: absolute;
      bottom: -15px;
      left: 0;
      right: 0;
      height: 20px;
      background: linear-gradient(to bottom, #d4a574, #c49a6c, #b8895e);
      border-radius: 3px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .shelf-board::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(to bottom, #e8c99b, #d4a574);
      border-radius: 3px 3px 0 0;
    }

    .books-container {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 8px;
      padding-bottom: 20px;
      min-height: 180px;
      flex-wrap: wrap;
    }

    .book {
      position: relative;
      width: 45px;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      transform-origin: bottom center;
    }

    .book:hover {
      transform: translateY(-8px) scale(1.05);
      z-index: 10;
    }

    .book-spine {
      position: relative;
      width: 100%;
      border-radius: 2px;
      box-shadow:
        2px 0 4px rgba(0,0,0,0.2),
        inset 1px 0 2px rgba(255,255,255,0.2),
        inset -1px 0 2px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 8px 4px;
      overflow: hidden;
    }

    .book-spine::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: rgba(0,0,0,0.15);
    }

    .book-spine::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: rgba(255,255,255,0.15);
    }

    .book-title {
      font-size: 9px;
      font-weight: bold;
      color: white;
      text-align: center;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      letter-spacing: 1px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      max-height: 140px;
      overflow: hidden;
      white-space: nowrap;
    }

    .book-icon {
      font-size: 16px;
      margin-bottom: 4px;
    }

    .book.babel-zh {
      height: 150px;
    }

    .book.babel-zh .book-spine {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      height: 100%;
    }

    .book.babel-en {
      height: 145px;
    }

    .book.babel-en .book-spine {
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      height: 100%;
    }

    .book.vue {
      height: 140px;
    }

    .book.vue .book-spine {
      background: linear-gradient(135deg, #42b883, #35495e);
      height: 100%;
    }

    .book.react {
      height: 138px;
    }

    .book.react .book-spine {
      background: linear-gradient(135deg, #61dafb, #282c34);
      height: 100%;
    }

    .book.typescript {
      height: 142px;
    }

    .book.typescript .book-spine {
      background: linear-gradient(135deg, #3178c6, #235a9e);
      height: 100%;
    }

    .book.nextjs {
      height: 136px;
    }

    .book.nextjs .book-spine {
      background: linear-gradient(135deg, #000000, #333333);
      height: 100%;
    }

    .book.nodejs {
      height: 144px;
    }

    .book.nodejs .book-spine {
      background: linear-gradient(135deg, #68a063, #4c8545);
      height: 100%;
    }

    .book.webpack {
      height: 139px;
    }

    .book.webpack .book-spine {
      background: linear-gradient(135deg, #8dd6f9, #1c78c0);
      height: 100%;
    }

    .book.placeholder {
      height: 135px;
    }

    .book.placeholder .book-spine {
      background: linear-gradient(135deg, #a0a0a0, #808080);
      height: 100%;
    }

    .book.placeholder .book-title {
      opacity: 0.5;
    }

    .book-tooltip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease, visibility 0.2s ease;
      margin-bottom: 8px;
      z-index: 100;
      pointer-events: none;
    }

    .book:hover .book-tooltip {
      opacity: 1;
      visibility: visible;
    }

    .book-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: rgba(0, 0, 0, 0.9);
    }

    @media (max-width: 768px) {
      .books-container {
        gap: 6px;
      }

      .book {
        width: 38px;
      }

      .book-title {
        font-size: 8px;
      }
    }
  `
  document.head.appendChild(style)
})
</script>

<template>
  <div class="bookshelf-container">
    <h1 class="bookshelf-title">📚 My Bookshelf</h1>

    <div class="shelf">
      <div class="books-container">
        <a href="/docs/babel-handbook/en/" class="book babel-en">
          <div class="book-spine">
            <span class="book-icon">📖</span>
            <span class="book-title">Babel Handbook</span>
          </div>
          <div class="book-tooltip">Babel Handbook (English)</div>
        </a>

        <a href="/docs/babel-handbook/zh/" class="book babel-zh">
          <div class="book-spine">
            <span class="book-icon">📖</span>
            <span class="book-title">Babel Handbook</span>
          </div>
          <div class="book-tooltip">Babel Handbook (中文版)</div>
        </a>

        <div class="book vue">
          <div class="book-spine">
            <span class="book-icon">⚡</span>
            <span class="book-title">Vue.js</span>
          </div>
          <div class="book-tooltip">Vue.js Tutorial (Coming Soon)</div>
        </div>

        <div class="book react">
          <div class="book-spine">
            <span class="book-icon">⚛️</span>
            <span class="book-title">React</span>
          </div>
          <div class="book-tooltip">React Tutorial (Coming Soon)</div>
        </div>

        <div class="book typescript">
          <div class="book-spine">
            <span class="book-icon">📘</span>
            <span class="book-title">TypeScript</span>
          </div>
          <div class="book-tooltip">TypeScript Tutorial (Coming Soon)</div>
        </div>
      </div>
      <div class="shelf-board"></div>
    </div>

    <div class="shelf">
      <div class="books-container">
        <div class="book nextjs">
          <div class="book-spine">
            <span class="book-icon">▲</span>
            <span class="book-title">Next.js</span>
          </div>
          <div class="book-tooltip">Next.js Tutorial (Coming Soon)</div>
        </div>

        <div class="book nodejs">
          <div class="book-spine">
            <span class="book-icon">🟢</span>
            <span class="book-title">Node.js</span>
          </div>
          <div class="book-tooltip">Node.js Tutorial (Coming Soon)</div>
        </div>

        <div class="book webpack">
          <div class="book-spine">
            <span class="book-icon">📦</span>
            <span class="book-title">Webpack</span>
          </div>
          <div class="book-tooltip">Webpack Tutorial (Coming Soon)</div>
        </div>

        <div class="book placeholder">
          <div class="book-spine">
            <span class="book-icon">📚</span>
            <span class="book-title">More</span>
          </div>
          <div class="book-tooltip">More Tutorials (Stay Tuned)</div>
        </div>
      </div>
      <div class="shelf-board"></div>
    </div>
  </div>
</template>
