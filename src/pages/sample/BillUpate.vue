<script setup>
import { onMounted,  ref} from "vue";
import {useRouter} from "vue-router";
import billFileCompType1 from "@/components/BillFileCompType1.vue";

/*변수선언*/
const router = useRouter();


/*File component*/
const fileRef = ref(null);//file component

/*Function List*/
const fnGoList= (e)=>{
    router.push({name: 'billList'});
}


const fnPrevSave = async () => {

    let billId = 'EB_07447afd-8120-4f80-97e6-449cfd0cd6ab';
    let procId = 'PC_dce987b5-a113-4a5e-8059-d94828afb1ff';

    const resultObj = await fileRef.value.fnFileSave(billId,procId);
    //const resultObj = await fileRef.value.fnFileSave(billId);

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

    // EB_f7c26b2b-30cb-41e5-8b3b-403a81dd59d7	PC_bf0ab024-443b-4209-b657-b1a0e7435379
    let billId = 'EB_f7c26b2b-30cb-41e5-8b3b-403a81dd59d7';
    let procId = 'PC_bf0ab024-443b-4209-b657-b1a0e7435379';

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
                <v-btn variant="outlined" @click="fnGoList">목록</v-btn>
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

                        <billFileCompType1 fileMode="U" ref="fileRef" />


                        <v-btn class="mt-2" type="button" @click="fnPrevSave" block>저장</v-btn>

                    </v-form>

                </v-sheet>
            </v-card>
    
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>
    
      </v-container>
    
    </template>