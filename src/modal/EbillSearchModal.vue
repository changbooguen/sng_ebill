<template>
    <div class="pa-4 text-center">
      <v-dialog   v-model="dialog" max-width="1000" scrollable>
        <v-card  prepend-icon="mdi-account"  title="Bill List">
          <v-card-text>
  
        <main class="content_frame" style="padding-top:1px">
        <section class="content_bundle">
  
        <article class="basic panel">
          <div class="panel_bundle">
            <div class="input_group row">
              <label>Bill No</label>
              <v-text-field
                  density="compact"
                  variant="outlined"
                  hide-details
                  @keydown.enter="fnSearch" v-model="schBillNo"
              ></v-text-field>
            </div>

            <div class="input_group row">
              <label>Bill Name</label>
              <v-text-field
                  density="compact"
                  variant="outlined"
                  hide-details
                  @keydown.enter="fnSearch" v-model="schBillNm"
              ></v-text-field>
            </div>
  
            <div class="input_group">
              <v-btn style="margin-right: 5%;" @click="fnSearch">조회</v-btn>
              <v-btn @click="fnReset">Reset</v-btn>
            </div>
  
          </div>
  
          <div class="panel_bundle">
            <div class="input_group row"></div>
          </div>
        </article>
  
        <article class="basic">
          <v-data-table
               height="400"
              :headers="headers"
              :items="tableDatas"
              density="compact"
              item-key="id"
              items-per-page="-1"
              hide-default-footer
              fixed-header
              hover
              show-select
              return-object
              v-model="selChecked">
          </v-data-table>
        </article>
  
        </section>
        </main>
          </v-card-text>
  
          <v-divider></v-divider>
  
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text="Cancel"
              variant="outlined"
              @click="dialog = false"
            ></v-btn>
            <v-btn
              color="primary"
              text="Confirm"
              variant="outlined"
              @click="fnConfirm"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  import {ref,onMounted} from 'vue';
  import store from '@/store';
  export default {
    name: 'EbillSearchComponent',
    props: {
    },
    setup(props,  { emit }) {

      /*변수선언*/
      const dialog = ref(false);
      const headers = [
            { title: '의안번호', align: 'center', key: 'billNumber', sortable: true },
            { title: '의안명', align: 'center', key: 'billName', sortable: true,cellProps:{class:"textLeftClass"} },
            { title: '제안일', align: 'center', key: 'proposeDate', sortable: true },
            { title: '제안자', align: 'center', key: 'proposerName', sortable: true }
      ]; 
      const tableDatas = ref([]);
      const selChecked = ref([]);
      const schBillNo = ref('');
      const schBillNm = ref('');
      
      /*함수*/
      const fnOpen = () => {
          selChecked.value = [];
          fnSearch();
          dialog.value = true;
      };

      const fnClose = () => {
          dialog.value = false;
      };

     /** 조회 */
     const fnSearch = () => {

        const apiUrl = "/api/bill/monitoring";
        let params = {};
        params.API_PATH = apiUrl;
        params.billNo = schBillNo.value;
        params.billName = schBillNm.value;
        params.size = 1000;
        store.dispatch('API_LIST', params).then((data) => {
            tableDatas.value = data.resultList.data;
        }).catch(({message}) => {
          console.log("message : ", message);
        })

    };

    const fnConfirm = () => {
        emit('selectedBills', selChecked.value);
        dialog.value = false;
    };

    /*검색어리셋*/
    const fnReset= ()=>{
        schBillNo.value = "";
        schBillNm.value = "";
    }

    /* Dom객체 완성이후 */
    onMounted( () => {

    });

    return {
        ...props,
        dialog,
        fnOpen,
        fnClose,
        fnSearch,
        fnReset,
        fnConfirm,
        tableDatas,
        selChecked,
        headers,
        schBillNo,
        schBillNm
    }
    },
  }
  </script>
  
  <style>
    
  .textLeftClass{text-align: left !important;}
  
  </style>