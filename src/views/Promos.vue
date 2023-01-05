<template>
    <div class="page-promos">
        <h2>
            Code Promo
            <button-app v-if="!hasNew"
            @click="hasNew = true">
                Ajouter un code promo
            </button-app>
        </h2>
        <form @submit.prevent="addPromo"
        class="form-new"
        v-if="hasNew">
            <form-row>
                <form-input>
                    Code
                    <input type="text" v-model="newPromo.code" required>
                </form-input>
                <form-input>
                    Pourcentage de réduction
                    <input type="number" v-model="newPromo.value" required>
                </form-input>
                <form-input>
                    Status
                    <select v-model="newPromo.active">
                        <option :value="true">Actif</option>
                        <option :value="false">Non actif</option>
                    </select>
                </form-input>
                <div class="content-btn">
                    <button-app type="submit"
                    role="save">
                        Créer
                    </button-app>
                    <button-app @click="hasNew = false"
                    role="cancel">
                        Annuler
                    </button-app>
                </div>
            </form-row>
        </form>
        <div class="promos">
            <form v-for="promo in promos" 
            :key="promo.id"
            @submit.prevent="updatePromo(promo)"
            >
                <form-row>
                    <form-input>
                        Code
                        <input type="text" v-model="promo.code" required>
                    </form-input>
                    <form-input>
                        Pourcentage de réduction
                        <input type="number" v-model="promo.value" required>
                    </form-input>
                    <form-input>
                        Status
                        <select v-model="promo.active">
                            <option :value="true">Actif</option>
                            <option :value="false">Non actif</option>
                        </select>
                    </form-input>
                    <div class="content-btn">
                        <button-app type="submit"
                        role="save">
                            Modifier
                        </button-app>
                        <button-app @click="deletePromo(promo)"
                        role="remove">
                            Supprimer
                        </button-app>
                    </div>
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
        const promos = reactive([])
        const hasNew = ref(false)
        const newPromo = reactive({
            code: null,
            value: 0,
            active: false
        })
        onMounted(() => {
            getDocs(collection(db, "promos")).then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    promos.push({
                        id: doc.id,
                        ...doc.data()
                    })
                    console.log(promos)
                })
            }).catch((error) => {
                console.log(error);
            })
        })
        const updatePromo = (promo) => {
            if(!confirm("Etes vous sur?")){
                return 
            }
            setDoc(doc(db, "promos", promo.id), {
                value: promo.value,
                code: promo.code,
                active: promo.active
            }).then(() => {
                console.log("carré")
                notify({
                    type: "success",
                    text: "Promo modifié"
                });
            }).catch((error) => {
                notify({
                    type: "success",
                    text: error.code
                });
            })
        }
        const deletePromo = (promo) => {
            if(!confirm("Etes vous sur?")){
                return 
            }
            deleteDoc(doc(db, "promos", promo.id)).then(() => {
                let index = promos.findIndex(element => promo.id === element.id)
                promos.splice(index, 1)
                notify({
                    type: "success",
                    text: "Promo supprimer"
                })
            }).catch((error) => {
                notify({
                    type: "error",
                    text: error
                })
            })
        }
        const addPromo = () => {
            addDoc(collection(db, "promos"), {
                value: newPromo.value,
                code: newPromo.code,
                active: newPromo.active
            }).then((docRef) => {
                console.log(docRef)
                hasNew.value = false
                promos.push({
                    id: docRef.id,
                    ...newPromo
                })
                newPromo.value = 0
                newPromo.code = null
                newPromo.active = false
                notify({
                    type: "success",
                    text: "Promo ajouté"
                });
            }).catch((error) => {
                notify({
                    type: "error",
                    text: error.code
                });
            })
        }
        return {
            promos,
            updatePromo,
            hasNew,
            deletePromo,
            addPromo,
            newPromo
        }
    }
}
</script>
<style lang="scss">
.page-promos{
    max-width: 1200px;
    margin: auto;

    .form-new{
        margin-bottom: 40px;
    }
    form{
        margin-bottom: 20px;
    }
    .content-btn {
        display: flex;
        align-items: end;
    }
}
</style>