<script setup>
import {defineEmits, onMounted, ref, defineProps} from 'vue';
import store from '@/store';

/** 변수선언 */
const emit = defineEmits(['close']);
const props = defineProps({
    show: Boolean, 
    nowFolder: {
        type: Object,
        required: true
    }
});
const dialog = ref(props.show);
const setAuthNm = ref('');
const saveForm = ref(null);
const formValid = ref(null);
const loginInfo = ref(store.getters.loginInfo);
const folderNm = ref(null);
const deptItems = ref([]);
const deptContents = ref([]);
const selectDept = ref(null);

/** function List */

/** 모달 닫기 */
const closeDialog = () => {
    dialog.value = false;
    emit('close');
}

/** 저장 */
const fnSave = (e) => {

    if(!fnValidate()){
        return;
    }

    // const authCd = deptContents.value.filter(data => data.deptNm === selectDept.value).map(data => ({
    //     id: data.deptId
    // }));

    const jsonData = {
        folderNm : folderNm.value,
        regId : loginInfo.value.user.userId,
        authCd : props.nowFolder.authCd,
        upperFolderId : props.nowFolder.folderId,
    }

    const apiUrl = "/api/folderInfo";
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData

    store.dispatch('API_SAVE', params).then((data) => {
        
        let authCd = props.nowFolder.authCd;
        let folderId = data.resultObj.data.folderId;
        addDeptUser(authCd,folderId)
        emit('close');
    }).catch(({message}) => {
        console.log("message : ", message);
    })
    
}

/** 유효성 검사 */
const fnValidate= (e)=>{
    const data = saveForm.value?.validate();
    return formValid.value;
};

/** 유효성 체크 */
const folderNm_rules = [
    v => !!v || '필수값입니다.',
    v => (v && v.length >= 1) || '최소1글자 이상',
];

/** 부서 조회 */
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

/** 폴더 부서원 추가 */
const addDeptUser = (authCd, folderId) => {

    const jsonData = {
        deptCd : authCd,
        folderId : folderId
    }

    const apiUrl = '/api/add/userAuthMapp';
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData;

    store.dispatch('API_SAVE', params).then((data) => {
        
    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

/** Dom객체 완성이후 */
onMounted(() => {
    
//   fnDeptSearch();

});

</script>

<template>
    <v-dialog v-model="dialog" max-width="600" @update:modelValue="val => !val && emit('close')">
        <v-card title="폴더 생성">
            <v-card-text>
                <v-form @submit.prevent ref="saveForm" v-model="formValid">
                    <v-row dense>
                        <v-col>
                            <v-text-field
                                label="폴더 이름"
                                type="text"
                                v-model="folderNm"
                                :rules="folderNm_rules"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <!-- <v-row>
                        <v-col>
                            <v-select
                                v-model="selectDept"
                                label="담당 부서"
                                :items="deptContents.map(v => v.deptNm)"
                            ></v-select>
                        </v-col>
                    </v-row> -->
                </v-form>

            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>

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
</template>

<style scoped>

</style>