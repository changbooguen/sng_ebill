<script setup>
import {inject, onMounted, onUpdated, ref} from "vue";
import {useRouter} from "vue-router";
import store from '@/store';

/*변수선언*/
const router = useRouter();
const props = defineProps({
  id: String
});
const item = ref({});

const title_rules = [
        value => {
          if (value) return true
          return '제목은 필수 입력값입니다.'
        },
    ];

const saveForm = ref(null);
const formValid = ref(null);

/*Function List*/
const fnGoList= (e)=>{
    router.push({name: 'sampleGridList'});
}


/*상세글가져오기*/
const fnGetData= ()=>{

    const apiUrl = `/api/sample/comBoard/${props.id}`;
    let params = {};
    params.API_PATH = apiUrl;

    store.dispatch('API_LIST',params).then((data) => {
      item.value = data.resultList.data;
    }).catch(({message}) => {
        console.log("message : ", message);
    })

}

const fnValidate= (e)=>{
    const data = saveForm.value?.validate();
    return formValid.value;
};


/*글수정하기*/
const fnSave= (e)=>{

    if(!fnValidate()) {
        return;
    } 

    const jsonData = {
        brdSj: `${item.value.brdSj}`,
        brdCn: `${item.value.brdCn}`,
        pupYn: `${item.value.pupYn}`,
        brdId:`${props.id}`
    };

    const apiUrl = `/api/sample/comBoard`;
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData

    store.dispatch('API_UPDATE',params).then((data) => {

        console.log(data);
        //this.$router.push(`/sample/GridMng`);

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

                      <v-form @submit.prevent ref="saveForm" v-model="formValid"  >
                        <v-text-field
                          v-model="item.brdSj"
                          :rules="title_rules"
                          label="제목"
                          required
                        ></v-text-field>
                    
                        <v-textarea
                          v-model="item.brdCn"
                          label="내용"
                          required
                        ></v-textarea>
                    
                        <v-checkbox
                          v-model="item.pupYn"
                          true-value="1"
                          false-value="0"
                          label="팝업여부"
                        ></v-checkbox>

                        <v-btn class="mt-2" type="submit" @click="fnSave" block>저장</v-btn>

                      </v-form>
  
                    </v-col>
                    </v-row>
                    <v-row class="lg-12"><v-col></v-col></v-row>
                </v-card>           
    
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>
    
      </v-container>
    
    </template>