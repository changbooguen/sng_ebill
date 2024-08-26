<!-- SnackbarQueue.vue -->
<template>
    <v-snackbar
      v-model="snackbar.visible"
      :timeout="snackbar.timeout"
      color="blue-grey"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="hideSnackbar"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </template>
  
  <script>
  import { mapState, mapMutations } from 'vuex';
  
  export default {
    computed: {
      ...mapState({
        snackbar: state => state.snackbar,
      }),
    },
    methods: {
        ...mapMutations(['hideSnackbar']),
    },
  };
  </script>
  
  <style scoped>
  </style>
  