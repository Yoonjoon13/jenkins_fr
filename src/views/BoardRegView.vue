<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createBoardPost } from '@/api/board'

const router = useRouter()

const form = reactive({
  title: '',
  content: '',
})

const isSubmitting = ref(false)
const errorMessage = ref('')

async function submitForm() {
  const title = form.title.trim()
  const content = form.content.trim()

  if (!title || !content) {
    errorMessage.value = '제목과 내용을 모두 입력해 주세요.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const response = await createBoardPost({ title, content })
    alert(response.message)
    await router.push('/board/list')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '게시글 저장에 실패했습니다.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="panel">
    <div class="panel-header">
      <div class="panel-title">
        <h1>게시글 등록</h1>
        <p>제목과 내용을 입력하면 DB에 게시글이 저장됩니다.</p>
      </div>

      <button class="secondary-button" type="button" @click="$router.push('/board/list')">
        목록으로
      </button>
    </div>

    <div v-if="errorMessage" class="message-box error">
      {{ errorMessage }}
    </div>

    <form class="card form-grid" @submit.prevent="submitForm">
      <div class="field">
        <label for="title">제목</label>
        <input id="title" v-model="form.title" type="text" maxlength="200" />
      </div>

      <div class="field">
        <label for="content">내용</label>
        <textarea id="content" v-model="form.content" />
      </div>

      <div class="button-row">
        <button class="primary-button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? '저장 중...' : '저장' }}
        </button>
        <button class="secondary-button" type="button" :disabled="isSubmitting" @click="$router.push('/board/list')">
          취소
        </button>
      </div>
    </form>
  </section>
</template>
