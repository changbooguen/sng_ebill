<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';
import ProgressShow from '@/pages/bill/monitor/ProgressShow.vue'
import ProgressGauge from '@/pages/bill/monitor/ProgressGauge.vue'


/*변수선언*/
const router = useRouter();

const billNo = ref('');
const billNm = ref('');
const tableDatas = ref([]);
const headers = [
    { title: '의안번호', align: 'center', key: 'billNumber', sortable: false, colspan: 1, rowspan: 2, width: '7vw' },
    { title: '의안명', align: 'left', key: 'billName', sortable: false, colspan: 1, rowspan: 2, width: '25vw' },
    { title: '접수일자', align: 'center', key: 'proposeDate', sortable: false, colspan: 1, rowspan: 2, cellProps: { class: 'dateClass' }, width: '9vw' },
    { title: '위원회', align: 'center', key: 'committee', sortable: false, colspan: 2, rowspan: 1 },
    { title: '본회의', align: 'center', key: 'generalMeeting', sortable: false, colspan: 2, rowspan: 1 },
    { title: '헌법위원회', align: 'center', key: 'constitutionCommittee', sortable: false, colspan: 1, rowspan: 2 },
    { title: '정부이송', align: 'center', key: 'govtSent', sortable: false, colspan: 1, rowspan: 2 },
    { title: '공포', align: 'center', key: 'announcement', sortable: false, colspan: 1, rowspan: 2 },
];
const gauageList = ref(Array(8).fill(-30))
const statusValue = ref(2)

/*Function List*/

/*검색어리셋*/
const fnReset = (e) => {
    billNo.value = "";
    billNm.value = "";
}

/*조회*/
const fnSearch = () => {

    // sample
    const apiUrl = "/api/bill/monitoring";
    let params = {};
    params.API_PATH = apiUrl;
    params.billNo = billNo.value;
    params.billName = billNm.value;
    params.size = 1000;

    store.dispatch('API_LIST', params).then((data) => {
        tableDatas.value = data.resultList.data;
        tableDatas.value = data.resultList.data.map(item => ({
            ...item,
            gaugeValue: calculateGaugeValue(item.billStatus)
        }));
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}


const calculateGaugeValue = (billStatus) => {
    gauageList.value = Array(8).fill(-30)
    if (billStatus === '접수완료') {
        return gauageList.value = [85, -30, -30, -30, -30, -30, -30, -30]
    } else if (billStatus === 'PR110') {
        return gauageList.value = [100, 100, 85, -30, -30, -30, -30, -30]
    } else if (billStatus === 'PR120') {
        return gauageList.value = Array(8).fill(100)//[100, 100, 100, 100, 80, -30, -30, -30];
    }
    console.log(gauageList.value)
    return gauageList.value;
}



const fnGoDetail = (e, row) => {
    router.push({ name: 'sampleDetail', params: { id: row.item.brdId } });
}

/*Dom객체 완성이후*/
onMounted(() => {

    fnSearch();//초기조회

});

const repeatArray = ref(new Array(7).fill(null));

</script>

<template>

    <v-container class="lg-12">

        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>
                <v-card>
                    <v-row class="lg-12"><v-col></v-col></v-row>
                    <v-row align="center" class="lg-12">
                        <v-col>
                            <v-text-field label="의안번호" type="input" @keydown.enter="fnSearch" v-model="billNo"
                                style="padding-left: 30px;"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field label="의안명" type="input" @keydown.enter="fnSearch" v-model="billNm">
                            </v-text-field>
                        </v-col>
                        <v-col>
                            <v-row align="center" justify="center">
                                <v-col cols="auto">
                                    <v-btn variant="outlined" @click="fnSearch">검색</v-btn>
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



        <!-- 테이블 -->
        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>
                <v-card variant="none">
                    <v-row class="lg-12"><v-col></v-col></v-row>
                    <v-row align="center" class="lg-12">
                        <v-col style="padding-right: 30px;">
                            <v-data-table :headers="headers" :items="tableDatas" item-key="id" class="tableArea">

                                <!-- headers custom -->
                                <template v-slot:headers>
                                    <tr>
                                        <th v-for="(header, i) in headers" :key="i" :rowspan="header.rowspan"
                                            :colspan="header.colspan" :align="header.align"
                                            :style="{ width: header.width }">
                                            {{ header.title }}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th class="thArea">접수</th>
                                        <th class="thArea">의결</th>
                                        <th class="thArea">부의</th>
                                        <th class="thArea">의결</th>
                                    </tr>
                                </template>

                                <template v-slot:item="{ item }">
                                    <tr>
                                        <td>{{ item.billNumber }}</td>
                                        <td>{{ item.billName }}</td>
                                        <td class="dateTd">{{ item.proposeDate }}</td>
                                        <!-- <td v-for="(item, i) in item.gaugeValue" :key="i" style="padding: 0;">
                                            <ProgressShow :value="item" style="padding: 0px;"/>
                                        </td> -->
                                        <td v-for="(item, i) in repeatArray" :key="i" style="padding: 0;">
                                            <ProgressGauge :count="i" :progressValue="statusValue" />
                                        </td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>
    </v-container>

</template>

<style scoped>
.dateTd {

    text-align: center;
}

.selected {
    background-color: red
}

.tableArea {
    margin-left: 15px;
}

th {
    background-color: #f5f5f5;
    text-align: center;
    font-weight: 500;
    padding: 10px;
    border: 1px solid white;
    text-align: center !important;
}

.thArea {
    width: 5vw;
}

/* td {
    border-right: 1px solid #e7e7e7;
} */
</style>