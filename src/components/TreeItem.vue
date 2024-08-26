<script setup>
import { ref, onMounted, watch, defineEmits, defineProps } from "vue";
import Tree from 'primevue/tree';
import store from '@/store';
import { DeptTreeData } from '@/Js/DeptTreeData'; 
import '@/css/edv.css';
import '@/css/main.css';

// primevue css
import 'primevue/resources/themes/aura-light-blue/theme.css';
import { NodeService } from "@/Js/NodeJsService";


const nodes = ref([]);
const selectedKey = ref(null);
const nodeCk = ref()


const props = defineProps({
  pageIs : String,
  reloadTree : Boolean
})

onMounted(async () => {
  if(props.pageIs === 'dept') {
    nodes.value = await DeptTreeData.getTreeNodes();
  } else {
    nodes.value = await NodeService.getTreeNodes();
  }


});

const emit = defineEmits(['selectedKeyChange', 'deptDataList']);

watch(selectedKey, () => {
   emit('selectedKeyChange', selectedKey.value);
});



watch(() => props.reloadTree,  async () => {
  nodes.value = await DeptTreeData.getTreeNodes();
});



const handleNodeCk = (event) => {
  nodeCk.value = event.key;
  fnGetDeptData();
};


const fnGetDeptData = () => {
  let params = {}
  params.API_PATH = "/api/departments/" + nodeCk.value

  store.dispatch('API_LIST',params).then((data) => {
    emit('deptDataList', data.resultList)
  }).catch(({message}) => {
    console.log(message)
  })
}

</script>

<template>
  <v-card>
  <div class="treeWrapper">
  <Tree :value="nodes" :filter="true" filter-mode="lenient" selection-mode="single" v-model:selectionKeys="selectedKey" @node-select="handleNodeCk"></Tree>
</div>
</v-card>
</template>

<style>
.treeWrapper {
  height: 74.5vh;
  overflow-y: auto;

}
</style>
