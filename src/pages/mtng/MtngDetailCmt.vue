<script setup>
import { onMounted, ref, defineProps } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';


/*변수선언*/
const router = useRouter();
const props = defineProps({
    id: String
})


const selectBills = ref(null)
const saveForm = ref(null);
const formValid = ref(null);
const mtngPlc = ref('')
const atdtIs = ref('16인 / 16인')
const plnrPrsntDt = ref('')
const billIds = ref([])

const mtngTypeCd = ref('상임위원회')
const cmtId = ref('T00001')
const ageCd = ref('')
const openDate = ref('')
const openTime = ref('')
const closeDtm = ref('')
const results = ref([])


const rmk = ref('')
const headers = ref([
    { title: '의안번호', align: 'center', key: 'billNumber', sortable: true },
    { title: '의안명', align: 'center', key: 'billName', sortable: false },
    { title: '제안일', align: 'center', key: 'ppslDt', sortable: false },
    { title: '제안자', align: 'center', key: 'ppsrNm', sortable: false },
    { title: '제출일', align: 'center', key: 'no', sortable: false },
    { title: '결과', align: 'center', key: 'result', sortable: false },
])
const tableDatas = ref([])


/*Function List*/
// Format the date to yyyy-mm-ddT:hh:ss
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    const hours = (`0${d.getHours()}`).slice(-2);
    const minutes = (`0${d.getMinutes()}`).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};


const fnGoList = (e) => {
    router.push({ name: 'cmtMtngMng' });
}

/*글저장*/
const fnValidate = (e) => {
    const data = saveForm.value?.validate();
    return formValid.value;
};

const fnSave = () => {

    if (!fnValidate()) {
        return;
    }
    const jsonData = {
        mtngTypeCd: mtngTypeCd.value,
        ageCd: ageCd.value,
        mtngPlc: mtngPlc.value,
        openDtm: openDate.value + 'T' + openTime.value,
        closeDtm: openDate.value + 'T' + closeDtm.value,
        mtngSj: rmk.value,
    }

    let params = {};
    params.API_PATH = `/api/mtng/save`;
    params.JSON_DATA = jsonData;
    store.dispatch('API_SAVE', params).then((data) => {

        billIds.value.forEach(id => {
            fnAgendaSave(data.resultObj.data.mtngId, id)
        })

        fnGoList();
    }).catch(({ message }) => {
        console.log("message : ", message);
    })

}


