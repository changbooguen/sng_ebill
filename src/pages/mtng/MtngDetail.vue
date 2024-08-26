selectBills
<script setup>
import { onMounted, ref, defineProps } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';
import ebillSearch from "@/modal/EbillSearchModal.vue";

/*변수선언*/
const router = useRouter();
const props = defineProps({
    id: String
})
const ebillSearchRef = ref(null);//의안검색팝업

const selectBills = ref(null)
const saveForm = ref(null);
const formValid = ref(null);
const ageCd = ref('')
const mtngDt = ref('')
const mtngPlc = ref('')
const atdtIs = ref('16인 / 16인')
const cmtId = ref('T00001')
const plnrPrsntDt = ref('')
const billIds = ref([])
const deleteBillId = ref([])


const rmk = ref('')
const headers = ref([
    { title: '의안번호', align: 'center', key: 'billNo', sortable: true },
    { title: '의안명', align: 'center', key: 'billName', sortable: false },
    { title: '제안일', align: 'center', key: 'ppslDt', sortable: false },
    { title: '제안자', align: 'center', key: 'ppsrNm', sortable: false },
    { title: '제출일', align: 'center', key: 'no', sortable: false },
    { title: '결과입력', align: 'center', key: 'result', sortable: false },
])
const tableDatas = ref([])


/*Function List*/
// Format the date to yyyy-mm-dd
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
    router.push({ name: 'MtngMng' });
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
        ageCd: ageCd.value,
        mtngPlc: mtngPlc.value,
        openDtm: formatDate(mtngDt.value),//(시작일시)
        mtngSj: rmk.value,
        mtngId: props.id,
    }

    let params = {};
    params.API_PATH = `/api/mtng`;
    params.JSON_DATA = jsonData;

    store.dispatch('API_UPDATE', params).then((data) => {
        tableDatas.value.forEach(item => {
            fnAgendaSave(data.resultObj.data.mtngId, item.billId);
        })
        fnGoList();
    }).catch(({ message }) => {
        console.log("message : ", message);
    })

}

