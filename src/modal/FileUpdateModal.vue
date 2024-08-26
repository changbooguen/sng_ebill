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
const folderNm = ref(props.nowFolder.folderNm);
const vFileList = ref(null);
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
        fnFileUpdate()
    }

    if(uploadFiles.length > 0) {
        const apiUrl = "/api/bsFileUpload";
        const formData = new FormData();

        uploadFiles.forEach((item, index) => {
            formData.append("files[]", item);
        });
        formData.append("folderId", props.nowFolder.folderId);
        formData.append("fileGroupId", props.nowFolder.fileGroupId);
        formData.append("favoriteYn", 'N');
        
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

/** 파일상세모드 */
const fnFileList = async (fileGroupId)=>{

    if(fileGroupId != '') {
        const apiUrl = '/api/searchFiles/';
        let params = {};
        params.API_PATH = apiUrl;
        params.fileGroupId = props.nowFolder.fileGroupId;

        store.dispatch('API_LIST',params).then((data) => {
            vFileList.value = data.resultList;

        }).catch(({message}) => {
            console.log("message : ", message);
        })
    }

}

/** 파일 다운로드 */
const fnFileDownload = (item) => {

    const apiUrl = `/api/bsFileDown/`+item.fileGroupId;
    let params = {};
    params.API_PATH = apiUrl;
    params.orgFileNm = item.fileNm;

    store.dispatch('API_FILE_DOWN', params).then((data) => {
        
    }).catch(({message}) => {
        console.log("message : " , message);
    })
}

/** 파일 삭제 */
const fnFileDelete = (item) => {
    
    if(!confirm("삭제 하시겠습니까?")){
      return;
    }

    // let deleteItems = [];
    // deleteItems.push({fileGroupId: item.fileGroupId, folderYn: 'N'});

    const apiUrl = "/api/bsFileDelete/"+item.fileId;

    let params = {};
    params.API_PATH = apiUrl;
    params.fileId = item.fileId;

    store.dispatch('API_DELETE',params).then((data) => {
        fnFileList();
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
    fnFileList();
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
                            <v-container class="lg-12" >
                                <v-row justify="center" v-for="(item) in vFileList" :key="item.seq">
                                    <v-col cols="8" class="text-left">
                                        <span>{{ item.fileNm }}</span>
                                    </v-col>
                                    <v-col cols="2" class="text-center">
                                        <v-btn 
                                            variant="tonal" 
                                            @click="fnFileDownload(item)" 
                                            size="x-small"
                                        >Download</v-btn>
                                    </v-col>
                                    <v-col cols="2" class="text-center">
                                        <v-btn 
                                            variant="tonal" 
                                            @click="fnFileDelete(item)" 
                                            size="x-small"
                                        >Delete</v-btn>
                                    </v-col>
                                </v-row>

                            </v-container>
                            <v-container class="lg-12">
                                <v-row justify="center">
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
                            </v-container>
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