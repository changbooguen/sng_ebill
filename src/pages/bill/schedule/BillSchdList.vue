<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  selectTab: String
})
</script>

<template>
  <v-container v-if="selectTab === '0'">
    <v-card variant="none" class="detailArea">
      <div>2024.07.01(Tue)</div>
      <hr>
      <div class="dotTitle">
        <div class="dot"></div>
        <div>국회 본회의</div>
      </div>
      <div class="dotDetail">14:00 본회의장</div>
      <hr>
      <div class="dotTitle">
        <div class="dot"></div>
        <div>국회 본회의</div>
      </div>
      <div class="dotDetail">16:00 본회의장</div>
      <hr>
    </v-card>
  </v-container>

  <v-container v-if="selectTab === '1'">
    <v-card variant="none" class="detailArea">
      <div>2024.07.01(Tue)</div>
      <hr>
      <div class="dotTitle">
        <div class="dot"></div>
        <div>국회 본회의</div>
      </div>
      <div class="dotDetail">14:00 본회의장</div>
      <hr>
    </v-card>
  </v-container>


  <v-container v-if="selectTab === '2'">
    <v-card variant="none" class="detailArea">
      <div>2024.07.01(Tue)</div>
      <hr>
      <div class="dotTitle">
        <div class="dot"></div>
        <div>위원회 회의</div>
      </div>
      <div class="dotDetail">16:00 위원회 회의장</div>
      <hr>
    </v-card>
  </v-container>
</template>

<style scoped>
.dotTitle {
  display: flex;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
  /* 점의 색상 */
  margin: 3px 10px 0 0;
}

.dotDetail {
  margin-left: 20px;
  color: #858585;
}
</style>