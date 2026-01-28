<template>
  <div>
    <!-- Header -->
    <VRow justify="space-between" align="center" class="mb-4">
      <h2>Ingredientes 🧄</h2>
      <VBtn color="primary" @click="openDialog()">Nuevo</VBtn>
    </VRow>
    <v-card-title class="d-flex align-center pe-2">
     

      <v-spacer></v-spacer>

      <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
        variant="solo-filled" flat hide-details single-line></v-text-field>
    </v-card-title>
    <!-- Tabla -->
    <VDataTable v-model:search="search" :headers="headers" :items="ingredientes" item-key="id" density="compact">
      <template #item.actions="{ item }">
        <VBtn icon="mdi-pencil" variant="text" @click="edit(item)" />
        <VBtn icon="mdi-delete" variant="text" color="red" @click="remove(item.id)" />
      </template>
    </VDataTable>

    <!-- Dialog -->
    <VDialog v-model="dialog" max-width="500">
      <VCard>
        <VCardTitle>
          {{ form.id ? 'Editar Ingrediente' : 'Nuevo Ingrediente' }}
        </VCardTitle>

        <VCardText>
          <VTextField label="Nombre" v-model="form.nombre" required />
          <VTextField label="Descripción" v-model="form.descripcion" />
          <VSelect label="Categoría" v-model="form.categoria" :items="categorias" clearable item-title="nombre"
            item-value="nombre" />
        </VCardText>


        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="dialog = false">Cancelar</VBtn>
          <VBtn color="primary" @click="save">Guardar</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/utils/firebase'

// State
const ingredientes = ref([])
const dialog = ref(false)
  const search = ref('')
const form = ref({
  id: null,
  nombre: '',
  descripcion: '',
  categoria: ''
})
const categorias = ref([]);
// Tabla
const headers = [
  { title: 'Nombre', value: 'nombre' },
  { title: 'Categoria', value: 'categoria' },
  { title: 'Descripción', value: 'descripcion' },
  { title: 'Acciones', value: 'actions', sortable: false }
]

// 🔄 Cargar ingredientes
const load = async () => {
  ingredientes.value = []
  const snapshot = await getDocs(collection(db, 'ingredientes'))

  snapshot.forEach(d => {
    ingredientes.value.push({
      id: d.id,
      ...d.data()
    })
  })
}

// ➕ Nuevo
const openDialog = () => {
  form.value = { id: null, nombre: '', descripcion: '' }
  dialog.value = true
}

// ✏️ Editar
const edit = (item) => {
  form.value = { ...item }
  dialog.value = true
}

// 💾 Guardar
const save = async () => {
  if (!form.value.nombre) return

  if (form.value.id) {
    // Update
    await updateDoc(
      doc(db, 'ingredientes', form.value.id),
      {
        nombre: form.value.nombre,
        descripcion: form.value.descripcion,
        categoria: form.value.categoria || null,
      }
    )
  } else {
    // Create
    await addDoc(collection(db, 'ingredientes'), {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
      categoria: form.value.categoria || null,
      createdAt: serverTimestamp()
    })
  }

  dialog.value = false
  load()
}
const loadCategorias = async () => {
  categorias.value = []
  const snap = await getDocs(collection(db, 'categorias'))
  snap.forEach(d => {
    categorias.value.push({ id: d.id, ...d.data() })
  })
}
// 🗑️ Eliminar
const remove = async (id) => {
  if (!confirm('¿Eliminar ingrediente?')) return
  await deleteDoc(doc(db, 'ingredientes', id))
  load()
}

onMounted(() => {
  load()
  loadCategorias()
})
</script>
