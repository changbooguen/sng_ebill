<script setup>
import {defineEmits, watch, ref, defineProps} from 'vue';
import store from '@/store';

/** 변수선언 */
const emit = defineEmits(['close']);
const props = defineProps({
    show: Boolean
});
const dialog = ref(props.show);
const setAuthNm = ref('');
const setUseYn = ref(false);
const saveForm = ref(null);
const formValid = ref(null);

/** function List */

/** 모달 닫기 */
const closeDialog = () => {
    dialog.value = false;
    emit('close');
}

/** 저장 */
const fnSave = (e) => {
    console.log(setUseYn.value)
    if(!fnValidate()){
        return;
    }

    if(setUseYn.value == 'yes'){
        setUseYn.value = 'Y';
    } else {
        setUseYn.value = 'N';
    }

    const formData = new FormData();
    formData.append("authNm", setAuthNm.value);
    formData.append("useYn",setUseYn.value);

    const apiUrl = "/api/auths";
    let params = {};
    params.API_PATH = apiUrl;
    params.formData = formData;

    store.dispatch('API_SAVE', params).then((data) => {
        
        emit('close');
    }).catch(({message}) => {
        console.log("message : ", message);
    })
    
}

/** 유효성 검사 */
const fnValidate= (e)=>{
    const data = saveForm.value?.validate();
    return formValid.value;
};

/** Dom객체 완성 이후 */
watch(() => props.show, (newVal) => {
  dialog.value = newVal;
});
</script>

<template>
    <v-dialog v-model="dialog" max-width="600" @update:modelValue="val => !val && emit('close')">
      <v-card title="권한 생성">
          <v-card-text>
            <v-form @submit.prevent ref="saveForm" v-model="formValid">
                <v-row dense>
                    <v-col>
                        <v-text-field
                            label="권한 이름"
                            type="text"
                            v-model="setAuthNm"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-switch
                            v-model="setUseYn"
                            :label="`사용여부: ${setUseYn}`"
                            false-value="no"
                            true-value="yes"
                            hide-details
                            color="primary"
                        ></v-switch>
                    </v-col>
                </v-row>
            </v-form>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="closeDialog"></v-btn>

          <v-btn
            color="primary"
            text="Save"
            variant="tonal"
            type="submit"
            @click="fnSave"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<style scoped>

</style>