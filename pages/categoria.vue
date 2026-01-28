<template>
  <div>
    <VRow justify="space-between" align="center" class="mb-4">
      <h2>Categoría ingredientes</h2>
      <VBtn color="primary" @click="openDialog()">Nueva</VBtn>
    </VRow>

    <VDataTable
      :headers="headers"
      :items="categorias"
      item-key="id"
      density="compact"
    >
      <template #item.actions="{ item }">
        <VBtn icon="mdi-pencil" variant="text" @click="edit(item)" />
        <VBtn icon="mdi-delete" variant="text" color="red" @click="remove(item.id)" />
      </template>
    </VDataTable>

    <VDialog v-model="dialog" max-width="400">
      <VCard>
        <VCardTitle>
          {{ form.id ? 'Editar Categoría' : 'Nueva Categoría' }}
        </VCardTitle>

        <VCardText>
          <VTextField
            label="Nombre"
            v-model="form.nombre"
            required
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

const categorias = ref([])
const dialog = ref(false)

const form = ref({
  id: null,
  nombre: ''
})

const headers = [
  { title: 'Nombre', value: 'nombre' },
  { title: 'Acciones', value: 'actions', sortable: false }
]

const load = async () => {
  categorias.value = []
  const snap = await getDocs(collection(db, 'categorias'))
  snap.forEach(d => {
    categorias.value.push({ id: d.id, ...d.data() })
  })
}

const openDialog = () => {
  form.value = { id: null, nombre: '' }
  dialog.value = true
}

const edit = (item) => {
  form.value = { ...item }
  dialog.value = true
}

const save = async () => {
  if (!form.value.nombre) return

  if (form.value.id) {
    await updateDoc(doc(db, 'categorias', form.value.id), {
      nombre: form.value.nombre
    })
  } else {
    await addDoc(collection(db, 'categorias'), {
      nombre: form.value.nombre,
      createdAt: serverTimestamp()
    })
  }

  dialog.value = false
  load()
}

const remove = async (id) => {
  if (!confirm('¿Eliminar categoría?')) return
  await deleteDoc(doc(db, 'categorias', id))
  load()
}

onMounted(load)
</script>

