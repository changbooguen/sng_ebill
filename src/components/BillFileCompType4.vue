<template>

<v-container class="lg-12" v-if="viewMode === 'R' || viewMode === 'U'">
    <v-row justify="center" v-for="(item) in vFileList" :key="item.seq">
        <v-col cols="8" class="text-left">
            <span>{{ item.orgFileNm }}</span>
        </v-col>
        <v-col cols="2" class="text-center">
            <v-btn v-if="item.uploadYn == 'Y'" variant="tonal" @click="fnFileDownload(item)" size="x-small">Download</v-btn>
            <v-btn v-if="item.uploadYn == 'N'" variant="tonal" size="x-small">Uploading</v-btn>
        </v-col>
        <v-col v-if="viewMode === 'U'" cols="2" class="text-center">
            <v-btn variant="tonal" @click="fnFileDelete(item)" size="x-small">Delete</v-btn>
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
/*input 1개에 multiple kindcd 로 조회해야 하는*/
import store from '@/store';
import {ref,toRef,onMounted,onUnmounted} from 'vue';

export default {
  name: 'BillFileInputComponent',
  props: {
      fileMode: {
        type: String,
        default:'C',
        required: true
      },
      fileKind: {
        type: String,
        default:'DOC',
        required: true
      },
      opbYn: {
        type: String,
        default:'Y',
        required: true
      },
  },
  setup(props, context) {

    const viewMode = toRef(props, 'fileMode');
    const vOpbYn = toRef(props, 'opbYn');
    const vFileKind = toRef(props, 'fileKind');
    const vFileModel = ref(null);
    const vFileList = ref([]);
    let gBillId = '', gProcId = '', gkindCd=vFileKind.value;
    const uploadFiles = [],fileKindCds = [],opbYns = [];
    let intervalId = null;

    const fnNullToBlank = (val) => {
        if(val === null || val == '' || val === undefined ) return '';
    }

    const fnFileSave = async (...args) => {

        if (args.length === 1) {
            gBillId = args[0]; gProcId = '';
        } else if(args.length === 2) {
            gBillId = args[0]; gProcId = args[1];
        } else {
            gBillId = ''; gProcId = '';
        }

        const data = await new Promise((resolve) => {
       
        setTimeout(() => {

            if (vFileModel.value && vFileModel.value.length) {
                vFileModel.value.forEach((_file, index) => {
                    uploadFiles.push(_file);
                    fileKindCds.push(vFileKind.value);
                    opbYns.push(vOpbYn.value);
                });
            } else if(vFileModel.value) {
                uploadFiles.push(vFileModel.value);
                fileKindCds.push(vFileKind.value);
                opbYns.push(vOpbYn.value);
            } else {
                console.log('No file selects.');
            }

            if(uploadFiles.length > 0) {

                const apiUrl = "/api/file";
                const formData = new FormData();

                uploadFiles.forEach((item, index) => {
                    formData.append("files[]", item);
                    formData.append("fileKindCds[]", fileKindCds[index]);
                    formData.append("opbYns[]", opbYns[index]);
                });
                formData.append("billId", gBillId);
                formData.append("procId", gProcId);
                let params = {};
                params.API_PATH = apiUrl;
                params.FORM_DATA = formData;
                store.dispatch('API_BILL_FILE_SAVE',params).then((data) => {
                resolve(data);
                }).catch(({message}) => {
                    console.log("message : ", message);
                    resolve(data);
                })
            } else {
                var returnMsg = {};
                returnMsg.code = 200;
                returnMsg.billId = '';
                returnMsg.procId = '';
                resolve({"data": returnMsg});
            }
        }, 200);


    });
    return data;
    };
    
    /*파일상세모드*/
    const fnFileList = async (_billId)=>{

        gBillId = _billId;

        if(gBillId != '') {

            const apiUrl = '/api/file/kind/'+gBillId+'/'+vFileKind.value;
            let params = {};
            params.API_PATH = apiUrl;
            store.dispatch('API_LIST',params).then((data) => {
                vFileList.value = data.resultList;

                var returnMsg = {};
                returnMsg.code = 200;
                //resolve({"data": returnMsg});

            }).catch(({message}) => {
                console.log("message : ", message);
                var returnMsg = {};
                returnMsg.code = 500;
                //resolve({"data": returnMsg});
            })
        }

    }

    /*fnFileDownload*/
    const fnFileDownload= (item)=>{

        const apiUrl = '/api/file/down/'+item.orgFileId;
        let params = {};
        params.API_PATH = apiUrl;
        params.orgFileNm = item.orgFileNm;
        store.dispatch('API_FILE_DOWN',params).then((data) => {

        }).catch(({message}) => {
            console.log("message : ", message);
        })
    };


    /*삭제하기*/
    const fnFileDelete= (item)=>{

        if(!confirm("삭제 하시겠습니까?")){
            return;
        }
        const apiUrl = "/api/file/"+item.orgFileId;
        let params = {};
        params.API_PATH = apiUrl;

        store.dispatch('API_FILE_DELETE',params).then((data) => {
            fnfetchFileList();
        }).catch(({message}) => {
            console.log("message : ", message);
        })

    }

    const fnfetchFileList= ()=>{
        fnFileList (gBillId);
    }

    onMounted(() => {
      fnfetchFileList(); // 처음 마운트될 때 데이터 가져오기
      intervalId = setInterval(fnfetchFileList, 2000); // 2초마다 데이터 갱신
    });

    onUnmounted(() => {
      clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
    });

    return {
        ...props,
        viewMode,
        fnFileSave,
        vFileModel,
        vOpbYn,
        vFileKind,
        fnFileList,
        vFileList,
        fnFileDownload,
        fnFileDelete

    }

  },

}

</script>
<style>

</style>