<script setup>

  import {ref, getCurrentInstance } from "vue";

  const {emit} = getCurrentInstance()

  const searchText = ref('');

  const search = () => {
    emit('search', searchText.value)
  }

</script>

<template>
  <div>
    <label>제목 </label><input class="searchTitle" type="text" v-model="searchText" placeholder="제목을 입력하세요." @keyup.enter="search">
    <v-btn variant="toned" @click="search">검색</v-btn>
  </div>
</template>

<style scoped>
.searchTitle {
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
}

</style>