<script setup>
import { onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import store from '@/store';

/*변수선언*/
const router = useRouter();
const props = defineProps({
  id: String
});
const item = ref({});

/*Function List*/
const fnGoList= (e)=>{
    router.push({name: 'board'});
}

/*수정으로 이동 */
const fnGoUpdate= (e)=>{
    router.push({name : 'boardUpdate', params : {  id: `${props.id}`}});
}

/*상세글가져오기*/
const fnGetData= ()=>{
    const apiUrl = `/api/board/${props.id}`;
    let params = {};
    params.API_PATH = apiUrl;

    store.dispatch('API_LIST',params).then((data) => {

      item.value = data.resultList.data;
    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

/*삭제하기*/
const fnDelete= ()=>{

    if(!confirm("삭제 하시겠습니까?")){
      return;
    }

    const apiUrl = "/api/board/";
    let deleteItems = [];
    deleteItems.push(`${props.id}`);

    let params = {};
    params.API_PATH = apiUrl;
    params.deleteItems = deleteItems;

    store.dispatch('API_DELETE',params).then((data) => {
      console.log(data.resultList);
      fnGoList();
      
    }).catch(({message}) => {       
      console.log("message : ", message);
    })
};
/*Dom객체 완성이후*/
onMounted( () => {
    fnGetData();
});

</script>

<template>
    <v-container class="lg-12">
        <v-row class="lg-12" >
            <v-col cols="1"></v-col>
            <v-col  align="end">
                <v-btn variant="outlined" @click="fnGoUpdate">수정</v-btn>
                <v-btn variant="outlined" @click="fnDelete">삭제</v-btn>
                <v-btn variant="outlined" @click="fnGoList">목록</v-btn>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>
        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>
                <v-card  variant="outlined">
                    <v-row class="lg-12"><v-col></v-col></v-row>
                    <v-row align="center" class="lg-12">
                    <v-col>
                  <v-table style="padding: 20px;">
                    <tbody >
                      <tr>
                        <th class="text-left">
                          제목
                        </th>
                        <td class="text-left">
                          {{ item.brdSj }}
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left">
                          내용
                        </th>
                        <td class="text-left">
                          {{ item.brdCn }}
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left">
                          유형
                        </th>
                        <td class="text-left">
                          {{ item.brdType }}
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left">
                          팝업여부
                        </th>
                        <td class="text-left">
                          {{ item.pupYn }}
                        </td>
                      </tr>
                      <tr v-if="item.pupYn === 'Y'">
                        <th class="text-left">
                          팝업시작일자
                        </th>
                        <td class="text-left">
                          {{ item.pupBgDt }}
                        </td>
                      </tr>
                      <tr v-if="item.pupYn === 'Y'">
                        <th class="text-left">
                          팝업종료일자
                        </th>
                        <td class="text-left">
                          {{ item.pupEdDt }}
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left">
                          순서
                        </th>
                        <td class="text-left">
                          {{ item.ord }}
                        </td>
                      </tr>
                    </tbody>
                  </v-table>

                    </v-col>
                    </v-row>
                    <v-row class="lg-12"><v-col></v-col></v-row>
                </v-card>           
    
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>
    
      </v-container>
    
    </template>