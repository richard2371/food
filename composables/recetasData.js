// composables/recetasData.js
import { ref } from 'vue'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
// import { db } from '@/plugins/firebase'

import { db } from '@/utils/firebase'
// import { collection, getDocs, query,where,addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'

export const recetas = ref([]) // Lista reactiva y global

export const loadRecetas = async () => {
  try {
    const q = query(collection(db, 'recetas'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)

    recetas.value = snap.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
      seleccionada: false // estado local del carrito
    }))
  } catch (error) {
    console.error('Error cargando recetas:', error)
  }
}