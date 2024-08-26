<script setup>
import store from '@/store';
import { ref, defineEmits, onMounted, defineProps } from 'vue';
import showDeptModal from '@/modal/DeptTreeModal.vue';

/** 변수선언 */
const emit = defineEmits(['closeModal']); 

const memberId = ref('');
const memberNm = ref('');
const pswd = ref('');
const pswdChk = ref('');
const polyCd = ref(''); //정당코드
const ageCd = ref(''); //대별코드
const deptId = ref('');
const cmitCd = ref(''); //소속위원회코드
const statCd = ref(''); //상태코드
const email = ref('');
const mblNo = ref('');
const inrNo = ref('');

const saveForm = ref(null);
const formValid = ref(null);
const deptItems = ref([]);
const deptContents = ref([]); 
const selectedDept = ref('');
const isReadonly = ref(false);
const modalVisible = ref(false);
const props = defineProps({
  show: Boolean,
})

/** function List */

const dialog = ref(props.show);

const closeDialog = () => {
    dialog.value = false;
    emit('close');
}

const fnValidate = (e) => {
  saveForm.value?.validate();
  return formValid.value;
}

/** 저장 */
const fnSave = (e) => {
    if(!fnValidate()){
        return;
    }

    const setDeptId = deptContents.value.filter(data => data.deptNm === selectedDept.value).map(data => ({
        id: data.deptId
    }));

    const jsonData = {
        memberId: memberId.value,
        memberNm: memberNm.value,
        pswd: pswd.value,
        pswdChk: pswdChk.value,
        polyCd: polyCd.value,
        ageCd: ageCd.value,
        deptId: props.selectedDeptId !== undefined? props.selectedDeptId : setDeptId.length != 0 ? setDeptId[0].id : '',
        cmitCd: cmitCd.value,
        statCd: statCd.value,
        email: email.value,
        mblNo: mblNo.value,
        inrNo: inrNo.value,
    }

    const apiUrl = "/api/members"
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData;

    store.dispatch('API_SAVE', params).then((data) => {
        let getData = data.resultObj.data;

        if(getData.deptId != ""){
            setDeptFolderMapp(getData);
        } else {
            emit('close', false);
        }
    }).catch(({message}) => {
        console.log("message : ", message)
    })
}

// 부서 조회
const fnDeptSearch = () => {
    const listUrl = "/api/deptTree";
    const params = {};
    params.API_PATH = listUrl;

    store.dispatch('API_LIST', params).then((data) => {
        deptItems.value = data.resultList;

        deptItems.value.forEach(data => {
            deptContents.value.push({
                deptId: data.deptId,
                deptNm: data.deptNm
            });
        });

    }).catch(({ message }) => {
        console.log("message : " + message);
    });
};

const fnOpen = () => {
    modalVisible.value = true;
}

const handleDeptValue = (val) => {
    selectedDept.value = val[0].title;
};

const memberId_rules = [
  v => !!v || '필수값입니다.',
  v => (v && v.length >= 1) || '최소1글자 이상',
];

const memberNm_rules = [
  v => !!v || '필수값입니다.',
  v => (v && v.length >= 1) || '최소1글자 이상',
];

const pswd_rules = [
  v => !!v || '필수값입니다.',
  v => (v && v.length >= 3) || '최소1글자 이상',
];

const pswdChk_rules = [
  v => !!v || '필수값입니다.',
  v => (v && v === pswd.value) || '비밀번호와 다른 값 입니다.',
];

