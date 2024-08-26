<script setup>
import { onMounted, ref, defineProps } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';
import VoteCircleChart from '@/pages/bill/vote/VoteCircleChart.vue'

/*변수선언*/
const router = useRouter();

const props = defineProps({
    id: String
})

const agreeList = ref([])
const disagreeList = ref([])
const agreeCount = ref(0)
const disagreeCount = ref(0)
const billIs = ref([])

/*Function List*/


/*조회*/
const fnAgreeList = () => {
    let params = {};
    params.API_PATH = "/api/vote/agree";
    params.billId = props.id;
    params.size = 1000;

    store.dispatch('API_LIST', params).then((data) => {
        agreeList.value = data.resultList
        agreeCount.value = data.resultList.length
        billIs.value = data.resultList[0]
    }).catch(({ message }) => {
        console.log("message : ", message);
    })

}


const fnDisagreeList = () => {
    let params = {};
    params.API_PATH = "/api/vote/disagree";
    params.billId = props.id;
    params.size = 1000;

    store.dispatch('API_LIST', params).then((data) => {

        disagreeList.value = data.resultList.map(item => item.memberNm)
        disagreeCount.value = data.resultList.length

    }).catch(({ message }) => {
        console.log("message : ", message);
    })

}

const fnGoList = (e) => {
    router.push({ name: 'BillVoteResult' })
}


/*Dom객체 완성이후*/
onMounted(() => {

    fnAgreeList();//초기조회
    fnDisagreeList();

});

</script>

<template>

    <v-container class="lg-12">

        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col><v-card variant="none" title="■ 본회의표결정보 상세" class="contentArea"></v-card></v-col>
            <v-col align="end"><v-btn variant="outlined" @click="fnGoList">목록</v-btn></v-col>
            <v-col cols="1"></v-col>
        </v-row>

        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>
                <v-card class="cardArea" variant="outlined">
                    <!--todo 나머지 데이터 채우기-->
                    <v-row>
                        <v-col>
                            <v-row align="center" class="lg-12"><v-col>{{ "의안명 : " + billIs.billName }}</v-col></v-row>
                            <v-row align="center" class="lg-12"><v-col>{{ "제안 / 표결 일자 : " + billIs.ppslDt + " / " + (billIs.plnrDt ? billIs.plnrDt.slice(0,10) : '')}}</v-col></v-row>
                            <v-row align="center" class="lg-12"><v-col>{{ "발의자 / 제안자 : " + billIs.ppsrNm }}</v-col></v-row>
                            <v-row align="center" class="lg-12"><v-col>{{ "표결의원 : " }}</v-col></v-row>
                            <v-row align="center" class="lg-12"><v-col>{{ "표결결과 : 원인가결  -인(찬성  " +  agreeCount + "인, 반대 " + disagreeCount + "인, 기권  -인)"}}</v-col></v-row>
                        </v-col>
                        
                        <v-col cols="1"></v-col>
                        <v-col>
                            <VoteCircleChart />
                        </v-col>
                    </v-row>


                </v-card>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>

        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>

                <v-card class="cardArea" variant="outlined">

                    <v-row align="center" class="lg-12">
                        <v-col>{{ "·찬성 : " + agreeCount }} </v-col>
                    </v-row>
                    <v-row>
                        <div style="padding-left: 15px;" v-for="(item, i) in agreeList" :key="i">{{ item.memberNm + ","
                            }}</div>
                    </v-row>

                    <v-row>
                        <v-col>{{ "·반대 : " + disagreeCount }} </v-col>
                    </v-row>
                    <v-row>
                        <v-col>{{ disagreeList + ""}}</v-col>
                    </v-row>
                    <v-row class="lg-12"><v-col></v-col></v-row>
                </v-card>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>
    </v-container>

</template>

<style scoped>
.cardArea {
    padding: 20px 20px 0;
}
</style>