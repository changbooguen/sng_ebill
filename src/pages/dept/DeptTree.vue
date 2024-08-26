<script setup>
import { ref, computed, onMounted, defineEmits, defineProps, watch } from 'vue';
import { VTreeview } from 'vuetify/labs/VTreeview';
import store from '@/store';

/** 변수선언 */
const emit = defineEmits(['close', 'deptValue']);

const props = defineProps({
    data: String,
    reload: Boolean
});
const tree = ref([]);
const treeContents = ref([]);
const lastSelectedNode = ref(null);
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
    return buildTree(treeContents.value);

});

/** 부서 선택 */
const fnUpdateTree = (e) => {
    const currentNode = e[0];
    if (e.length > 0) {
        if (lastSelectedNode.value && lastSelectedNode.value.id === currentNode.id) {
            tree.value = [];
        }
        lastSelectedNode.value = currentNode;
    }
    emit('deptValue', lastSelectedNode.value);
};

const fnClickTree = (e) => {
    emit('deptValue', e.id);
}

watch(() => props.reload, (newValue, oldValue) => {
    if (newValue) {
        fnSearch();
    } else if (newValue !== oldValue) {
        fnSearch();
    }
});


// DOM 객체 완성 이후
onMounted(() => {
    fnSearch(); // 초기 조회
});
</script>

<template>
    <transition name="modal" appear>
        <v-card min-height="610" variant="none">
            <v-card-text>
                <v-treeview density="compact" v-model:selected="tree" :items="filteredItems" item-value="id"
                    return-object @click:open="fnClickTree" @update:selected="fnUpdateTree" color="blue" slim="true" variant="plain">
                </v-treeview>
            </v-card-text>
        </v-card>
    </transition>
</template>
<style scoped></style>
