<script setup>
import { defineEmits, onMounted, ref, defineProps, watch } from 'vue';
import store from '@/store';

/** 변수선언 */
const headers = [
            { title: '정당', align: 'center', key: 'deptNm', sortable: false },
            { title: '이름', align: 'center', key: 'userNm', sortable: false },
            { title: '조회', align: 'center', key: 'searchYn', sortable: false },
            { title: '등록', align: 'center', key: 'createYn', sortable: false },
            { title: '수정', align: 'center', key: 'updateYn', sortable: false },
            { title: '삭제', align: 'center', key: 'deleteYn', sortable: false },
];   
const tableDatas = ref([]);
const emit = defineEmits(['close']);
const props = defineProps({
    show: Boolean,
    authInfo: {
        type: Object,
        required: true
    }
});
const dialog = ref(props.show);

/** function List */

/** 모달 닫기 */
const closeDialog = () => {
    dialog.value = false;
    emit('close');
}

/** 부서원 목록 조회 */
const fnSearch = () => {
 
    const apiUrl = "/api/dept/MemberUser";
    let params = {};

    params.API_PATH = apiUrl;
    params.deptId = props.authInfo.authCd;

    store.dispatch('API_LIST',params).then((data) => {
        tableDatas.value = data.resultList
        
        console.log(tableDatas.value)
    }).catch(({message}) => {
        console.log(message)
    })
}

const changedItems = ref([]);
/** 항목 변경 시 변경된 항목을 추적 */
const mappChanges = (item) => {
    if(!changedItems.value.includes(item)){
        changedItems.value.push(item);
    }
}

/** 저장 */
const fnSave = () => {

    if(changedItems.value.length == 0){
        alert('선택된 항목이 없습니다');
        return;
    }

    const jsonData = changedItems.value.map(item => ({
        createYn: item.createYn != null ? item.createYn : false,
        updateYn: item.updateYn != null ? item.updateYn : false,
        searchYn: item.searchYn != null ? item.searchYn : false,
        deleteYn: item.deleteYn != null ? item.deleteYn : false,
        userId: item.userId,
        deptCd: item.deptCd,
        folderId: props.authInfo.folderId
    }));

    const apiUrl = `/api/authMappUpdate`;
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData;

    store.dispatch('API_UPDATE', params).then((data) => {
        closeDialog();
    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

/** Dom객체 완성이후 */
onMounted(() => {
    fnSearch()
});

</script>

<template>
    <v-dialog v-model="dialog" max-width="800" @update:modelValue="val => !val && emit('close')">
        <v-card rounded="lg">
            <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">
                    권한설정
                </div>

                <v-btn
                    icon="mdi-close"
                    variant="text"
                    @click="closeDialog"
                ></v-btn>
            </v-card-title>

            <v-divider class="mb-4"></v-divider>

            <v-card-text>
                
                <v-data-table-virtual
                    :headers="headers"
                    :items="tableDatas"
                    density="compact"
                    item-key="id"
                    return-object
                >
                    <template v-slot:[`item.searchYn`]="{ item }">
                        <v-checkbox-btn
                            v-model="item.searchYn"
                            @change="mappChanges(item)"
                        ></v-checkbox-btn>
                    </template>
                    <template v-slot:[`item.createYn`]="{ item }">
                        <v-checkbox-btn
                            v-model="item.createYn"
                            @change="mappChanges(item)"
                        ></v-checkbox-btn>
                    </template>
                    <template v-slot:[`item.updateYn`]="{ item }">
                        <v-checkbox-btn
                            v-model="item.updateYn"
                            @change="mappChanges(item)"
                        ></v-checkbox-btn>
                    </template>
                    <template v-slot:[`item.deleteYn`]="{ item }">
                        <v-checkbox-btn
                            v-model="item.deleteYn"
                            @change="mappChanges(item)"
                        ></v-checkbox-btn>
                    </template>
                </v-data-table-virtual>

            </v-card-text>

            <v-divider class="mt-2"></v-divider>

            <v-card-actions class="my-2 d-flex justify-end sticky-actions">
                <v-btn
                    class="text-none"
                    rounded="xl"
                    text="Close"
                    @click="closeDialog"
                ></v-btn>

                <v-btn
                    class="text-none"
                    color="primary"
                    rounded="xl"
                    text="Save"
                    variant="flat"
                    @click="fnSave()"
                ></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
    .sticky-actions {
        position: sticky; 
        bottom: 0; 
        background-color: white; 
        padding: 16px; 
        z-index: 1; 
    }
</style>