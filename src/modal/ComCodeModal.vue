<script setup>
import store from '@/store';
import { ref, defineEmits, watch } from 'vue';

/** 변수선언 */
const props = defineProps({
  data: Object,
  forUpdate: Boolean,
  tableDatas: Array
});
const emit = defineEmits(['close', 'saveSuccess']); 
const codeId = ref('');
const codeNm = ref('');
const grpCode = ref('');
const rmk = ref(''); 
const ord = ref('0');
const useYn = ref(false);

const saveForm = ref(null);
const formValid = ref(true);

  /** 입력값 유효성 확인 */
const codeId_rules = [
  value => {
    if (value) return true
      return '코드아이디는 필수 입력값입니다.'
  },
];
const codeNm_rules = [
  value => {
    if (value) return true
      return '코드명은 필수 입력입니다.'
  },
];

const ord_rules = [
  value => {
    if (value >=0 && value <= 10) return true
    return "0~10"
  },
];

/*Function List*/
watch(() => props.data, (newData) => {
  if (newData){
    codeId.value = newData.codeId || '';
    codeNm.value = newData.codeNm || '';
    grpCode.value = newData.grpCode || '';
    rmk.value = newData.rmk || '';
    ord.value = newData.ord || '0';
    useYn.value = newData.useYn === 'Y'; 
  }
}, { immediate: true});

const fnValidate = (e) => {
  saveForm.value?.validate();
  return formValid.value;
}
/**코드아이디 및 그룹코드 최대 입력 */
const limitInputLength =(input) =>{
  if (input.length > 5){
    input = input.slice(0, 5);
  }
}

/**저장 */
const fnSave = (e) => {
  if (!fnValidate()) {
    return;                              
}
  
const formData = {
  codeId: codeId.value,
  codeNm: codeNm.value,
  grpCode: grpCode.value,
  rmk: rmk.value,
  ord: ord.value ? ord.value : 0,
  useYn: useYn.value ? 'Y' : 'N'
};
const apiAction = props.forUpdate ? 'API_UPDATE' : 'API_SAVE';
const apiUrl = props.forUpdate ? `/api/com-codes/${codeId.value}` : "/api/com-codes";

const params = {
  API_PATH: apiUrl,
  JSON_DATA: formData
};

store.dispatch(apiAction, params)
  .then((data) => {
  emit('saveSuccess');
  emit('close', false);})

  .catch(({ message }) => {
    console.error("message:", message);
  });
};
const closeModal = () => {
  emit("close");
}
</script>

<template>
  <transition name="modal" appear>
    <div class="modal-overlay" @click.self="closeModal">
    <v-form @submit.prevent ref="saveForm" v-model="formValid" class="modal-container">
      <v-container class="modal-wrapper">
        <v-row align="center" justify="center" style="font-size: large;">■ 코드 등록</v-row>
        <v-divider></v-divider>
        <v-sheet>
          <v-row >
            <v-col cols="4">코드아이디*</v-col>
            <v-col>
              <v-text-field
                  v-model="codeId" :readonly="forUpdate"
                  :rules="codeId_rules"
                  :maxlength="5"
                  @input="limitInputLength('codeId')"
                  hint="최대 5글자"
                  variant="outlined"
                  density="compact"
                  width="15rem" >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row >
            <v-col cols="4">코드명*</v-col>
            <v-col>
              <v-text-field
                v-model="codeNm"
                :rules="codeNm_rules"
                variant="outlined"
                density="compact"
                width="15rem">
              </v-text-field>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="4">그룹코드</v-col>
            <v-col>
              <v-text-field
                v-model="grpCode"
                variant="outlined"
                :maxlength="5"
                @input="limitInputLength('grpCode')"
                hint="최대 5글자"
                density="compact"
                width="15rem">
              </v-text-field>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="4">비고</v-col>
            <v-col>
              <v-textarea
                v-model="rmk"
                variant="outlined"
                density="compact"
                width="15rem"
                >
              </v-textarea>
            </v-col>
          </v-row>
          <v-row align="center" >
            <v-col cols="4">순서</v-col>
            <v-col>
              <v-text-field
                v-model="ord"
                type="number"
                :rules="ord_rules"
                variant="outlined"
                min="0"
                max="10"
                width="5rem"
                density="compact"
              
             ></v-text-field>
            </v-col>
            <v-col >
              <v-checkbox v-model="useYn" label="사용여부">
              </v-checkbox>
            </v-col>
          </v-row>
        </v-sheet>

        <v-row align="center" justify="center">
          <v-col cols="auto">
            <v-btn variant="tonal" color="primary" size="large" type="submit" @click="fnSave">저장</v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn variant="tonal" size="large" @click="$emit('close', false)">닫기</v-btn>
          </v-col>
        </v-row>
        
      </v-container>
    </v-form> 
    </div> 
  </transition>

</template>

<style scoped>
.modal-overlay{
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}
.modal-wrapper{
  position: fixed;
  width:35%;
  height: 95%;
  overflow: auto;
  padding: 20px;
}

</style>







