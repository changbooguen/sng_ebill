<script setup>
import { onMounted,  ref} from "vue";
import {useRouter} from "vue-router";
import billFileCompType4 from "@/components/BillFileCompType4.vue";

/*변수선언*/
const router = useRouter();


/*File component*/
const fileRef = ref(null);//file component
const inputBillNo = ref('3f7824ccfea44019851962ee8ddaa7c0');

/*Function List*/
const fnGoDetail= (e)=>{
    router.push({name: 'billDetail'});
}


const fnPrevSave = async () => {

    const resultObj = await fileRef.value.fnFileSave(inputBillNo.value);
    
     console.log('fnPrevSave');
     console.log(resultObj.data);
     console.log(resultObj.data.code);
     console.log(resultObj.data.billId);
     console.log(resultObj.data.procId);
     console.log('fnPrevSave');

     if(resultObj.code == '200') {
        fnGetList();
     }

}

const fnGetList= ()=>{
    const resultObj = fileRef.value.fnFileList(inputBillNo.value);

}



/*Dom객체 완성이후*/
onMounted( () => {
    fnGetList();
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

                        <v-text-field   label="bill_no"   required  v-model="inputBillNo" ></v-text-field>


                        <billFileCompType4 fileKind="DOC" fileMode="U" ref="fileRef" />


                        <v-btn class="mt-2" type="button" @click="fnPrevSave" block>파일저장</v-btn>

                    </v-form>

                </v-sheet>
            </v-card>
    
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>
    
      </v-container>
    
    </template>