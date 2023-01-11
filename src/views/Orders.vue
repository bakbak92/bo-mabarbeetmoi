<template>
    <div class="orders">
        <h2>Commandes</h2>
        <table>
            <thead>
                <th>Référence commande</th>
                <th>Date</th>
                <th>Nom</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Code promo</th>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order.id" @click="$router.push(`/customers/${order.uid}`)">
                    <td>{{order.id}}</td>
                    <td>{{ orderDate(order.date) }}</td>
                    <td>{{ order.firstname }} {{ order.lastname }}</td>
                    <td>{{ order.total }}</td>
                    <td :class="['status',status(order.status)]">{{ status(order.status) }}</td>
                    <td>{{ order.codepromo }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { db } from "../firebaseConfig"
import { collection, getDocs} from "firebase/firestore"
import {reactive, onMounted} from "vue"
import moment from "moment"
export default {
    setup(){
        const orders = reactive([])
        onMounted(() => {
            getDocs(collection(db, "orders")).then((snapshots) => {
                snapshots.forEach((doc) => {
                    const order = {
                        id: doc.id,
                        ...doc.data()
                    }
                    orders.push(order)
                })
                orders.sort((a, b) => {
                    return new Date(a.date.toMillis).valueOf() - new Date(a.date.toMillis).valueOf()
                }).reverse()
            });
        })
        const orderDate = (date) => {
            const timestamp = date.toMillis()
            const time = new Date(timestamp)
    
            return moment(time).format("DD/MM/YYYY à HH:mm:ss")
        }
        const status = (order_status) => {
            return order_status === "progress" ? "en cours" : "finit"
        }
        return {
            orders,
            orderDate,
            status
        }
    }
}

</script>
<style lang="scss">
.orders{
    .status{
        padding: 4px 8px;
        &.progress{
            background-color: red;
        }
        &.finish{
            background-color: green;
        }
    }
    table{
        margin-top: 20px;
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #f2f2f2;

        thead{
            white-space: nowrap;
            font-weight: normal;
            text-transform: uppercase;
            text-align: left;
            border-bottom: 1px solid #f2f2f2;
            th{
                border-right: 1px solid #f2f2f2;
                padding-left: 10px;
                &:last-child{
                    border-right: none;
                }
            }
        }
        tr{
            border-bottom: 1px solid #f2f2f2;
            cursor: pointer;
            &:last-child{
                border-bottom: none;
            }
            &:hover{
                background-color: #f1f1f1;
            }
            td{
                border-right: 1px solid #f2f2f2;
                padding-left: 10px;
                &:last-child{
                    border-right: none;
                }
                img{
                    width: 40px;
                    height: 40px;
                }
            }
        }
    }
}
</style>