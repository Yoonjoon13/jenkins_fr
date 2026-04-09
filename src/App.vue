<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div>
        <RouterLink class="brand" to="/board/list">게시판 실습</RouterLink>
        <p class="tagline">MariaDB와 연결된 간단한 게시판 예제</p>
      </div>

      <nav class="app-nav">
        <RouterLink to="/board/list">목록</RouterLink>
        <RouterLink to="/board/reg">글쓰기</RouterLink>
      </nav>
    </header>

    <main class="page-shell">
      <RouterView />
    </main>
  </div>
</template>
