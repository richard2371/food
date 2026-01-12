<template>
    <VContainer fluid class="pa-2">
        <!-- HEADER -->

        <!-- <CarritoIngredientes /> -->
        <VRow align="center" justify="space-between" class="mb-2">
            <h3><VIcon>mdi-food-croissant</VIcon> Refacciones</h3>
            <VBtn icon color="primary" @click="openDialog">
                <VIcon>mdi-plus</VIcon>
            </VBtn>
        </VRow>

        <!-- LISTA DE RECETAS SOLO Refacciones -->
        <VRow dense>
            <VCol v-for="r in recetas.filter(rec => rec.categoria === 'Refaccion')" :key="r.id" cols="12" sm="6" md="4">

                <VCard class="rounded-xl">
                    <VImg :src="r.imagenURL" height="180" cover />

                    <VCardTitle class="text-h6">{{ r.nombre }}</VCardTitle>
                    <VCardSubtitle>⏱ {{ r.tiempo }} min</VCardSubtitle>

                    <VCardText class="pb-0">
                        <div class="text-caption mb-1">Ingredientes:</div>
                        <div v-for="ing in r.ingredientes" :key="ing.nombre">
                            • {{ ing.nombre }} ({{ ing.cantidad }})
                        </div>
                        <!-- Toggle Ya Cociné -->
                        <VCheckbox v-model="r.cocinado" label="Ya cociné" density="compact"
                            @update:modelValue="toggleCocinado(r)" />
                        <VCheckbox v-if="!r.cocinado" v-model="r.seleccionada" label="Incluir en carrito"
                            density="compact" @update:modelValue="toggleCarrito(r)" prepend-icon="mdi-cart-plus"
                            class="mt-1" />
                    </VCardText>
           
                    
                    <VCardActions>
                        <VBtn size="small" @click="edit(r)" prepend-icon="mdi-pencil">Editar</VBtn>
                        <VSpacer />
                        <VBtn size="small" color="red" @click="remove(r.id)" prepend-icon="mdi-delete">Eliminar</VBtn>
                        <v-btn :icon="r.show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="r.show = !r.show"></v-btn>
                    </VCardActions>
                    <v-expand-transition>
                        <div v-show="r.show">
                            <v-divider></v-divider>

                            <v-card-text>
                                {{ r.descripcion }}
                            </v-card-text>
                        </div>
                    </v-expand-transition>
                </VCard>
            </VCol>

        </VRow>

        <!-- DIALOG NUEVA/EDITAR RECETA -->
        <VDialog v-model="dialog" max-width="800px" fullscreen-sm>
            <VCard>
                <VCardTitle class="d-flex align-center">
                    <VIcon class="mr-2">mdi-book-open-page-variant</VIcon>
                    {{ form.id ? 'Editar receta' : 'Nueva receta' }}
                </VCardTitle>

                <VCardText>
                    <VRow>
                        <!-- Imagen y checkbox -->
                        <VCol cols="12" md="4" class="mb-4 mb-md-0">
                            <VCard v-if="form.imagenURL" class="rounded-xl mb-2">
                                <VImg :src="form.imagenURL" height="180" cover />
                            </VCard>
                            <VTextField v-model="form.imagenURL" label="URL de Imagen" prepend-inner-icon="mdi-image"
                                dense />
                            <VCheckbox label="Ya cociné" v-model="form.cocinado" dense class="mt-2" />
                        </VCol>

                        <!-- Datos y campos -->
                        <VCol cols="12" md="8">
                            <VTextField v-model="form.nombre" label="Nombre" prepend-inner-icon="mdi-text" dense />

                            <VRow class="mt-2">
                                <VCol cols="12" md="7">
                                    <VSelect label="Categoría" :items="['Refaccion']" v-model="form.categoria"
                                        prepend-inner-icon="mdi-silverware-fork-knife" dense variant="outlined" />
                                </VCol>
                                <VCol cols="12" md="5">
                                    <VTextField label="Tiempo (min)" type="number" v-model="form.tiempo"
                                        prepend-inner-icon="mdi-timer" dense />
                                </VCol>
                            </VRow>

                            <VTextarea v-model="form.descripcion" label="Descripción" prepend-inner-icon="mdi-note-text"
                                dense rows="2" class="mt-2" />

                            <!-- Ingredientes mejorados -->
                            <!-- INGREDIENTES MEJORADOS -->
                            <div class="mt-3">
                                <VBtn text color="primary" variant="tonal" class="mt-2"
                                    @click="form.ingredientes.push({ nombre: '', cantidad: '' })">
                                    <VIcon left>mdi-plus</VIcon> Ingrediente
                                </VBtn>

                                <VTable class="d-none d-md-table">
                                    <thead>
                                        <tr>
                                            <th>Ingrediente</th>
                                            <th>Cantidad</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(ing, index) in form.ingredientes" :key="index">
                                            <td>
                                                <VSelect :items="ingredientesDisponibles" v-model="ing.nombre" dense
                                                    hide-details style="min-width:150px" prepend-inner-icon="mdi-food"
                                                    variant="underlined" />

                                            </td>
                                            <td>
                                                <VTextField v-model="ing.cantidad" dense hide-details
                                                    style="width:80px" />
                                            </td>
                                            <td>
                                                <VBtn color="red" variant="tonal" size="x-small"
                                                    @click="form.ingredientes.splice(index, 1)">
                                                    <VIcon>mdi-delete</VIcon>
                                                </VBtn>
                                            </td>
                                        </tr>
                                    </tbody>
                                </VTable>

                                <!-- Mobile: cards verticales -->
                                <div class="d-md-none">
                                    <div v-for="(ing, index) in form.ingredientes" :key="index" class="mb-2">
                                        <VCard outlined class="pa-2 d-flex flex-column">
                                            <VSelect :items="ingredientesDisponibles" v-model="ing.nombre"
                                                label="Ingrediente" dense prepend-inner-icon="mdi-food" />
                                            <VTextField v-model="ing.cantidad" label="Cantidad" dense
                                                prepend-inner-icon="mdi-numeric" class="mt-1" />
                                            <VBtn icon color="red" class="mt-1 align-self-end" size="x-small"
                                                variant="tonal" @click="form.ingredientes.splice(index, 1)">
                                                <VIcon>mdi-delete</VIcon>
                                            </VBtn>
                                        </VCard>
                                    </div>
                                </div>


                            </div>


                        </VCol>
                    </VRow>
                </VCardText>

                <VCardActions>
                    <VSpacer />
                    <VBtn color="primary" :loading="saving" @click="save">
                        <VIcon left>mdi-content-save</VIcon>Guardar
                    </VBtn>
                    <VBtn text @click="dialog = false">
                        <VIcon left>mdi-cancel</VIcon>Cancelar
                    </VBtn>
                </VCardActions>
            </VCard>
        </VDialog>


    </VContainer>
