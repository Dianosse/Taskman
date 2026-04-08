<template>
  <div class="container">

    <div v-if="loading" class="loading">
      Chargement...
    </div>

    <div v-else-if="error" class="error">
      <h2>{{ error }}</h2>
      <router-link to="/">Retour à l'accueil</router-link>
    </div>

    <div v-else-if="annonce">
      <h1>{{ annonce.titre }}</h1>

      <p class="meta">
        {{ annonce.category }} • {{ annonce.city }}
      </p>

      <p class="description">
        {{ annonce.description }}
      </p>

      <div class="info">
        <p><strong>Type :</strong> {{ annonce.type }}</p>
        <p><strong>Disponibilité :</strong> {{ annonce.availability }}</p>
        <p><strong>Modalité :</strong> {{ annonce.modality }}</p>
      </div>

      <div class="price">
        <strong>{{ annonce.tarif }} €</strong>
        <span v-if="annonce.tarif_type === 'HOURLY'"> / heure</span>
      </div>

      <button class="contact-btn">
        Contacter
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAnnonceById } from '@/services/annonces.service'

const route = useRoute()

const annonce = ref(null)
const loading = ref(true)
const error = ref(null)

async function fetchAnnonce() {
  try {
    const id = route.params.id

    const res = await getAnnonceById(id)

    if (!res.success) {
      error.value = res.error || "Annonce introuvable"
      return
    }

    annonce.value = res.data.annonce

  } catch (err) {
    error.value = err.response?.data?.error || "Erreur serveur"
  } finally {
    loading.value = false
  }
}

onMounted(fetchAnnonce)
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.loading {
  text-align: center;
  margin-top: 50px;
}

.error {
  text-align: center;
  color: red;
}

.meta {
  color: gray;
}

.description {
  margin: 20px 0;
}

.price {
  font-size: 20px;
  font-weight: bold;
  margin: 20px 0;
}

.contact-btn {
  padding: 12px 16px;
  background: black;
  color: white;
  border: none;
  border-radius: 8px;
}
</style>