<template>
  <div>
    <VSpeedDial v-model="fab" size="large" direction="left" transition="scale-transition">
      <template #activator>
        <VBtn color="pink" fab dark @click="fab = !fab">
          <VIcon>mdi-cart</VIcon>
        </VBtn>
      </template>

      <!-- Contenedor de lista de ingredientes -->
      <VCard max-width="350" class="pa-4 rounded-xl elevation-6">
        <VCardTitle class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <VIcon class="mr-2" color="primary">mdi-cart</VIcon>
            <span class="text-h6 font-weight-medium">Lista de Compras</span>
          </div>
          <!-- <VBtn icon small color="primary" @click="listaCarrito = []">
            <VIcon>mdi-delete-sweep</VIcon>
          </VBtn> -->
        </VCardTitle>

        <VDivider class="my-2" />

        <VList dense nav>
          <VListItem v-for="(item, i) in listaCarrito" :key="i" class="rounded-lg mb-2 elevation-1 pa-2">
            <VRow align="center" class="w-100">
              <!-- Icono -->
          

              <!-- Nombre del ingrediente -->
              <VCol cols="7" class="d-flex align-center">
                <span class="font-weight-medium">{{ item.nombre }}</span>
              </VCol>

              <!-- Cantidad -->
              <VCol cols="3" class="d-flex justify-end align-center">
                <span class="font-weight-bold">{{ item.cantidad }}</span>
              </VCol>
            </VRow>
          </VListItem>

          <!-- Mensaje cuando está vacío -->
          <VListItem v-if="listaCarrito.length === 0">
            <VListItemContent>
              <VListItemTitle class="text-center grey--text">
                No hay recetas seleccionadas
              </VListItemTitle>
            </VListItemContent>
          </VListItem>
        </VList>

      </VCard>

    </VSpeedDial>

  </div>
</template>
<style>
.fab-fixed {
  position: fixed;
  bottom: 16px;
  /* distancia desde el borde inferior */
  right: 16px;
  /* distancia desde el borde derecho */
  z-index: 2000;
  /* para que esté por encima del contenido */
}
</style>
<script setup>
import { ref, watch } from 'vue'
import { recetas } from '@/composables/recetasData'

const fab = ref(false)
const listaCarrito = ref([])

// Función que calcula el carrito basado en recetas seleccionadas y no cocinadas
const actualizarCarrito = () => {
  const map = {}
  recetas.value.forEach(r => {
    if (!r.cocinado && r.seleccionada) {
      r.ingredientes.forEach(ing => {
        if (map[ing.nombre]) map[ing.nombre] += Number(ing.cantidad)
        else map[ing.nombre] = Number(ing.cantidad)
      })
    }
  })

  listaCarrito.value = Object.entries(map).map(([nombre, cantidad]) => ({ nombre, cantidad }))
}

// Observa cambios en recetas para actualizar el carrito automáticamente
watch(recetas, actualizarCarrito, { deep: true })
</script>
