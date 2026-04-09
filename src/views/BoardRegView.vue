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
    errorMessage.value = 'Please enter both title and content.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const response = await createBoardPost({ title, content })
    alert(response.message)
    await router.push('/board/list')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to save post.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="panel">
    <div class="panel-header">
      <div class="panel-title">
        <h1>Create Post</h1>
        <p>Enter a title and content to store a new post in the database.</p>
      </div>

      <button class="secondary-button" type="button" @click="$router.push('/board/list')">
        Back to List
      </button>
    </div>

    <div v-if="errorMessage" class="message-box error">
      {{ errorMessage }}
    </div>

    <form class="card form-grid" @submit.prevent="submitForm">
      <div class="field">
        <label for="title">Title</label>
        <input id="title" v-model="form.title" type="text" maxlength="200" />
      </div>

      <div class="field">
        <label for="content">Content</label>
        <textarea id="content" v-model="form.content" />
      </div>

      <div class="button-row">
        <button class="primary-button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : 'Save' }}
        </button>
        <button class="secondary-button" type="button" :disabled="isSubmitting" @click="$router.push('/board/list')">
          Cancel
        </button>
      </div>
    </form>
  </section>
</template>
