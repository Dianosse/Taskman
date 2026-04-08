<template>
  <div>
    <Navbar />

    <main class="home">
      <h1>Liste des annonces</h1>

      <div class="grid">
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
import { ref, onMounted, watch } from 'vue'
import Navbar from '@/components/Navbar.vue'
import AnnonceCard from '@/components/AnnonceCard.vue'
import { getAnnonces } from '@/services/annonces.service'
import { useRoute } from 'vue-router'

const annonces = ref([])
const page = ref(1)
const limit = ref(8)
const totalPages = ref(1)
const route = useRoute()

const limitOptions = [8, 16, 24, 32]

async function fetchAnnonces() {
  try {
    const search = route.query.search || ''

    const res = await getAnnonces(page.value, limit.value, search)

    annonces.value = res.data.annonces
    totalPages.value = res.pagination.totalPages
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchAnnonces)

watch(page, fetchAnnonces)

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

watch(() => route.query.search, () => {
  page.value = 1
  fetchAnnonces()
})

</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
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