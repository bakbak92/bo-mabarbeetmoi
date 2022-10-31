<template>
    <div class="products-list">
        <h2>
            Listes de produits
            <button @click="$router.push(`/products/new`)">
                Ajouter un nouvelle article
            </button>
        </h2>
        <table>
            <thead>
                <th>Nom</th>
                <th>Categories</th>
                <th>Prix</th>
                <th>Status</th>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.id" @click="$router.push(`/products/${product.id}`)">
                    <td>{{product.name}}</td>
                    <td>{{categories[product.category] ? categories[product.category].name : null}}</td>
                    <td>{{product.price}}</td>
                    <td>
                        <span class="status" 
                        :class="{nopublished: product.isPublished}">
                            {{product.isPublished ? "publié" : "non publié"}}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { db } from "../firebaseConfig"
import { collection, getDocs} from "firebase/firestore"
export default {
    data(){
        return {
            products: [],
            categories: {}
        }
    },
    mounted(){
        const dbCategories = collection(db, "categories");
        const dbProducts = collection(db, "products");
        getDocs(dbCategories).then((snapshots) => {
            snapshots.forEach((doc) => {
                this.categories[doc.id] = doc.data();
            })
            getDocs(dbProducts).then((snapshots) => {
                snapshots.forEach((doc) => {
                    const product = {
                        id: doc.id,
                        ...doc.data()
                    }
                    this.products.push(product)
                })
            });
        })
    }
}
</script>
<style lang="scss">
.products-list{
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