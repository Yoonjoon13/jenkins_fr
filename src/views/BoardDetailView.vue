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
    alert('올바르지 않은 게시글 번호입니다.')
    await router.replace('/board/list')
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    post.value = await fetchBoardDetail(idx)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      alert('게시글을 찾을 수 없습니다.')
      await router.replace('/board/list')
      return
    }

    errorMessage.value =
      error instanceof Error ? error.message : '게시글 상세 정보를 불러오지 못했습니다.'
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
        <h1>게시글 상세</h1>
        <p>선택한 게시글의 전체 내용을 확인할 수 있습니다.</p>
      </div>

      <button class="secondary-button" type="button" @click="$router.push('/board/list')">
        목록보기
      </button>
    </div>

    <div v-if="errorMessage" class="message-box error">
      {{ errorMessage }}
    </div>

    <div v-if="isLoading" class="card empty-state">게시글을 불러오는 중입니다...</div>

    <article v-else-if="post" class="card">
      <span class="detail-meta">게시글 번호 {{ post.idx }}</span>
      <h2 class="detail-title">{{ post.title }}</h2>
      <p class="detail-content">{{ post.content }}</p>
    </article>
  </section>
</template>
