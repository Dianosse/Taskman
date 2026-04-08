<template>
  <div class="card">
    <h3>{{ annonce.titre }}</h3>

    <p class="category">
      {{ annonce.category }} • {{ annonce.city }}
    </p>

    <p class="description">
      {{ annonce.description }}
    </p>

    <p class="price">
      {{ annonce.tarif }} €
      <span v-if="annonce.tarif_type === 'HOURLY'">/h</span>
    </p>

    <p class="type" :class="annonce.type">
      {{ annonce.type }}
    </p>

    <button class="consult-btn" @click="goToDetail">
      CONSULTER
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  annonce: Object
})

const router = useRouter()

function goToDetail() {
  router.push(`/annonces/${props.annonce.id}`)
}
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 16px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category {
  font-size: 14px;
  color: gray;
}

.description {
  font-size: 14px;
}

.price {
  font-weight: bold;
}

.type {
  font-size: 12px;
  font-weight: bold;
}

.type.OFFER {
  color: green;
}

.type.REQUEST {
  color: orange;
}

.consult-btn {
  margin-top: auto;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: black;
  color: white;
  cursor: pointer;
}

.consult-btn:hover {
  background: #333;
}
</style>