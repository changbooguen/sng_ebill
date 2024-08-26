<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';

/*변수선언*/
const router = useRouter();


const title_rules = [
    value => {
        if (value) return true
        return '필수 입력값입니다.'
    },
];

const lawNm1 = ref('');
const lawNm2 = ref('');
const rmk = ref('')
const useYn = ref('Y');
const loginId = ref(store.getters.userId);

const saveForm = ref(null);
const formValid = ref(null);

/*Function List*/

const fnGoList = (e) => {
    router.push({ name: 'billinfo' });
}

const fnValidate = (e) => {
    const data = saveForm.value?.validate();
    return formValid.value;
};


const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    const hours = (`0${d.getHours()}`).slice(-2);
    const minutes = (`0${d.getMinutes()}`).slice(-2);
    const seconds = (`0${d.getSeconds()}`).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}


const fnSave = (e) => {

    if (!fnValidate()) {
        return;
    }

    const jsonData = {
        lawNm1: lawNm1.value,
        lawNm2: lawNm2.value,
        useYn: useYn.value,
        regDt: formatDate(new Date()),
        regId: loginId.value,
        rmk: rmk.value
    }

    const apiUrl = "/api/billInfo/save";

    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData

    store.dispatch('API_SAVE', params).then((data) => {
        fnGoList();
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}


/*Dom객체 완성이후*/
onMounted(() => {
});
</script>


<template>

    <v-container class="lg-12">

        <v-row class="lg-12">
            <v-col cols="1"></v-col>

            <v-col align="end">
                <v-btn variant="outlined" @click="fnGoList">목록</v-btn>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>


        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>

                <v-card variant="outlined">
                    <v-sheet class="mx-auto" width="100%">

                        <v-form @submit.prevent ref="saveForm" v-model="formValid">

                            <v-textarea v-model="lawNm1" :rules="title_rules" label="법률명1" required
                                class="lawField"></v-textarea>
                            <v-textarea v-model="lawNm2" :rules="title_rules" label="법률명2" required
                                class="lawField"></v-textarea>
                            <v-textarea v-model="rmk" label="비고" class="lawField"></v-textarea>

                            <v-col cols="12">
                                <v-radio-group v-model="useYn" label="사용유무">
                                    <v-row class="align-center">
                                        <v-col cols="auto"><v-radio label="사용" value="Y"></v-radio></v-col>
                                        <v-col><v-radio label="미사용" value="N"></v-radio></v-col>
                                    </v-row>
                                </v-radio-group>
                            </v-col>

                            <v-btn class="mt-2" type="submit" @click="fnSave" block>저장</v-btn>

                        </v-form>

                    </v-sheet>
                </v-card>

            </v-col>
            <v-col cols="1"></v-col>
        </v-row>

    </v-container>

</template>

<style scoped>
.lawField {
    padding: 15px 20px 0px;
}
</style>