</template>

<script setup>
import CarritoIngredientes from '~/components/CarritoIngredientes.vue';
import { recetas } from '@/composables/recetasData'
import { ref, onMounted } from 'vue'
import { db } from '@/utils/firebase'
import { onSnapshot, collection, getDocs, query, where, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
const show = ref(false)
// const recetas = ref([])
const ingredientesDisponibles = ref([])
const dialog = ref(false)
const saving = ref(false)

const form = ref({
    id: null, nombre: '', categoria: 'Refaccion', tiempo: '', descripcion: '', ingredientes: [], cocinado: false, imagenURL: ''
})

const loadRecetas = () => {
    const q = query(collection(db, 'recetas'))

    // Esto reemplaza getDocs → escucha en tiempo real
    onSnapshot(q, (snap) => {
        recetas.value = []
        snap.forEach(docSnap => {
            const data = docSnap.data()
            recetas.value.push({
                id: docSnap.id,
                ...data,
                show: false,
                seleccionada: data.seleccionada || false,
                cocinado: data.cocinado || false
            })
        })
    })
}


const loadIngredientes = async () => {
    ingredientesDisponibles.value = []
    const snap = await getDocs(collection(db, 'ingredientes'))
    snap.forEach(d => ingredientesDisponibles.value.push(d.data().nombre))
}

const openDialog = () => {
    form.value = { id: null, nombre: '', categoria: 'Refaccion', tiempo: '', descripcion: '', ingredientes: [], cocinado: false, imagenURL: '' }
    dialog.value = true
}

const edit = (r) => {
    form.value = { ...r }
    dialog.value = true
}

const save = async () => {
    saving.value = true

    // Limpiar ingredientes vacíos
    form.value.ingredientes = form.value.ingredientes.filter(i => i.nombre && i.cantidad)

    // Preparamos objeto limpio para guardar
    const payload = {
        nombre: form.value.nombre,
        tiempo: form.value.tiempo,
        categoria: form.value.categoria,
        ingredientes: form.value.ingredientes,
        cocinado: form.value.cocinado,
        seleccionada: false, // inicial
        descripcion: form.value.descripcion,
        imagenURL: form.value.imagenURL,
        createdAt: serverTimestamp()
    }

    if (form.value.id) {
        // Si ya existe ID → actualizar Firebase
        await updateDoc(doc(db, 'recetas', form.value.id), payload)

        // Actualizar el composable en memoria
        const index = recetas.value.findIndex(r => r.id === form.value.id)
        if (index !== -1) {
            recetas.value[index] = {
                ...recetas.value[index],
                ...payload,
                id: form.value.id,
                seleccionada: recetas.value[index].seleccionada || false
            }
        }
    } else {
        // Nuevo documento → Firebase
        const docRef = await addDoc(collection(db, 'recetas'), payload)

        // Agregar a composable en memoria
        recetas.value.unshift({
            ...payload,
            id: docRef.id,
            seleccionada: false
        })
    }

    saving.value = false
    dialog.value = false
}


const remove = async (id) => {
    try {
        if (!confirm('¿Eliminar receta?')) return
        console.log('Eliminando receta con id:', id)

        // Crear referencia al doc
        const docRef = doc(db, 'recetas', id)

        // Eliminar documento
        await deleteDoc(docRef)

        // Recargar recetas
        await loadRecetas()
        alert('Receta eliminada ✅')
    } catch (error) {
        console.error('Error eliminando receta:', error)
        alert('No se pudo eliminar la receta')
    }
}

const toggleCocinado = async (r) => {
    await updateDoc(doc(db, 'recetas', r.id), { cocinado: r.cocinado, seleccionada: false })

    // Actualizar en composable
    const index = recetas.value.findIndex(x => x.id === r.id)
    if (index !== -1) {
        recetas.value[index].cocinado = r.cocinado
        recetas.value[index].seleccionada = false
    }
}

const toggleCarrito = async (r) => {
    await updateDoc(doc(db, 'recetas', r.id), { seleccionada: r.seleccionada })

    // Actualizar en composable
    const index = recetas.value.findIndex(x => x.id === r.id)
    if (index !== -1) {
        recetas.value[index].seleccionada = r.seleccionada
    }
}
// const actualizarCarrito = () => {
//   const map = {}

//   recetas.forEach(r => {
//     if (!r.cocinado && r.seleccionada) {
//       r.ingredientes.forEach(ing => {
//         if (map[ing.nombre]) {
//           map[ing.nombre] += Number(ing.cantidad)
//         } else {
//           map[ing.nombre] = Number(ing.cantidad)
//         }
//       })
//     }
//   })

//   // Convertimos a array para mostrar
//   carrito.value = Object.entries(map).map(([nombre,cantidad]) => ({nombre,cantidad}))
// }



onMounted(() => {
    loadRecetas()
    loadIngredientes()
})
</script>

<style scoped>
.v-card {
    box-shadow: 0 4px 10px rgba(0, 0, 0, .15)
}
</style>
