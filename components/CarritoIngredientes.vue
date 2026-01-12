<template>
  <VCard class="pa-3 mb-4">
    <VCardTitle>
      <VIcon class="mr-2">mdi-cart</VIcon> Lista de Compras
    </VCardTitle>

    <VList two-line>
      <VListItem v-for="(item, i) in listaCarrito" :key="i">
        <VListItemContent>
          <VListItemTitle>{{ item.nombre }}</VListItemTitle>
        </VListItemContent>
        <VListItemContent class="text-right">
          <VListItemTitle>{{ item.cantidad }}</VListItemTitle>
        </VListItemContent>
      </VListItem>

      <VListItem v-if="listaCarrito.length === 0">
        <VListItemContent>
          <VListItemTitle class="text-center grey--text">No hay ingredientes seleccionados</VListItemTitle>
        </VListItemContent>
      </VListItem>
    </VList>
  </VCard>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { db } from '@/utils/firebase'
import { collection, getDocs, query,where,addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
const listaCarrito = ref([])

const cargarCarrito = async () => {
  const q = query(collection(db, 'recetas'), where('cocinado', '==', false), where('seleccionada', '==', true))
  const snap = await getDocs(q)

  const map = {}
  snap.forEach(docSnap => {
    const receta = docSnap.data()
    receta.ingredientes.forEach(ing => {
      if (map[ing.nombre]) {
        map[ing.nombre] += Number(ing.cantidad)
      } else {
        map[ing.nombre] = Number(ing.cantidad)
      }
    })
  })

  listaCarrito.value = Object.entries(map).map(([nombre, cantidad]) => ({ nombre, cantidad }))
}

// Cargar al montar
onMounted(cargarCarrito)
</script>
