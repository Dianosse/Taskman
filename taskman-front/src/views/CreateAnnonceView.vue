<template>
  <div>
    <Navbar />

    <main class="create-page">
      <section class="card">
        <h1>Créer une annonce</h1>

        <form @submit.prevent="handleSubmit" class="form">
          <input v-model="titre" placeholder="Titre" required />

          <textarea
              v-model="description"
              placeholder="Description"
              rows="4"
              required
          />

          <select v-model="type">
            <option value="OFFER">Offre</option>
            <option value="REQUEST">Demande</option>
          </select>

          <input v-model="city" placeholder="Ville" required />

          <select v-model="category" required>
            <option disabled value="">Sélectionner une catégorie</option>
            <option
                v-for="item in categories"
                :key="item"
                :value="item"
            >
              {{ item }}
            </option>
          </select>

          <input v-model="availability" placeholder="Disponibilité" required />

          <select v-model="tarif_type">
            <option value="FREE">Gratuit</option>
            <option value="HOURLY">Horaire</option>
            <option value="FIXED">Forfait</option>
          </select>

          <input
              v-if="tarif_type !== 'FREE'"
              v-model.number="tarif"
              type="number"
              placeholder="Prix"
          />

          <select v-model="modality">
            <option value="AT_CUSTOMER">Chez le client</option>
            <option value="REMOTE">À distance</option>
            <option value="IN_PERSON">Présentiel</option>
          </select>

          <select v-model="status">
            <option value="DRAFT">Brouillon</option>
            <option value="PUBLISHED">Publié</option>
          </select>

          <p v-if="error" class="error">{{ error }}</p>

          <div class="actions">
            <router-link to="/" class="secondary-btn">Annuler</router-link>

            <button type="submit" :disabled="loading">
              {{ loading ? 'Création...' : 'Créer' }}
            </button>
          </div>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { createAnnonce, getCategories } from '@/services/annonces.service'

const router = useRouter()

const titre = ref('')
const description = ref('')
const type = ref('OFFER')
const city = ref('')
const category = ref('')
const availability = ref('')
const tarif_type = ref('FREE')
const tarif = ref(0)
const modality = ref('AT_CUSTOMER')
const status = ref('DRAFT')

const categories = ref([])

const error = ref('')
const loading = ref(false)

async function fetchCategories() {
  try {
    const res = await getCategories()

    if (!res.success) {
      throw new Error('Impossible de récupérer les catégories')
    }

    categories.value = res.data.categories
  } catch (err) {
    error.value =
        err.response?.data?.error || err.message || 'Erreur lors du chargement des catégories'
  }
}

function validate() {
  error.value = ''

  if (!titre.value || !description.value) {
    error.value = 'Titre et description requis'
    return false
  }

  if (!category.value) {
    error.value = 'Catégorie requise'
    return false
  }

  if (tarif_type.value !== 'FREE' && (!tarif.value || tarif.value < 0)) {
    error.value = 'Prix invalide'
    return false
  }

  return true
}

async function handleSubmit() {
  try {
    if (!validate()) return

    loading.value = true

    const res = await createAnnonce({
      titre: titre.value,
      description: description.value,
      type: type.value,
      city: city.value,
      category: category.value,
      availability: availability.value,
      tarif_type: tarif_type.value,
      tarif: tarif_type.value === 'FREE' ? 0 : tarif.value,
      modality: modality.value,
      status: status.value
    })

    if (!res.success) {
      throw new Error('Erreur création annonce')
    }

    const id = res.data.annonce.id

    router.push(`/annonces/${id}`)
  } catch (err) {
    error.value =
        err.response?.data?.error || err.message || 'Erreur lors de la création'
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)
</script>

<style scoped>
.create-page {
  max-width: 700px;
  margin: 30px auto;
  padding: 20px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 16px;
  padding: 24px;
  background: white;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input,
textarea,
select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.secondary-btn {
  padding: 10px;
  border: 1px solid black;
  border-radius: 8px;
  text-decoration: none;
  color: black;
}

button {
  padding: 10px;
  background: darkorange;
  color: darkblue;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background: darkblue;
  color: darkorange;
}

.error {
  color: red;
}
</style>