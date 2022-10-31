<template>
    <div class="login">
        <form @submit.prevent="logIn">
            <form-row>
                <form-input>
                    <p>Email</p>
                    <input type="email" v-model="email">
                </form-input>
            </form-row>
            <form-row>
                <form-input>
                    <p>Mot de passe</p>
                    <input type="password" v-model="password">
                </form-input>
            </form-row>
            <content-btn>
                <button-app role="save" type="submit">Se connecter</button-app>
            </content-btn>
        </form>
    </div>
</template>
<script>
import FormRow from "@/components/FormRow.vue"
import FormInput from "@/components/FormInput.vue"
import ContentBtn from "@/components/ContentBtn.vue"
import ButtonApp from "@/components/ButtonApp.vue"
import { ref } from "vue"
import {useUserStore} from "../stores/user";
export default {
    setup() {
        const store = useUserStore();
        const email = ref(null);
        const password = ref(null);
        const logIn = () => {
            store.signIn(email.value, password.value)
            .then(() => {
                this.$router.push("/products")
            })
        }

        return {logIn, email, password}
    },
    components: {
        FormRow,
        FormInput,
        ContentBtn,
        ButtonApp
    }
}
</script>
<style lang="scss">
.login{
    max-width: 800px;
    margin: auto;
}
</style>