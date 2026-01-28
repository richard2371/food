<template>
  <VApp>
    <!-- App Bar -->
      <VAppBar height="80" flat color="green lighten-1" class="appbar-natural">
  <VAppBarNavIcon @click="drawer = !drawer" class="z-10" />
  <VToolbarTitle class="text-white z-10 font-weight-bold">
    Comidas E230 🍽️
  </VToolbarTitle>
</VAppBar>
    <!-- Drawer / Menú lateral -->
    <VNavigationDrawer v-model="drawer" app temporary>
      <VList nav density="compact">
        <VListItem prepend-icon="mdi-coffee" title="Desayunos" to="/recetas/desayunos" />
        <VListItem prepend-icon="mdi-food-croissant" title="Refacciones" to="/recetas/refacciones" />
        <VListItem prepend-icon="mdi-food-steak" title="Almuerzos" to="/recetas/almuerzos" />
        <VListItem prepend-icon="mdi-food-apple" title="Merienda" to="/recetas/merienda" />
        <VListItem prepend-icon="mdi-food-turkey" title="Cena" to="/recetas/cena" />




        <VListItem prepend-icon="mdi-silverware-fork-knife" title="Ingredientes" to="/ingredientes" />

         <VListItem prepend-icon="mdi-peanut-outline" title="Categoria ingredientes" to="/categoria" />

        <!-- <VListItem prepend-icon="mdi-check-circle-outline" title="Cocinadas" to="/cocinadas" /> -->

      </VList>
    </VNavigationDrawer>

    <!-- Contenido principal -->
    <VMain>

      <VContainer fluid class="pa-4">
        <CarritoFAB></CarritoFAB>
        <slot />
      </VContainer>
    </VMain>
  </VApp>
</template>
<style scoped>
.appbar-natural {
  position: relative;
  overflow: hidden;
}

/* Overlay de frutas y verduras en blanco */
.appbar-natural::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('https://www.transparenttextures.com/patterns/vegetables.png'); /* patrón de frutas/verduras */
  background-repeat: repeat;
  background-size: contain;
  opacity: 0.1; /* sutil para que no opaque el texto */
  z-index: 1;
}

/* Aseguramos que contenido (texto e íconos) esté encima */
.appbar-natural > * {
  position: relative;
  z-index: 2;
}
</style>
<script setup>
import CarritoFAB from '~/components/CarritoFAB.vue';
import { recetas, loadRecetas } from '@/composables/recetasData'
onMounted(async () => {
  await loadRecetas()
})
const drawer = ref(false)
</script>
