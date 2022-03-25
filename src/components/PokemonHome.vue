<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12" class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Pokemon fullstack App (front)
        </h1>
      </v-col>
      <v-col
        cols="12"
        style="
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        "
      >
        <v-btn
          color="secondary"
          large
          x-large
          x-small
          v-if="!showPokemon"
          v-on:click="handleFetch"
          >{{ data.length ? 'SHOW ALL POKEMONS' : 'GET ALL POKEMONS' }}</v-btn
        >
        <v-btn
          color="secondary"
          large
          x-large
          x-small
          v-if="showPokemon"
          v-on:click="hideContent"
          >HIDE ALL POKEMONS</v-btn
        >
        <v-btn
          color="secondary"
          large
          x-large
          x-small
          v-on:click="toggleCreating"
          >ADD POKEMON</v-btn
        >

        <v-btn color="secondary" large x-large x-small v-on:click="toggleSearch"
          >GET POKEMON BY ID</v-btn
        >
      </v-col>
      <v-col cols="12">
        <v-form
          ref="newForm"
          v-model="valid"
          lazy-validation
          style="display: flex; gap: 1rem"
          v-if="creating"
        >
          <v-text-field
            v-model="pokemonName"
            :counter="50"
            :rules="nameRules"
            label="Name"
            required
            style="width: 20vw"
            ref="name"
          ></v-text-field>

          <v-text-field
            v-model="pokemonType"
            :counter="30"
            :rules="typeRules"
            label="Type"
            required
            style="width: 20vw"
            ref="type"
          ></v-text-field>

          <div>
            <v-btn
              large
              style="margin: 0.5rem"
              color="green darken-1"
              @click="handleNew()"
            >
              <v-icon color="white lighten-1">mdi-check</v-icon>
            </v-btn>
            <v-btn
              large
              style="margin: 0.5rem"
              color="red darken-1"
              @click="toggleCreating"
            >
              <v-icon color="white lighten-1">mdi-cancel</v-icon>
            </v-btn>
          </div>
        </v-form>
        <v-form
          ref="searchingForm"
          v-model="valid"
          lazy-validation
          style="display: flex; gap: 1rem"
          v-if="searchingById"
        >
          <v-text-field
            v-model="pokemonID"
            :counter="50"
            :rules="nameRules"
            label="ID"
            required
            style="width: 5vw"
            ref="id"
          ></v-text-field>

          <div>
            <v-btn
              large
              style="margin: 0.5rem"
              color="green darken-1"
              @click="handleSearch()"
            >
              <v-icon color="white lighten-1">mdi-check</v-icon>
            </v-btn>
            <v-btn
              large
              style="margin: 0.5rem"
              color="red darken-1"
              @click="toggleSearch"
            >
              <v-icon color="white lighten-1">mdi-cancel</v-icon>
            </v-btn>
          </div>
        </v-form>
        <div v-if="!success">Oops! Something went wrong</div>
        <div v-else-if="showPokemon">
          <v-list-item
            two-line
            subheader
            v-for="item in data"
            :key="item?.name"
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 5rem;
            "
          >
            <span>ID: {{ item.id }}</span>
            <v-list-item-content>
              <div
                v-if="editingId === item.id"
                style="display: flex; gap: 1rem"
              >
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                  style="display: flex; gap: 1rem"
                >
                  <v-text-field
                    v-model="pokemonName"
                    :counter="50"
                    :rules="nameRules"
                    label="Name"
                    required
                    style="width: 20vw"
                    ref="name"
                  ></v-text-field>

                  <v-text-field
                    v-model="pokemonType"
                    :counter="30"
                    :rules="typeRules"
                    label="Type"
                    required
                    style="width: 20vw"
                    ref="type"
                  ></v-text-field>

                  <div>
                    <v-btn
                      large
                      style="margin: 0.5rem"
                      color="green darken-1"
                      @click="validate(item.id)"
                      v-if="editingId === item.id"
                    >
                      <v-icon color="white lighten-1">mdi-check</v-icon>
                    </v-btn>
                    <v-btn
                      large
                      style="margin: 0.5rem"
                      color="red darken-1"
                      @click="toggleEditState"
                      v-if="editingId === item.id"
                    >
                      <v-icon color="white lighten-1">mdi-cancel</v-icon>
                    </v-btn>
                  </div>
                </v-form>
              </div>
              <v-list-item-title v-if="editingId !== item.id">{{
                `${item?.name.slice(0, 1).toUpperCase()}${item?.name.slice(1)}`
              }}</v-list-item-title>
              <v-list-item-subtitle v-if="editingId !== item.id">{{
                `${item?.type.slice(0, 1).toUpperCase()}${item?.type.slice(1)}`
              }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                style="margin: 0.5rem"
                v-on:click="handleDelete(item.id)"
                v-if="editingId !== item.id"
              >
                <v-icon color="grey lighten-1">mdi-delete</v-icon>
              </v-btn>
              <v-btn
                icon
                style="margin: 0.5rem"
                v-on:click="toggleEditState(item.id)"
                v-if="editingId !== item.id"
              >
                <v-icon color="grey lighten-1">mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import {
    deletePokemon,
    editPokemon,
    useFetch,
    createPokemon,
    searchByID,
  } from '@/api/persistanceFn'
  import { Data } from '@/interfaces/Data'
  import { defineComponent } from 'vue'
  import {
    fetchAllUrl,
    deleteUrl,
    editUrl,
    newUrl,
    searchByIdUrl,
  } from '../constants/url'

  export default defineComponent({
    name: 'PokemonHome',
    data() {
      return {
        dialog: false,
        showPokemon: false,
        success: true,
        data: [],
        editing: false,
        creating: false,
        searchingById: false,
        deleteSuccess: false,
        editSuccess: false,
        createSuccess: false,
        editingId: '',
        nameRules: [
          (v) => !!v || 'Name is required',
          (v) =>
            (v && v.length <= 50) || 'Name must be less than 50 characters',
        ],
        typeRules: [
          (v) => !!v || 'Type is required',
          (v) =>
            (v && v.length <= 30) || 'Type must be less than 30 characters',
        ],
      }
    },
    methods: {
      async updateUI() {
        const { data, success, error } = await useFetch(fetchAllUrl)
        this.data = data
      },
      async handleFetch() {
        // if (this.data?.length) {
        //   this.showPokemon = !this.showPokemon
        //   return
        // } //disabled in order to let searchByID and SearchByParam work correctly when wanting to display all pokemons again after filter
        const { data, success, error } = await useFetch(fetchAllUrl)

        this.success = success
        this.showPokemon = success
        this.data = data
        error && console.error(error)
      },
      async handleDelete(id: string) {
        const deletedPokemon = await deletePokemon(id, deleteUrl)

        const { success, error } = deletedPokemon

        this.deleteSuccess = success
        error && alert(error)

        this.data = success
          ? this.data.filter((pokemon) => pokemon?.id !== id)
          : this.data
      },
      toggleEditState(id: string) {
        this.editing = !this.editing
        this.editingId = id || ''
      },
      toggleCreating() {
        this.creating = !this.creating
      },
      toggleSearch() {
        this.searchingById = !this.searchingById
      },
      async handleSearch() {
        const ID = this.pokemonID
        if (!ID) return alert('ID cannot be empty')

        const pokemon = await searchByID(searchByIdUrl, ID)
        const { success, error, data } = pokemon

        this.searchByIDSuccess = success

        error && alert(error)

        this.data = data

        this.toggleSearch()
      },
      async handleNew() {
        this.$refs.newForm.validate()

        const inputsForm = await this.$refs.newForm.validate()
        if (!inputsForm.valid) return

        const updatedData: Data = {
          name: this.pokemonName.toLowerCase(),
          type: this.pokemonType.toLowerCase(),
        }

        const newPokemon = await createPokemon(newUrl, updatedData)
        const { success, error } = newPokemon

        this.createSuccess = success

        error && alert(error)
        this.updateUI()

        this.creating = false
      },
      async validate(id: string) {
        //NOW IT WORKS; FIX TEXT AUTOCOMPLETED ON INPUT WHEN CLICKING SECOND EDIT BUTTON
        this.$refs.form[0].validate()

        const inputsForm = await this.$refs.form[0].validate()
        if (!inputsForm.valid) return

        const updatedData = {
          name: this.pokemonName.toLowerCase(),
          type: this.pokemonType.toLowerCase(),
        }
        const editedPokemon = await editPokemon(editUrl, updatedData, id)
        const { success, error } = editedPokemon

        this.editSuccess = success

        error && alert(error)

        this.data = success
          ? this.data.map((pokemon) =>
              pokemon?.id === id ? { id, ...updatedData } : pokemon
            )
          : this.data

        this.editing = false
        this.editingId = ''
      },

      hideContent() {
        this.showPokemon = false
      },
    },
  })
</script>

<style>
  h1 {
    border: '1px solid red';
  }
</style>
