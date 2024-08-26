<script setup>
import { onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import billFileCompType1 from "@/components/BillFileCompType1.vue";

/*변수선언*/
const router = useRouter();
const fileRef = ref(null);//file component

/*Function List*/

const fnGoUpdate= (e)=>{
    router.push({name: 'billUpdate'});
}

/*상세글가져오기*/
const fnGetData= ()=>{

    let billId = 'EB_07447afd-8120-4f80-97e6-449cfd0cd6ab';
    let procId = 'PC_dce987b5-a113-4a5e-8059-d94828afb1ff';
    
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
                <v-btn variant="outlined" @click="fnGoUpdate">수정</v-btn>
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
                        <th class="text-left">
                            bill_no
                        </th>
                      </tr>

                       <tr>
                        <td>

                            <billFileCompType1 fileMode="R" ref="fileRef" />

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