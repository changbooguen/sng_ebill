<script setup>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';
const { dataObj } = history.state;
const { searchStatus } = history.state;


/*변수선언*/
const router = useRouter();

const headers = [
    { title: '의안번호', align: 'right', key: 'billNumber', sortable: false },
    { title: '의안명', align: 'right', key: 'billName', sortable: false },
    { title: '제안자', align: 'center', key: 'proposerName', sortable: false },
    { title: '제안일', align: 'center', key: 'proposeDate', sortable: false },
    { title: '상임위', align: 'center', key: 'committeeId', sortable: false },
    { title: '회부일', align: 'center', key: 'submitDt', sortable: false },
    { title: '처리결과', align: 'center', key: 'proposeType', sortable: false },
];


/*Function List*/

/*조회*/
const fnSearch = () => {

    // sample
    const apiUrl = "/api/sample/comBoard";
    let params = {};
    params.API_PATH = apiUrl;
    params.size = 1000;

    store.dispatch('API_LIST', params).then((data) => {

        tableDatas.value = data.resultList;

    }).catch(({ message }) => {
        console.log("message : ", message);
    })

}

const fnGoDetail = (e, row) => {
    router.push({ name: '', params: { id: row.item.brdId } });
}

const fnGoList = (e) => {
    router.push({ name: 'BillQuickSearchMng' });
}

const formattedSearchConditions = computed(() => {
    return `검색조건 &nbsp= <span class="label">제안대수:</span> ${searchStatus.naTermCd1 || ' - '}
          대 ~ ${searchStatus.naTermCd2 || ' - '}대,
          <span class="label">의안종류:</span> ${searchStatus.billKind || ' - '},
          <span class="label">의안처리구분:</span> ${searchStatus.division || ' - '},
          <span class="label">제안종류:</span> ${searchStatus.ppslKndCd || ' - '},
          <span class="label">발의자명:</span> ${searchStatus.ppsrNm || ' - '},
          <span class="label">의안번호:</span> ${searchStatus.billNo || ' - '},
          <span class="label">의안명:</span> ${searchStatus.billName || ' - '}`;
});

/*Dom객체 완성이후*/
onMounted(() => {
    fnSearch(); //초기 조회

});


</script>

<template>

    <v-container class="lg-12">
        <v-row><v-col></v-col></v-row>
        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col><v-card variant="none" title="■ 검색결과" class="contentArea"></v-card></v-col>
            <v-col cols="1"></v-col>
        </v-row>

        <v-row>
            <v-col cols="1"></v-col>
            <v-col align="center">
                <v-card variant="outlined" style="padding: 10px;">
                    <div v-html="formattedSearchConditions"></div>
                </v-card>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>


        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col align="end" style="padding: 20px;">
                <v-btn style="margin-right:10px;" color="primary">엑셀 다운로드</v-btn>
                <v-btn variant="outlined" @click="fnGoList">간편검색</v-btn>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>

        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>

                <v-card variant="outlined">
                    <v-row class="lg-12"><v-col></v-col></v-row>
                    <v-row align="center" class="lg-12">

                        <v-data-table :headers="headers" :items="dataObj" item-key="billNumber"
                            @dblclick:row="fnGoDetail">
                            <template v-slot:[`item.billNumber`]="{ item }">
                                <span>&nbsp;{{ item.billNumber }}</span>
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

<style>
span.label {
    color: rgb(10, 46, 124);
    font-weight: bold;
    padding-left: 10px;
}
</style>