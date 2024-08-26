<script setup>
import { ref, defineProps } from 'vue';
const props = defineProps({
  value: Number
})
const progress = ref(props.value);
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="progress-wrapper">
          <v-progress-linear v-model="progress" color="primary" height="20" class="custom-progress"></v-progress-linear>
          <!-- 화살표 div -->
          <div class="progress-arrow" :style="{ left: `${progress}%` }"></div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.progress-wrapper {
  position: relative;
  /* width: 100%; */
  height: 20px;
}

.custom-progress {
  height: 20px;
}

.progress-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-left: 11px solid #1867C0;
}
</style>
