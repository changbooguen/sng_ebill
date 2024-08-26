<template>
  <div class="pa-4 text-center">
    <v-dialog   v-model="dialog" max-width="800" scrollable persistent>
      <v-card  prepend-icon="mdi-account"  title="User List">
        <v-card-text>

      <main class="content_frame" style="padding-top:1px">
      <section class="content_bundle">

      <article class="basic panel">
        <div class="panel_bundle">
          <div class="input_group row">
            <label>Name</label>
            <v-text-field
                density="compact"
                variant="outlined"
                hide-details
                @keydown.enter="fnSearch" v-model="schMemberNm"
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
            :headers="headers"
            :items="tableDatas"
            density="compact"
            item-key="id"
            items-per-page="10"
            hover
            show-select
            return-object
            v-model="selChecked"
        >

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
    name: 'ComMemberSearchComponent',
    props: {
    },
    setup(props,  { emit }) {

      /*변수선언*/
      const dialog = ref(false);
      const headers = [
            { title: '아이디', align: 'center', key: 'memberId', sortable: false },
            { title: '이름', align: 'center', key: 'memberNm', sortable: true },
            { title: '정당', align: 'center', key: 'polyNm', sortable: true },
            { title: '이메일', align: 'center', key: 'email', sortable: false },
            { title: '전화번호', align: 'center', key: 'inrNo', sortable: false }
      ]; 
      const tableDatas = ref([]);
      const schMemberId = ref('');
      const schMemberNm = ref('');
      const selChecked = ref([]);

      /*함수*/
      const fnOpen = () => {
          dialog.value = true;
      };

      const fnClose = () => {
          dialog.value = false;
      };

      const fnConfirm = () => {
        emit('selectedMembers', selChecked.value);
        dialog.value = false;
      };

      /** 조회 */
      const fnSearch = () => {

        const listUrl = "/api/members";
        let params = {};
        params.API_PATH = listUrl;
        params.memberId = schMemberId.value;
        params.memberNm = schMemberNm.value;
        store.dispatch('API_LIST', params).then((data) => {
          tableDatas.value = data.resultList;
        }).catch(({message}) => {
          console.log("message : ", message);
        })
      };


      /*검색어리셋*/
      const fnReset= ()=>{
        schMemberId.value = "";
        schMemberNm.value = "";
      }
  
      /* Dom객체 완성이후 */
      onMounted( () => {
        fnSearch();//초기조회
      });

      return {
          ...props,
          dialog,
          fnOpen,
          fnClose,
          fnConfirm,
          fnSearch,
          selChecked,
          headers,
          tableDatas,
          fnReset,
          schMemberId,
          schMemberNm
      }
    },
  }
  </script>

<style>

</style>