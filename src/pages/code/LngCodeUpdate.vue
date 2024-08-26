<script setup>
import { inject, onMounted, onUpdated, ref } from "vue";
import {useRouter} from "vue-router";
import store from '@/store';

/** 변수 선언 */
const router = useRouter();
const saveForm = ref(null);
const formValid = ref(null);
const type_rules = [
        value => {
          if (value) return true
          return '필수 입력값입니다.'
        },
    ];
const props = defineProps({
  id: String
});
const item = ref({});


/** function List */

/** 상세 글 가져오기 */
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

/** rule */
const fnValidate= (e)=>{
    const data = saveForm.value?.validate();
    return formValid.value;
};

/** 수정 */
const fnSave = (e) => {
  if(!fnValidate()) {
    return;
  }

  const jsonData = {
    lngId : `${props.id}`,
    lngTy1 : item.value.lngTy1,
    lngTy2 : item.value.lngTy2,
    lngTy3 : item.value.lngTy3,
    rmk : item.value.rmk
  }

  const apiUrl = `/api/lngCode/${props.id}`;
  let params = {};
  params.API_PATH = apiUrl;
  params.JSON_DATA = jsonData;

  store.dispatch('API_UPDATE', params).then((data) => {
    router.push({name : 'lngDetail', params : {  id: props.id }});
  }).catch(({message}) => {
    console.log("message : ", message);
  });
}

/** 목록 */
const fnGoList = (e) => {
  router.push({name: 'lngCodeMng'});
}

/** 초기화 */
const fnReset = () =>{
  lngType1.value = "";
  lngType2.value = "";
  lngType3.value = "";
  rmk.value = "";
}

/** Dom객체 완성이후 */
onMounted(() => {
  fnGetData();

});

</script>

<template>
  <v-container class="lg-12">
      <v-row>
        메세지 등록
      </v-row>
      
      <v-form @submit.prevent ref="saveForm" v-model="formValid">
        <v-row>
          <v-col cols="1">
            프랑스어 : 
          </v-col>
          <v-col>
            <v-text-field
              v-model="item.lngTy1"
              :rules="type_rules"
              label="제목"
              required
            ></v-text-field>
          </v-col>  
        </v-row>  

        <v-row>
          <v-col cols="1">
            영어 : 
          </v-col>
          <v-col >
            <v-text-field
              v-model="item.lngTy2"
              :rules="type_rules"
              label="제목"
              required
            ></v-text-field>
          </v-col>  
        </v-row>  

        <v-row>
          <v-col cols="1">
            한국어 : 
          </v-col>
          <v-col>
            <v-text-field
              v-model="item.lngTy3"
              :rules="type_rules"
              label="제목"
              required
            ></v-text-field>
          </v-col>  
        </v-row>  

        <v-row>
          <v-col cols="1">
            비고 : 
          </v-col>
          <v-col >
            <v-text-field
              v-model="item.rmk"
              label="제목"
              required
            ></v-text-field>
          </v-col>  
        </v-row>  
      </v-form>
    
      <v-row justify="end">
        <v-col cols="1">
          <v-btn variant="outlined" type="submit" @click="fnSave">저장</v-btn>
        </v-col>
        <v-col>
          <v-btn variant="outlined" @click="fnGoList">목록</v-btn>
        </v-col>
      </v-row>  
  </v-container>
</template>



<style scoped>

</style>