<script setup>
import { onMounted,  ref} from "vue";
import {useRouter} from "vue-router";
import billFileCompType1 from "@/components/BillFileCompType1.vue";
import billCodeComponent from "@/components/BillCodeComponent.vue";
import billCodeInputComponent from "@/components/BillCodeInputComponent.vue";

/*변수선언*/
const router = useRouter();


/*File component*/
const fileRef = ref(null);//file component
const CodeRef = ref(null);//CodeRef component
const InputCodeRef = ref(null);//InputCodeRef component

/*Function List*/
const fnGoDetail= (e)=>{
    router.push({name: 'billDetail'});
}


const fnPrevSave = async () => {

    const resultObj = await fileRef.value.fnFileSave();
    //const resultObj = await fileRef.value.fnFileSave(billId);
    //const resultObj = await fileRef.value.fnFileSave(billId,procId);
    
     console.log('fnPrevSave');
     console.log(resultObj.data.code);
     console.log(resultObj.data.billId);
     console.log(resultObj.data.procId);
     console.log('fnPrevSave');

     if(resultObj.code == '200') {
    //     //fnSave();
     }

}

const fnGetSelect= (e)=>{
   const selectedValue = CodeRef.value.getCode();
   console.log(selectedValue);
}

const fnSetSelect= ()=>{
    CodeRef.value.setCode('FN003');
}

const fnSave= (e)=>{

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
                <v-btn variant="outlined" @click="fnGoDetail">상세</v-btn>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>


        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>

            <v-card  variant="outlined">
                <v-sheet class="mx-auto" width="100%">

                    <v-form @submit.prevent   >

                        <v-text-field
                        label="bill_no"
                        required
                        ></v-text-field>

                        <billCodeComponent ref="CodeRef" groupCode="0000" />
                        <billCodeInputComponent ref="InputCodeRef" groupCode="0000" />

                        <billFileCompType1 fileMode="C" ref="fileRef" />


                        <v-btn class="mt-2" type="button" @click="fnPreSave" block>파일저장</v-btn>
                        <v-btn class="mt-2" type="button" @click="fnGetSelect" block>저장시 콤보박스 값가져오기</v-btn>
                        <v-btn class="mt-2" type="button" @click="fnSetSelect" block>수정에서 콤보박스 값셋팅하기</v-btn>

                    </v-form>

                </v-sheet>
            </v-card>
    
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>
    
      </v-container>
    
    </template>