const setDeptFolderMapp = (item) => {
    const jsonData = {
        deptCd : item.deptId,
        userId : item.memberId,
    };

    const apiUrl = "/api/setMemberAuthMapp";
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData;

    store.dispatch('API_SAVE',params).then((data) => {
        emit('close', false);
    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

/*Dom객체 완성이후*/
onMounted(() => {
    fnDeptSearch();

    if(props.data != null){
        selectedDept.value = props.data;
        isReadonly.value = true;
    } 
});

</script>

<template>
    <v-dialog v-model="dialog" max-width="480" @update:modelValue="val => !val && emit('close')">
        <v-card prepend-icon="mdi-account" title="User Profile">
            <v-card-text>
                <v-form @submit.prevent ref="saveForm" v-model="formValid">
                    <v-row>■ 국회의원 등록</v-row>
                    <v-divider></v-divider>
                    <v-sheet>
                        <v-row>개인정보</v-row>

                        <v-row dense>
                            <v-col cols="4">아이디 :</v-col>
                            <v-col>
                                    <v-text-field
                                    v-model="memberId"
                                    label="아이디"
                                    variant="outlined"
                                    density="compact"
                                    width="15rem"
                                    :rules="memberId_rules"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row dense>
                            <v-col cols="4">이름 :</v-col>
                            <v-col>
                                <v-text-field
                                    v-model="memberNm"
                                    label="이름"
                                    variant="outlined"
                                    density="compact"
                                    width="15rem"
                                    :rules="memberNm_rules"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row dense>
                            <v-col cols="4">비밀번호 :</v-col>
                            <v-col>
                                <v-text-field
                                    type="password"
                                    v-model="pswd"
                                    label="비밀번호"
                                    variant="outlined"
                                    density="compact"
                                    width="15rem"
                                    :rules="pswd_rules"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row dense>
                            <v-col cols="4">비밀번호 확인 :</v-col>
                            <v-col>
                                <v-text-field
                                    type="password"
                                    v-model="pswdChk"
                                    label="비밀번호"
                                    variant="outlined"
                                    density="compact"
                                    width="15rem"
                                    :rules="pswdChk_rules"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row dense>
                            <v-col cols="4">휴대전화 :</v-col>
                            <v-col>
                                <v-text-field
                                    v-model="mblNo"
                                    label="휴대전화"
                                    variant="outlined"
                                    density="compact"
                                    width="15rem"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row dense>
                            <v-col cols="4">이메일 :</v-col>
                            <v-col>
                                <v-text-field
                                    v-model="email"
                                    label="이메일"
                                    variant="outlined"
                                    density="compact"
                                    width="15rem"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-divider></v-divider>

                        <v-row>회사정보</v-row>

                        <v-row dense>
                            <v-col cols="4">부서 :</v-col>
                            <v-col>
                                <v-combobox
                                    label="부서 선택"
                                    :items="deptContents.map(dept => dept.deptNm)"
                                    variant="solo"
                                    @selectPosition="positionVal = $event"
                                    density="compact"
                                    width="10rem"
                                    v-model="selectedDept"
                                    :readonly="isReadonly"
                                ></v-combobox>
                            </v-col>
                            <v-col>
                                <v-btn v-if="!props.data" variant="elevated" @click="fnOpen">조회</v-btn>
                            </v-col>
                        </v-row>

                        <v-row dense>
                            <v-col cols="4">정당(코드) :</v-col>
                            <v-col>
                                <v-text-field
                                    v-model="polyCd"
                                    label="소속 정당"
                                    variant="outlined"
                                    density="compact"
                                    width="15rem"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row dense>
                            <v-col cols="4">대별코드 :</v-col>
                            <v-col>
                                <v-text-field
                                    v-model="ageCd"
                                    label="대별코드"
                                    variant="outlined"
                                    density="compact"
                                    width="15rem"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row dense>
                            <v-col cols="4">소속위원회 :</v-col>
                            <v-col>
                                <v-text-field
                                    v-model="cmitCd"
                                    label="소속위원회"
                                    variant="outlined"
                                    density="compact"
                                    width="15rem"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-form>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="sticky-actions">
                <v-spacer></v-spacer>
                <v-btn text="Close" variant="plain" @click="$emit('close', false)"></v-btn>
                <v-btn
                    color="primary"
                    text="Save"
                    variant="tonal"
                    type="submit"
                    @click="fnSave"
                ></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <showDeptModal v-if="modalVisible" :show="modalVisible" @close="modalVisible = false" @deptValue="handleDeptValue" class="side-modal"/>
</template>

<style scoped>
.modal-wrapper {
    position: fixed;
    width: 32%; /* 모달의 너비를 전체 화면의 50%로 설정 */
}

.sticky-actions {
    position: sticky; 
    bottom: 0; 
    background-color: white; 
    padding: 16px; 
    z-index: 1; 
}
</style>