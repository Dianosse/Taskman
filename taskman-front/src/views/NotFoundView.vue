<template>
  <div class="container">
    <h1>404</h1>
    <p>Page non trouvée</p>

    <router-link to="/" class="home-link">
      Retour à l'accueil
    </router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.container {
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

h1 {
  font-size: 64px;
  margin: 0;
}

p {
  font-size: 18px;
  color: gray;
}

.home-link {
  margin-top: 10px;
  padding: 10px 16px;
  border: 1px solid black;
  border-radius: 8px;
  text-decoration: none;
  color: black;
}
</style>