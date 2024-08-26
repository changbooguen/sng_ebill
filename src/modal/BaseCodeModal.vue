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
const codeKind = ref('대수');
const bgDt = ref('');
const edDt = ref('') ;
const rmk = ref(''); 
const ord = ref('0');
const currYn = ref(false);
const regId = ref('');
const userId = ref(store.getters.userId);
const useYn = ref(false);
const saveForm = ref(null);
const formValid = ref(true);

  /** 입력값 유효성 검증 */
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

//현재 사용중인 코드 존재하는지 검증
const currYn_rules = [
  value => {
    if(value){
      if (props.tableDatas.some(item => item.currYn === 'Y' && item !== props.data)){
        return '현재 사용중인 코드가 이미 존재합니다.';
      }
    return true;
    }
  return true;
  }
];
const ord_rules = [
  value => {
          if (value >= 0 && value <= 10) return true
          return "0~10"
  },
];
/*시작일/종료일 유효성 검증*/
const edDt_rules = [
  (value) => {
    const startDate = new Date(bgDt.value);
    const endDate = new Date(value);

    if (bgDt.value && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      if (endDate <= startDate) {
        return '종료일시는 시작일시 이후여야 합니다.';
      }
    }
    return true; 
  },
];

const bgDt_rules = [
  (value) => {
    const endDate = new Date(edDt.value);
    const startDate = new Date(value);

    if (edDt.value && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      if (startDate >= endDate) {
        return '시작일시는 종료일시 전이어야 합니다.';
      }
    }
    return true; 
  },
];

watch(() => props.data, (newData) => {
  if (newData){
    codeId.value = newData.codeId || '';
    codeNm.value = newData.codeNm || '';
    codeKind.value = newData.codeKind || '';
    bgDt.value = newData.bgDt || '';
    edDt.value = newData.edDt || '';
    rmk.value = newData.rmk || '';
    ord.value = newData.ord || '0';
    currYn.value = newData.currYn === 'Y'; 
    useYn.value = newData.useYn === 'Y'; 
    regId.value = newData.regId || '';
  }
}, { immediate: true});


/** function List */

const fnValidate = (e) => {
  saveForm.value?.validate();
  return formValid.value;
}
/*날짜 검중 */
const formatDateTime = (dateTime) => {
  return dateTime ? new Date(dateTime).toISOString().slice(0, 10) : '';
};

/**코드아이디 및 비고 최대 입력 */
const limitInputLength = (input) => {
  if (input.length > 10){
    input = input.slice(0, 10);
  }
}

/** 저장 */
const fnSave = (e) => {
  if (!fnValidate()) {
    return;                              
}

const formData = {
  codeId: codeId.value,
  codeKind: codeKind.value,
  codeNm: codeNm.value,
  bgDt: formatDateTime(bgDt.value),
  edDt: formatDateTime(edDt.value),
  rmk: rmk.value,
  ord: ord.value ? ord.value : 0,
  currYn: currYn.value ? 'Y' : 'N', 
  regId: userId.value,
  useYn: useYn.value ? 'Y' : 'N'
};
const apiAction = props.forUpdate ? 'API_UPDATE' : 'API_SAVE';
const apiUrl = props.forUpdate ? `/api/base-codes/${codeId.value}` : "/api/base-codes";

const params = {
  API_PATH: apiUrl,
  JSON_DATA: formData
};

store.dispatch(apiAction, params)
  .then((data) => {
  
  emit('saveSuccess');
  emit('close', false);

  })
  .catch(({ message }) => {
    console.error("message:", message);
  });
};

/**모달 닫기 */
const closeModal = () => {
  emit("close");
}
</script>

<template>
 
  <transition name="modal" appear>
    <div  class="modal-overlay" @click.self="closeModal">
    <v-form @submit.prevent ref="saveForm" v-model="formValid" class="modal-container">
      <v-container class="modal-wrapper">
        <v-row justify="center" style="font-size: large;">
          ■ 코드 등록
        </v-row>
        <v-divider></v-divider>
        <v-sheet >
          <v-row dense>
            <v-col cols="4">코드아이디*</v-col>
            <v-col>
              <v-text-field
                v-model="codeId" :readonly="forUpdate"
                :rules="codeId_rules"
                :maxlength="10"
                @input="limitInputLength('codeId')"
                hint="최대 10글자"
                variant="outlined"
                density="compact"
                width="15rem" >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row dense>
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
          <v-row dense>
            <v-col cols="4">코드종류 </v-col>
            <v-col>
              <v-radio-group v-model="codeKind" inline >
                <v-radio label="대수" value="대수"></v-radio>
               <!-- <v-radio label="회기" value="회기"></v-radio> -->
              <!--  <v-radio label="차수" value="차수"></v-radio>-->
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="4">시작일시 </v-col>
            <v-col>
              <v-text-field
              type="date"
                v-model="bgDt"
                :rules="bgDt_rules"
                width="15rem"
                density="compact"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="4">종료일시 </v-col>
            <v-col>
              <v-text-field
              type="date"
                v-model="edDt"
                :rules="edDt_rules"
                width="15rem"
                density="compact"
            >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="4">비고 </v-col>
            <v-col>
              <v-text-field
                v-model="rmk"
                :maxlength="10"
                @input="limitInputLength('rmk')"
                hint="최대 10글자"
                variant="outlined"
                density="compact"
                width="15rem"
                >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row dense >
          <v-col cols="4">순서</v-col>
          <v-col>
              <v-text-field
                v-model="ord"
                type="number"
                :rules="ord_rules"
                variant="outlined"
                min="0"
                max="10"
                density="compact"
                width="5rem"

             ></v-text-field>
            </v-col>
            </v-row>
 
            <v-row>
            <v-col cols="6">
              <v-checkbox 
              v-model="useYn"
              label="사용여부">
              </v-checkbox>
            </v-col>
      
            <v-col cols="6">
              <v-checkbox v-model="currYn"
                :rules="currYn_rules"
                label="현재여부"
                >
              </v-checkbox>
            </v-col>
            </v-row>
        </v-sheet>
        <v-row  justify="center">
          <v-col cols="auto">
            <v-btn variant="tonal" color="primary" size="large" type="submit" @click="fnSave">저장</v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn variant="tonal"  size="large" @click="$emit('close', false)">닫기</v-btn>
          </v-col>
        </v-row>
        
      </v-container>
    </v-form>  
    </div>
  </transition>

</template>

<style scoped>
.modal-overlay{
  position: fixed;
  top:0;
  left:0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);

}

.modal-wrapper {
  position: fixed;
  width: 35%; 
  height: 95%;
  overflow: auto;
  z-index: 1000;
  padding: 20px;
  
}

</style>
