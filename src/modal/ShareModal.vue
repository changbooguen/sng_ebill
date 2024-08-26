<script setup>
import { defineEmits, onMounted, ref, defineProps, watch } from 'vue';
import store from '@/store';

/** 변수선언 */
const memberHeaders = [
            { title: '정당', align: 'center', key: 'polyNm', sortable: false },
            { title: '이름', align: 'center', key: 'memberNm', sortable: false },
            { title: '이메일', align: 'center', key: 'email', sortable: false },
            { title: '전화번호', align: 'center', key: 'inrNo', sortable: false },
];   
const userHeaders = [
            { title: '부서', align: 'center', key: 'departmentName', sortable: false},
            { title: '직무', align: 'center', key: 'posCd', sortable: false },
            { title: '이름', align: 'center', key: 'userNm', sortable: false },
            { title: '이메일', align: 'center', key: 'email', sortable: false },
            { title: '전화번호', align: 'center', key: 'inrNo', sortable: false },
]; 
const headers = ref([]);
const tableDatas = ref([]);
const selectedItem = ref(null);
const emit = defineEmits(['close']);
const props = defineProps({
    show: Boolean,
    shareInfo: {
        type: Object,
        required: true
    }
});
const dialog = ref(props.show);
const tabKind = ref(null);

/** function List */

/** 모달 닫기 */
const closeDialog = () => {
    dialog.value = false;
    emit('close');
}

const fnSearch = () => {
    if(tabKind.value == 'member'){
        fnMember();
        headers.value = memberHeaders;
    } else if(tabKind.value == 'user') {
        fnUser();
        headers.value = userHeaders;
    }
}

/** 의원 목록 조회 */
const fnMember = () => {

    const apiUrl = '/api/members';

    let params = {};
    params.API_PATH = apiUrl;
    params.memberId = '';
    params.memberNm = '';

    store.dispatch("API_LIST", params).then((data) => {
        tableDatas.value = data.resultList;

    }).catch(({message}) => {
        console.log("message : " + message);
    })
}

/** 직원 목록 조회 */
const fnUser = () => {
    
    const apiUrl = '/api/users';

    let params = {};
    params.API_PATH = apiUrl;

    store.dispatch("API_LIST", params).then((data) => {
        tableDatas.value = data.resultList;
        
    }).catch(({message}) => {
        console.log("message : " + message);
    })
}
 
const fnSave = () => {
    
    let selected = [];

    console.log(selectedItem)
    if(tabKind.value == 'member'){
        selectedItem.value.forEach(item => selected.push(item.memberId));
    } else if(tabKind.value == 'user'){
        selectedItem.value.forEach(item => selected.push(item.userId));
    }
    
    let shareFolder = props.shareInfo.folderId;
    let shareFile = props.shareInfo.fileGroupId;
    let folderYn = props.shareInfo.folderYn;
    
    if(folderYn == 'Y'){
        shareFile = '';
    } else if ( folderYn == 'N') {
        shareFolder = '';
    }
    
    const jsonData = {
        selectedItem : selected,
        targetKind : tabKind.value,
        folderId : shareFolder,
        fileGroupId : shareFile,
        ownerId : props.shareInfo.ownerId,
        folderYn : folderYn, 
    }
    const apiUrl = '/api/share';

    let params = {}
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData;
    
    store.dispatch('API_SAVE',params).then((data) => {
        emit('close')
    }).catch(({message}) => {
        console.log("message : " + message);
    })
}

/** Dom객체 완성이후 */
onMounted(() => {
    tabKind.value = 'all'
    console.log(props.shareInfo)
});

watch(tabKind, (newValue) => {
  fnSearch(); // tabKind 값이 변경될 때마다 fnSearch를 호출
});
</script>


<template>
    <v-dialog v-model="dialog" max-width="600" @update:modelValue="val => !val && emit('close')">
        <v-card rounded="lg">
            <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">
                    공유
                </div>

                <v-tabs v-model="tabKind">
                    <v-tab
                        text="전체"
                        value="all"
                    ></v-tab>    
                    <v-tab 
                        text="의원"
                        value="member"
                    ></v-tab>
                    <v-tab 
                        text="직원"
                        value="user"
                    ></v-tab>
                </v-tabs>

                <v-btn
                    icon="mdi-close"
                    variant="text"
                    @click="closeDialog"
                ></v-btn>
            </v-card-title>

            <v-divider class="mb-4"></v-divider>

            <v-card-text>
                
                <v-tabs-window v-model="tabKind">
                    <v-tabs-window-item value="all">
                        전체에게 공유됩니다.
                    </v-tabs-window-item>

                    <v-tabs-window-item v-if="tabKind === 'member' || tabKind === 'user'" :value="tabKind">
                        <v-data-table-virtual
                            :headers="headers"
                            :items="tableDatas"
                            density="compact"
                            item-key="id"
                            show-select
                            return-object
                            v-model="selectedItem"
                        >
                            <template v-slot:[`item.regDt`]="{ item }">
                                {{ item.regDt.slice(0, item.regDt.indexOf('T')) }}
                            </template>
                        </v-data-table-virtual>
                    </v-tabs-window-item>

                </v-tabs-window>
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
                    text="Share"
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