<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { fetchBoardList } from '@/api/board'

const posts = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

async function loadPosts() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    posts.value = await fetchBoardList()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '게시글 목록을 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadPosts)
</script>

<template>
  <section class="panel">
    <div class="panel-header">
      <div class="panel-title">
        <h1>게시글 목록</h1>
        <p>MariaDB에 저장된 게시글을 최신순으로 보여줍니다.</p>
      </div>

      <RouterLink class="primary-button" to="/board/reg">글쓰기</RouterLink>
    </div>

    <div v-if="errorMessage" class="message-box error">
      {{ errorMessage }}
    </div>

    <div v-if="isLoading" class="card empty-state">게시글을 불러오는 중입니다...</div>

    <div v-else-if="posts.length === 0" class="card empty-state">
      아직 등록된 게시글이 없습니다. 첫 글을 작성해 보세요.
    </div>

    <div v-else class="card">
      <table class="board-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.idx">
            <td class="idx-cell">{{ post.idx }}</td>
            <td>
              <RouterLink :to="`/board/${post.idx}`">{{ post.title }}</RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="button-row">
      <button class="secondary-button" type="button" @click="loadPosts">새로고침</button>
    </div>
  </section>
</template>
