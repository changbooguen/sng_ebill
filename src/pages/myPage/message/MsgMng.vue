<script setup>
import { onMounted, ref, watch } from "vue";
import store from '@/store';
import MsgSendModal from '@/pages/myPage/message/MsgSendModal.vue';

/*변수선언*/
const loginId = ref(store.getters.userId);
const searchTitle = ref('');
const searchId = ref('');
const searchStatus = ref('all')
const tableDatas = ref([]);
const modalShow = ref(false);
const msgData = ref([])
const msgType = ref('')
const itemsPerPage = ref(10) // Set items per page
const currentPage = ref(1)

const headers = [
    { title: "No", value: 'no' },
    { title: "제목", value: "msgSj" },
    { title: "수신자", value: "rcvId" },
    { title: "상태", value: "status" },
    { title: "발송일시", value: "sendDt" },
    { title: "취소일시", value: "cncDt" },
    { title: "확인일시", value: "rcvDt" },
]

const headers2 = [
    { title: "No", value: 'no' },
    { title: "제목", value: "msgSj" },
    { title: "발신자", value: "sendId" },
    { title: "상태", value: "status" },
    { title: "발송일시", value: "sendDt" },
    { title: "확인일시", value: "rcvDt" },
]

const tabSel = ref(null)

const sendItem = ref([
    { title: '전체', value: 'all' },
    { title: '발송', value: 'send' },
    { title: '확인', value: 'confirm' },
    { title: '취소', value: 'cancel' },
])

const rcvItem = ref([
    { title: '전체', value: 'all' },
    { title: '확인', value: 'confirm' },
    { title: '미확인', value: 'unconfirm' },
])



/*Function List*/

/*검색어리셋*/
const fnReset = (e) => {
    searchTitle.value = "";
    searchId.value = "";
    searchStatus.value = "";
}

/*조회*/
const fnSearch = () => {
    let params = {};
    params.API_PATH = `/api/msg/send/${searchStatus.value}/${tabSel.value}`;
    params.msgSj = searchTitle.value

    if (tabSel.value === 'sendTab') {
        params.rcvId = searchId.value
        params.sendId = loginId.value
    } else {
        params.rcvId = loginId.value
        params.sendId = searchId.value
    }

    params.size = 1000;

    store.dispatch('API_LIST', params).then((data) => {
        tableDatas.value = data.resultList;

    }).catch(({ message }) => {
        console.log("message : ", message);
    })

}

/*메세지 확인 모달*/
const fnGoDetail = (item) => {
    modalShow.value = true;
    msgType.value = 'msgDetail'
    msgData.value = item
    if (tabSel.value === 'rcvTab' && item.rcvDt === null) {
        fnRcvTime(item.msgId);
    }
}

/*메세지 발송 모달*/
const fnOpen = () => {
    modalShow.value = true;
    msgType.value = 'msgSend'
}


/*확인 일시 수정*/
const fnRcvTime = (msgId) => {
    let params = {}
    const currentTime = new Date().toISOString();

    const jsonData = {
        rcvDt: currentTime
    }
    params.API_PATH = `/api/msg/rcvDt/${msgId}`
    params.JSON_DATA = jsonData

    store.dispatch("API_UPDATE", params).then((data) => {
        console.log(data)
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnReload = () => {
    fnSearch();
}


watch(tabSel, (newValue) => {
    fnSearch();
    if (newValue === 'sendTab') {
        searchStatus.value = sendItem.value[0].value;
    } else {
        searchStatus.value = rcvItem.value[0].value;
    }
});

/*Dom객체 완성이후*/
onMounted(() => {
    fnSearch();//초기조회
});

</script>

<template>

    <v-container class="lg-12">

        <v-row class="lg-12" align="center">
            <v-col cols="1"></v-col>
            <v-col>
                <v-tabs v-model="tabSel">
                    <v-tab text="보낸메세지" value="sendTab"></v-tab>
                    <v-tab text="받은메세지" value="rcvTab"></v-tab>
                </v-tabs>
            </v-col>
            <v-col align="end">
                <v-btn @click="fnOpen">메세지 발송</v-btn>
                <MsgSendModal v-if="modalShow" :show="modalShow" @close="modalShow = false" :msgData="msgData"
                    :msgType="msgType" :tabSel="tabSel" @reloadData="fnReload"/>
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
                            <v-text-field label="제목" type="input" @keydown.enter="fnSearch" v-model="searchTitle">
                            </v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field :label="tabSel === 'sendTab' ? '수신자' : '발신자'" type="input"
                                @keydown.enter="fnSearch" v-model="searchId">
                            </v-text-field>

                        </v-col>
                        
                        <v-col>
                            <v-select label="상태" v-model="searchStatus"
                                :items="tabSel === 'sendTab' ? sendItem : rcvItem" item-text="title"
                                item-value="value"></v-select>
                        </v-col>

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
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>

        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>
                <v-card variant="outlined">
                    <v-tabs-window v-model="tabSel">
                        <v-tabs-window-item value="sendTab">

                            <v-data-table :headers="headers" :items="tableDatas" density="compact" item-key="msgId" :hover="true" v-model:items-per-page="itemsPerPage" v-model:page="currentPage">
                                <template v-slot:item="{ item, index }">
                                    <tr @click="fnGoDetail(item)">
                                        <td>{{ (index + 1) + ((currentPage - 1) * itemsPerPage) }}</td>
                                        <td>{{ item.msgSj }}</td>
                                        <td>{{ item.rcvId }}</td>
                                        <td>{{ item.rcvDt ? '확인완료' : (item.cncDt ? '취소' : '발송완료') }}</td>
                                        <td>{{ item.sendDt ? item.sendDt.slice(0, 16) : '' }}</td>
                                        <td>{{ item.cncDt ? item.cncDt.slice(0, 16) : '' }}</td>
                                        <td>{{ item.rcvDt ? item.rcvDt.slice(0, 16) : '' }}</td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </v-tabs-window-item>


                        <v-tabs-window-item value="rcvTab">
                            <v-data-table :headers="headers2" :items="tableDatas" density="compact" item-key="msgId" v-model:items-per-page="itemsPerPage" v-model:page="currentPage">
                                <template v-slot:item="{ item, index }">
                                    <tr @click="fnGoDetail(item)">
                                        <td>{{ (index + 1) + ((currentPage - 1) * itemsPerPage) }}</td>
                                        <td class="titleCn">{{ item.msgSj }}</td>
                                        <td>{{ item.sendId }}</td>
                                        <td class="status">{{ item.rcvDt ? '확인' : '미확인' }}</td>
                                        <td class="dateIs">{{ item.sendDt ? item.sendDt.slice(0, 16) : ''}}</td>
                                        <td class="dateIs">{{ item.rcvDt ? item.rcvDt.slice(0, 16) : '' }}</td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </v-tabs-window-item>
                    </v-tabs-window>
                </v-card>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>
    </v-container>

</template>

<style scoped></style>