<template>

<v-container class="lg-12" v-if="viewMode === 'R' || viewMode === 'U'">
    <v-row justify="center" v-for="(item) in vFileList" :key="item.seq">
        <v-col cols="9" class="text-left">
            <span>{{ item.orgFileNm }}</span>
        </v-col>
        <v-col cols="3" class="text-center">
            <v-btn v-if="item.uploadYn == 'Y'" variant="tonal" @click="fnFileDownload(item)" size="x-small">Download</v-btn>
            <v-btn v-if="item.uploadYn == 'N'" variant="tonal" size="x-small">Uploading</v-btn>
        </v-col>
    </v-row>

</v-container>
<v-container class="lg-12" v-if="viewMode === 'C' || viewMode === 'U'">
    <v-row justify="center">
        <v-col>
            <v-file-input v-model="vFileModel" multiple prepend-icon="mdi-paperclip" show-size density="compact" chips></v-file-input>
        </v-col>
    </v-row>
</v-container>

</template>
      
<script>
import store from '@/store';
import {ref,toRef} from 'vue';

export default {
  name: 'FileComponent',
  props: {
      fileMode: {
        type: String,
        default:'C',
        required: true
      },

  },
  setup(props, context) {

    const viewMode = toRef(props, 'fileMode');
    const vFileModel = ref(null);
    const vFileList = ref([]);
    let gFileGroupId = '';
    const uploadFiles = [];

    const fnNullToBlank = (val) => {
        if(val === null || val == '' || val === undefined ) return '';
    }

    const fnFileSave = async (...args) => {

        if (args.length === 1) {
            gFileGroupId = args[0];
        } else {
            gFileGroupId = ''; 
        }

        const data = await new Promise((resolve) => {
       
        setTimeout(() => {

            if (vFileModel.value && vFileModel.value.length) {
                vFileModel.value.forEach((_file, index) => {
                    uploadFiles.push(_file);
                });
            } else if(vFileModel.value) {
                uploadFiles.push(vFileModel.value);
            } else {
                console.log('No file selects.');
            }

            if(uploadFiles.length > 0) {

                const apiUrl = "/api/com/file";
                const formData = new FormData();

                uploadFiles.forEach((item, index) => {
                    formData.append("files[]", item);
                });
                formData.append("fileGroupId", gFileGroupId);
                let params = {};
                params.API_PATH = apiUrl;
                params.FORM_DATA = formData;
                store.dispatch('API_FILE_SAVE',params).then((data) => {
                resolve(data);
                }).catch(({message}) => {
                    console.log("message : ", message);
                    resolve(data);
                })
            } else {
                var returnMsg = {};
                returnMsg.code = 200;
                returnMsg.fileGroupId = '';
                resolve({"data": returnMsg});
            }
        }, 200);


    });
    return data;
    };
    
    /*파일상세모드*/
    const fnFileList = (_fileGroupId)=>{

        gFileGroupId = _fileGroupId;

        if(gFileGroupId != '' ) {
            const apiUrl = '/api/com/file/'+gFileGroupId;
            let params = {};
            params.API_PATH = apiUrl;
            store.dispatch('API_LIST',params).then((data) => {
                vFileList.value = data.resultList;
            }).catch(({message}) => {
                console.log("message : ", message);
            })
        }
    }

    /*fnFileDownload*/
    const fnFileDownload= (item)=>{

        const apiUrl = '/api/com/file/down/'+item.fileId;
        let params = {};
        params.API_PATH = apiUrl;
        params.orgFileNm = item.orgFileNm;
        store.dispatch('API_FILE_DOWN',params).then((data) => {

        }).catch(({message}) => {
            console.log("message : ", message);
        })
    };

    return {
        ...props,
        viewMode,
        fnFileSave,
        vFileModel,
        fnFileList,
        vFileList,
        fnFileDownload

    }

  },

}

</script>
<style>

</style>