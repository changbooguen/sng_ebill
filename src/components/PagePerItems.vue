
<script setup>
import { defineProps, defineEmits} from "vue";

const props = defineProps({
  pagePerItems : {
    type : [String, Number],
    default : 10
}});
const pageSize = [10,30,50,100];
const emit = defineEmits([
  "updateNumItems"
]);
const updateNumItems  = (e)=>{
  emit("updateNumItems", e.target.value)
}


</script>

<template>
  <div>
    itemsPerPage
    <select name="numItems" id="numItems" @change="updateNumItems" >
      <template v-for="v in pageSize" :key="v">
        <template v-if="v == props.pagePerItems">
          <option selected :value="v">{{v}}</option>
        </template>
        <template v-if="v != props.pagePerItems">
          <option :value="v">{{v}}</option>
        </template>
      </template>
    </select>
  </div>
</template>

<style scoped>

</style>
