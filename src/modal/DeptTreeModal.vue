<script setup>
import { ref, computed, onMounted, defineEmits, defineProps } from 'vue';
import { VTreeview } from 'vuetify/labs/VTreeview';
import store from '@/store';

/** 변수선언 */
const emit = defineEmits(['close', 'deptValue']);
const props = defineProps({
  data: String,
  show: Boolean
});

const deptTreeModal = ref(props.show);
const tree = ref([]);
const treeContents = ref([]);
const searchTr = ref("");

/** function List */

// 데이터 로드 함수
const fnSearch = () => {
  const listUrl = "/api/deptTree";
  const params = {};
  params.API_PATH = listUrl;

  store.dispatch('API_LIST', params).then((data) => {
    treeContents.value = data.resultList;
  }).catch(({ message }) => {
    console.log("message : " + message);
  });
};

// 트리 아이템 생성 함수
const buildTree = (items, parentId = 0) => {
  const tree = [];

  for (let item of items) {
    if (item.uprDeptId == parentId) {
      const children = buildTree(items, item.deptId);
      const treeNode = {
        id: item.deptId,
        title: item.deptNm,
        children: children.length ? children : undefined
      };
      tree.push(treeNode);
    }
  }

  return tree;
};

/** 부서 검색 */
const filteredItems = computed(() => {
  if (!searchTr.value) {
    return buildTree(treeContents.value);
  }
  const filtered = treeContents.value.filter(data => data.deptNm.includes(searchTr.value));
  return buildTree(filtered);
});

/** 부서 저장 */
const fnSave = () => {
  const deptIdx = tree.value[0];
  const deptMap = treeContents.value.filter(data => data.deptId === deptIdx).map(data => ({
    id: data.deptId,
    title: data.deptNm
  }));

  if (tree.value.length > 0) {
    emit('deptValue', deptMap);
    emit('close', false);
  } else {
    emit('close', false);
  }
};

/** 부서 선택 */
const selectedTree = (e) => {
  tree.value = [e.id];
};


// DOM 객체 완성 이후
onMounted(() => {
  fnSearch(); // 초기 조회
});
</script>

<template>
  <transition name="modal" appear>
    <v-dialog v-model="deptTreeModal" max-width="350" @update:modelValue="val => !val && emit('close')">
      <v-card min-height="600">
        <v-row>
          <v-col>
            <v-card-text>
              <v-text-field
                v-model="searchTr"
                clear-icon="mdi-close-circle-outline"
                label="부서 검색"
                clearable
                hide-details
              >
              </v-text-field>

              <v-treeview
                v-model:selected="tree"
                :items="filteredItems"
                selected-color="indigo"
                item-value="id"
                selectable
                return-object
                open-all
                :active-strategy="'independent'"
                @click:open="selectedTree"
              ></v-treeview>
            </v-card-text>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="emit('close')"></v-btn>

          <v-btn
            color="primary"
            text="Save"
            variant="tonal"
            type="submit"
            @click="fnSave"
          ></v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
  </transition>
</template>

<style scoped>

</style>
