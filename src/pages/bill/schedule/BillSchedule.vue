<script setup>
import { ref } from "vue";
import BillSchdCalendar from '@/pages/bill/schedule/BillSchdCalendar.vue';
const selectTab = ref('0');
</script>

<template>
  <v-container class="lg-12">

    <v-row class="lg-12">
      <v-col cols="1"></v-col>


      <v-col>

          <v-card variant="none" title="■ 의사일정" class="contentArea">
            <v-row>
              <div class="tabs">
                <v-btn variant="plain" class="tab" :class="{ active: selectTab === '0' }"
                  @click="selectTab = '0'">전체</v-btn>
                <v-btn variant="plain" class="tab" :class="{ active: selectTab === '1' }"
                  @click="selectTab = '1'">본회의</v-btn>
                <v-btn variant="plain" class="tab" :class="{ active: selectTab === '2' }"
                  @click="selectTab = '2'">위원회</v-btn>
              </div>

              <v-col cols="12">
                <v-card-text class="calArea">
                  <div v-if="selectTab === '0'">
                    <BillSchdCalendar :select-tab="selectTab" />
                  </div>
                  <div v-else-if="selectTab === '1'">
                    <BillSchdCalendar :select-tab="selectTab" />
                  </div>
                  <div v-else-if="selectTab === '2'">
                    <BillSchdCalendar :select-tab="selectTab" />
                  </div>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>

      </v-col>


      <v-col cols="1"></v-col>
    </v-row>
  </v-container>
</template>



<style scoped>
.tabs {
  display: flex;
  position: relative;
  left: 8%;
  margin: 20px;
}

.tab {
  color: black;
  background-color: white;
  cursor: pointer;
  width: 10vw;
  height: 6vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
}

.tab.active {
  color: black;
  border-bottom: 3px solid black;
  border-top: none;
  border-right: none;
  border-left: none;
  border-radius: 0;
}
</style>