<template>
 <div class="pa-4 text-center">
    <!-- v-dialog -->
    <v-dialog v-model="dialog" max-width="1000" max-height="700" scrollable>
      <v-card  prepend-icon="mdi-account"  title="User List">

        <v-card-text>

          <v-row class="lg-12">
          <v-col cols="4">

          <v-treeview hide-details height="500"
            density="compact"
            :items="items" item-value="id" return-object slim variant="plain"
            @click:select="fnSelectedDept"
            >
          </v-treeview>

          </v-col>
          <v-col>

            <v-data-table
            :headers="headers"
            :items="tableDatas"
            density="compact"
            item-key="id"
            hover
            show-select
            return-object
            v-model="selChecked"
            hide-default-footer
            items-per-page="-1"
            >

        </v-data-table>

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
    name: 'ComUserSearchComponent',
    props: {
    },
    components: { 
      VTreeview
    },
    setup(props,  { emit }) {

      /*변수선언*/
      const dialog = ref(false);
      const headers = [
            { title: '아이디', align: 'center', key: 'userId', sortable: false },
            { title: '이름', align: 'center', key: 'userNm', sortable: true },
            { title: '부서', align: 'center', key: 'deptNm', sortable: true },
            { title: '이메일', align: 'center', key: 'email', sortable: false },
            { title: '전화번호', align: 'center', key: 'mblNo', sortable: false }
      ]; 
      const tableDatas = ref([]);
      const selChecked = ref([]);
      const items = ref([]);//부서목록

      /*함수*/
      const fnOpen = () => {
        fnSearchDept();
        dialog.value = true;
        selChecked.value = [];
      };

      const fnClose = () => {
          dialog.value = false;
      };

      const fnConfirm = () => {
        emit('selectedMembers', selChecked.value);
        dialog.value = false;
      };

      const fnSelectedDept = (e) => {

        if(e.id) {
          fnSearchDeptUser(e.id);
        }

      };

      

      /** 부서 조회 */
      const fnSearchDept = () => {

        const listUrl = "/api/authUser/comDept";
        let params = {};
        params.API_PATH = listUrl;
        store.dispatch('API_LIST', params).then((data) => {
          items.value = data.resultList;
          console.log(items.value);
        }).catch(({message}) => {
          console.log("message : ", message);
        })
      };

      /** 부서 조회 */
      const fnSearchDeptUser = (deptcd) => {

        const listUrl = "/api/authUser/comDeptUser/"+deptcd;
        let params = {};
        params.API_PATH = listUrl;
        store.dispatch('API_LIST', params).then((data) => {
          console.log(data.resultList);
          tableDatas.value = data.resultList;
        }).catch(({message}) => {
          console.log("message : ", message);
        });

      };


  
      /* Dom객체 완성이후 */
      onMounted( () => {

      });

      return {
          ...props,
          dialog,
          fnOpen,
          fnClose,
          fnConfirm,
          fnSearchDept,
          selChecked,
          headers,
          tableDatas,
          items,
          fnSelectedDept
      }
    },
  }
  </script>
