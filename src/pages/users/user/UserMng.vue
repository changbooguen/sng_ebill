<script setup>
import store from '@/store';
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import userModalSave from "@/modal/UserModalSave.vue";

/* 변수 선언 */
const router = useRouter();
const searchDepartment = ref('');
const searchPosition = ref('');
const SearchUserNm = ref('');
const tableDatas = ref([]);
const headers = [
            { title: '부서', align: 'center', key: 'departmentName', sortable: true ,cellProps:{class:"textLeftClass"}},
            { title: '직무', align: 'center', key: 'posCd', sortable: true ,cellProps:{class:"textLeftClass"}},
            { title: '이름', align: 'center', key: 'userNm', sortable: true },
            { title: '아이디', align: 'center', key: 'userId', sortable: false },
            { title: '이메일', align: 'center', key: 'email', sortable: false },
            { title: '전화번호', align: 'center', key: 'inrNo', sortable: false },
]; 
const delChecked = ref([]);
const showModal = ref(false);

/* function List */

/*검색어리셋*/
const fnReset = (e) => {
  searchDepartment.value = "";
  searchPosition.value = "";
  SearchUserNm.value = "";
}

/* 조회 */
const fnSearch = () => {
  const listUrl = "/api/users";

  let params = {};
  params.API_PATH = listUrl;
  // params.deptNm = searchDepartment;
  // params.userNm = SearchUserNm;

  store.dispatch('API_LIST', params).then((data) => {

    tableDatas.value = data.resultList;
    
  }).catch(({message}) => {
    console.log("message : ", message);
  })

}

const userAllSave = async () => {
  try {
    await router.push('/userMngAllSave');
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
  }
}


const openModal = () => {
  showModal.value = true;
}

const closeModal = (reload) => {
  showModal.value = false;
  if (!reload){
    fnSearch();
  }
}


/* 삭제 */
const fnDelete = () => {
  if(!confirm("삭제 하시겠습니까?")){
    return;
  }
  const listUrl = `/api/users/`;

  let deleteItems = [];
  delChecked.value.forEach(item => deleteItems.push(item.userId));

  let params = {};
  params.API_PATH = listUrl;
  params.deleteItems = deleteItems;

  store.dispatch('API_DELETE', params).then((data) => {
    delChecked.value = [];
    fnSearch();
  }).catch(({message}) => {
    console.log("message : ", message);
  })

}


const fnExcelDownload= ()=>{

const jsonData = {
    datas: tableDatas.value
};

const apiUrl = "/api/excel/download";

let params = {};
params.API_PATH = apiUrl;
params.JSON_DATA = jsonData;

store.dispatch('API_SAVE',params).then((data) => {

    

}).catch(({message}) => {
    console.log("message : ", message);
})

}

/** 상세정보 조회 */
const fnGoDetail = (e, row) => {
  sessionStorage.setItem('userId', row.item.userId);
  router.push({ name: 'userDetail' });
}

/* Dom객체 완성이후 */
onMounted( () => {
  fnSearch();//초기조회
});


</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="1">
        직무 : 
      </v-col>
      <v-col>
        <v-combobox
        label="Combobox"
        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
        variant="solo"
        ></v-combobox>
      </v-col>  
      <v-col cols="1">
        직무 : 
      </v-col>
      <v-col>
        <v-text-field 
        label="inputBox" 
        variant="outlined" 
        type="text" 
        v-model="sjSearch" 
        @keyup.enter="searchTwocondition(first)"
        ></v-text-field>
      </v-col>  
      <v-col cols="1">
        직무 : 
      </v-col>
      <v-col>
        <v-combobox
        label="Combobox"
        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
        variant="solo"
        ></v-combobox>
      </v-col>  
    </v-row>
      
    <v-row justify="end">
      <v-col cols="auto">
        <v-btn variant="outlined" @click="openModal">등록</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" @click="userAllSave">일괄 등록</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" @click="fnExcelDownload">삭제ddd</v-btn>
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
  <userModalSave v-if="showModal" :show="showModal" :data="updateUserData" @close="closeModal"/>
  
</template>

<style scoped>
  .buttonGroup{
    display: flex;
    justify-content: flex-end;
  }

  .header{
    display: flex;
    width: 41rem;
    height: 3rem;
    margin-top: 2rem;
  }
</style>