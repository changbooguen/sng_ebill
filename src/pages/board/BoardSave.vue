<script setup>
import { onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import store from '@/store';

/*변수선언*/
const router = useRouter();
const contents = ref('');
const brdType = ref('공지사항');
const title = ref('');
const pupYn = ref(false);
const pupBgDt = ref('');
const pupEdDt = ref('');
const saveForm = ref(null);
const formValid = ref(null);
const ord = ref('');


/*입력값 유효성 검증 */
const title_rules = [
    value => {
        if (value) return true
          return '제목은 필수 입력값입니다.'
    },
];

const EdDt_rules = [
  value => !!value || '종료일시는 필수 입력값입니다.',
  value => ((new Date(pupBgDt.value) < new Date(value)) || (pupBgDt.value === '')) || '종료일시는 시작일시 이후여야 합니다.'
];
const BgDt_rules = [
  value => !!value || '시작일시는 필수 입력값입니다.',
  value => ((new Date(value) < new Date(pupEdDt.value)) || (pupEdDt.value === '') ) || '시작일시는 종류일시 전이어야 합니다.'
];
const ord_rules = [
    value => {
        if (value >= 0 && value <= 10) return true
        return "0~10"
    },
];

/*Function List*/
const fnGoList= (e)=>{
    router.push({name: 'board'});
}

const fnValidate= (e)=>{
    const data = saveForm.value?.validate();
    return formValid.value;
};
const formatDateTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().slice(0, 10);
}

/*저장 */
const fnSave= async (e)=>{

    if(!fnValidate()) {
        return;
    } 

    const jsonData = {
        brdSj: title.value,
        brdCn: contents.value,
        brdType: brdType.value,
        pupYn: pupYn.value ? 'Y' : 'N',
        pupBgDt: formatDateTime(pupBgDt.value),
        pupEdDt: formatDateTime(pupEdDt.value),
        ord: ord.value ? ord.value : 0
    };
    const apiUrl = '/api/board';
    let params = {};
    params.API_PATH = apiUrl,
    params.JSON_DATA = jsonData;
    
    store.dispatch('API_SAVE', params).then((data) => {
    fnGoList();
  }).catch(({message}) => {
    console.log("message : ", message);
  });
}

/*Dom객체 완성이후*/
onMounted( () => {

});

</script>

<template>
    <v-container class="lg-12">
        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>
            <v-card  variant="outlined">
                <v-sheet class="mx-auto" width="100%" style="padding: 20px;">
                    <v-form @submit.prevent ref="saveForm" v-model="formValid"  >
                    <v-col></v-col>
                        <v-col>
                            <v-radio-group v-model="brdType" inline>
                                <template v-slot:label>
                                    <div>유형*</div>    
                                </template>
                            <v-radio label="공지사항" value="공지사항"></v-radio>
                            <v-radio label="자료실" value="자료실"></v-radio>
                            <v-radio label="FAQ" value="FAQ"></v-radio>
                            </v-radio-group> 
                        </v-col>
                        <v-col>
                            <v-text-field
                            v-model="title"
                            :rules="title_rules"
                            label="제목*"
                            required
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-textarea
                            v-model="contents"
                            label="내용"
                            required
                            ></v-textarea>
                        </v-col>
                        <v-col>
                        <v-row class="lg-12" align="center" >
                        <v-col cols="2">
                            <v-text-field
                            v-model="ord"
                            :rules="ord_rules"
                            label="순서"
                            type="number"   
                            min="0"
                            max="10"       
                            outlined                
                            density="compact"        
                             
                            ></v-text-field>     
                        </v-col>
                        <v-col cols="auto">
                            <v-checkbox
                            v-model="pupYn"
                            label="팝업여부"
                            type="checkbox"
                            ></v-checkbox>
                        </v-col>
                        </v-row>
                        </v-col>
                        <v-col>
                        <v-row v-if="pupYn" justify="start">
                            <v-col cols="auto">
                                <v-text-field
                                type="date" 
                                v-model="pupBgDt"
                                :rules="BgDt_rules"
                                variant="outlined"
                                density="compact"
                                width="15rem"
                                label="팝업시작일자"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="auto">
                                <v-text-field
                                type="date"
                                v-model="pupEdDt"
                                :rules="EdDt_rules"
                                variant="outlined"
                                density="compact"
                                width="15rem"
                                label="팝업종료일자"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        </v-col>

                        <v-col>
                        <v-row class="lg-12" justify="center">
                            <v-col cols="1"></v-col>
                            <v-col cols="auto">
                                <v-btn class="mt-2" type="submit" @click="fnSave" >저장</v-btn>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn class="mt-2" @click="fnGoList">목록</v-btn>
                            </v-col>
                            <v-col cols="1"></v-col>
                        </v-row>
                        </v-col>
                        
                    </v-form>
                </v-sheet>
            <v-col></v-col>      
            </v-card>
        </v-col>
    <v-col cols="1"></v-col>
    </v-row>
</v-container>
</template>

<style>

</style>