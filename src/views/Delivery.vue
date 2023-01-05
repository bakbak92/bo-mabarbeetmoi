<template>
    <div class="page-deliveries">
        <h2>
            Livraison
        </h2>
        <div class="deliveries">
            <form v-for="delivery in deliveries" 
            :key="delivery.id"
            @submit.prevent="updateDelivery(delivery)"
            >
                <p>Zone {{delivery.zone}}</p>
                <form-row>
                    <form-input>
                        <input type="number" 
                        v-model="delivery.price"
                        >
                    </form-input>
                    <button-app type="submit"
                    role="save">
                        Modifier
                    </button-app>
                </form-row>
            </form>
        </div>
    </div>
</template>
<script lang="js">
import {db} from "../firebaseConfig"
import {getDocs, collection, setDoc, doc } from "firebase/firestore"
import { onMounted, reactive} from "vue"
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
        const deliveries = reactive([])
        onMounted(() => {
            getDocs(collection(db, "delivery")).then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    deliveries.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
            }).catch((error) => {
                console.log(error);
            })
        })
        const updateDelivery = (delivery) => {
            if(!confirm("Etes vous sur de modifier le prix de livraison de la zone " + delivery.zone)){
                return 
            }
            setDoc(doc(db, "delivery", delivery.id), {price: delivery.price})
            .then(() => {
                notify({
                    type: "success",
                    text: "Livraison modifiée"
                });
            }).catch((error) => {
                notify({
                    type: "error",
                    text: error.code + " " + error.message
                });
            })
        }
        return {
            deliveries,
            updateDelivery,
        }
    }
}
</script>
<style lang="scss">
.page-deliveries{
    max-width: 1200px;
    margin: auto
}
</style>