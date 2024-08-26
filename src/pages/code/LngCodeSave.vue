<script setup>
import store from '@/store';
import { inject, onMounted, onUpdated, ref } from "vue";
import {useRouter} from "vue-router";

/** 변수 선언 */
const lngType1 = ref('');
const lngType2 = ref('');
const lngType3 = ref('');
const rmk = ref('');
const router = useRouter();
const saveForm = ref(null);
const formValid = ref(null);
const type_rules = [
        value => {
          if (value) return true
          return '필수 입력값입니다.'
        },
    ];


/** function List */

/** rule */
const fnValidate= (e)=>{
    const data = saveForm.value?.validate();
    return formValid.value;
};

/** 저장 */
const fnSave = (e) => {
  if(!fnValidate()) {
    return;
  }

  const jsonData = {
    lngTy1 : lngType1.value,
    lngTy2 : lngType2.value,
    lngTy3 : lngType3.value,
    rmk : rmk.value,
  };

  const apiUrl = "/api/lngCode";
  let params = {};
  params.API_PATH = apiUrl;
  params.JSON_DATA = jsonData;

  store.dispatch('API_SAVE', params).then((data) => {
    fnGoList();
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
              v-model="lngType1"
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
              v-model="lngType2"
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
              v-model="lngType3"
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
              v-model="rmk"
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