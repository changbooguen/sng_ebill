<!--공통 코드-->
<script setup>
import ComCodeModal from '@/modal/ComCodeModal.vue';
import store from '@/store';
import { ref, onMounted } from "vue";
import TotalCount from "@/components/TotalCount.vue";

/*변수선언*/
const tableDatas = ref([]);
const modalVisible = ref(false);
const delChecked = ref([]);
const updateCodeData = ref([]);
const forUpdate = ref(false);
const count = ref(0);

const searchCode = ref('');
const searchGrCode = ref('');

const headers = [
    {   title: 'Code', align: 'center', key: 'codeId', sortable: true, width: '100px'},
    {   title: 'Code name',align: 'center', key: 'codeNm', sortable: true, width: '200px',cellProps:{class:"textLeftClass"}},
    {   title: 'Group',align: 'center', key: 'grpCode', sortable: true},
    {   title: 'Remark',align: 'center', key: 'rmk', sortable: true,cellProps:{class:"textLeftClass"}},
    {   title: 'Order',align: 'center', key: 'ord', sortable: true},
    {   title: 'Use Yn',align: 'center', key: 'useYn', sortable: true},
];

/*Function List*/

/*검색어리셋*/
const fnReset= (e)=>{
  searchCode.value = "";
  searchGrCode.value = "";
}

/*조회*/
const fnSearch = async () => {
  
  const listUrl = "/api/com-codes";
  let params = {};
  params.API_PATH = listUrl;
  params.codeNm = searchCode.value;
  params.grpCode = searchGrCode.value;

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
  const apiUrl = `/api/com-codes`
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

const openModal = () => {
  updateCodeData.value = null;
  modalVisible.value = true;
  forUpdate.value = false;
};

const openModalforUpdate = (e, row) => {
  updateCodeData.value = row.item;
  modalVisible.value = true;
  forUpdate.value = true;
}

const closeModal = (reload) => {
  modalVisible.value = false;
  if (reload) {
    fnSearch();
  }
};
/*비고 20글자까지 자르기 */
const truncateRmk = (rmk)=>{
    return rmk.length > 20 ? rmk.substring(0, 20) + '...' : rmk;
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
              <v-text-field label="코드명" type="input" @keydown.enter="fnSearch" v-model="searchCode" variant="underlined"></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field label="그룹코드" type="input" @keydown.enter="fnSearch" v-model="searchGrCode" variant="underlined"></v-text-field>
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
      <v-col cols="1"></v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" color="primary" @click="openModal">등록</v-btn>
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
          <v-row class="lg-12" justify="space-between" align="center">
            <v-col></v-col>
          </v-row>
          <v-row align="center" class="lg-12">
            <v-data-table
              v-model="delChecked"
              :headers="headers"
              :items="tableDatas"
              item-key="codeId"
              show-select
              hide-default-footer
              :items-per-page="-1"
              height="500"
              fixed-header
              @dblclick:row="openModalforUpdate"
            >
            </v-data-table>
          </v-row>
          <v-row class="lg-12"><v-col></v-col></v-row>
        </v-card>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>
  </v-container>
  
  <ComCodeModal
    v-if="modalVisible"
    :data="updateCodeData"
    :tableDatas="tableDatas"
    :forUpdate="forUpdate"
    @close="closeModal"
    @saveSuccess="fnSearch"
  />
</template>
  
  <style scoped>

.textLeftClass{text-align: left !important;}
 

  </style>
  