<script setup>
import { ref, onMounted, watch, defineEmits } from "vue";
import Tree from 'primevue/tree';
import { NodeService } from '@/Js/NodeJsService'; 
import '@/css/edv.css';
import '@/css/main.css';

// primevue css
import 'primevue/resources/themes/aura-light-blue/theme.css';

const nodes = ref([]);
const selectedKey = ref(null);

onMounted(async () => {
  nodes.value = await NodeService.getTreeNodes();
});

const emit = defineEmits(['selectedKeyChange']);

watch(selectedKey, () => {
   emit('selectedKeyChange', selectedKey.value);
});

</script>

<template>
  <div class="treeWrapper">
  <Tree :value="nodes" :filter="true" filter-mode="lenient" class="" selection-mode="single" v-model:selectionKeys="selectedKey"></Tree>
</div>
</template>

<style>
.treeWrapper {
  height: 72.5vh;
  border-radius: 5px;
}
</style>
