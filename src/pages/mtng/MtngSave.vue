<script setup>
import { inject, onMounted, onUpdated, ref } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';
import ebillSearch from "@/modal/EbillSearchModal.vue";
import comDptmUserModal from "@/modal/ComDptmUserModal.vue";

/*변수선언*/
const router = useRouter();
const ebillSearchRef = ref(null);//의안검색팝업
const comDptmUserRef = ref(null);//참가자팝업
const participants = ref([]);//참가자목록

const title = ref('');
const title_rules = [
    value => {
        if (value) return true
        return '제목은 필수 입력값입니다.'
    },
];

const selectBills = ref([])
const saveForm = ref(null);
const formValid = ref(null);
const mtngType = ref('conference')
const ageCd = ref('')
const mtngDt = ref('')
const mtngPlc = ref('')
const atdtId = ref('PD2468')
const rmk = ref('')



const headers = ref([
    { title: '의안번호', align: 'center', key: 'billNumber', sortable: true },
    { title: '의안명', align: 'center', key: 'billName', sortable: true, cellProps: { class: "textLeftClass" } },
    { title: '제안일', align: 'center', key: 'proposeDate', sortable: true },
    { title: '제안자', align: 'center', key: 'proposerName', sortable: true },
    { title: '제출일', align: 'center', key: 'submitDt', sortable: false }
]);

const tableDatas = ref([]);



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

const fnSave = (e) => {

    if (!fnValidate()) {
        return;
    }

    const jsonData = {
        mtngTypeCd: mtngType.value,
        ageCd: ageCd.value,
        mtngPlc: mtngPlc.value,
        openDtm: formatDate(mtngDt.value),//(시작일시),
        mtngSj: rmk.value
    }

    let params = {};
    params.API_PATH = "/api/mtng/save";
    params.JSON_DATA = jsonData;

    store.dispatch('API_SAVE', params).then((data) => {

        fnAtdtSave(data.resultObj.data.mtngId);

        tableDatas.value.forEach(item => {
            fnBillSave(data.resultObj.data.mtngId, item.billId);
        })

        fnGoList();
    }).catch(({ message }) => {
        console.log("message : ", message);
    })

}

const fnEbillSearch = () => {
    ebillSearchRef.value.fnOpen();
};

const fnSetBills = (returnArr) => {
    //tableDatas.value = returnArr;
    const filteredItems = returnArr.filter(newItem => {
        return !tableDatas.value.some(item => item.billNumber === newItem.billNumber);
    });
    tableDatas.value = [...tableDatas.value, ...filteredItems];
};


const fnPartiUsersSearch = () => {
    comDptmUserRef.value.fnOpen();
};

const fnSetParticipant = (returnArr) => {
    participants.value = returnArr;
};

//삭제
const fnDelete = () => {
    const billIds = selectBills.value.map(item => item.billId);
    tableDatas.value = tableDatas.value.filter(item => {
        return !billIds.includes(item.billId);
    });
}

//참석자 저장
const fnAtdtSave = (id) => {
    let params = {}

    const jsondata = {
        mtngId: id,
        atdtId: atdtId.value,
    }

    params.API_PATH = "/api/mtng/attendants"
    params.JSON_DATA = jsondata

    store.dispatch('API_SAVE', params).then((data) => {

    }).catch(({ message }) => {
        console.log(message)
    })
}

//회의안건 저장
const fnBillSave = (id, billId) => {
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

/*Dom객체 완성이후*/
onMounted(() => {

});

</script>


<template>

    <v-container class="lg-12">

        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>■ &nbsp;회의 등록</v-col>
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
                            <v-col cols="5">
                                <v-card-text>
                                    <span class="subheading">참가자</span>
                                    <v-chip-group>
                                        <v-chip v-for="item in participants" :key="item.userId" :text="item.userNm">
                                        </v-chip>
                                    </v-chip-group>
                                </v-card-text>


                            </v-col>
                            <v-col cols="auto"><v-btn @click="fnPartiUsersSearch">선택</v-btn></v-col>
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
                            <v-col align="end"><v-btn variant="outlined" @click="fnEbillSearch">안건등록</v-btn></v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-card style="height: 50vh; overflow-y: auto;" variant="none">
                                    <v-data-table :headers="headers" :items="tableDatas" density="compact"
                                        item-key="billNo" items-per-page="-1" show-select return-object :hover="true"
                                        hide-default-footer v-model="selectBills"></v-data-table>
                                </v-card>
                            </v-col>
                        </v-row>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn type="submit" @click="fnSave" variant="outlined">저장</v-btn>
                            <v-btn variant="outlined" @click="fnGoList">취소</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>



    </v-container>
    <ebillSearch ref="ebillSearchRef" @selectedBills="fnSetBills" />
    <comDptmUserModal ref="comDptmUserRef" @selectedUsers="fnSetParticipant" />

</template>

<style scoped>
.paddingArea {
    padding: 20px;
}

.textLeftClass {
    text-align: left !important;
}
</style>
