<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';

/*변수선언*/
const router = useRouter();
const sBillKind = ref('전체')
const sDivision = ref('전체')
const sPpslKndCd = ref('전체')
const sPpsrNm = ref('')
const billTypeList = ref([])
const sBillNo = ref('')
const sBillName = ref('')
const sAgeCode1 = ref('')
const sAgeCode2 = ref('')
const ageCodeList = ref([])
let searchCon = {}



/*Function List*/

/*검색어리셋*/
const fnReset = (e) => {
    sDivision.value = "전체";
    sPpslKndCd.value = "전체";
    sBillKind.value = "전체";
    sBillNo.value = '';
    sBillName.value = '';
    sPpsrNm.value = '';
    sAgeCode1.value = ageCodeList.value[0];
    sAgeCode2.value = ageCodeList.value[0];
}

/*조회*/
const fnSearch = () => {
    if (sBillKind.value === '전체') {
        sBillKind.value = ''
    }

    if (sPpslKndCd.value === '전체') {
        sPpslKndCd.value = ''
    }

    const cd1 = sAgeCode1.value ? sAgeCode1.value.slice(1, 3) : ''
    const cd2 = sAgeCode2.value ? sAgeCode2.value.slice(1, 3) : ''

    const apiUrl = "/api/bill/searchQuick";
    let params = {};
    params.API_PATH = apiUrl;

    params.billKind = sBillKind.value;
    params.ppslKndCd = sPpslKndCd.value;
    params.ppsrNm = sPpsrNm.value;
    params.billNo = sBillNo.value;
    params.billName = sBillName.value;
    params.naTermCd1 = cd1;
    params.naTermCd2 = cd2;
    params.division = sDivision.value; //todo 의안 처리구분 수정

    searchCon = params

    store.dispatch('API_LIST', params).then((data) => {
        const item = data.resultList.data.map(item => item)
        router.push({
            name: 'BillQSearchList',
            state: {
                dataObj: item,
                searchStatus: searchCon
            }
        });
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}


const fnGetTypeList = () => {
    let params = {}
    params.API_PATH = "/api/bill/type"

    store.dispatch('API_LIST', params).then((data) => {
        let A1 = [{
            title: '전체',
            value: 'all'
        }]

        let A2 = data.resultList.data.map(item => ({
            title: item.billKind,
            value: item.billKind
        }))

        billTypeList.value = [...A1, ...A2];

    }).catch(({ message }) => {
        console.log(message)
    })
}



const fnGetAgeCode = () => {
    let params = {}
    params.API_PATH = "/api/baseAllList"
    store.dispatch('API_LIST', params).then((data) => {
        ageCodeList.value = data.resultList.data.map(item => ({
            title: '제' + item.codeNm + '대 (' + item.bgDt.slice(0, 4) + '-' + item.edDt.slice(0, 4) + ')'
        }))
        sAgeCode1.value = ageCodeList.value[0].title
        sAgeCode2.value = ageCodeList.value[0].title
    }).catch(({ message }) => {
        console.log(message)
    })
}




/*Dom객체 완성이후*/
onMounted(() => {
    fnGetTypeList();
    fnGetAgeCode();
});

</script>
<template>

    <v-container class="lg-12">

        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>

                <v-card variant="none" title="■ 간편검색" class="contentArea"></v-card>

                <v-card variant="outlined" class="paddingArea">
                    <v-row class="lg-12"><v-col></v-col></v-row>

                    <!-- 1 -->
                    <v-row dense align="center" class="lg-12">
                        <v-col cols="2">제안대수</v-col>
                        <v-col>
                            <v-select v-model="sAgeCode1" :items="ageCodeList">
                            </v-select>
                        </v-col>
                        <v-col cols="1" align="center" style="padding: 0 0 20px 0;">~</v-col>
                        <v-col>
                            <v-select v-model="sAgeCode2" :items="ageCodeList">
                            </v-select>
                        </v-col>
                    </v-row>


                    <!-- 2 -->
                    <v-row dense align="center" class="lg-12">
                        <v-col cols="2">의안종류/처리</v-col>
                        <v-col>
                            <v-select label="의안종류" v-model="sBillKind" :items="billTypeList" item-text="title">
                            </v-select>
                        </v-col>
                        <v-col>
                            <v-select label="의안처리구분" :items="['전체', '처리', '계류']" v-model="sDivision">
                            </v-select>
                        </v-col>
                    </v-row>


                    <!-- 3 -->
                    <v-row dense align="center" class="lg-12">
                        <v-col cols="2">발의자/제안자</v-col>
                        <v-col>
                            <v-select label="제안종류" :items="['전체', '의원', '정부']" v-model="sPpslKndCd">
                            </v-select>
                        </v-col>
                        <v-col>
                            <v-text-field v-if="!(sPpslKndCd === '정부')" label="의원명" type="input" v-model="sPpsrNm">
                            </v-text-field>
                        </v-col>
                    </v-row>



                    <!-- 4 -->
                    <v-row dense align="center" class="lg-12">
                        <v-col cols="2">의안번호</v-col>
                        <v-col>
                            <v-text-field label="의안번호" type="input" v-model="sBillNo">
                            </v-text-field>
                        </v-col>
                    </v-row>



                    <!-- 5 -->
                    <v-row dense align="center" class="lg-12">
                        <v-col cols="2">의안명</v-col>
                        <v-col>
                            <v-text-field label="의안명" type="input" v-model="sBillName">
                            </v-text-field>
                        </v-col>
                    </v-row>

                    <v-row class="lg-12">
                        <v-col cols="1"></v-col>

                        <v-col>
                            <v-row align="center" justify="center">
                                <v-col cols="auto">
                                    <v-btn variant="outlined" @click="fnSearch">조회</v-btn>
                                </v-col>
                                <v-col cols="auto">
                                    <v-btn variant="outlined" @click="fnReset">reset</v-btn>
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col cols="1"></v-col>
                    </v-row>

                    <v-row class="lg-12"><v-col></v-col></v-row>
                </v-card>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>


    </v-container>

</template>

<style scoped>
.paddingArea {
    padding: 20px
}
</style>