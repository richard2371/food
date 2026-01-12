<template>
  <div>
    <!-- Header -->
    <VRow justify="space-between" align="center" class="mb-4">
      <h2>Ingredientes 🧄</h2>
      <VBtn color="primary" @click="openDialog()">Nuevo</VBtn>
    </VRow>

    <!-- Tabla -->
    <VDataTable
      :headers="headers"
      :items="ingredientes"
      item-key="id"
      density="compact"
    >
      <template #item.actions="{ item }">
        <VBtn icon="mdi-pencil" variant="text" @click="edit(item)" />
        <VBtn
          icon="mdi-delete"
          variant="text"
          color="red"
          @click="remove(item.id)"
        />
      </template>
    </VDataTable>

    <!-- Dialog -->
    <VDialog v-model="dialog" max-width="500">
      <VCard>
        <VCardTitle>
          {{ form.id ? 'Editar Ingrediente' : 'Nuevo Ingrediente' }}
        </VCardTitle>

        <VCardText>
          <VTextField
            label="Nombre"
            v-model="form.nombre"
            required
          />
          <VTextField
            label="Descripción"
            v-model="form.descripcion"
          />
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

const form = ref({
  id: null,
  nombre: '',
  descripcion: ''
})

// Tabla
const headers = [
  { title: 'Nombre', value: 'nombre' },
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
        descripcion: form.value.descripcion
      }
    )
  } else {
    // Create
    await addDoc(collection(db, 'ingredientes'), {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
      createdAt: serverTimestamp()
    })
  }

  dialog.value = false
  load()
}

// 🗑️ Eliminar
const remove = async (id) => {
  if (!confirm('¿Eliminar ingrediente?')) return
  await deleteDoc(doc(db, 'ingredientes', id))
  load()
}

onMounted(load)
</script>
