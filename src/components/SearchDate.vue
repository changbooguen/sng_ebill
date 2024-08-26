<script setup>

import {ref, shallowRef, computed, watch, defineEmits, defineProps} from "vue";

const startDate = ref(null);
const endDate = ref(null);
const menu = ref(false);
const menu2 = ref(false);

const props = defineProps({
  start: String,
  end: String,
});

const emit = defineEmits(['update:start', 'update:end', 'search']);

const search = () => {
  const startDt = startDate.value ? formatDate(new Date(startDate.value)) : '';
  const endDt = endDate.value ? formatDate(new Date(endDate.value)) : ''
  emit('search', {startDate:startDt,endDate:endDt})
}

// Format the date to yyyy-mm-dd
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

// Computed properties for formatted dates
const formattedStartDate = computed({
  get: () => startDate.value ? formatDate(startDate.value) : '',
  set: (value) => {
    startDate.value = value ? new Date(value) : null;
    emit('update:start', startDate.value);
  }
});
const formattedEndDate = computed({
  get: () => endDate.value ? formatDate(endDate.value) : '',
  set: (value) => {
    endDate.value = value ? new Date(value) : null;
    emit('update:end', endDate.value);
  }
});

// Watchers to detect changes and trigger events
watch(startDate, (newValue, oldValue) => {
  // Trigger your custom event or function here
  search();
});

watch(endDate, (newValue, oldValue) => {
  search();
});

watch(() => props.start, (newValue) => {
  startDate.value = newValue ? new Date(newValue) : null;
});

watch(() => props.end, (newValue) => {
  endDate.value = newValue ? new Date(newValue) : null;
});

</script>

<template>




  <v-col cols="2">
    <v-menu v-model="menu" activator="parent"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"    
    >
      <template v-slot:activator="{ attrs }">
        <v-text-field
          v-model="formattedStartDate"
          label="시작일"
          append-inner-icon="mdi-calendar"
          readonly
          v-bind="attrs"
        ></v-text-field>
      </template>
      <v-confirm-edit v-model="startDate" @save="menu=!menu" @cancel="menu=!menu; startDate=null;">
        <template v-slot:default="{ model: proxyModel, actions }">
          <v-date-picker v-model="proxyModel.value">
            <template v-slot:actions>
              <component :is="actions"></component>
            </template>
          </v-date-picker>
        </template>
      </v-confirm-edit>
    </v-menu>
  </v-col>
  <v-col cols="2">
    <v-menu v-model="menu2" activator="parent"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"  
    >
      <template v-slot:activator="{ attrs }">
        <v-text-field
          v-model="formattedEndDate"
          label="종료일"
          append-inner-icon="mdi-calendar"
          readonly
          v-bind="attrs"
        ></v-text-field>
      </template>
      <v-confirm-edit v-model="endDate" @save="menu2=!menu2" @cancel="menu2=!menu2; endDate=null;">
        <template v-slot:default="{ model: proxyModel, actions }">
          <v-date-picker v-model="proxyModel.value">
            <template v-slot:actions>
              <component :is="actions"></component>
            </template>
          </v-date-picker>
        </template>
      </v-confirm-edit>
    </v-menu>

  </v-col>
</template>          
<style scoped>
</style>