//회의마스터 수정
const fnUpdate = () => {
    if (!fnValidate()) {
        return;
    }

    const jsonData = {
        ageCd: ageCd.value,
        mtngPlc: mtngPlc.value,
        openDtm: openDate.value + 'T' + openTime.value,
        closeDtm: openDate.value + 'T' + closeDtm.value,
        mtngSj: rmk.value,
        mtngId: props.id,
    }

    let params = {};
    params.API_PATH = `/api/mtng`;
    params.JSON_DATA = jsonData;

    store.dispatch('API_UPDATE', params).then((data) => {
        billIds.value.forEach(id => {
            fnAgendaUpdate(id)
        })
        fnGoList();
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
};


//위원회별 안건 목록
const fnCmtBill = () => {
    let params = {};
    params.API_PATH = `/api/bill/cmt/${cmtId.value}`; //위원회 아이디 master에서? dept에서?

    store.dispatch('API_LIST', params).then((data) => {
        tableDatas.value = data.resultList.data
        billIds.value = data.resultList.data.map(item => item.billId)

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

//회의마스터별 상세 조회
const fnGetData = () => {

    let params = {};
    params.API_PATH = `/api/mtng/detail/${props.id}`;

    store.dispatch('API_LIST', params).then((data) => {
        const item = data.resultList.data

        ageCd.value = item.ageCd
        openDate.value = item.openDtm ? item.openDtm.slice(0, 10) : ''
        openTime.value = item.openDtm ? item.openDtm.slice(11, 16) : ''
        closeDtm.value = item.closeDtm ? item.closeDtm.slice(11, 16) : ''
        mtngPlc.value = item.mtngPlc
        rmk.value = item.mtngSj
    }).catch(({ message }) => {
        console.log("message : ", message);
    })

}

//안건 조회
const fnAgenda = () => {
    let params = {};
    params.API_PATH = `/api/mtng/agenda/${props.id}`;

    store.dispatch('API_LIST', params).then((data) => {
        const index = data.resultList.data.map(item => item.billId)
        const rsltCd = data.resultList.data.map(item => item.rsltCd)
        index.forEach((item, idx) => {
            results.value[item] = rsltCd[idx];
        })
        console.log(results.value)
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

//안건 저장
const fnAgendaSave = (id, billId) => {
    let params = {}
    const jsondata = {
        mtngId: id,
        billId: billId,
        rsltCd: results.value[billId],
    }

    params.API_PATH = "/api/mtng/agendas"
    params.JSON_DATA = jsondata

    store.dispatch('API_SAVE', params).then((data) => {

    }).catch(({ message }) => {
        console.log(message)
    })
}

//안건 수정
const fnAgendaUpdate = (billId) => {

    let params = {}
    const jsondata = {
        billId: billId,
        rsltCd: results.value[billId]
    }

    params.API_PATH = "/api/mtng/agendas"
    params.JSON_DATA = jsondata
    store.dispatch('API_UPDATE', params).then((data) => {

    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnSaveAll = () => {
    if (props.id !== '0') {
        fnUpdate();
    } else {
        fnSave();
    }

}


/*Dom객체 완성이후*/
onMounted(() => {
    if (props.id !== '0') {
        fnGetData();
    }
    fnCmtBill();
    fnAgenda();
});

</script>


<template>

    <v-container class="lg-12">

        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>■ &nbsp;위원회 회의 등록</v-col>
            <v-col cols="1"></v-col>
        </v-row>


        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>

                <v-card variant="outlined" class="paddingArea">
                    <v-form @submit.prevent ref="saveForm" v-model="formValid">

                        <v-row dense align="center">
                            <v-col>
                                <v-text-field label="회의구분" v-model="mtngTypeCd"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-select label="위원회" v-model="cmtId" @update:model-value="fnCmtBill"></v-select>
                            </v-col>
                        </v-row>

                        <v-row dense>
                            <v-col>
                                <v-text-field density="compact" label="대수" v-model="ageCd"></v-text-field>
                            </v-col>
                            <v-col><v-text-field density="compact" label="출석현황" v-model="atdtIs"></v-text-field></v-col>
                            <v-col cols="auto"><v-btn>참석인원</v-btn></v-col>
                        </v-row>

                        <v-row dense>
                            <v-col>
                                <v-text-field type='date' label="회의일시" v-model="openDate"></v-text-field>
                            </v-col>
                            <v-col><v-text-field type='time' label="개의 시각" v-model="openTime"></v-text-field></v-col>
                            <v-col><v-text-field type='time' label="산회 시각" v-model="closeDtm"></v-text-field></v-col>
                        </v-row>

                        <v-row dense>
                            <v-col><v-text-field label="비고" v-model="rmk"></v-text-field></v-col>
                            <v-col><v-text-field label="회의장소" v-model="mtngPlc"></v-text-field></v-col>
                        </v-row>

                        <v-row class="lg-12"><v-col></v-col></v-row>


                        <v-row>
                            <v-col>
                                <v-card style="height: 50vh; overflow-y: auto;" variant="none">
                                    <v-data-table :headers="headers" :items="tableDatas" density="compact"
                                        item-key="billNo" return-object :hover="true" hide-default-footer
                                        v-model="selectBills">
                                        <template v-slot:[`item.result`]="{ item }">
                                            <tr>
                                                <td style="width: 6vw; padding:10px 0 0;"><v-select
                                                        v-model="results[item.billId]" :items="['가결', '부결']"
                                                        item-value="id"></v-select></td>
                                            </tr>
                                        </template>
                                    </v-data-table>
                                </v-card>
                            </v-col>
                        </v-row>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn type="submit" @click="fnSaveAll()" variant="outlined">저장</v-btn>
                            <v-btn variant="outlined" @click="fnGoList">목록</v-btn>
                        </v-card-actions>

                    </v-form>
                </v-card>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>

    </v-container>

</template>

<style scoped>
.paddingArea {
    padding: 20px;
}
</style>