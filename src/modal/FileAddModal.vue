<script setup>
import {defineEmits, onMounted, ref, defineProps} from 'vue';
import store from '@/store';
import FileComponent from "@/components/FileComponent.vue";
import axios from "@/axios";

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
const saveForm = ref(null);
const formValid = ref(null);
const loginInfo = ref(store.getters.loginInfo);
const folderNm = ref(null);
const files = ref(null);
const bsFileInput = ref(null);

/** function List */

/** 모달 닫기 */
const closeDialog = () => {
    dialog.value = false;
    emit('close');
}

/** 저장 */
const fnSave = () => {

    const uploadFiles = [];

    if(bsFileInput.value && bsFileInput.value.length){
        bsFileInput.value.forEach((_file, index) => {
            uploadFiles.push(_file);
        });
    } else if (bsFileInput.value){
        uploadFiles.push(bsFileInput.value);
    } else {
        console.log("No file selects.");
    }

    if(uploadFiles.length > 0) {
        const apiUrl = "/api/bsFileUpload";
        const formData = new FormData();

        uploadFiles.forEach((item, index) => {
            formData.append("files[]", item);
        });
        formData.append("folderId", props.nowFolder.folderId);
        formData.append("favoriteYn", 'N');
        formData.append("authCd", loginInfo.value.deptCd);
        
        let params = {};
        params.API_PATH = apiUrl;
        params.FORM_DATA = formData;
        
        store.dispatch('API_FILE_SAVE',params).then((data) => {
            console.log(data);
            emit('close');
        }).catch(({message}) => {
            console.log("message : ", message);
        })

    } else {
        var returnMsg = {};
        returnMsg.code = 200;
        returnMsg.fileGroupId = '';
        console.log("message : " + returnMsg)
    }

}

/** 유효성 검사 */
const fnValidate= (e)=>{
    const data = saveForm.value?.validate();
    return formValid.value;
};

/** 유효성 체크 */
const folderId_rules = [
    v => !!v || '필수값입니다.',
    v => (v && v.length >= 1) || '최소1글자 이상',
];

const file_rules = [
    v => !!v || '필수값입니다.',
    v => (v && v.length >= 1) || '최소1글자 이상',
];


/** Dom객체 완성이후 */
onMounted(() => {
    folderNm.value = props.nowFolder.folderNm;
});

</script>

<template>
    <v-dialog v-model="dialog" max-width="600" @update:modelValue="val => !val && emit('close')">
        <v-card title="파일 생성">
            <v-card-text>
                <v-form @submit.prevent ref="saveForm" v-model="formValid">
                    <v-row dense>
                        <v-col>
                            <v-text-field
                                v-model="folderNm"
                                readonly
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col>
                            <v-file-input
                                v-model="bsFileInput"
                                multiple 
                                prepend-icon="mdi-paperclip"
                                show-size 
                                density="compact" 
                                chips
                            ></v-file-input>
                        </v-col>
                    </v-row>
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