<script setup>
import { onMounted,  ref} from "vue";
import {useRouter} from "vue-router";
import store from '@/store';

/*변수선언*/
const router = useRouter();

const searchTitle = ref('');
const searchContents = ref('');
const tableDatas = ref([]);
const headers = [
            { title: '제목', align: 'center', key: 'brdSj', sortable: true ,cellProps:{class:"textLeftClass"}},
            { title: '내용', align: 'center', key: 'brdCn', sortable: true ,cellProps:{class:"textLeftClass"}},
            { title: '팝업유무', align: 'center', key: 'pupYn', sortable: false }
];    


/*Function List*/

/*검색어리셋*/
const fnReset= (e)=>{
    searchTitle.value = "";
    searchContents.value = "";
}

/*조회*/
const fnSearch= ()=>{

    // sample
    const apiUrl = "/api/sample/comBoard";
    let params = {};
    params.API_PATH = apiUrl;
    params.brdSj = searchTitle.value;
    params.brdCn = searchContents.value;
    params.size = 1000;

    store.dispatch('API_LIST',params).then((data) => {

        tableDatas.value = data.resultList;

    }).catch(({message}) => {
        console.log("message : ", message);
    })

}

const fnExcelDownload= ()=>{

    const headers = [{brdSj:'제목'},{brdCn:'내용'}];
    const jsonData = {
        datas: tableDatas.value,
        headers: headers
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



const fnGoDetail= (e,row)=>{
    router.push({name : 'sampleDetail', params : {  id: row.item.brdId }});
}

const fnGoSave= (e,row)=>{
    router.push({name: 'sampleSave'});
}







/*Dom객체 완성이후*/
onMounted( () => {

    fnSearch();//초기조회

});

</script>
<template>
    <section class="content_bundle">
  
      <TitleComp>
        <template #titleName>동sample서명</template>
      </TitleComp>
  
      <article class="basic panel">
        <div class="panel_bundle">
          <div class="panel_unit">
            <div class="input_group row">
              <label>제목</label>
              <v-text-field  type="input" @keydown.enter="fnSearch" v-model="searchTitle" density="compact" variant="outlined" hide-details> </v-text-field>
            </div>
            <div class="input_group row">
              <label>내용</label>
              <v-text-field  type="input" @keydown.enter="fnSearch" v-model="searchContents" density="compact" variant="outlined" hide-details> </v-text-field>
            </div>

          </div>
        </div>
  
        <div class="panel_btn_bundle">
            <v-btn prepend-icon="mdi-magnify" variant="tonal" class="search_btn"  @click="fnSearch">조회</v-btn>
            <v-btn variant="tonal" @click="fnExcelDownload">excel download</v-btn>
            <v-btn variant="tonal" @click="fnReset">reset</v-btn>

        </div>
      </article>
  
      <article class="basic">
        <v-data-table
                      :headers="headers"
                      :items="tableDatas"
                      density="compact"
                      item-key="id"
                      @dblclick:row="fnGoDetail"
                    >
                    <template v-slot:[`item.brdSj`]="{ item }">
                        <span>&nbsp;{{item.brdSj }}</span>
                    </template>
                    <template v-slot:[`item.pupYn`]="{ item }">
                        {{item.pupYn ? "예":"아니요"}}
                    </template>

                    </v-data-table>
      </article>
  

    </section>
  </template>
  
  <script>
  import TableComp from "@/components/DetailComponents/TableComp.vue";
  import PaginationComp from "@/components/DetailComponents/PaginationComp.vue";
  
  export default {
    components: {PaginationComp, TableComp},
    data: () => ({
      select: { state: 'Florida', abbr: 'FL' },
      items: [
        { state: 'Florida', abbr: 'FL' },
        { state: 'Georgia', abbr: 'GA' },
        { state: 'Nebraska', abbr: 'NE' },
        { state: 'California', abbr: 'CA' },
        { state: 'New York', abbr: 'NY' },
      ],
  
    }),
  }
  </script>
  
  <style lang="scss" scoped>
  
  </style>