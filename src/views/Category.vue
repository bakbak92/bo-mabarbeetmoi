<template>
    <div class="page-categories">
        <h2>
            Catégories
            <button-app v-if="!hasNew"
            @click="hasNew = true">
                Ajouter une categorie
            </button-app>
        </h2>
        <form @submit.prevent="addCategory"
        v-if="hasNew">
            Nom nouvelle catégorie
            <form-row>
                <form-input>
                    <input type="text" v-model="newCategory">
                </form-input>
                <button-app type="submit"
                role="save">
                    Créer
                </button-app>
            </form-row>
        </form>
        <div class="categories">
            <form v-for="category in categories" 
            :key="category.id"
            @submit.prevent="updateCategory(category)"
            >
                <p>Nom de la categorie</p>
                <form-row>
                    <form-input>
                        <input type="text" 
                        v-model="category.name"
                        >
                    </form-input>
                    <button-app type="submit"
                    role="save">
                        Modifier
                    </button-app>
                    <button-app @click="deleteCategory(category)"
                    role="remove">
                        Supprimer
                    </button-app>
                </form-row>
            </form>
        </div>
    </div>
</template>
<script lang="js">
import {db} from "../firebaseConfig"
import {getDocs, collection, setDoc, doc, deleteDoc, addDoc} from "firebase/firestore"
import { onMounted, reactive, ref } from "vue"
import FormRow from "@/components/FormRow.vue"
import FormInput from "@/components/FormInput.vue"
import ButtonApp from "@/components/ButtonApp.vue"
import { notify } from "@kyvg/vue3-notification";

export default {
    components: {
        FormInput,
        FormRow,
        ButtonApp,
    },
    setup(){
        const categories = reactive([])
        const hasNew = ref(false)
        const newCategory = ref(null)
        onMounted(() => {
            getDocs(collection(db, "categories")).then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    categories.push({
                        id: doc.id,
                        ...doc.data()
                    })
                    console.log(categories)
                })
            }).catch((error) => {
                console.log(error);
            })
        })
        const updateCategory = (category) => {
            if(!confirm("Etes vous sur? si oui penser à bien mettre à jour les produits lié à cette catégorie")){
                return 
            }
            setDoc(doc(db, "categories", category.id), {name: category.name})
            .then(() => {
                console.log("carré")
                notify({
                    type: "success",
                    text: "Categorie modifié"
                });
            }).catch((error) => {
                notify({
                    type: "success",
                    text: error.code
                });
            })
        }
        const deleteCategory = (category) => {
            if(!confirm("Etes vous sur? si oui penser à bien mettre à jour les produits lié à cette catégorie")){
                return 
            }
            deleteDoc(doc(db, "categories", category.id)).then(() => {
                let index = categories.findIndex(element => category.id === element.id)
                categories.splice(index, 1)
                notify({
                    type: "success",
                    text: "Catégorie supprimer"
                })
            }).catch((error) => {
                notify({
                    type: "error",
                    text: error
                })
            })
        }
        const addCategory = () => {
            addDoc(collection(db, "categories"), {name: newCategory.value})
            .then((docRef) => {
                console.log(docRef)
                hasNew.value = false
                categories.push({
                    name: newCategory.value,
                    id: docRef.id
                })
                newCategory.value = null
                notify({
                    type: "success",
                    text: "Categorie ajouté"
                });
            }).catch((error) => {
                notify({
                    type: "success",
                    text: error.code
                });
            })
        }
        return {
            categories,
            updateCategory,
            hasNew,
            deleteCategory,
            addCategory,
            newCategory
        }
    }
}
</script>
<style lang="scss">
.page-categories{
    max-width: 1200px;
    margin: auto
}
</style>