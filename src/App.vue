<template>
  <header>
    <Navbar />
  </header>
  <main v-if="loading === false">
    <notifications position="top center"
        />
    <RouterView />
  </main>
</template>
<script>
import Navbar from "./components/Navbar.vue";
import {useUserStore} from "./stores/user";
import {mapActions, mapState} from "pinia";
export default {
  components: {
    Navbar
  },
  mounted(){
    this.logIn().then(() => {
      console.log("connected");
      this.loading = false;
      console.log(this.loading);
    }).catch(() => {
      console.log("erreur");
      this.loading = false;
      this.$router.push("/login")
    })
  },
  data(){
    return {
      loading: true
    }
  },
  computed: {
    ...mapState(useUserStore, ["connected"])
  },
  methods: {
    ...mapActions(useUserStore, ["logIn"])
  }
}
</script>
<style lang="scss">
body{
  margin: 0;
  color: #282828;
  font-family: 'Roboto', sans-serif;
  .wrapper{
    display: flex;
  }
}
</style>
