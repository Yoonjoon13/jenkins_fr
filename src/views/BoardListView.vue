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
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load posts.'
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
        <h1>Board List</h1>
        <p>Posts stored in MariaDB are shown in newest-first order.</p>
      </div>

      <RouterLink class="primary-button" to="/board/reg">Write Post</RouterLink>
    </div>

    <div v-if="errorMessage" class="message-box error">
      {{ errorMessage }}
    </div>

    <div v-if="isLoading" class="card empty-state">Loading posts...</div>

    <div v-else-if="posts.length === 0" class="card empty-state">
      There are no posts yet. Create the first one.
    </div>

    <div v-else class="card">
      <table class="board-table">
        <thead>
          <tr>
            <th>Idx</th>
            <th>Title</th>
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
      <button class="secondary-button" type="button" @click="loadPosts">Refresh</button>
    </div>
  </section>
</template>
