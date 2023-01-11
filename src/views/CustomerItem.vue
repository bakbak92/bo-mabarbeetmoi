<template>
    <div class="customer-item">
        <h2>Client</h2>
        <p><strong>Nom :</strong> {{ user.firstname }} {{ user.lastname }}</p>
        <p><strong>Email :</strong> {{ user.email }}</p>
        <p><strong>Adresse :</strong> {{ user.address }} {{ user.zip_code }} {{ user.city }} {{ user.country }}</p>
        <p><strong>Téléphone</strong> {{ user.phone }}</p>
        <p v-if="user.registered_at">S'est inscris le {{ dateRegistered(user.registered_at) }}</p>
        <h3>Ses commandes</h3>
        <div class="order" v-for="order in orders" :key="order.id">
            <p>Ref commande: <b>{{ order.id }}</b> fait {{dateOrder(order.date)}}</p>
            <div>Status commande
                <select v-model="order.status" @change="changeStatus(order)">
                    <option value="progress">en cours</option>
                    <option value="finish">Finit</option>
                </select>
            </div>
            <div v-for="product in order.products" :key="product.id">
                {{product.name }} {{product.accessoireChoosed ? "avec " + product.accessoireChoosed.name : null}} - quantité: {{  product.quantity}}
            </div>
            <p v-if="order.codepormo">{{ order.codepormo }}</p>
            <p>Prix total {{order.total }} €</p>
        </div>
    </div>
</template>
<script>
import FormInput from "../components/FormInput.vue";
import FormRow from "../components/FormRow.vue";
import { db } from "../firebaseConfig"
import { collection, getDocs, query, where, doc, getDoc, deleteDoc, updateDoc} from "firebase/firestore"
import ContentBtn from "../components/ContentBtn.vue";
import ButtonApp from "../components/ButtonApp.vue";
import moment from "moment"
export default {
    components: {
        FormInput,
        FormRow,
        ContentBtn,
        ButtonApp
    },
    data(){
        return {
            user: {

            },
            orders: []
        }
    },
    mounted(){
        getDoc(doc(db, "users", this.$route.params.id))
        .then((docRef) => {
            this.user = docRef.data()
        })
        getDocs(query(collection(db, "orders"), where("uid", "==", this.$route.params.id)))
        .then((snapshot) => {
            snapshot.docs.forEach((docRef) => {
                console.log(docRef.data())
                this.orders.push(docRef.data())
            })
        }).catch((error) => {
            console.log(error.code, error.message)
        })
    },
    methods: {
        dateRegistered(date){
            const timestamp = date.toMillis()
            const time = new Date(timestamp)

            return moment(time).format("DD/MM/YYYY")
        },
        dateOrder(date){
            const timestamp = date.toMillis()
            const time = new Date(timestamp)

            return moment(time).format("DD/MM/YYYY à HH:mm:ss")
        },
        changeStatus(order){
            updateDoc(doc(db, "orders", order.id), {status: order.status})
            .then(() => {
                this.$notify({
                    type: "success",
                    text: "Le status de la commande est bien changé"
                })
            })
            .catch((error) => {
                this.$notify({
                    type: "error",
                    text: error.message
                })
            })
        }
    }
}
</script>
<style lang="scss">
.customer-item{
    max-width: 1200px;
    margin: auto;
    padding: 20px;
}
</style>