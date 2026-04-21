<template>
  <div>
    <Navbar />

    <main class="edit-page">
      <section class="card">
        <h1>Modifier l'annonce</h1>

        <div v-if="loading" class="state-message">
          Chargement...
        </div>

        <div v-else>
          <form @submit.prevent="handleSubmit" class="form">
            <input v-model.trim="titre" placeholder="Titre" required />

            <textarea
                v-model.trim="description"
                placeholder="Description"
                rows="4"
                required
            />

            <select v-model="type">
              <option value="OFFER">Offre</option>
              <option value="REQUEST">Demande</option>
            </select>

            <input v-model.trim="city" placeholder="Ville" required />

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

            <input v-model.trim="availability" placeholder="Disponibilité" required />

            <select v-model="tarif_type">
              <option value="FREE">Gratuit</option>
              <option value="HOURLY">Horaire</option>
              <option value="FIXED">Forfait</option>
            </select>

            <input
                v-if="tarif_type !== 'FREE'"
                v-model.number="tarif"
                type="number"
                min="0"
                placeholder="Prix"
            />

            <select v-model="modality">
              <option value="REMOTE">À distance</option>
              <option value="AT_PROVIDER">Chez le prestataire</option>
              <option value="AT_CUSTOMER">Chez le client</option>
            </select>

            <select v-model="status">
              <option value="DRAFT">Brouillon</option>
              <option value="PUBLISHED">Publié</option>
            </select>

            <p v-if="successMessage" class="success-message">
              {{ successMessage }}
            </p>

            <p v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </p>

            <div class="actions">
              <router-link :to="`/annonces/${annonceId}`" class="secondary-btn">
                Annuler
              </router-link>

              <button type="submit" class="primary-btn" :disabled="saving">
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { getAnnonceById, updateAnnonce, getCategories } from '@/services/annonces.service'

const route = useRoute()
const router = useRouter()

const annonceId = route.params.id

const loading = ref(true)
const saving = ref(false)

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

const errorMessage = ref('')
const successMessage = ref('')

function validateForm() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!titre.value || titre.value.length < 3) {
    errorMessage.value = 'Titre invalide'
    return false
  }

  if (!description.value.trim()) {
    errorMessage.value = 'Description invalide'
    return false
  }

  if (!category.value) {
    errorMessage.value = 'Catégorie invalide'
    return false
  }

  if (!city.value.trim()) {
    errorMessage.value = 'Ville invalide'
    return false
  }

  if (!availability.value.trim()) {
    errorMessage.value = 'Disponibilité invalide'
    return false
  }

  if (tarif_type.value === 'FREE') {
    tarif.value = 0
  }

  if (tarif_type.value !== 'FREE' && (!tarif.value || tarif.value <= 0)) {
    errorMessage.value = 'Le tarif doit être supérieur à 0'
    return false
  }

  if (tarif.value < 0) {
    errorMessage.value = 'Tarif invalide'
    return false
  }

  return true
}

async function fetchCategories() {
  const res = await getCategories()

  if (!res.success) {
    throw new Error('Impossible de récupérer les catégories')
  }

  categories.value = res.data.categories
}

async function fetchAnnonce() {
  try {
    const [categoriesRes, annonceRes] = await Promise.all([
      getCategories(),
      getAnnonceById(annonceId)
    ])

    if (!categoriesRes.success) {
      throw new Error('Impossible de récupérer les catégories')
    }

    categories.value = categoriesRes.data.categories

    if (!annonceRes.success) {
      throw new Error("Impossible de récupérer l'annonce")
    }

    const annonceData = annonceRes.data.annonce.annonce

    titre.value = annonceData.titre
    description.value = annonceData.description
    type.value = annonceData.type
    city.value = annonceData.city
    category.value = annonceData.category
    availability.value = annonceData.availability
    tarif_type.value = annonceData.tarif_type
    tarif.value = Number(annonceData.tarif)
    modality.value = annonceData.modality
    status.value = annonceData.status
  } catch (err) {
    errorMessage.value =
        err.response?.data?.error || err.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  try {
    if (!validateForm()) {
      return
    }

    saving.value = true
    errorMessage.value = ''
    successMessage.value = ''

    const res = await updateAnnonce(annonceId, {
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
      throw new Error("Impossible de modifier l'annonce")
    }

    successMessage.value = 'Annonce modifiée avec succès'

    setTimeout(() => {
      router.push(`/annonces/${annonceId}`)
    }, 800)
  } catch (err) {
    errorMessage.value =
        err.response?.data?.error || err.message || 'Une erreur est survenue'
  } finally {
    saving.value = false
  }
}

onMounted(fetchAnnonce)
</script>

<style scoped>
.edit-page {
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

.state-message {
  text-align: center;
  font-size: 18px;
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
  padding: 10px 14px;
  border: 1px solid black;
  border-radius: 8px;
  text-decoration: none;
  color: black;
}

.primary-btn {
  padding: 10px 14px;
  background: black;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.success-message {
  color: green;
  font-weight: 600;
  margin: 0;
}

.error-message {
  color: red;
  font-weight: 600;
  margin: 0;
}
</style>