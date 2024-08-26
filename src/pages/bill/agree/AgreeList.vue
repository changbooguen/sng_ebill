<script setup>
import store from '@/store';
import {ref, onMounted, watch} from "vue";
import {useRouter} from "vue-router";

/*변수선언*/
const router = useRouter();

const tableDatas = ref([]);

const searchBillName = ref('');
const searchPpsrNm = ref('');
const searchAgreeYn = ref('전체');


//[{id:'',name:'전체'},{id:'Y',name:'서명완료'},{id:'N',name:'미서명'}]
// 예제 데이터
const autocompleteItems = ref(['전체','서명완료','미서명']);

const headers = [
  { title: '번호', align: 'center', key: 'index', sortable: false },
  { title: '요청일', align: 'center', key: 'regDt', sortable: true },
  { title: '의안명', align: 'center', key: 'billName', sortable: true ,cellProps:{class:"textLeftClass"}},
  { title: '요청자', align: 'center', key: 'ppsrNm', sortable: true },
  //{ title: '의안파일', align: 'center', key: '', sortable: false },
  { title: '서명여부', align: 'center', key: 'agreeYn', sortable: false },
  { title: '서명의원수', align: 'center', key: 'agreeCnt', sortable: false },
  { title: '상태', align: 'center', key: 'statNm', sortable: false },
];    

/*검색어리셋*/
const fnReset= (e)=>{
  searchBillName.value = "";
  searchPpsrNm.value = "";
  searchAgreeYn.value = "";
}

const fnSearch= (e)=>{
  console.log('fnSearch()')
  const listUrl = "/api/agree";
  let params = {};
  params.API_PATH = listUrl;
  params.billName = searchBillName.value;
  params.ppsrNm = searchPpsrNm.value;
  params.agreeYn = '';

  if (searchAgreeYn.value=='서명완료'){
    params.agreeYn = 'Y';
  }else if(searchAgreeYn.value=='미서명'){
    params.agreeYn = 'N';
  }
  
  params.size = 1000;
  console.log('searchAgreeYn.value',searchAgreeYn.value);
  console.log('params.agreeYn',params.agreeYn);
  store.dispatch('API_LIST',params).then((data) => {

    tableDatas.value = data.resultList.data.content;

    console.log("list content", data.resultList.data.content);

  }).catch(({message}) => {
      console.log("message : ", message);
  })

}

const fnGoDetail= (e,row)=>{
    router.push({name : 'agreeDetail', params : {  billId: row.item.billId }});
}

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};


watch(searchAgreeYn, (newValue, oldValue) => {
  // Trigger your custom event or function here
  fnSearch();
});

/*Dom객체 완성이후*/
onMounted( () => {

  fnSearch();//초기조회

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
                  <v-col>
                      <v-text-field label="의안명" type="input" @keydown.enter="fnSearch" v-model="searchBillName"></v-text-field>
                  </v-col>
                  <v-col>
                      <v-text-field label="요청자" type="input" @keydown.enter="fnSearch" v-model="searchPpsrNm  "></v-text-field>
                  </v-col>
                  <v-col>
                      <v-select
                          label="서명여부"
                          :items="autocompleteItems"
                          v-model="searchAgreeYn"
                      ></v-select>
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

    <v-row class="lg-12">
        <v-col cols="1"></v-col>
        <v-col  align="end">
        </v-col>
        <v-col cols="1"></v-col>
    </v-row>


    <v-row class="lg-12">
        <v-col cols="1"></v-col>
        <v-col>

            <v-card  variant="outlined">          
                <v-row class="lg-12"><v-col></v-col></v-row>
                <v-row align="center" class="lg-12">

                <v-data-table
                  :headers="headers"
                  :items="tableDatas"
                  density="compact"
                  item-key="id"
                  @dblclick:row="fnGoDetail"
                >

                  <template v-slot:[`item.index`]="{item}">
                    {{tableDatas.indexOf(item) + 1}}
                  </template>

                  <template v-slot:[`item.agreeYn`]="{ item }">
                    {{item.agreeYn == 'Y' ? "서명완료":"미서명"}}
                  </template>

                  <template v-slot:[`item.regDt`]="{ item }">
                    {{formatDate(item.regDt)}}
                  </template>
                  <!--
                  <template v-slot:[`item.statCd`]="{ item }">
                    {{item.statCd == 'Y' ? "서명완료":"미서명"}}
                  </template>
-->
                </v-data-table>

                </v-row>
                <v-row class="lg-12"><v-col></v-col></v-row>
            </v-card>           

        </v-col>
        <v-col cols="1"></v-col>
    </v-row>

  </v-container>
</template>

<style scoped>

</style>