<script setup>
import store from '@/store';
import { ref, defineEmits, onMounted, defineProps } from 'vue';
import showDeptModal from '@/modal/DeptTreeModal.vue';

/* 변수 선언 */
const userNm = ref('');
const userId = ref('');
const pswd = ref('');
const pswdChk = ref('');
const mblNo = ref('');
const posCd = ref('');
const inrNo = ref('');
const email = ref('');
const statCd = ref('');
const role = ref('USER');
const initDt = ref('');
const selectedDept = ref('');
const isReadonly = ref(false);

const emit = defineEmits(['close', 'reload']); 
const modalVisible = ref(false);
const saveForm = ref(null);
const formValid = ref(null);

const deptItems = ref([]);
const deptContents = ref([]); 

const props = defineProps({
    data: String,
    show: Boolean,
    selectedDeptId : String
})

/* function List */

const fnValidate = (e) => {
    saveForm.value?.validate();
    return formValid.value;
}

const fnSave = (e) => {

    if(!fnValidate()){
        return;
    }

    const setDeptId = deptContents.value.filter(data => data.deptNm === selectedDept.value).map(data => ({
        id: data.deptId
    }));

    const jsonData = {
        userId: userId.value,
        userNm: userNm.value,
        pswd: pswd.value,
        pswdChk: pswdChk.value,
        posCd: posCd.value,
        email: email.value,
        statCd: statCd.value,
        deptId: props.selectedDeptId !== undefined? props.selectedDeptId : setDeptId.length != 0 ? setDeptId[0].id : '',
        role: role.value,
        initDt: initDt.value,
    }

    const apiUrl = "/api/users";
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData;

    store.dispatch('API_SAVE',params).then((data) => {
        let getData = data.resultObj.data;

        if(getData.deptId != ""){
            setDeptFolderMapp(getData);
        } else {
            emit('close', false);
            emit('reload')
        }

    }).catch(({message}) => {
        console.log("message : ", message);
    })

}

const userId_rules = [
    v => !!v || '필수값입니다.',
    v => (v && v.length >= 1) || '최소1글자 이상',
];

const userName_rules = [
    v => !!v || '필수값입니다.',
    v => (v && v.length >= 1) || '최소1글자 이상',
];

const userPswd_rules = [
    v => !!v || '필수값입니다.',
    v => (v && v.length >= 3) || '최소1글자 이상',
];

const userPswdChk_rules = [
    v => !!v || '필수값입니다.',
    v => (v && v === pswd.value) || '비밀번호와 다른 값 입니다.',
];

const handleDeptValue = (val) => {
    selectedDept.value = val[0].title;
};

const fnOpen = () => {
    modalVisible.value = true;
}

const dialog = ref(props.show);

const closeDialog = () => {
    dialog.value = false;
    emit('close');
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

const setDeptFolderMapp = (item) => {

    const jsonData = {
        deptCd : item.deptId,
        userId : item.userId,
    };

    const apiUrl = "/api/setUserAuthMapp";
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData;

    store.dispatch('API_SAVE',params).then((data) => {
        emit('close', false);
        emit('reload')
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
                <v-row>
                개인정보
                </v-row>

                <v-row dense>
                <v-col cols="4">아이디 :</v-col>
                <v-col>
                    <v-text-field
                        v-model="userId"
                        label="아이디"
                        variant="outlined"
                        density="compact"
                        width="15rem"
                        :rules="userId_rules"
                    ></v-text-field>
                </v-col>
                </v-row>

                <v-row dense>
                <v-col cols="4">이름 :</v-col>
                <v-col>
                    <v-text-field
                        v-model="userNm"
                        label="이름"
                        variant="outlined"
                        density="compact"
                        width="15rem"
                        :rules="userName_rules"
                    ></v-text-field>
                </v-col>
                </v-row>

                <v-row dense>
                <v-col cols="4">비밀번호 :</v-col>
                <v-col>
                    <v-text-field
                        v-model="pswd"
                        type="password"
                        label="비밀번호"
                        variant="outlined"
                        density="compact"
                        width="15rem"
                        :rules="userPswd_rules"
                    ></v-text-field>
                </v-col>
            </v-row>
            
            <v-row dense>
                <v-col cols="4">비밀번호 확인 :</v-col>
                <v-col>
                    <v-text-field
                        v-model="pswdChk"
                        type="password"
                        label="비밀번호 확인"
                        variant="outlined"
                        density="compact"
                        width="15rem"
                        :rules="userPswdChk_rules"
                    ></v-text-field>
                </v-col>
            </v-row>
            
            <v-row dense>
                <v-col cols="4">전화번호 :</v-col>
                <v-col>
                    <v-text-field
                        type="tel"
                        v-model="mblNo"
                        label="전화번호"
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
                <v-col cols="4">직위 :</v-col>
                <v-col>
                    <v-combobox
                        label="직위 선택"
                        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                        variant="solo"
                        @selectPosition="positionVal = $event"
                        density="compact"
                        width="15rem"
                    ></v-combobox>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="4">전화번호 :</v-col>
                <v-col>
                    <v-text-field
                        type="tel"
                        v-model="inrNo"
                        label="전화번호"
                        variant="outlined"
                        density="compact"
                        width="15rem"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="4">임용일 :</v-col>
                <v-col>
                    <v-text-field
                        type="date"
                        v-model="initDt"
                        label="임용일"
                        variant="outlined"
                        density="compact"
                        width="15rem"
                    ></v-text-field>
                </v-col>
            </v-row>

            </v-form>

        </v-card-text>

        <v-divider></v-divider>
        
        <v-card-actions class="my-2 d-flex justify-end sticky-actions">

            <v-btn text="Close" variant="plain" @click="closeDialog"></v-btn>

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
.deptSelect {
    display: flex;
}

.modal-wrapper {
    position: fixed;
    width: 32%; /* 모달의 너비를 전체 화면의 50%로 설정 */
    z-index: 1000;
}

.side-modal {
    position: absolute;
    right: 0;
    width: 50%;
    height: 100%;
    border-left: 1px solid #ccc;
    background-color: #fff;
    max-width: 29rem;
}

.userModal {
    display: flex;
}

.userSaveKind {
    width: 9rem;
}

.sticky-actions {
    position: sticky; 
    bottom: 0; 
    background-color: white; 
    padding: 16px; 
    z-index: 1; 
}
</style>
