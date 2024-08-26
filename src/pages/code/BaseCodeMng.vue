<!--기본 코드-->
<script setup>
import TotalCount from '@/components/TotalCount.vue';
import BaseCodeModal from '@/modal/BaseCodeModal.vue';
import store from '@/store';
import { ref, onMounted } from "vue";


/*변수선언*/
const tableDatas = ref([]);
const modalVisible = ref(false);
const delChecked = ref([]);
const updateCodeData = ref([]);
const forUpdate = ref(false);
const count = ref(0);
const searchTitle = ref('');

const headers = [
  {title: '연번', align: 'center', value: 'index', sortable: false},
  { title: '코드아이디',  align: 'center', key: 'codeId', sortable: true },
  { title: '코드명', align: 'center', key: 'codeNm', sortable: true },
  { title: '시작일시',  align: 'center', key: 'bgDt', sortable: true },
  { title: '종료일시',  align: 'center', key: 'edDt', sortable: true },
  { title: '순서', align: 'center', key: 'ord', sortable: true },
  { title: '현재여부',  align: 'center', key: 'currYn' },
 
];

/*Function List*/

/*검색어리셋*/
const fnReset= (e)=>{
    searchTitle.value = "";
}

/*조회*/
const fnSearch = async () => {
  
  const listUrl = "/api/base-codes";
  let params = {};
  params.API_PATH = listUrl;
  params.codeNm = searchTitle.value;

  store.dispatch('API_LIST', params).then((data) => {
    tableDatas.value = data.resultList.sort((a,b) => new Date(b.regDt) - new Date(a.regDt));
    count.value = tableDatas.value.length;
  });
};

/** 삭제 */
const fnDelete = async () => {
  if(!confirm("삭제 하시겠습니까?")){
    return;
  }
  const apiUrl = `/api/base-codes`
  let deleteItems = [];
  delChecked.value.forEach(item => deleteItems.push(item.codeId));

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

/*등록 모달 */
const openModal = () => {
  updateCodeData.value = null;
  modalVisible.value = true;
  forUpdate.value = false;
};

/*수정 모달 */
const openModalforUpdate = (e, row) => {
  updateCodeData.value = row.item;
  modalVisible.value = true;
  forUpdate.value = true;
};
/*모당 닫기*/
const closeModal = (reload) => {
  modalVisible.value = false;
  if (!reload) {
    fnSearch();
  }
};
/*날짜 형식 지정 */
const sliceDt = (Dt) => {
  if (Dt && Dt !== '') { 
    return Dt.slice(0, Dt.indexOf('T'));
  }
  return ''; 
}
/*Dom객체 완성이후*/
onMounted(() => {
  fnSearch();
});
</script>

<template>
  <v-container class="lg-12">
      <v-row class="lg-12">
      <v-col cols="1"></v-col>
      <v-col>
        <v-card variant="outlined">
          <v-row class="lg-12"><v-col></v-col></v-row>
          <v-row align="center" class="lg-12">
            <v-col cols="3">
              <v-text-field label="코드명" type="input" @keydown.enter="fnSearch" v-model="searchTitle" variant="underlined"></v-text-field>
            </v-col>

            <v-col>
              <v-row align="center" justify="center">
                <v-col cols="auto">
                  <v-btn variant="outlined" @click="fnSearch">조회</v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn variant="outlined" @click="fnReset">reset</v-btn>
                </v-col>

              </v-row>
            </v-col>
          </v-row>
          <v-row class="lg-12"><v-col></v-col></v-row>
        </v-card>
      </v-col>
      <v-col cols="1"></v-col>
      </v-row>
 

    <v-row class="lg-12" justify="end">
      <v-col cols="1"></v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" @click="openModal">등록</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" @click="fnDelete">삭제</v-btn>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>
    
    <v-row class="lg-12">
      <v-col cols="1"></v-col>
      <v-col>
        <total-count :totalCount="count"></total-count>
        <v-card variant="outlined">
          <v-row class="lg-12"><v-col></v-col></v-row>
          <v-row align="center" class="lg-12">
            <v-data-table
              v-model="delChecked"
              :headers="headers"
              :items="tableDatas"
              item-key="codeId"
              show-select
              return-object
              hide-default-footer
              :items-per-page="-1"
              @dblclick:row="openModalforUpdate"
             
            >
              <template v-slot:[`item.index`]="{ index }">
                {{ index + 1 }}
              </template>
              <template #[`item.regDt`]="{ item }">
                {{ sliceDt(item.regDt) }}
              </template>
              <template #[`item.currYn`]="{ item }">
                {{ item.currYn === 'Y' ? 'O' : '-' }}
              </template>
              
            </v-data-table>
          </v-row>
          <v-row class="lg-12"><v-col></v-col></v-row>
        </v-card>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>
  </v-container>
  <BaseCodeModal
    v-if="modalVisible"
    :data="updateCodeData"
    :tableDatas="tableDatas"
    :forUpdate="forUpdate"
    @close="closeModal"
    @saveSuccess="fnSearch"
  />
</template>
<style scoped>

</style>
