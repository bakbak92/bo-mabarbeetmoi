<template>
    <div class="customers-list">
        <h2>
            Listes des clients
        </h2>
        <table>
            <thead>
                <th>Nom</th>
                <th>Email</th>
                <th>Numero</th>
                <th>Date inscription</th>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id" @click="$router.push(`/customers/${user.id}`)">
                    <td>{{user.firstname}} {{user.lastname}}</td>
                    <td>{{user.email}}</td>
                    <td>{{user.phone}}</td>
                    <td>{{dateRegistered(user.registered_at)}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script lang="js">
import { getDocs, collection, query, where } from "firebase/firestore"
import {db} from "../firebaseConfig.ts"
import {reactive} from "vue"
import moment from "moment"

export default {
    setup(){
        const users = reactive([])
        getDocs(query(collection(db, "users"), where("role", "==", "customer")))
        .then((snapshot) => {
            snapshot.docs.forEach((docRef) => {
                users.push({
                    id: docRef.id,
                    ...docRef.data()
                })
            })
        })
        const dateRegistered = (date) => {
            const timestamp = date.toMillis()
            const time = new Date(timestamp)

            return moment(time).format("DD/MM/YYYY")
        }
        return {
            users,
            dateRegistered
        }
    }
}
</script>
<style lang="scss">
.customers-list{
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