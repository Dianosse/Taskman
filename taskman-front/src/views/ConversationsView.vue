<template>
  <div>
    <Navbar />

    <main class="conversations-page">
      <h1>Mes conversations</h1>

      <div v-if="loading" class="state-message">
        Chargement...
      </div>

      <div v-else-if="error" class="state-message error">
        {{ error }}
      </div>

      <div v-else-if="conversations.length === 0" class="empty-state">
        Aucune conversation pour le moment.
      </div>

      <div v-else class="conversations-list">
        <router-link
            v-for="conversation in conversations"
            :key="conversation.id"
            :to="`/conversations/${conversation.id}`"
            class="conversation-card"
        >
          <h2>
            Discussion avec {{ getOtherUsername(conversation) }}
          </h2>

          <p>
            <strong>Annonce :</strong> {{ conversation.titre_annonce }}
          </p>

          <p class="open-text">Ouvrir la conversation</p>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { getMyConversations } from '@/services/conversations.service'

const conversations = ref([])
const loading = ref(true)
const error = ref('')
const currentUser = ref(null)

function getOtherUsername(conversation) {
  if (!currentUser.value) {
    return 'utilisateur'
  }

  if (conversation.email1 === currentUser.value.email) {
    return conversation.username2
  }

  return conversation.username1
}

async function fetchConversations() {
  try {
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      currentUser.value = JSON.parse(storedUser)
    }

    const res = await getMyConversations()

    if (!res.success) {
      throw new Error('Impossible de récupérer les conversations')
    }

    conversations.value = res.data.allMyConversation
  } catch (err) {
    error.value =
        err.response?.data?.error || err.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

onMounted(fetchConversations)
</script>

<style scoped>
.conversations-page {
  max-width: 900px;
  margin: 30px auto;
  padding: 0 20px 40px;
}

.conversations-page h1 {
  margin-bottom: 24px;
}

.state-message {
  margin-top: 40px;
  text-align: center;
  font-size: 18px;
}

.error {
  color: red;
}

.empty-state {
  padding: 30px 20px;
  text-align: center;
  border: 1px dashed #ccc;
  border-radius: 12px;
  color: #666;
  background: #fafafa;
}

.conversations-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.conversation-card {
  display: block;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: white;
  text-decoration: none;
  color: black;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.conversation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.conversation-card h2 {
  margin: 0 0 12px 0;
  font-size: 20px;
}

.conversation-card p {
  margin: 6px 0;
}

.open-text {
  margin-top: 14px;
  font-weight: 600;
}
</style>