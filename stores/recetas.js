import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useRecetasStore = defineStore('recetas', () => {
  const recetas = ref([])       // Todas las recetas cargadas
  const carrito = ref({})       // Carrito global

  const loadRecetas = async (db) => {
    const snap = await getDocs(collection(db, 'recetas'))
    recetas.value = snap.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }))
  }

  const toggleReceta = (receta) => {
    receta.cocinado = !receta.cocinado
    receta.ingredientes.forEach(ing => {
      if (receta.cocinado) {
        carrito.value[ing.nombre] = (carrito.value[ing.nombre] || 0) + Number(ing.cantidad)
      } else {
        carrito.value[ing.nombre] -= Number(ing.cantidad)
        if (carrito.value[ing.nombre] <= 0) delete carrito.value[ing.nombre]
      }
    })
  }

  const listaCarrito = computed(() => {
    return Object.entries(carrito.value).map(([nombre, cantidad]) => ({nombre, cantidad}))
  })

  return { recetas, carrito, toggleReceta, listaCarrito, loadRecetas }
})
