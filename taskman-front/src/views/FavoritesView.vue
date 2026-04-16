<template>
  <div>
    <Navbar />

    <main class="favorites-page">
      <div v-if="loading" class="state-message">
        Chargement...
      </div>

      <div v-else-if="error" class="state-message error">
        {{ error }}
      </div>

      <div v-else>
        <section class="header">
          <h1>Mes favoris</h1>
          <p class="subtitle">Retrouve ici toutes les annonces que tu as enregistrées.</p>
        </section>

        <div v-if="favoris.length === 0" class="empty-state">
          Aucune annonce en favoris pour le moment.
        </div>

        <div v-else class="annonces-grid">
          <AnnonceCard
              v-for="annonce in favoris"
              :key="annonce.id"
              :annonce="annonce"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import AnnonceCard from '@/components/AnnonceCard.vue'
import { getMesFavoris } from '@/services/favoris.service'

const favoris = ref([])
const loading = ref(true)
const error = ref('')

async function fetchFavoris() {
  try {
    const res = await getMesFavoris()

    if (!res.success) {
      throw new Error('Impossible de récupérer les favoris')
    }

    favoris.value = res.data.allFavoris
  } catch (err) {
    error.value = err.response?.data?.error || err.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

onMounted(fetchFavoris)
</script>

<style scoped>
.favorites-page {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px 40px;
}

.header {
  margin-bottom: 24px;
}

.header h1 {
  margin: 0 0 8px 0;
}

.subtitle {
  margin: 0;
  color: #666;
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

.annonces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
</style>