<template>
  <Navbar />

  <div class="container">
    <div v-if="loading" class="loading">
      Chargement...
    </div>

    <div v-else-if="error" class="error-box">
      <h2>{{ error }}</h2>
      <router-link to="/" class="back-link">Retour à l'accueil</router-link>
    </div>

    <div v-else-if="annonce" class="annonce-card">
      <div class="header">
        <div>
          <span class="type-badge" :class="annonce.annonce.type">
            {{ annonce.annonce.type === 'OFFER' ? 'Offre' : 'Demande' }}
          </span>
          <h1>{{ annonce.annonce.titre }}</h1>
          <p class="meta">{{ annonce.annonce.category }} • {{ annonce.annonce.city }}</p>
        </div>

        <div class="price-box">
          <span class="price-value">{{ annonce.annonce.tarif }} €</span>
          <span v-if="annonce.annonce.tarif_type === 'HOURLY'" class="price-type"> / heure</span>
          <span v-else-if="annonce.annonce.tarif_type === 'FIXED'" class="price-type"> / forfait</span>
          <span v-else class="price-type"> gratuit</span>
        </div>
      </div>

      <section class="section">
        <h2>Description</h2>
        <p class="description">{{ annonce.annonce.description }}</p>
      </section>

      <section class="section infos-grid">
        <div class="info-item">
          <span class="info-label">Type</span>
          <span class="info-value">{{ annonce.annonce.type }}</span>
        </div>

        <div class="info-item">
          <span class="info-label">Disponibilité</span>
          <span class="info-value">{{ annonce.annonce.availability }}</span>
        </div>

        <div class="info-item">
          <span class="info-label">Modalité</span>
          <span class="info-value">{{ formattedModality }}</span>
        </div>

        <div class="info-item">
          <span class="info-label">Catégorie</span>
          <span class="info-value">{{ annonce.annonce.category }}</span>
        </div>

        <div class="info-item">
          <span class="info-label">Ville</span>
          <span class="info-value">{{ annonce.annonce.city }}</span>
        </div>

        <div class="info-item">
          <span class="info-label">Statut</span>
          <span class="info-value">{{ annonce.annonce.status }}</span>
        </div>
      </section>

      <section class="section publisher-box">
        <h2>Annonce publiée par {{ annonce.creator.username }}</h2>

        <router-link :to="`/users/${annonce.creator.id}`" class="publisher-link">
          Voir le profil
        </router-link>
      </section>

      <p v-if="favoriteSuccess" class="success-message">
        {{ favoriteSuccess }}
      </p>

      <p v-if="favoriteError" class="favorite-error">
        {{ favoriteError }}
      </p>

      <div class="actions">
        <router-link to="/" class="secondary-btn">
          Retour
        </router-link>

        <button
            v-if="currentUser && !isOwnAnnonce && !isFavorite"
            class="favorite-btn"
            @click="handleAddFavori"
            :disabled="favoriteLoading"
        >
          {{ favoriteLoading ? 'Ajout...' : 'Ajouter aux favoris' }}
        </button>

        <button
            v-if="currentUser && !isOwnAnnonce && isFavorite"
            class="remove-favorite-btn"
            @click="handleRemoveFavori"
            :disabled="favoriteLoading"
        >
          {{ favoriteLoading ? 'Suppression...' : 'Supprimer des favoris' }}
        </button>

        <button
            v-if="currentUser && !isOwnAnnonce"
            class="contact-btn"
        >
          Contacter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAnnonceById } from '@/services/annonces.service'
import { addFavori, getMesFavoris, removeFavori } from '@/services/favoris.service'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()

const annonce = ref(null)
const loading = ref(true)
const error = ref(null)
const currentUser = ref(null)

const favoriteLoading = ref(false)
const favoriteSuccess = ref('')
const favoriteError = ref('')
const isFavorite = ref(false)

const isOwnAnnonce = computed(() => {
  if (!currentUser.value || !annonce.value) {
    return false
  }

  return currentUser.value.id === annonce.value.annonce.id_creator
})

const formattedModality = computed(() => {
  if (!annonce.value) {
    return ''
  }

  if (annonce.value.annonce.modality === 'AT_CUSTOMER') {
    return 'Chez le client'
  }

  if (annonce.value.annonce.modality === 'REMOTE') {
    return 'À distance'
  }

  if (annonce.value.annonce.modality === 'IN_PERSON') {
    return 'En présentiel'
  }

  return annonce.value.annonce.modality
})

