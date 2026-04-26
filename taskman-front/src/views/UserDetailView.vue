<template>
  <div>
    <Navbar />

    <main class="user-page">
      <div v-if="loading" class="state-message">
        Chargement...
      </div>

      <div v-else-if="error" class="state-message error">
        {{ error }}
      </div>

      <div v-else-if="user">
        <section class="user-header">
          <div class="user-info">
            <h1>{{ user.username }}</h1>
            <p class="email">{{ user.email }}</p>
            <p class="bio">{{ user.bio || 'Aucune bio renseignée.' }}</p>
            <p class="city"> {{ user.city || 'Aucune ville renseignée'}}</p>
          </div>

          <div class="user-actions">
            <router-link to="/" class="action-btn">
              Retour à l'accueil
            </router-link>
          </div>
        </section>

        <section class="annonces-section">
          <div class="section-header">
            <h2>Annonces de cet utilisateur</h2>
          </div>

          <div v-if="annonces.length === 0" class="empty-state">
            Cet utilisateur n'a publié aucune annonce.
          </div>

          <div v-else class="annonces-grid">
            <AnnonceCard
                v-for="annonce in annonces"
                :key="annonce.id"
                :annonce="annonce"
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import AnnonceCard from '@/components/AnnonceCard.vue'
import { getUserById, getUserAnnonces } from '@/services/users.service'

const route = useRoute()

const user = ref(null)
const annonces = ref([])
const loading = ref(true)
const error = ref('')

async function fetchUserData() {
  try {
    const id = route.params.id

    const [userRes, annoncesRes] = await Promise.all([
      getUserById(id),
      getUserAnnonces(id)
    ])

    if (!userRes.success) {
      throw new Error("Impossible de récupérer l'utilisateur")
    }

    if (!annoncesRes.success) {
      throw new Error("Impossible de récupérer les annonces de l'utilisateur")
    }

    user.value = userRes.data

    annonces.value =
        annoncesRes.data.annonces ||
        annoncesRes.data.userAnnonces ||
        annoncesRes.data.allAnnonces ||
        []
  } catch (err) {
    error.value =
        err.response?.data?.error || err.message || "Une erreur est survenue"
  } finally {
    loading.value = false
  }
}

onMounted(fetchUserData)
</script>

<style scoped>
.user-page {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px 40px;
}

.state-message {
  margin-top: 40px;
  text-align: center;
  font-size: 18px;
}

.error {
  color: red;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
  margin-bottom: 40px;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: white;
}

.user-info h1 {
  margin: 0 0 10px 0;
}

.email {
  margin: 0 0 12px 0;
  color: #666;
}

.bio {
  margin: 0;
  line-height: 1.5;
}

.city {
  margin: 0;
  line-height: 1.5;
}

.user-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 200px;
}

.action-btn {
  display: inline-block;
  padding: 10px 14px;
  border: 1px solid #111;
  border-radius: 8px;
  text-decoration: none;
  color: #111;
  text-align: center;
  font-weight: 500;
  background: white;
}

.annonces-section {
  margin-top: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
}

.empty-state {
  padding: 30px 20px;
  text-align: center;
  border: 1px dashed #ccc;
  border-radius: 12px;
  color: #666;
  background: #fafafa;
}

.annonces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
</style>