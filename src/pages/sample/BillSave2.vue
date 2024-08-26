<script setup>
import { onMounted,  ref} from "vue";
import {useRouter} from "vue-router";
import billFileComp from "@/components/BillFileCompType2.vue";

/*변수선언*/
const router = useRouter();


/*File component*/
const fileRef = ref(null);//file component

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
        //fnSave();
    }

}

const fnSave= (e)=>{

}


/*상세글가져오기*/
const fnGetData= ()=>{
//  EB_9c4524ab-9a26-46a5-9a6f-74974e28ea8c	PC_111cc907-004c-42f2-b86b-93e01c2b4915
let billId = 'EB_9c4524ab-9a26-46a5-9a6f-74974e28ea8c';
let procId = 'PC_111cc907-004c-42f2-b86b-93e01c2b4915';

const resultObj = fileRef.value.fnFileList(billId,procId);

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
                <v-btn variant="outlined" @click="fnGoDetail">상ddd세</v-btn>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>


        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>

            <v-card  variant="outlined">
                <v-sheet class="mx-auto" width="100%">


                        <billFileComp fileKind="AC" opbYn="Y" fileMode="U" ref="fileRef" />


                        <v-btn class="mt-2" type="button" @click="fnPrevSave" block>저장</v-btn>


                </v-sheet>
            </v-card>
    
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>
    
      </v-container>
    
    </template>