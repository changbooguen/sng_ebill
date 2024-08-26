<script setup>
import {inject, onMounted, onUpdated, ref} from "vue";
import {useRouter} from "vue-router";
import store from '@/store';
import AuthAddModal from "@/modal/AuthAddModal.vue";

/*변수선언*/
const router = useRouter();

const searchTitle = ref('');
const searchContents = ref('');
const menuTableDatas = ref([]);
const authTableDatas = ref([]);
const authHeaders = [
            { title: '권한 명', align: 'center', key: 'authNm', sortable: true }
];    
const menuHeaders = [
            { title: '메뉴 명', align: 'center', key: 'menuNm1'},
            { title: '순서', align: 'center', key: 'ord' }
];
const showModal = ref(false)

/*Function List*/

/** 검색어리셋 */
const fnReset= (e)=>{
    searchTitle.value = "";
    searchContents.value = "";
}

/** 권한 조회 */
const fnSearchAuth = ()=>{

    const listUrl = "/api/auths";
    let params = {};
    params.API_PATH = listUrl;

    store.dispatch('API_LIST',params).then((data) => {

        authTableDatas.value = data.resultList.content;

    }).catch(({message}) => {
        console.log("message : ", message);
    })

}

/** 메뉴권한 리스트 조회 */
const fnSearchMenu = (authId)=>{

    const listUrl = "/api/menus?page=0&size=100&sort=ord,asc";
    let params = {};
    params.API_PATH = listUrl;

    store.dispatch('API_LIST',params).then((data) => {

        menuTableDatas.value = data.resultList.content;

    }).catch(({message}) => {
        console.log("message : ", message);
    })

}

/** 권한선택 */
const fnSetAuth= (e,row)=>{
    const authIdx = row.item.authId;
    fnSearchMenu(authIdx);
}

/** 모달 */
const fnShowModal = (kind) => {
    if(kind == 'deptAdd'){
        showModal.value = true;
    }
}

/*Dom객체 완성이후*/
onMounted( () => {

    fnSearchAuth();//초기조회

});

</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="3">
                <v-card variant="elevated">
                    <v-col>
                        권한
                        <v-btn
                            text="추가"
                            variant="elevated"
                            v-bind="activatorProps"
                            @click="fnShowModal('deptAdd')"
                        ></v-btn>
                    </v-col>
                    <v-card variant="outlined">
                        <v-data-table
                            :headers="authHeaders"
                            :items="authTableDatas"
                            item-key="id"
                            :hide-default-footer="true"
                            :hover="true"
                            @click:row="fnSetAuth"
                            show-select
                            return-object
                        >
                        </v-data-table>
                    </v-card>
                    <v-col></v-col> 
                </v-card>
            </v-col>
            <v-col>
                <v-card variant="elevated">
                    <v-col>
                        권한별 메뉴
                        <v-btn
                            text="저장"
                            variant="elevated"
                            @click="fnShowModal('deptAdd')"
                        ></v-btn>
                    </v-col>
                    <v-card variant="outlined">
                        <v-data-table
                            :headers="menuHeaders"
                            :items="menuTableDatas"
                            :hover="true"
                        >
                        </v-data-table>
                    </v-card>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <AuthAddModal :show="showModal" @close="showModal = false" v-if="showModal"/>
</template>

<style scoped>

</style>