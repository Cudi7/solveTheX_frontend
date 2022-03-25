<template>
  <v-app>
    <v-main>
      <AppBar />
      <PokemonHome />
    </v-main>
  </v-app>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import PokemonHome from './components/PokemonHome.vue'
  import AppBar from './components/AppBar.vue'

  export default defineComponent({
    name: 'App',

    components: {
      AppBar,
      PokemonHome,
    },

    data() {
      return {}
    },
  })
</script>
