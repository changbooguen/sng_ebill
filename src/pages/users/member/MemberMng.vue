<script setup>
import store from '@/store';
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import memberModalSave from "@/modal/MemberModalSave.vue";

/** 변수 선언 */
const tableDatas = ref([])
const router = useRouter();
const delChecked = ref([]);
const modalVisible = ref(false);
const showModal = ref(false);
const headers = [
            { title: '아이디', align: 'center', key: 'memberId', sortable: false },
            { title: '이름', align: 'center', key: 'memberNm', sortable: true },
            { title: '정당', align: 'center', key: 'polyNm', sortable: true },
            { title: '이메일', align: 'center', key: 'email', sortable: false },
            { title: '전화번호', align: 'center', key: 'inrNo', sortable: false },
            { title: '입사일', align: 'center', key: 'initDt', sortable: false },
]; 
const schMemberId = ref('');
const schMemberNm = ref('');

/** function List */

/** 조회 */
const fnSearch = async () => {
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
}

/** 일괄등록 페이지 이동 */
const fnGoAllSave = async () => {
  try {
    await router.push('/memberMngAllSave');
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
  }
}

const delMemberChk = (data) => {
  const index = delChecked.value.findIndex(item => item === data);
  if (index === -1) {
    delChecked.value.push(data);
  } else {
    delChecked.value.splice(index, 1);
  }
}

/** 삭제 */
const fnDelete = async () => {
  if(!confirm("삭제 하시겠습니까?")){
    return;
  }

  const apiUrl = `/api/members`

  let deleteItems = [];
  delChecked.value.forEach(item => deleteItems.push(item.memberId));

  let params = {};
  params.API_PATH = apiUrl;
  params.deleteItems = deleteItems;

  store.dispatch('API_DELETE', params).then((data) => {
    delChecked.value = [];
    fnSearch();
  }).catch(({message}) => {
    console.log("message : ",  message);
  })

};

const openModal = () => {
  showModal.value =true;
}

const closeModal = (reload) => {
  showModal.value = false;
  if (!reload){
    fnSearch();
  }
}

const fnGoDetail = (e, row) => {
  sessionStorage.setItem('memberId', row.item.memberId);
  router.push({ name: 'memberDetail' });
}


/* Dom객체 완성이후 */
onMounted( () => {

  fnSearch();//초기조회

});

</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field 
        label="아이디" 
        variant="outlined" 
        type="text" 
        v-model="schMemberId" 
        @keyup.enter="fnSearch"
        ></v-text-field>
      </v-col>  
      <v-col>
        <v-text-field 
        label="이름" 
        variant="outlined" 
        type="text" 
        v-model="schMemberNm" 
        @keyup.enter="fnSearch"
        ></v-text-field>
      </v-col>  
    </v-row>

    <v-row justify="end">
      <v-col cols="auto">
        <v-btn variant="outlined" @click="openModal">등록</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" @click="fnGoAllSave">일괄 등록</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" @click="fnDelete">삭제</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="tableDatas"
          item-key="id"
          show-select
          return-object
          v-model="delChecked"
          @dblclick:row="fnGoDetail"
        >
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
  <memberModalSave v-if="showModal" :show="showModal" @close="closeModal"/>
</template>

<style scoped>
</style>
