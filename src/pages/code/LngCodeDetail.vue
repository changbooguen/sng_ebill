<script setup>
import {inject, onMounted, onUpdated, ref} from "vue";
import {useRouter} from "vue-router";
import store from '@/store';

/** 변수선언 */
const router = useRouter();

const props = defineProps({
  id: String
})
const item = ref({});

/** function List */

/** 조회 */
const fnGetData = () => {
  const listUrl = `/api/lngCode/${props.id}`

  let params = {};
  params.API_PATH = listUrl;

  store.dispatch('API_LIST',params).then((data) => {
    item.value = data.resultList.data;
  }).catch(({message}) => {
        console.log("message : ", message);
  })

}

/** 날짜변환 */
const fnFormDate = (data) => {
  if(!data) return '';
  return data.replace('T', ' ').split('.')[0];
}

/** 목록 */
const fnGoList = () => {
  router.push({name: 'lngCodeMng'})
}

/** 수정 */
const fnGoUpdate = () => {
  router.push({name: 'lngUpdate', params : {id : `${props.id}`}});
}

/** 삭제 */
const fnDelete = () => {
  if(!confirm("삭제 하시겠습니까?")){
    return;
  }
  const apiUrl = `/api/lngCode/`;

  let deleteItems = [];
  deleteItems.push(`${props.id}`);

  let params = {};
  params.API_PATH = apiUrl;
  params.deleteItems = deleteItems;

  store.dispatch('API_DELETE', params).then((data) => {
    fnGoList();
  }).catch(({message}) => {
    console.log("message : ", message);
  })
}

/*Dom객체 완성이후*/
onMounted( () => {
    fnGetData();
});

</script>

<template>
  <v-container class="lg-12">
    
    <v-row class="lg-12">
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


              <v-table>
                <tbody>
                  <tr>
                    <td class="text-left">
                      메세지코드
                    </td>
                    <td class="text-left" colspan="3">
                      {{ item.lngId }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left">
                      프랑스어
                    </td>
                    <td class="text-left" colspan="3">
                      {{ item.lngTy1 }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left">
                      영어
                    </td>
                    <td class="text-left" colspan="3">
                      {{ item.lngTy2 }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left">
                      한국어
                    </td>
                    <td class="text-left" colspan="3">
                      {{ item.lngTy3 }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left">
                      비고
                    </td>
                    <td class="text-left" colspan="3">
                      {{ item.rmk }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left">
                      등록아이디
                    </td>
                    <td class="text-left">
                      {{ item.regId }}
                    </td>
                    <td class="text-left">
                      등록날짜
                    </td>
                    <td class="text-left">
                      {{ fnFormDate(item.regDt) }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left">
                      수정아이디
                    </td>
                    <td class="text-left">
                      {{ item.modId }}
                    </td>
                    <td class="text-left">
                      수정날짜
                    </td>
                    <td class="text-left">
                      {{ fnFormDate(item.modDt) }}
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



<style scoped>

</style>