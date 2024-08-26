<script setup>
import { onMounted,  ref} from "vue";
import {useRouter} from "vue-router";
import store from '@/store';

/*변수선언*/
const router = useRouter();
const props = defineProps({
  id: String
});
const item = ref({});
const saveForm = ref(null);
const formValid = ref(null);

/*입력값 유효성 검증*/
const title_rules = [
        value => {
          if (value) return true
          return '제목은 필수 입력값입니다.'
        },
    ];

const EdDt_rules = [
  value => !!value || '종료일시는 필수 입력값입니다.',
  value => ((new Date(item.value.pupBgDt) < new Date(value)) || (item.value.pupBgDt === '')) || '종료일시는 시작일시 이후여야 합니다.'
];

const BgDt_rules = [
  value => !!value || '시작일시는 필수 입력값입니다.',
  value => ((new Date(value) < new Date(item.value.pupEdDt)) || (item.value.pupEdDt === '') ) || '시작일시는 종류일시 전이어야 합니다.'
];
const ord_rules = [
    value => {
        if (value >= 0 && value <= 10) return true
        return "0~10"
    },
];

/*Function List*/

/*목록으로 이동*/
const fnGoList= (e)=>{
    router.push({name: 'board'});
}

/*상세글가져오기*/
const fnGetData= ()=>{
    const apiUrl = `/api/board/${props.id}/edit`;
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

/*날짜 형식 지정*/
const formatDateTime = (dateTime) => {
    if (!dateTime) return '';

    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateTime);
        return '';
    }
    return date.toISOString().slice(0, 10);
}

/*글수정하기*/
const fnSave= async (e)=>{

    if(!fnValidate()) {
        return;
    } 

    const jsonData = {
      brdId:`${props.id}`,
      brdSj: item.value.brdSj,
      brdCn: item.value.brdCn,
      pupYn: item.value.pupYn,  
      ord: item.value.ord ? item.value.ord : 0,
      brdType: item.value.brdType,
      pupBgDt: formatDateTime(item.value.pupBgDt),
      pupEdDt: formatDateTime(item.value.pupEdDt),
      
    };
    const apiUrl = `/api/board`;
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData;

    store.dispatch('API_UPDATE', params).then((data) => {
      fnGoList();
    }).catch(({message}) => {
    console.log("message : ", message);
  });
}
/*Dom객체 완성이후*/
onMounted( () => {
    fnGetData();
});

</script>

<template>
  <v-container class="lg-12">
    <v-row class="lg-12" > 
      <v-col cols="1"></v-col>  
      <v-col>
        <v-card  variant="outlined">
          <v-sheet class="mx-auto" width="100%" style="padding: 20px;">
            <v-form @submit.prevent ref="saveForm" v-model="formValid"  >
              <v-col></v-col>
              <v-col>
                <v-radio-group v-model="item.brdType" inline>
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
                v-model="item.brdSj"
                :rules="title_rules"
                label="제목*"
                required
                ></v-text-field>
              </v-col>
              <v-col>
                <v-textarea
                v-model="item.brdCn"
                label="내용"
                required
                ></v-textarea>
              </v-col>
              <v-col>
              <v-row class="lg-12" align="center">
                <v-col cols="2">
                  <v-text-field
                  v-model="item.ord"
                  :rules="ord_rules"
                  label="순서"
                  type="number"  
                  min="0"
                  max="10"        
                  outlined                
                  density="compact"      
                  clearable   
                  variant="underlined"            
                  ></v-text-field>
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                  v-model="item.pupYn"
                  true-value="Y"
                  false-value="N"
                  label="팝업여부"
                  ></v-checkbox>
                </v-col>
              </v-row>
              </v-col>
                <v-col>
                <v-row v-if="item.pupYn === 'Y'" justify="start">
                  <v-col cols="auto">
                    <v-text-field
                    type="date" 
                    v-model="item.pupBgDt"
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
                    v-model="item.pupEdDt"
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
  