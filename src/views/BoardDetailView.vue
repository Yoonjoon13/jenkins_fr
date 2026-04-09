<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ApiError, fetchBoardDetail } from '@/api/board'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')

async function loadPost() {
  const rawIdx = route.params.idx
  const idx = Number(rawIdx)

  if (!Number.isInteger(idx) || idx <= 0) {
    alert('Invalid post id.')
    await router.replace('/board/list')
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    post.value = await fetchBoardDetail(idx)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      alert('Post not found.')
      await router.replace('/board/list')
      return
    }

    errorMessage.value = error instanceof Error ? error.message : 'Failed to load post detail.'
  } finally {
    isLoading.value = false
  }
}

watch(() => route.params.idx, () => void loadPost(), { immediate: true })
</script>

<template>
  <section class="panel">
    <div class="panel-header">
      <div class="panel-title">
        <h1>Board Detail</h1>
        <p>You can view the full content of the selected post.</p>
      </div>

      <button class="secondary-button" type="button" @click="$router.push('/board/list')">
        Back to List
      </button>
    </div>

    <div v-if="errorMessage" class="message-box error">
      {{ errorMessage }}
    </div>

    <div v-if="isLoading" class="card empty-state">Loading post...</div>

    <article v-else-if="post" class="card">
      <span class="detail-meta">Post #{{ post.idx }}</span>
      <h2 class="detail-title">{{ post.title }}</h2>
      <p class="detail-content">{{ post.content }}</p>
    </article>
  </section>
</template>
