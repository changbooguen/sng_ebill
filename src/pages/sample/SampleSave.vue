<script setup>
import {inject, onMounted, onUpdated, ref} from "vue";
import {useRouter} from "vue-router";
import store from '@/store';

/*변수선언*/
const router = useRouter();

const title = ref('');
const title_rules = [
        value => {
          if (value) return true
          return '제목은 필수 입력값입니다.'
        },
    ];


const contents = ref('');
const isImportant = ref(false);
const saveForm = ref(null);
const formValid = ref(null);

/*Function List*/

const fnGoList= (e)=>{
    router.push({name: 'sampleGridList'});
}

/*글저장*/

// const fnValidate22 = async () => {
//     const data = await saveForm.value?.validate();
//     console.log(data.valid);
//     return data.valid;
// };

const fnValidate= (e)=>{
    const data = saveForm.value?.validate();
    return formValid.value;
};

const fnSave= (e)=>{

    if(!fnValidate()) {
        return;
    } 

    const jsonData = {
        brdSj: title.value,
        brdCn: contents.value,
        pupYn: 1
    }

    const apiUrl = "/api/sample/comBoard";

    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData

    store.dispatch('API_SAVE',params).then((data) => {

        console.log(data);
        
        fnGoList();

    }).catch(({message}) => {
        console.log("message : ", message);
    })

}


/*Dom객체 완성이후*/
onMounted( () => {


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
                <v-sheet class="mx-auto" width="100%">

                    <v-form @submit.prevent ref="saveForm" v-model="formValid"  >

                        <v-text-field
                        v-model="title"
                        :rules="title_rules"
                        label="제목"
                        required
                        ></v-text-field>

                        <v-textarea
                        v-model="contents"
                        label="내용"
                        required
                        ></v-textarea>

                        <v-checkbox
                        v-model="isImportant"
                        label="중요여부"
                        type="checkbox"
                        ></v-checkbox>

                        <v-btn class="mt-2" type="submit" @click="fnSave" block>저장</v-btn>

                    </v-form>

                </v-sheet>
            </v-card>
    
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>
    
      </v-container>
    
    </template>