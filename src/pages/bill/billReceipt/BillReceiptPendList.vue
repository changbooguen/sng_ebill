<script setup>
import store from '@/store';
import { useRouter } from 'vue-router';
import { ref, onMounted } from "vue";
import billCodeComponent from "@/components/BillCodeComponent.vue";

/** 변수선언 */
const router = useRouter();
const srhStatCd = ref(null);
const srhBillName = ref(null);
const srhBillNo = ref(null);
const tableDatas = ref([]);
const headers = [
            {title: '접수번호', align: 'center', key: 'billNo'},
            {title: '의안명', align: 'center', key: 'billName', cellProps:{class:"textLeftClass"}},
            {title: '제안자', align: 'center', key: 'ppsrNm'},
            {title: '제안일', align: 'center', key: 'ppslDt', sortable: true},
            {title: '요청일', align: 'center', key: 'reqDt'},
            {title: '접수자', align: 'center', key: 'userNm'},
            {title: '접수일시', align: 'center', key: 'rcpDt'},
            {title: '상태', align: 'center', key: 'statCd'}, //codeNm
]
const loginInfo = ref(store.getters.loginInfo);
const CodeRef = ref(null);//CodeRef component


/** function List */


/** 데이터 변경 */
const processTableData = (data) => {
    return data.map(item => {

        if (item.rcpDt) {
            item.rcpDt = item.rcpDt.split('T')[0];
        }

        if (item.billName != null && item.billName.length > 30) {
            item.billName = item.billName.substring(0, 30) + "...";
        }
        return item;
    });
};

/** 조회 */
const fnSearch = () => {
    
    const listUrl = "/api/billReceiptPend"

    let params = {};
    params.API_PATH = listUrl;
    params.billNo = srhBillNo.value != null ? srhBillNo.value : '';
    params.billName = srhBillName.value != null ? srhBillName.value : '';
    //codeNm
    params.statCd = CodeRef.value.getCode();


    store.dispatch('API_LIST', params).then((data) => {
        tableDatas.value = processTableData(data.resultList);
    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

/** 상세조회 */
const fnGoDetail = (e, row) => {
    // router.push({name: 'billReceiptPendDetail', params : { id : row.item.billNo }});
    router.push({name: 'billReceiptPendDetail', params : { id : row.item.billId }});
}

/** Dom객체 완성이후 */
onMounted( () => {

    fnSearch();

});
</script>

<template>
    <v-container>
        <v-card variant="outlined">
            <v-row>
                <v-col>
                    <v-text-field 
                        label="접수번호" 
                        variant="outlined"
                        v-model="srhBillNo"
                        @keydown.enter="fnSearch"
                    ></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field 
                        label="의안명" 
                        variant="outlined"
                        v-model="srhBillName"
                        @keydown.enter="fnSearch"
                    ></v-text-field>
                </v-col>
                <v-col>
                    <!-- <v-select
                        label="상태"
                        :items="['접수대기', '접수', '승인대기', '승인', '의안등록']"
                        variant="outlined"
                        v-model="srhStatCd"
                    ></v-select> -->
                    <billCodeComponent ref="CodeRef" groupCode="PRGRP" />
                </v-col>
                <v-col cols="1">
                    <v-btn 
                        text="검색"
                        @click="fnSearch"
                    ></v-btn>
                </v-col>
            </v-row>
        </v-card>

        <v-row><v-col></v-col></v-row>
        <v-row>
            <v-col align="end">
                총 {{ tableDatas.length }}건
            </v-col>
        </v-row>

        <v-card variant="outlined">
            <v-data-table
                :headers="headers"
                :items="tableDatas"
                item-key="id"
                @dblclick:row="fnGoDetail"
                class="receiptPendCls"
            ></v-data-table>
        </v-card>
    </v-container>
</template>

<style>

</style>