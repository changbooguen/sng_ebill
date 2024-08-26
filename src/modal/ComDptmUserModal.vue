<template>
    <div class="pa-4 text-center">
      <v-dialog   v-model="dialog" max-width="1000" scrollable>
        <v-card  prepend-icon="mdi-account"  title="Department User List">
        <v-card-text>

        <v-row>
          <v-col>

            <v-sheet :width="400" :height="600" :elevation="4"  border  rounded>
            <v-treeview hide-details 
            density="compact"
            :items="items" item-value="id" return-object slim variant="plain"
            @click:select="fnSelectedDept">
          </v-treeview>
          </v-sheet>
          </v-col>
          <v-col>
            <v-row>
              <v-col>
                <v-sheet :width="480" :height="270" :elevation="4"  border  rounded>
                <v-data-table height="265" fixed-header
                  :headers="headers"
                  :items="sourceTableDatas"
                  density="compact"
                  item-key="id"
                  hover
                  show-select
                  return-object
                  v-model="sourceSelChecked"
                  hide-default-footer
                  items-per-page="-1">
                </v-data-table>
              </v-sheet>
              </v-col>
            </v-row>
            <v-row  justify="center">
              <v-col cols="auto">
                    <v-btn @click="fnAddUsers" variant="tonal"  prepend-icon="mdi-chevron-down">Add</v-btn>
                </v-col>
              <v-col cols="auto">
                    <v-btn @click="fnDelUsers" variant="tonal"  prepend-icon="mdi-chevron-up">Delete</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-sheet :width="480" :height="240" :elevation="4"  border  rounded>
                <v-data-table height="235"  fixed-header
                  :headers="headers"
                  :items="targetTableDatas"
                  density="compact"
                  item-key="id"
                  hover
                  show-select
                  return-object
                  v-model="targetSelChecked"
                  hide-default-footer
                  items-per-page="-1">
                </v-data-table>
              </v-sheet>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

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
  import { VTreeview } from 'vuetify/labs/VTreeview'

  export default {
    name: 'ConmDptmUserComponent',
    props: {
    },
    components: { 
      VTreeview
    },
    setup(props,  { emit }) {

    /*변수선언*/
    const dialog = ref(false);
    const items = ref([]);//부서목록
    const headers = [
            { title: '아이디', align: 'center', key: 'userId', sortable: true },
            { title: '이름', align: 'center', key: 'userNm', sortable: true },
            { title: '부서', align: 'center', key: 'deptNm', sortable: false }
      ]; 
    const sourceTableDatas = ref([]);
    const sourceSelChecked = ref([]);
    const targetTableDatas = ref([]);
    const targetSelChecked = ref([]);

    /*함수*/
    const fnOpen = () => {
      fnSearchDept();
      dialog.value = true;
    };

    const fnClose = () => {
      dialog.value = false;
    };

    /** 부서 조회 */
    const fnSearchDept = () => {

      const listUrl = "/api/authUser/comDept";
      let params = {};
      params.API_PATH = listUrl;
      store.dispatch('API_LIST', params).then((data) => {
        items.value = data.resultList;
      }).catch(({message}) => {
        console.log("message : ", message);
      })
    };

    const fnSelectedDept = (e) => {
      if(e.id) {
        fnSearchDeptUser(e.id);
      }
    };

    /** 부서 user 조회 */
    const fnSearchDeptUser = (deptcd) => {

      const listUrl = "/api/authUser/comDeptUser/"+deptcd;
      let params = {};
      params.API_PATH = listUrl;
      store.dispatch('API_LIST', params).then((data) => {
        sourceTableDatas.value = data.resultList;
      }).catch(({message}) => {
        console.log("message : ", message);
      });

    };

    const fnAddUsers = () => {

      let filteredItems = sourceSelChecked.value.filter(newItem => {
        return !targetTableDatas.value.some(item => item.userId === newItem.userId);
      });
      targetTableDatas.value = [...targetTableDatas.value, ...filteredItems];
      sourceSelChecked.value = [];
    };

    const fnDelUsers = () => {
      targetTableDatas.value = targetTableDatas.value.filter(item => !targetSelChecked.value.includes(item));
      targetSelChecked.value = [];
    };

    const fnConfirm = () => {
        emit('selectedUsers', targetTableDatas.value);
        dialog.value = false;
    };

    /* Dom객체 완성이후 */
    onMounted( () => {

    });

    return {
        ...props,
        dialog,
        fnOpen,
        fnClose,
        fnSearchDept,
        fnSelectedDept,
        fnSearchDeptUser,
        headers,
        items,
        sourceTableDatas,
        sourceSelChecked,
        targetTableDatas,
        targetSelChecked,
        fnAddUsers,
        fnDelUsers,
        fnConfirm

    }
    },
  }
  </script>
  
  <style>
    
  
  </style>