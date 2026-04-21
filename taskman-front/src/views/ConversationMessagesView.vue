<template>
  <div>
    <Navbar />

    <main class="conversation-page">
      <div class="conversation-header">
        <h1>Conversation</h1>

        <router-link to="/conversations" class="back-link">
          Retour aux conversations
        </router-link>
      </div>

      <div v-if="loading" class="state-message">
        Chargement...
      </div>

      <div v-else-if="error" class="state-message error">
        {{ error }}
      </div>

      <div v-else class="conversation-wrapper">
        <div v-if="messages.length === 0" class="empty-state">
          Aucun message dans cette conversation.
        </div>

        <div v-else class="messages-list" ref="messagesContainer">
          <div
              v-for="message in messages"
              :key="message.id"
              class="message-row"
              :class="{ mine: isMyMessage(message) }"
          >
            <div class="message-bubble">
              <p class="message-content">{{ message.content }}</p>
              <p class="message-date">{{ formatDate(message.created_at) }}</p>
            </div>
          </div>
        </div>

        <form class="message-form" @submit.prevent="handleSendMessage">
          <input
              v-model.trim="newMessage"
              type="text"
              placeholder="Écrire un message..."
              class="message-input"
          />

          <button type="submit" class="send-btn" :disabled="sending">
            {{ sending ? 'Envoi...' : 'Envoyer' }}
          </button>
        </form>

        <p v-if="sendError" class="send-error">
          {{ sendError }}
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { getConversationMessages, sendMessage } from '@/services/messages.service'
import socket from '@/services/socket'

const route = useRoute()

const conversationId = route.params.id
const messages = ref([])
const loading = ref(true)
const error = ref('')
const currentUser = ref(null)

const newMessage = ref('')
const sending = ref(false)
const sendError = ref('')
const messagesContainer = ref(null)

function formatDate(dateString) {
  return new Date(dateString).toLocaleString()
}

function isMyMessage(message) {
  if (!currentUser.value) {
    return false
  }

  return message.id_user === currentUser.value.id
}

async function scrollToBottom() {
  await nextTick()

  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

async function fetchMessages() {
  try {
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      currentUser.value = JSON.parse(storedUser)
    }

    const res = await getConversationMessages(conversationId)

    if (!res.success) {
      throw new Error('Impossible de récupérer les messages')
    }

    messages.value = res.data.allMessages
  } catch (err) {
    error.value =
        err.response?.data?.error || err.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}

function handleNewMessage(message) {
  if (Number(message.id_conversation) !== Number(conversationId)) {
    return
  }

  const alreadyExists = messages.value.some((item) => item.id === message.id)

  if (alreadyExists) {
    return
  }

  messages.value.push(message)
  scrollToBottom()
}

async function handleSendMessage() {
  try {
    if (!newMessage.value) {
      return
    }

    sending.value = true
    sendError.value = ''

    const content = newMessage.value

    newMessage.value = ''

    const res = await sendMessage(conversationId, {
      id_conversation: Number(conversationId),
      content
    })

    if (!res.success) {
      throw new Error("Erreur lors de l'envoi du message")
    }
  } catch (err) {
    sendError.value =
        err.response?.data?.error || err.message || "Erreur lors de l'envoi du message"
  } finally {
    sending.value = false
  }
}

onMounted(async () => {
  await fetchMessages()

  socket.emit('join_conversation', conversationId)
  socket.on('new_message', handleNewMessage)
})

onUnmounted(() => {
  socket.emit('leave_conversation', conversationId)
  socket.off('new_message', handleNewMessage)
})
</script>

<style scoped>
.conversation-page {
  max-width: 900px;
  margin: 30px auto;
  padding: 0 20px 40px;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.conversation-header h1 {
  margin: 0;
}

.back-link {
  padding: 10px 14px;
  border: 1px solid #111;
  border-radius: 8px;
  text-decoration: none;
  color: #111;
  font-weight: 600;
}

.state-message {
  margin-top: 40px;
  text-align: center;
  font-size: 18px;
}

.error {
  color: red;
}

.conversation-wrapper {
  border: 1px solid #ddd;
  border-radius: 16px;
  background: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 70vh;
}

.empty-state {
  padding: 30px 20px;
  text-align: center;
  color: #666;
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 8px;
  margin-bottom: 20px;
}

.message-row {
  display: flex;
  justify-content: flex-start;
}

.message-row.mine {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 14px;
  border-radius: 14px;
  background: #f3f3f3;
  border: 1px solid #e5e5e5;
}

.message-row.mine .message-bubble {
  background: #111;
  color: white;
  border: 1px solid #111;
}

.message-content {
  margin: 0;
  line-height: 1.5;
  word-break: break-word;
}

.message-date {
  margin: 8px 0 0 0;
  font-size: 12px;
  opacity: 0.8;
}

.message-form {
  display: flex;
  gap: 12px;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 12px 14px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.send-btn {
  padding: 12px 16px;
  background: #111;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-error {
  margin-top: 12px;
  color: red;
  font-weight: 600;
}
</style>