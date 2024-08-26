<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';

/*변수선언*/
const router = useRouter();

const searchBillNo = ref('')
const searchBillNm = ref('')

const tableDatas = ref([]);
const headers = [ //todo 의결일, 기권 key 수정 및 데이터 호출
    { title: 'No', align: 'center', key: 'no', sortable: false, cellProps: { class: "textLeftClass" } },
    { title: '의결일', align: 'center', key: 'plnrDt', sortable: false, cellProps: { class: "textLeftClass" } },
    { title: '의안번호', align: 'center', key: 'billNo', sortable: false },
    { title: '의안명', align: 'center', key: 'billName', sortable: false },
    { title: '위원회', align: 'center', key: 'cmtId', sortable: false },
    { title: '찬성', align: 'center', key: 'agree', sortable: false },
    { title: '반대', align: 'center', key: 'disagree', sortable: false },
    { title: '기권', align: 'center', key: 'abs', sortable: false },
    { title: '결과', align: 'center', key: 'plnrResult', sortable: false },
];


/*Function List*/
/*검색어리셋*/
const fnReset= (e)=>{
    searchBillNo.value = "";
    searchBillNm.value = "";
}
/*조회*/
const fnSearch = () => {

    let params = {};
    params.API_PATH = "/api/vote/result";
    params.billId = searchBillNo.value
    params.billName = searchBillNm.value
    params.size = 1000;

    store.dispatch('API_LIST', params).then((data) => {
        tableDatas.value = data.resultList;
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnGoDetail = (e, row) => {
    router.push({ name: 'BillVoteRList', params: { id: row.item.billId } })
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
            <v-col><v-card variant="none" title="■ 본회의표결정보" class="contentArea"></v-card></v-col>
            <v-col cols="1"></v-col>
        </v-row>

        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>
                <v-card  variant="outlined">
                    <v-row class="lg-12"><v-col></v-col></v-row>
    
                    <v-row align="center" class="lg-12">
                    <v-col>
                        <v-text-field label="의안번호"  type="input" @keydown.enter="fnSearch" v-model="searchBillNo" > </v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field label="의안명"  type="input" @keydown.enter="fnSearch" v-model="searchBillNm" > </v-text-field>
                    </v-col>
                    <v-col>
                      
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

                <v-card variant="outlined">
                    <v-row class="lg-12"><v-col></v-col></v-row>
                    <v-row align="center" class="lg-12">

                        <v-data-table :headers="headers" :items="tableDatas" density="compact" item-key="id"
                            @dblclick:row="fnGoDetail" :hover="true">
                            <template v-slot:[`item.no`]="{ index }">{{ index + 1 }}</template>
                        </v-data-table>
                    </v-row>
                    <v-row class="lg-12"><v-col></v-col></v-row>
                </v-card>

            </v-col>
            <v-col cols="1"></v-col>
        </v-row>

    </v-container>

</template>

<style></style>