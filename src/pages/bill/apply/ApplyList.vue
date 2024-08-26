<script setup>
import store from '@/store';
import {ref, onMounted, watch} from "vue";
import {useRouter} from "vue-router";
import billCodeComponent from "@/components/BillCodeComponent.vue";

/*변수선언*/
const router = useRouter();

const tableDatas = ref([]);

const searchBillName = ref('');
const searchStatCd = ref('전체');

const autocompleteItems = ref(['전체','제출대기','제출완료', '반송']);

const headers = [
  { title: '번호', align: 'center', key: 'index', sortable: false },
  { title: '제안일', align: 'center', key: 'ppslDt', sortable: true },
  { title: '의안명', align: 'center', key: 'billName', sortable: true ,cellProps:{class:"textLeftClass"}},
  { title: '상태', align: 'center', key: 'statCd', sortable: false }
];    

/*검색어리셋*/
const fnReset= (e)=>{
  searchBillName.value = "";
  searchStatCd.value = "";
}

const fnSearch= (e)=>{
  console.log('fnSearch()')
  const listUrl = "/api/apply/ebsMaster";
  let params = {};
  params.API_PATH = listUrl;
  params.billName = searchBillName.value;
  params.statCd = '';
  
  if (searchStatCd.value=='제출대기'){
    params.statCd = 'PR010';
  }else if(searchStatCd.value=='제출완료'){
    params.statCd = 'PR105';
  }else if(searchStatCd.value=='반송'){
    params.statCd = 'PR101';
  }


  params.size = 1000;

  store.dispatch('API_LIST',params).then((data) => {

    console.log("list content", data);

    tableDatas.value = data.resultList;

    

  }).catch(({message}) => {
      console.log("message : ", message);
  })

}

const fnGoDetail= (e,row)=>{
    router.push({name : 'applyDetail', params : {  billId: row.item.billId }});
}

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};


watch(searchStatCd, (newValue, oldValue) => {
  // Trigger your custom event or function here
  fnSearch();
});

const fnGoSave= (e)=>{
    router.push({name: 'applySave'});
}

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
                    
                      <v-select
                          label="상태"
                          :items="autocompleteItems"
                          v-model="searchStatCd"
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
          <v-btn variant="outlined" @click="fnGoSave">글쓰기</v-btn>
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

                  <template v-slot:[`item.ppslDt`]="{ item }">
                    {{formatDate(item.ppslDt)}}
                  </template>
                  <template v-slot:[`item.statCd`]="{ item }">
                    <span v-if="item.statCd=='PR010'">
                      제출대기
                    </span>
                    <span v-if="item.statCd=='PR105'">
                      제출완료
                    </span>
                    <span v-if="item.statCd=='PR101'">
                      반송
                    </span>
                  </template>
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