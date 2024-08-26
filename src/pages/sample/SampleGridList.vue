<script setup>
import {inject, onMounted, onUpdated, ref} from "vue";
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

    <v-container class="lg-12">
    
        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>
                <v-card  variant="outlined">
                    <v-row class="lg-12"><v-col></v-col></v-row>
    
                    <v-row align="center" class="lg-12">
                    <v-col>
                        <v-text-field label="제목"  type="input" @keydown.enter="fnSearch" v-model="searchTitle" > </v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field label="내용"  type="input" @keydown.enter="fnSearch" v-model="searchContents" > </v-text-field>
                    </v-col>
                    <v-col>
                      
                      <v-row align="center" justify="center">
                        <v-col cols="auto">
                          <v-btn variant="outlined" @click="fnSearch">조회</v-btn>

                          <v-btn variant="outlined" @click="fnExcelDownload">excel download</v-btn>

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
                    <template v-slot:[`item.brdSj`]="{ item }">
                        <span>&nbsp;{{item.brdSj }}</span>
                    </template>
                    <template v-slot:[`item.pupYn`]="{ item }">
                        {{item.pupYn ? "예":"아니요"}}
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
 
 <style>
    
 .selected {
     background-color: red
 }
 
 .textLeftClass{text-align: left !important;}
 
 </style>

    
    