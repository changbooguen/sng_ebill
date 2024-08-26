<script setup>

  import {ref, getCurrentInstance} from "vue";

  const {emit} = getCurrentInstance()

  const userId = ref('');

  const search = () => {
    emit('search', userId.value)
  }

  const bind = () => {
    emit('bind', userId.value)
  }

</script>

<template>
  <label>아이디 </label><input class="searchId" type="text" v-model="userId" @keyup.enter="search" @change="bind">
</template>

<style scoped>

</style>