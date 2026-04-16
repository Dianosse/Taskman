<template>
  <div>
    <Navbar />

    <main class="profile-page">
      <div v-if="loading" class="state-message">
        Chargement...
      </div>

      <div v-else-if="error" class="state-message error">
        {{ error }}
      </div>

      <div v-else>
        <section class="profile-header">
          <div class="profile-info">
            <h1>{{ user.username }}</h1>
            <p class="email">{{ user.email }}</p>
            <p class="bio">{{ user.bio }}</p>
          </div>

          <div class="profile-actions">
            <router-link to="/profile/edit" class="action-btn">
              Modifier mon profil
            </router-link>

            <router-link to="/favorites" class="action-btn">
              Mes favoris
            </router-link>

            <router-link to="/conversations" class="action-btn">
              Mes conversations
            </router-link>
          </div>
        </section>

        <section class="annonces-section">
          <div class="section-header">
            <h2>Mes annonces</h2>
            <router-link to="/annonces/create" class="create-btn">
              Publier une annonce
            </router-link>
          </div>

          <div v-if="mesAnnonces.length === 0" class="empty-state">
            Vous n'avez encore publié aucune annonce.
          </div>

          <div v-else class="annonces-grid">
            <AnnonceCard
                v-for="annonce in mesAnnonces"
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
import Navbar from '@/components/Navbar.vue'
import AnnonceCard from '@/components/AnnonceCard.vue'
import { getMyProfile, getMyAnnonces } from '@/services/users.service'

const user = ref(null)
const mesAnnonces = ref([])
const loading = ref(true)
const error = ref('')

async function fetchProfileData() {
  try {
    const [profileRes, annoncesRes] = await Promise.all([
      getMyProfile(),
      getMyAnnonces()
    ])

    if (!profileRes.success) {
      throw new Error('Impossible de récupérer le profil')
    }

    if (!annoncesRes.success) {
      throw new Error('Impossible de récupérer les annonces')
    }

    user.value = profileRes.data
    mesAnnonces.value = annoncesRes.data.mesAnnonces
  } catch (err) {
    error.value = err.response?.data?.error || err.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProfileData)
</script>

<style scoped>
.profile-page {
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

.profile-header {
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

.profile-info h1 {
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

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 220px;
}

.action-btn {
  display: inline-block;
  padding: 10px 14px;
  border: 1px solid darkorange;
  border-radius: 8px;
  text-decoration: none;
  color: darkblue;
  text-align: center;
  font-weight: 500;
  background: white;
}

.action-btn:hover {
  background: darkorange;
  color: darkblue;
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

.create-btn {
  padding: 10px 14px;
  border-radius: 8px;
  text-decoration: none;
  background: darkorange;
  color: darkblue;
  font-weight: 500;
}

.create-btn:hover {
  background: darkblue;
  color: darkorange;
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