//회의 마스터 수정
const fnBillSave = (id, type) => {
    let cmtIdIs = cmtId.value
    if (type === 'none') {
        cmtIdIs = null
    }
    const jsonData = {
        plnrPrsntDt: formatDate(plnrPrsntDt.value),
        cmtId: cmtIdIs,
        billId: id
    }


    let params = {};
    params.API_PATH = `/api/bill`;
    params.JSON_DATA = jsonData;

    store.dispatch('API_UPDATE', params).then((data) => {
        console.log(data)
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

//회의안건 저장
const fnAgendaSave = (id, billId) => {
    let params = {}

    const jsondata = {
        mtngId: id,
        billId: billId,
        procId: '1' //todo 수정
    }

    params.API_PATH = "/api/mtng/agendas"
    params.JSON_DATA = jsondata

    store.dispatch('API_SAVE', params).then((data) => {

    }).catch(({ message }) => {
        console.log(message)
    })
}

//마스터 업데이트 위원회 삭제
const fnUpdateCmt = (billId) => {
    let params = {}
    params.API_PATH = `/api/bill/`
    const jsonData = {
        billId: billId,
        cmtId: ''
    }
    params.JSON_DATA = jsonData

    store.dispatch('API_UPDATE', params).then((data) => {
        console.log(data)
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnEbillSearch = () => {
    ebillSearchRef.value.fnOpen();
};

//todo 회의안건 수정



/*상세글가져오기*/
const fnGetData = () => {

    let params = {};
    params.API_PATH = `/api/mtng/detail/${props.id}`;

    store.dispatch('API_LIST', params).then((data) => {
        const item = data.resultList.data
        ageCd.value = item.ageCd
        mtngDt.value = item.openDtm
        mtngPlc.value = item.mtngPlc
        rmk.value = item.mtngSj
    }).catch(({ message }) => {
        console.log("message : ", message);
    })

}

//회의안건 리스트
const fnGetAgenda = () => {
    let params = {};
    params.API_PATH = `/api/mtng/agenda/${props.id}`;

    store.dispatch('API_LIST', params).then((data) => {
        billIds.value = data.resultList.data.map(item => item.billId)

        billIds.value.forEach(billIdIs => {
            fnGetBill(billIdIs)
        });

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}


const fnUpdate = () => {
    fnSave();

    billIds.value.forEach(billIdIs => {
        fnBillSave(billIdIs, 'cmt')
    });

    fnDeleteAgenda();

    deleteBillId.value.forEach(id => {
        fnBillSave(id, 'none');
    })
}

//의안 목록
const fnGetBill = (billId) => {
    let params = {};
    params.API_PATH = `/api/mtng/bill/${billId}`;

    store.dispatch('API_LIST', params).then((data) => {
        tableDatas.value.push(data.resultList.data)

        plnrPrsntDt.value = data.resultList.data.plnrPrsntDt
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}


//등록 안건 삭제 
const fnDelete = () => {
    deleteBillId.value = selectBills.value.map(item => item.billId);

    tableDatas.value = tableDatas.value.filter(item => {
        return !deleteBillId.value.includes(item.billId);
    });
}

//등록 의안 삭제시 의안 위원회아이디, 회의안건 삭제
const fnDeleteAgenda = () => {
    let params = {}
    let deleteItems = [];
    deleteItems = deleteBillId.value

    params.API_PATH = "/api/agenda"
    params.deleteItems = deleteItems;

    store.dispatch('API_DELETE', params).then((data) => {
        console.log(data)
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnSetBills = (returnArr) => {
    //tableDatas.value = returnArr;
    const filteredItems = returnArr.filter(newItem => {
        return !tableDatas.value.some(item => item.billNumber === newItem.billNumber);
    });
    tableDatas.value = [...tableDatas.value, ...filteredItems];
};

/*Dom객체 완성이후*/
onMounted(() => {
    fnGetData();
    fnGetAgenda();
});

</script>


<template>

    <v-container class="lg-12">

        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>■ &nbsp;회의 상세</v-col>
            <v-col cols="1"></v-col>
        </v-row>


        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>

                <v-card variant="outlined" class="paddingArea">
                    <v-form @submit.prevent ref="saveForm" v-model="formValid">

                        <v-row dense align="center">
                            <v-col cols="auto">회의구분 : </v-col>
                            <v-col cols="3"><v-text-field density="compact" label="대 conference 회의"
                                    v-model="ageCd"></v-text-field></v-col>
                            <v-col><v-text-field type="datetime-local" density="compact" label="회의일시"
                                    v-model="mtngDt"></v-text-field></v-col>
                        </v-row>

                        <v-row dense>
                            <v-col><v-text-field density="compact" label="회의장소"
                                    v-model="mtngPlc"></v-text-field></v-col>
                            <v-col cols="5"><v-text-field density="compact" label="출석 현황"
                                    v-model="atdtIs"></v-text-field></v-col>
                            <v-col cols="auto"><v-btn>출석</v-btn></v-col>
                        </v-row>

                        <v-row dense>
                            <v-col><v-text-field label="General Report" v-model="report"></v-text-field></v-col>
                        </v-row>

                        <v-row dense>
                            <v-col><v-text-field label="비고" v-model="rmk"></v-text-field></v-col>
                        </v-row>

                        <v-row class="lg-12"><v-col></v-col></v-row>

                        <v-row dense>
                            <v-col><v-btn variant="outlined" @click="fnDelete">삭제</v-btn></v-col>
                            <v-spacer></v-spacer>
                            <v-col align="end"><v-btn variant="outlined" @click="fnEbillSearch">안건추가</v-btn></v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-card style="height: 50vh; overflow-y: auto;" variant="none">
                                    <v-data-table :headers="headers" :items="tableDatas" density="compact"
                                        item-key="billNo" items-per-page="-1" show-select return-object :hover="true"
                                        hide-default-footer v-model="selectBills">
                                        <template v-slot:[`item.result`]>
                                            <tr>
                                                <td style="padding-top: 15px;"><v-text-field label="소관위원회"
                                                        v-model="cmtId"></v-text-field></td>
                                            </tr>
                                            <tr>
                                                <td><v-text-field label="관련위원회"></v-text-field></td>
                                            </tr>
                                            <tr>
                                                <td style="width: 20vw;"><v-text-field label="본회의" type="datetime-local"
                                                        v-model="plnrPrsntDt"></v-text-field></td>
                                            </tr>
                                        </template>
                                    </v-data-table>
                                </v-card>
                            </v-col>
                        </v-row>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn type="submit" @click="fnUpdate" variant="outlined">수정</v-btn>
                            <v-btn variant="outlined">결과보고</v-btn>
                            <v-btn variant="outlined" @click="fnGoList">목록</v-btn>
                        </v-card-actions>

                    </v-form>
                </v-card>



            </v-col>
            <v-col cols="1"></v-col>
        </v-row>
        <ebillSearch ref="ebillSearchRef" @selectedBills="fnSetBills" />
    </v-container>

</template>

<style scoped>
.paddingArea {
    padding: 20px;
}
</style>