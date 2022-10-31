<template>
    <nav>
        <div class="logo">
            <img src="@/assets/logo.png" alt="">
        </div>
        <ul v-if="connected">
            <li>
                <RouterLink to="/products">Produits</RouterLink>
            </li>
            <li>
                <RouterLink to="/orders">Commandes</RouterLink>
            </li>
            <li>
                <RouterLink to="/customers">Clients</RouterLink>
            </li>
            <li>
                <RouterLink to="/promos">Code promo</RouterLink>
            </li>
            <li>
                <span @click="logOut">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    Se déconnecter
                </span>
            </li>
        </ul>
    </nav>
</template>
<script lang="ts">
import {mapState, mapActions} from "pinia";
import {useUserStore} from "../stores/user";

export default {
    computed: {
        ...mapState(useUserStore, ["connected"])
    },
    methods: {
        ...mapActions(useUserStore, ["logOut"])
    }
}
</script>
<style lang="scss">
@import "@/assets/colors";

nav{
    display: flex;
    justify-content: space-between;
    padding: 16px;
    background-color: $black;
    align-items: center;
    .logo{
        img{
            width: 60px;
        }
    }
    ul{
        display: flex;
        list-style: none;
        gap: 20px;
        li{
            a{
                color: white;
                text-decoration: none;
                cursor: pointer;
            }
            span{
                color: white;
                cursor: pointer;
            }
        }
    }
}
</style>