async function checkIfFavorite() {
  if (!currentUser.value || !annonce.value || isOwnAnnonce.value) {
    return
  }

  try {
    const res = await getMesFavoris()

    if (!res.success) {
      return
    }

    const favoris = res.data.allFavoris || []

    isFavorite.value = favoris.some(
        (favori) => favori.id === annonce.value.annonce.id
    )
  } catch {
    isFavorite.value = false
  }
}

async function fetchAnnonce() {
  try {
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      currentUser.value = JSON.parse(storedUser)
    }

    const id = route.params.id
    const res = await getAnnonceById(id)

    if (!res.success) {
      error.value = res.error || "Annonce introuvable"
      return
    }

    annonce.value = res.data.annonce

    await checkIfFavorite()
  } catch (err) {
    error.value = err.response?.data?.error || "Erreur serveur"
  } finally {
    loading.value = false
  }
}

async function handleAddFavori() {
  try {
    favoriteLoading.value = true
    favoriteSuccess.value = ''
    favoriteError.value = ''

    const res = await addFavori(annonce.value.annonce.id)

    if (!res.success) {
      throw new Error("Impossible d'ajouter aux favoris")
    }

    isFavorite.value = true
    favoriteSuccess.value = 'Annonce ajoutée aux favoris'
  } catch (err) {
    favoriteError.value = err.response?.data?.error || err.message || "Erreur lors de l'ajout aux favoris"
  } finally {
    favoriteLoading.value = false
  }
}

async function handleRemoveFavori() {
  try {
    favoriteLoading.value = true
    favoriteSuccess.value = ''
    favoriteError.value = ''

    const res = await removeFavori(annonce.value.annonce.id)

    if (!res.success) {
      throw new Error("Impossible de supprimer des favoris")
    }

    isFavorite.value = false
    favoriteSuccess.value = 'Annonce supprimée des favoris'
  } catch (err) {
    favoriteError.value = err.response?.data?.error || err.message || "Erreur lors de la suppression des favoris"
  } finally {
    favoriteLoading.value = false
  }
}

onMounted(fetchAnnonce)
</script>

<style scoped>
.container {
  max-width: 950px;
  margin: 40px auto;
  padding: 20px;
}

.loading {
  text-align: center;
  margin-top: 50px;
  font-size: 18px;
}

.error-box {
  text-align: center;
  padding: 40px 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fff;
}

.back-link {
  display: inline-block;
  margin-top: 16px;
  color: #111;
  text-decoration: none;
  font-weight: 600;
}

.annonce-card {
  border: 1px solid #ddd;
  border-radius: 16px;
  padding: 28px;
  background: white;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 28px;
}

.header h1 {
  margin: 12px 0 8px;
  font-size: 32px;
}

.meta {
  margin: 0;
  color: #666;
  font-size: 15px;
}

.type-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

.type-badge.OFFER {
  background: #e9f8ee;
  color: #1f7a39;
}

.type-badge.REQUEST {
  background: #fff1e8;
  color: #c45a14;
}

.price-box {
  min-width: 150px;
  text-align: right;
}

.price-value {
  font-size: 30px;
  font-weight: 700;
}

.price-type {
  display: block;
  margin-top: 4px;
  color: #666;
}

.section {
  margin-top: 28px;
}

.section h2 {
  margin: 0 0 12px;
  font-size: 20px;
}

.description {
  margin: 0;
  line-height: 1.6;
  color: #222;
}

.infos-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.info-item {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 14px;
  background: #fafafa;
}

.info-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #666;
}

.info-value {
  font-weight: 600;
  color: #111;
}

.publisher-box {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 18px;
  background: #fafafa;
}

.publisher-link {
  text-decoration: none;
  font-weight: 600;
  color: #111;
}

.success-message {
  margin-top: 20px;
  color: green;
  font-weight: 600;
}

.favorite-error {
  margin-top: 20px;
  color: red;
  font-weight: 600;
}

.actions {
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  flex-wrap: wrap;
}

.secondary-btn {
  padding: 12px 16px;
  border: 1px solid #111;
  border-radius: 8px;
  text-decoration: none;
  color: #111;
  font-weight: 600;
}

.favorite-btn {
  padding: 12px 18px;
  background: white;
  color: #111;
  border: 1px solid #111;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

.favorite-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.remove-favorite-btn {
  padding: 12px 18px;
  background: #111;
  color: white;
  border: 1px solid #111;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

.remove-favorite-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.contact-btn {
  padding: 12px 18px;
  background: darkorange;
  color: darkblue;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

.contact-btn:hover {
  background: darkblue;
  color: darkorange;
}
</style>