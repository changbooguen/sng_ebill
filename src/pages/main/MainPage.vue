<script setup>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

onMounted(async () => {
      await store.dispatch('API_CODE_LIST');
});


</script>

<template>
  <h2>MAIN</h2>

</template>
