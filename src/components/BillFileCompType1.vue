
<template>
  <v-container class="lg-12" v-if="viewMode === 'R' || viewMode === 'U'">
    <v-row>
    <v-sheet class="ma-2 pa-2">
        <v-table density="compact" height="200px" fixed-header>
        <thead>
          <tr>
            <th class="text-center" style="width: 500px;">
              File Name
            </th>
            <th class="text-center" style="width: 150px;">
              File Type
            </th>
            <th class="text-center" style="width: 100px;">
              Public or not
            </th>
            <th class="text-center" style="width: 100px;">
              DownLoad
            </th>
            <th class="text-center" style="width: 100px;" v-if="viewMode === 'U'">
              Delete
            </th>
          </tr>
        </thead>
        
        <tbody>
          <tr
            v-for="item in vItems"
            :key="item.orgFileId"
          >
            <td>
              {{item.orgFileNm}}
            </td>
            <td>
              {{item.fileKindCd}}
            </td>
            <td>
              {{item.opbYn}}
            </td>
            <td>
              <v-btn v-if="item.orgFileYn == 'Y'" variant="tonal" @click="fnFileDownload(item)" size="x-small">Download</v-btn>
              <v-btn v-if="item.orgFileYn == 'N'" variant="tonal" size="x-small">Uploading</v-btn>
            </td>
            <td v-if="viewMode === 'U'">
              <v-btn variant="tonal" @click="fnFileDelete(item)" size="x-small">Delete</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-sheet>
    </v-row>
  </v-container>

  <v-container class="lg-12" v-if="viewMode === 'C' || viewMode === 'U'">  

    <v-row no-gutters align="center">
      <v-col cols="12">
        <v-sheet class="ma-2 pa-2 text-right">
          <v-btn variant="outlined"  @click="addRow">Add File</v-btn>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row no-gutters align="center">
      <v-col cols="12">
        <v-sheet class="ma-2 pa-2">
          <v-table density="compact" height="200px" fixed-header>
        <thead>
          <tr>
            <th class="text-center" style="width: 500px;">
              File Name
            </th>
            <th class="text-center" style="width: 150px;">
              File Type
            </th>
            <th class="text-center" style="width: 100px;">
              Public or not
            </th>
            <th class="text-center" style="width: 100px;">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
          >
            <td style="vertical-align: middle;">
              <v-file-input    v-model="item.file"
                   prepend-icon="mdi-paperclip" multiple show-size density="compact" chips></v-file-input>
            </td>
            <td>
                <v-select v-model="item.fileKindCd" :items="billFileKindCds" item-value="code" item-title="name" density="compact"></v-select>
            </td>
            <td>
              <v-switch :label="`${item.opbYn.toString()}`" v-model="item.opbYn" true-value="Y"  false-value="N" hide-details inset ></v-switch>
            </td>
            <td>
              <v-btn variant="tonal" @click="fnRowDel(item)" size="x-small">DELETE</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

        </v-sheet>
      </v-col>
    </v-row>

  </v-container>

</template>
      
     
<script>
/*input 여러개추가해서*/

import store from '@/store';
import {ref,toRef} from 'vue';

export default {
  name: 'FileInputComponent',
  props: {
      fileMode: {
        type: String,
        default:'C',
        required: true
      },

  },
  setup(props, context) {

    const viewMode = toRef(props, 'fileMode');
    const switchModel = ref('N');
    const idx = ref(0);
    const billFileKindCds = ref([]);
    billFileKindCds.value = [
        { code: 'A001', name: 'Item 1' },
        { code: 'A002', name: 'Item 2' },
        { code: 'A003', name: 'Item 3' },
      ]
    
    const opbYn = [false,true];
    const items = ref([]);
    const vItems = ref([]);
    const uploadFiles = [];
    const fileKindCds = [];
    const opbYns = [];
    let gBillId = "";
    let gProcId = "";

    const addRow = () => {
      var row = {};
      row.id = idx.value++;
      row.fileKindCd = "";
      row.opbYn = 'N';
      row.file = null;
      row.actions = null;
      items.value.push(row);
    }

    const fnRowDel = (item) => {
      const index = items.value.indexOf(item);
      if (index !== -1) {
        items.value.splice(index, 1);
      }
    }



    const fnFileSave = async (...args) => {

      if (args.length === 1) {
        gBillId = args[0];
        gProcId = '';
      } else if(args.length === 2) {
        gBillId = args[0];
        gProcId = args[1];
      } else {
        gBillId = '';
        gProcId = '';
      }

      const fnNullToBlank = (val) => {
        if(val === null || val == '' || val === undefined ) return '';
      }
     
      const data = await new Promise((resolve) => {

        setTimeout(() => {
          
        if (items.value && items.value.length) {

          items.value.forEach((item, index) => {

            var fileKindCd = fnNullToBlank(item.fileKindCd) == '' ? '-':item.fileKindCd;
            var opbYn = fnNullToBlank(item.opbYn) == '' ? 'N':item.opbYn;

            if (item.file && item.file.length) {
              item.file.forEach((file, index) => {
                uploadFiles.push(file);
                fileKindCds.push(fileKindCd);
                opbYns.push(opbYn);
              });
            }

          });
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
    
  const fnFileUpdate = async (billId,procId) => {

    const data = await new Promise((resolve) => {

      setTimeout(() => {
      
          items.value.forEach((item, index) => {

            var fileKindCd = item.fileKindCd;
            var opbYn = item.opbYn;

              item.file.forEach((file, index) => {
                uploadFiles.push(file);
                fileKindCds.push(fileKindCd);
                opbYns.push(opbYn);
              });
          });


          if(uploadFiles.length > 0) {

            const apiUrl = "/api/file";
            const formData = new FormData();

            uploadFiles.forEach((item, index) => {
              formData.append("files[]", item);
              formData.append("fileKindCds[]", fileKindCds[index]);
              formData.append("opbYns[]", opbYns[index]);
            });

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
  const fnFileList = (_billId,_procId)=>{

      gBillId = _billId;
      gProcId = _procId;

      if(gBillId != '' && gProcId !='') {
        const apiUrl = '/api/file/'+gBillId+'/'+gProcId;
        let params = {};
        params.API_PATH = apiUrl;
        store.dispatch('API_LIST',params).then((data) => {
          vItems.value = data.resultList;
        }).catch(({message}) => {
            console.log("message : ", message);
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
      fnFileList(gBillId,gProcId);
    }).catch(({message}) => {
        console.log("message : ", message);
    })

  }


  return {
    ...props,
    items,
    vItems,
    fnFileSave,
    fnFileUpdate,
    fnFileList,
    fnFileDownload,
    fnFileDelete,
    addRow,
    fnRowDel,
    opbYn,
    viewMode,
    switchModel,
    billFileKindCds

  }
  }
}

</script>
<style>

</style>