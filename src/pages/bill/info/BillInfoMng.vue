<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';

/*변수선언*/
const router = useRouter();

const searchLawNm = ref('');
const tableDatas = ref([]);
const headers = [
    { title: '법률Id', align: 'center', key: 'lawId', sortable: true },
    { title: '법률명1', align: 'left', key: 'lawNm1', sortable: true, cellProps: { class: "lawNmClass" } },
    { title: '법률명2', align: 'left', key: 'lawNm2', sortable: true, cellProps: { class: "lawNmClass" } },
    { title: '등록일', align: 'center', key: 'regDt', sortable: false },
    { title: '등록자Id', align: 'center', key: 'regId', sortable: false }
];

const selectedId = ref(null)

/*Function List*/

/*검색어리셋*/
const fnReset = (e) => {
    searchLawNm.value = "";
}

/*조회*/
const fnSearch = () => {

    const apiUrl = "/api/getBillInfo/";
    let params = {};
    params.API_PATH = apiUrl;
    params.lawNm = searchLawNm.value;
    params.size = 1000;

    store.dispatch('API_LIST', params).then((data) => {
        tableDatas.value = data.resultList;

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnGoDetail = (e, row) => {
    router.push({ name: 'billinfoDetail', params: { id: row.item.lawId } })
}

const fnGoSave = (e, row) => {
    router.push({
        name: 'billinfoSave'
    })
}

const fnGoDelete = (e, row) => {
    const confirmd = confirm("삭제하시겠습니까?")
    if(confirmd) {
        let deleteItems = [];
    if (selectedId.value) {
        selectedId.value.forEach(item => deleteItems.push(item.lawId));

        let params = {}
        params.API_PATH = `/api/billInfo/delete/`
        params.deleteItems = deleteItems;

        store.dispatch('API_DELETE', params).then((data) => {
            location.reload();
        }).catch(({ message }) => {
            console.log(message)
        })
    }
    }
    
}


/*Dom객체 완성이후*/
onMounted(() => {

    fnSearch();//초기조회

});

</script>

<template>

    <v-container class="lg-12">

        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>
                <v-card>
                    <v-row class="lg-12"><v-col></v-col></v-row>

                    <v-row align="center" class="lg-12">
                        <v-col cols="9">
                            <v-text-field label="법률명" type="input" @keydown.enter="fnSearch" v-model="searchLawNm"
                                style="padding-left: 40px;">
                            </v-text-field>
                        </v-col>

                        <v-col cols="3">

                            <v-row align="center" justify="center">
                                <v-col cols="auto">
                                    <v-btn variant="outlined" @click="fnSearch">조회</v-btn>
                                </v-col>
                                <v-col cols="auto">
                                    <v-btn variant="outlined" @click="fnReset">reset</v-btn>
                                </v-col>
                            </v-row>

                        </v-col>
                    </v-row>

                    <v-row class="lg-12"><v-col></v-col></v-row>
                </v-card>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>

        <v-row class="lg-12">
            <v-col cols="1"></v-col>

            <v-col>
                <v-btn variant="outlined" @click="fnGoDelete">삭제</v-btn>
            </v-col>
            <v-col align="end">
                <v-btn variant="outlined" @click="fnGoSave">글쓰기</v-btn>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>


        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>

                <v-card variant="outlined">
                    <v-row class="lg-12"><v-col></v-col></v-row>
                    <v-row align="center" class="lg-12">

                        <v-data-table :headers="headers" :items="tableDatas" density="compact" item-key="lawId"
                            @click:row="fnGoDetail" return-object show-select style="padding : 0px 15px" :hover="true"
                            v-model="selectedId">
                            <template v-slot:[`item.regDt`]="{ item }">
                                <span>{{ item.regDt ? item.regDt.slice(0, 10) : item.regDt }}</span>
                            </template>
                        </v-data-table>

                    </v-row>
                    <v-row class="lg-12"><v-col></v-col></v-row>
                </v-card>

            </v-col>
            <v-col cols="1"></v-col>
        </v-row>

    </v-container>

</template>

<style scoped>
.lawNmClass {
    width: 20vw;
    text-align: left !important;
}
</style>