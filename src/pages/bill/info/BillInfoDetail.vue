<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';

/*변수선언*/
const router = useRouter();
const props = defineProps({
    id: String
});
const item = ref({ lawNm1: '', lawNm2: '', useYn: '', rmk: '' });
const loginId = ref(store.getters.userId)

/*Function List*/
const fnGoList = (e) => {
    router.push({ name: 'billinfo' });
}

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

const fnGoUpdate = (e) => {
    const confirmd = confirm("수정하시겠습니까?")
    if(confirmd) {
        const jsonData = {
        lawId: item.value.lawId,
        lawNm1: item.value.lawNm1,
        lawNm2: item.value.lawNm2,
        useYn: item.value.useYn,
        modDt: formatDate(new Date()),
        modId: loginId.value,
        rmk: item.value.rmk
    }

    let params = {}
    params.API_PATH = `/api/billInfo/update/${props.id}`
    params.JSON_DATA = jsonData

    store.dispatch('API_UPDATE', params).then((data) => {
        router.push({ name: 'billinfo' });
    }).catch(({ message }) => {
        console.log(message)
    })
    }
    
}

/*상세글가져오기*/
const fnGetData = () => {

    let params = {};
    params.API_PATH = `/api/billInfo/detail/${props.id}`;
    store.dispatch('API_LIST', params).then((data) => {
        item.value = data.resultList.data;
    }).catch(({ message }) => {
        console.log("message : ", message);
    })

}


/*Dom객체 완성이후*/
onMounted(() => {
    fnGetData();
});

</script>

<template>

    <v-container class="lg-12">

        <v-row class="lg-12">
            <v-col cols="1"></v-col>

            <v-col align="end">
                <v-btn variant="outlined" @click="fnGoUpdate">수정</v-btn>
                <v-btn variant="outlined" @click="fnGoList">목록</v-btn>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>


        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>

                <v-card variant="outlined">
                    <v-row class="lg-12"><v-col></v-col></v-row>
                    <v-row align="center" class="lg-12">
                        <v-col>


                            <v-table>
                                <tbody>
                                    <tr>
                                        <th class="textTh">
                                            법률ID
                                        </th>
                                        <td class="text-left">
                                            {{ item.lawId }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="textTh">
                                            법률명1
                                        </th>
                                        <td class="text-left" colspan="3">
                                            <v-text-field v-model="item.lawNm1" variant="underlined"
                                                class="textArea"></v-text-field>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="textTh">
                                            법률명2
                                        </th>
                                        <td class="text-left" colspan="3">
                                            <v-text-field v-model="item.lawNm2" variant="underlined"
                                                class="textArea"></v-text-field>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="textTh">
                                            비고
                                        </th>
                                        <td class="text-left" colspan="3">
                                            <v-text-field variant="underlined" class="textArea"
                                                v-model="item.rmk"></v-text-field>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            등록자
                                        </th>
                                        <td>{{ item.regId }}</td>
                                        <th class="textTh">
                                            등록일시
                                            <!-- todo db 저장 로컬시간으로 설정 -->
                                        </th>
                                        <td class="text-left">
                                            {{ item.regDt ? item.regDt.slice(0, 16) : item.regDt }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            수정자
                                        </th>
                                        <td>{{ item.modId }}</td>
                                        <th class="textTh">
                                            수정일시
                                        </th>
                                        <td class="text-left">
                                            {{ item.modDt ? item.modDt.slice(0, 16) : item.modDt }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="textTh">
                                            사용여부
                                        </th>
                                        <td class="text-left">
                                            <v-row>
                                                <v-radio-group v-model="item.useYn">
                                                    <div class="radioClass">
                                                        <v-col><v-radio label="사용" value="Y"></v-radio></v-col>
                                                        <v-col><v-radio label="미사용" value="N"></v-radio></v-col>
                                                    </div>
                                                </v-radio-group>
                                            </v-row>
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

<style scoped>
.radioClass {
    display: flex;
    justify-content: center;
    padding-top: 20px;
}

.text-left {
    padding: 0px !important;
}

.textTh {
    width: 12vw;
}

.textArea {
    width: 48vw;
}

.textTh,
.text-left,
td,
th {
    border-bottom: none !important;
}

.v-text-field .v-input__control {
    background-color: red;
}
</style>