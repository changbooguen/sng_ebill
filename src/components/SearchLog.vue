<script setup>

  import {ref, getCurrentInstance} from "vue";

  const {emit} = getCurrentInstance()

  const reqUrl = ref('');

  const search = () => {
    emit('search', reqUrl.value)
  }
</script>

<template>
  <label>접속주소 </label><input class="searchId" type="text" v-model="reqUrl" @keyup.enter="search">
</template>

<style scoped>

</style>