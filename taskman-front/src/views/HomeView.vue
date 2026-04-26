<template>
  <div>
    <Navbar />

    <main class="home">
      <h1>Liste des annonces</h1>

      <section class="filters">
        <select v-model="filters.type">
          <option value="">Tous les types</option>
          <option value="OFFER">Offre</option>
          <option value="REQUEST">Demande</option>
        </select>

        <select v-model="filters.category">
          <option value="">Toutes les catégories</option>
          <option
              v-for="category in categories"
              :key="category"
              :value="category"
          >
            {{ category }}
          </option>
        </select>

        <input
            v-model.trim="filters.city"
            type="text"
            placeholder="Ville"
        />

        <select v-model="filters.sort">
          <option value="">Tri par défaut</option>
          <option value="recent">Plus récent</option>
          <option value="price_asc">Tarif croissant</option>
          <option value="price_desc">Tarif décroissant</option>
        </select>

        <button @click="applyFilters">
          Rechercher
        </button>

        <button @click="resetFilters" class="reset-btn">
          Réinitialiser
        </button>
      </section>

      <p v-if="activeSearch" class="search-info">
        Résultats pour : {{ activeSearch }}
      </p>

      <div v-if="annonces.length === 0" class="empty-state">
        Aucune annonce trouvée.
      </div>

      <div v-else class="grid">
        <AnnonceCard
            v-for="annonce in annonces"
            :key="annonce.id"
            :annonce="annonce"
        />
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="page === 1">
          Précédent
        </button>

        <span>Page {{ page }} / {{ totalPages }}</span>

        <button @click="nextPage" :disabled="page === totalPages">
          Suivant
        </button>
      </div>

      <div class="limit-picker">
        <p>Nombre d'annonces par page :</p>

        <div class="limit-buttons">
          <button
              v-for="value in limitOptions"
              :key="value"
              @click="changeLimit(value)"
              :class="{ active: limit === value }"
              class="limit-button"
          >
            {{ value }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import Navbar from '@/components/Navbar.vue'
import AnnonceCard from '@/components/AnnonceCard.vue'
import { getAnnonces, getCategories } from '@/services/annonces.service'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const annonces = ref([])
const categories = ref([])

const page = ref(1)
const limit = ref(8)
const totalPages = ref(1)
const limitOptions = [8, 16, 24, 32]

const filters = ref({
  search: '',
  type: '',
  category: '',
  city: '',
  sort: ''
})

const activeSearch = computed(() => route.query.search || '')

function syncFiltersFromRoute() {
  filters.value.search = route.query.search || ''
  filters.value.type = route.query.type || ''
  filters.value.category = route.query.category || ''
  filters.value.city = route.query.city || ''
  filters.value.sort = route.query.sort || ''
}

async function fetchCategories() {
  try {
    const res = await getCategories()

    if (res.success) {
      categories.value = res.data.categories
    }
  } catch (err) {
    console.error(err)
  }
}

async function fetchAnnonces() {
  try {
    const res = await getAnnonces(page.value, limit.value, {
      search: route.query.search || '',
      type: route.query.type || '',
      category: route.query.category || '',
      city: route.query.city || '',
      sort: route.query.sort || ''
    })

    annonces.value = res.data.annonces
    totalPages.value = res.pagination.totalPages || 1
  } catch (err) {
    console.error(err)
  }
}

function applyFilters() {
  page.value = 1

  const query = {}

  if (filters.value.search) query.search = filters.value.search
  if (filters.value.type) query.type = filters.value.type
  if (filters.value.category) query.category = filters.value.category
  if (filters.value.city) query.city = filters.value.city
  if (filters.value.sort) query.sort = filters.value.sort

  router.push({
    path: '/',
    query
  })
}

function resetFilters() {
  filters.value = {
    search: '',
    type: '',
    category: '',
    city: '',
    sort: ''
  }

  page.value = 1
  router.push({ path: '/' })
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value--
  }
}

async function changeLimit(newLimit) {
  if (limit.value === newLimit) {
    return
  }

  limit.value = newLimit
  page.value = 1
  await fetchAnnonces()
}

onMounted(async () => {
  syncFiltersFromRoute()
  await fetchCategories()
  await fetchAnnonces()
})

watch(page, fetchAnnonces)

watch(
    () => route.query,
    async () => {
      page.value = 1
      syncFiltersFromRoute()
      await fetchAnnonces()
    }
)
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}

.filters {
  margin-top: 20px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: white;
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 12px;
}

.filters input,
.filters select {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.filters button {
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: darkorange;
  color: darkblue;
  cursor: pointer;
  font-weight: 600;
}

.filters button:hover {
  background: darkblue;
  color: darkorange;
}

.reset-btn {
  background: #111 !important;
  color: white !important;
}

.search-info {
  margin-top: 16px;
  color: #666;
  font-weight: 500;
}

.empty-state {
  margin-top: 20px;
  padding: 30px 20px;
  text-align: center;
  border: 1px dashed #ccc;
  border-radius: 12px;
  color: #666;
  background: #fafafa;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.limit-picker {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.limit-picker p {
  margin: 0;
  font-weight: 500;
}

.limit-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.limit-button {
  padding: 8px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.limit-button.active {
  border-color: black;
  font-weight: 700;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>