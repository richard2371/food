<template>
  <VContainer fluid class="pa-4">
    <VRow dense>
      <VCol
        v-for="cat in categorias"
        :key="cat.title"
        cols="12"
        sm="6"
        md="4"
      >
        <VCard
          class="d-flex flex-column align-center justify-center pa-6 rounded-xl elevation-4 hoverable"
          color="green-lighten-4"
          height="200"
          :to="cat.to"
          ripple
        >
          <VIcon size="48" class="mb-4" color="green-darken-3">
            {{ cat.icon }}
          </VIcon>
          <div class="text-h6 font-weight-bold">{{ cat.title }}</div>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup>
const categorias = [
  { title: 'Desayunos', icon: 'mdi-coffee', to: '/recetas/desayunos' },
  { title: 'Refacciones', icon: 'mdi-food-croissant', to: '/recetas/refacciones' },
  { title: 'Almuerzos', icon: 'mdi-food-steak', to: '/recetas/almuerzos' },
  { title: 'Merienda', icon: 'mdi-food-apple', to: '/recetas/merienda' },
  { title: 'Cena', icon: 'mdi-food-turkey', to: '/recetas/cena' }
]
</script>

<style scoped>
.v-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}
</style>
