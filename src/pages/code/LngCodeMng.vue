<script setup>
import store from '@/store';
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

/** 변수 선언 */
const searchTypes = ref('');
const searchContents = ref('');
const router = useRouter();
const tableDatas = ref([]);
const headers = [
            { title: '메세지코드', align: 'center', key: 'lngId', sortable: true },
            { title: '프랑스어(1)', align: 'center', key: 'lngTy1', sortable: false },
            { title: '영어(2)', align: 'center', key: 'lngTy2', sortable: false },
            { title: '한국어(3)', align: 'center', key: 'lngTy3', sortable: false },
            { title: '비고', align: 'center', key: 'rmk', sortable: false },
            { title: '등록아이디', align: 'center', key: 'regId', sortable: false },
            { title: '등록날짜', align: 'center', key: 'regDt', sortable: false, 
              value: (item) => fnFormDate(item.regDt) },
]; 
const delChecked = ref([]);


/** function List */

/** 날짜변환 */
const fnFormDate = (data) => {
  if(!data) return '';
  return data.replace('T', ' ').split('.')[0];
}

/** 조회 */
const fnSearch = () =>{
  const listUrl = "/api/lngCode";

  let params = {};
  params.API_PATH = listUrl;
  params.shTy = searchTypes.value;
  params.shCn = searchContents.value;


  store.dispatch('API_LIST',params).then((data) => {
    tableDatas.value = data.resultList;

  }).catch(({message}) => {
    console.log("message : ", message);
  })

} 

const fnGoSave = () => {
  router.push({name: 'lngSave'});
}

const fnDelete = () => {
  if(!confirm("삭제 하시겠습니까?")){
    return;
  }

  const apiUrl = `/api/lngCode/`;

  let deleteItems = [];
  delChecked.value.forEach(item => deleteItems.push(item.lngId));

  let params = {};
  params.API_PATH = apiUrl;
  params.deleteItems = deleteItems;

  store.dispatch('API_DELETE', params).then((data) => {
    delChecked.value = [];
    fnSearch();
  }).catch(({message}) => {
    console.log("message : ", message);
  })
}

const fnReset = () => {
  searchTypes.value = "kr";
  searchContents.value = "";
}

const fnGoDetail = (e,row) => {
  router.push({name : 'lngDetail', params : {  id: row.item.lngId }});
}


/* Dom객체 완성이후 */
onMounted( () => {

  searchTypes.value = "kr";
  fnSearch();//초기조회
});


</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-radio-group v-model="searchTypes" inline>
          <v-radio label="프랑스어" value="fr"></v-radio>
          <v-radio label="영어" value="en"></v-radio>
          <v-radio label="한국어" value="kr"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col>
        <v-text-field 
          label="검색" 
          variant="outlined" 
          type="input" 
          v-model="searchContents" 
          @keyup.enter="fnSearch"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn variant="outlined" @click="fnSearch">검색</v-btn> 
        <v-btn variant="outlined" @click="fnReset">reset</v-btn> 
      </v-col>

      <v-col cols="2"></v-col>

      <v-col cols="1">
        <v-btn variant="outlined" @click="fnGoSave">추가</v-btn>
      </v-col>
      <v-col cols="1">
        <v-btn variant="outlined" @click="fnDelete">삭제</v-btn>
      </v-col>

    </v-row>

    <v-row>
      <v-data-table
        :items="tableDatas"
        :headers="headers"
        density="compact"
        item-key="lngId"
        @dblclick:row="fnGoDetail"
        show-select
        return-object
        v-model="delChecked"
      >
      </v-data-table>
    </v-row>

  </v-container>

</template>

<style scoped>

</style>