<script setup>
import store from '@/store';
import { useRouter } from 'vue-router';
import { ref, onMounted } from "vue";
import axios from "@/axios";
import billFileComp from "@/components/BillFileCompType3.vue";

/** 변수선언 */
const router = useRouter();
const loginInfo = ref(store.getters.loginInfo);
const props = defineProps({
  id: String
});
const item = ref({});
const proposerData = ref([]);
const nowStat = ref(null);
const fileItem = ref({});
const dialog = ref(false);
let statKind = null;

/** function List */

/** 상세 조회 */
const fnGetData = () => {
    
    const apiUrl = `/api/billReceiptPendDetail/${props.id}`

    let params = {};
    params.API_PATH = apiUrl;

    store.dispatch('API_LIST', params).then((data) => {
        item.value = data.resultList.data.pendDetail;
        proposerData.value = data.resultList.data.proposerList;

        nowStat.value = item.value.statCd;
        const resultObj = fileRefList.value.fnFileList(item.value.billId,item.value.procId);


    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

/** 목록이동 */
const fnGoList = (e, row) => {
    router.push({name: 'billReceiptPendList'});
}

/** 승인 */
const fnSave = (kind) => {
    const apiUrl = `/api/receiptApprove`;
    
    const jsonData = {
        billId : props.id,
        rcpUsrId : loginInfo.value.user.userId,
        procDeptId : loginInfo.value.user.deptId,
        reqDt : item.value.regDt,
        reqUsrId : item.value.ppsrNm,
        rsltCd : ifKind(kind)
    }
    
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData;
    
    store.dispatch('API_SAVE',params).then((data) => {
        dialog.value = false;

        if(data.resultObj.code == '201' && kind === 'review') {
            const resultObj = fileRef.value.fnFileSave(data.resultObj.data.billId,data.resultObj.data.procId);
        }

        statUpdate(kind);
        
    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

const statUpdate = (kind) => {

    const jsonData = {
        billId : props.id,
        statCd : ifKind(kind),
    }

    axios({
        url: '/api/stateUpdate',
        method: 'put',
        data: jsonData,
    }).then((data) => {

        fnGetData();

    }).catch(({error}) => {
        console.log("message : ", error)
    });
}

const ifKind = (kind) => {
    let result = null;

    if(kind == 'review'){
        result = 'PR120' //검토의뢰
    } else if (kind == 'approve'){
        result = 'PR110' //의장접수
    } else if (kind == 'reject'){
        result = 'PR101' //반려
    } else if (kind == 'accept'){
        result = 'PR220' //conference
    }

    return result;
}
 
/** 첨부 파일 */
/*File component*/
const fileRef = ref(null);//file component
const fileRefList = ref(null);//file component

/** 확인창 */
const fnOpenSave = (kind) => {
    dialog.value = true;
    statKind = kind;
}

/** Dom객체 완성이후 */
onMounted( () => {
    fnGetData();
});

</script>

<template>
    <v-container>
        <v-card variant="solo" class="mb-4">
            <v-card-title>접수대기 상세화면</v-card-title>
        </v-card>

        <v-card variant="elevated" class="pa-4">
            <v-row v-if="nowStat === 'PR110'">
            <!-- <v-row> -->
                <v-col cols="2">
                    의안번호 :
                </v-col>
                <v-col cols="4">
                    <v-text-field
                        variant="outlined"
                        readonly="true"
                        placeholder="의안번호"
                    ></v-text-field>
                </v-col>
                <v-col cols="2">
                    접수일시 :
                </v-col>
                <v-col cols="4">
                    <v-text-field
                        type="date"
                        variant="outlined"
                        v-model="item.rsltDt"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-divider v-if="nowStat === 'PR110'"></v-divider>

            <v-row>
                <v-col cols="2">
                    제목 :
                </v-col>
                <v-col cols="10">
                    {{ item.billName }}
                </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row>
                <v-col cols="2">
                    발의자 :
                </v-col>
                <v-col cols="4">
                    {{ item.ppsrNm }}
                </v-col>
                <v-col cols="2">
                    요청일시 :
                </v-col>
                <v-col cols="4">
                    {{ item.regDt }} 
                </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row>
                <v-col cols="2">
                    제안자 :
                </v-col>
                <v-col cols="10">
                    <v-row>
                        <v-col v-for="(proposer, index) in proposerData" :key="index">
                            {{ proposer.memberNm }}
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <v-divider></v-divider>
            
            <v-row>
                <v-col cols="2">
                    제안취지 :
                </v-col>
                <v-col cols="10">
                    {{ item.smrCn }}
                </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row> 
                <v-col cols="2">
                    첨부 :
                </v-col>
                <v-col cols="10">
                    <billFileComp fileMode="R" ref="fileRefList" />
                </v-col>    
            </v-row>

            <v-divider></v-divider>

            <v-row>
                <v-col cols="2">
                    접수일시 :
                </v-col>
                <v-col cols="10">
                    <!-- {{ item.ppslDt ? item.ppslDt.slice(0, item.ppslDt.indexOf('T')) : "" }} -->
                    {{ item.ppslDt }}
                </v-col>
            </v-row>
            <v-divider></v-divider>


            <v-row v-if="nowStat === 'PR105'">
                <v-col cols="2">
                    제출파일 :
                </v-col>
                <v-col cols="8">
                    
                    <billFileComp fileKind="AC" opbYn="Y" fileMode="C" ref="fileRef" />

                </v-col>
            </v-row>
            
            <v-divider v-if="nowStat === 'PR105'"></v-divider>

            <v-row>
                <v-col cols="2">
                    제출일시 : 
                </v-col>
                <v-col cols="10">
                    {{ item.rcpDt ? item.rcpDt.slice(0, item.rcpDt.indexOf('T')) : "" }}
                </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row class="mt-4">
                <v-col></v-col>

                <v-col cols="1" v-if="nowStat === 'PR105'"> 
                    <v-btn @click="fnOpenSave('review')">검토의뢰</v-btn>
                    <!-- <v-btn>Bureau 제출</v-btn> -->
                </v-col>    
                <v-col cols="2" v-else-if="nowStat === 'PR120'">
                    <v-btn @click="fnOpenSave('approve')">승인</v-btn>
                    <v-btn @click="fnOpenSave('reject')">반려</v-btn>
                </v-col>
                <v-col cols="1" v-else-if="nowStat === 'PR110'">
                    <v-btn @click="fnOpenSave('accept')">의안 접수</v-btn>
                </v-col>    

                <v-col cols="1">
                    <v-btn @click="fnGoList()">목록</v-btn>
                </v-col>

                <v-col></v-col>
            </v-row>
        </v-card>
    </v-container>

    <v-dialog
      v-model="dialog"
      width="auto"
    >
        <v-card
            width="400"
            text="진행 하시겠습니까?"
            title="confirm"
        >
        <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

            <v-btn
                color="primary"
                text="Save"
                variant="tonal"
                @click="fnSave(statKind)"
            ></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style>
.v-divider {
    margin-top: 8px;
    margin-bottom: 8px;
}
</style>