<script setup>

import {ref, defineEmits} from "vue";

const code = ref('');
const emit = defineEmits(['search']);

const handleInput = () => {
    emit('search', code.value);
};
</script>

<template>
    <label>
    코드ID
   
    </label>
    <input class="searchCode" type="text" v-model="code" @input="handleInput">
    <button type="button" @click="search">검색</button>
</template>
