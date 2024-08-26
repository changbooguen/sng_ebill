<script setup>
import { defineProps, ref, defineEmits, onMounted } from 'vue'
import FileComponent from "@/components/FileComponent.vue";
import MsgRcvModal from '@/pages/myPage/message/MsgRcvModal.vue';
import store from '@/store';


/** 변수선언 */
const props = defineProps({
    show: Boolean,
    msgId: String,
    msgData: Array,
    msgType: String,
    tabSel: String
})
const emit = defineEmits(['close', 'reloadData'])

const modalShow = ref(props.show)
const title = ref(null)
const content = ref(null)
const formValid = ref(null);
const rcvIds = ref([]);
const modalVisible = ref(false)
const saveForm = ref(null);
const msgId = ref(props.msgData.msgId);
const userId = ref(store.getters.userId);
const nowTime = ref(null);

/*File component*/
const fileRef = ref(null);
const fileGroupId = ref(props.msgData.fileGroupId);

const sj_rules = [
    value => {
        if (value) return true;
        return '필수 입력값입니다.'
    },
]

const cn_rules = [
    value => {
        if (value) return true;
        return '필수 입력값입니다.'
    },
]


/* function List */

const fnValidate = (e) => {
    saveForm.value?.validate();
    return formValid.value;
}



const fnSendMsg = async () => {
    if (rcvIds.value.length == 0) {
        alert('수신자를 선택해주세요.');
        return;
    }

    if (!fnValidate()) {
        return;
    }

    const fileObj = await fileRef.value.fnFileSave();

    const jsonData = {
        sendId: userId.value,
        rcvIds: rcvIds.value,
        msgSj: title.value,
        msgCn: content.value,
        fileGroupId: fileObj.data.fileGroupId
    }

    const apiUrl = "/api/message/sendMsgs";
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData

    store.dispatch('API_SAVE', params).then((data) => {

        emit('close');
        emit('reloadData');

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}



const fnOpen = () => {
    modalVisible.value = true;
}

const getRcvs = (data) => {
    rcvIds.value = data
}

const fnSendBackMsg = () => {

    const curTime = new Date();
    nowTime.value = curTime.toISOString();

    if (props.msgData.cncDt === null) {

        let params = {}
        const jsonData = {
            cncDt: nowTime.value
        }
        params.API_PATH = `/api/msg/cncDt/${msgId.value}`;
        params.JSON_DATA = jsonData;
        store.dispatch('API_UPDATE', params).then((data) => {
            alert("메세지 전송이 취소되었습니다.");
            emit('close');
            emit('reloadData');
        }).catch(({ message }) => {
            console.log(message);
        })
    }
}

const fnClose = () => {
    emit('close')
    emit('reloadData')
}

onMounted(() => {
    const resultObj = fileRef.value.fnFileList(fileGroupId.value);
})
</script>

<template>
    <v-dialog v-model="modalShow" max-width="700" @update:modelValue="val => !val && emit('close')">
        <v-card min-height="400">
            <v-card-title v-if="props.msgType === 'msgSend'">■ 메세지 전송</v-card-title>
            <v-card-title v-else>
                <v-row>
                    <v-col>■ 메세지 확인</v-col>
                    <v-col align="end" v-if="props.msgData.rcvDt === null && props.msgData.cncDt === null && props.tabSel === 'sendTab'">
                        <v-btn variant="outlined" @click="fnSendBackMsg">발송취소</v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-form lazy-validation @submit.prevent ref="saveForm" v-model="formValid">
                <v-row class="lg-12"></v-row>
                <v-row>
                    <v-col cols="1"></v-col>
                    <v-col v-if="props.msgType === 'msgSend'">
                        <v-btn variant="outlined" @click="fnOpen">수신자 Id 조회</v-btn> {{ rcvIds }}
                    </v-col>
                    <v-col cols="1"></v-col>
                    <MsgRcvModal v-if="modalVisible" :visible="modalVisible" @close="modalVisible = false" @rcvs="getRcvs" />
                </v-row>

                <v-row>
                    <v-col cols="1"></v-col>
                    <v-col v-if="props.msgType === 'msgSend'">
                        <v-text-field label="제목" v-model="title" :rules="sj_rules"></v-text-field>
                    </v-col>
                    <v-col v-else>제목
                        <v-text-field :readonly="true">{{ props.msgData.msgSj }}</v-text-field>
                    </v-col>
                    <v-col cols="1"></v-col>
                </v-row>

                <v-row>
                    <v-col cols="1"></v-col>
                    <v-col v-if="props.msgType === 'msgSend'"><v-textarea v-model="content" label="내용" :rules="cn_rules"></v-textarea></v-col>
                    <v-col v-else>내용<v-text-field :readonly="true">{{ props.msgData.msgCn }}</v-text-field></v-col>
                    <v-col cols="1"></v-col>
                </v-row>

                <v-row>
                    <v-col cols="1"></v-col>
                    <v-col v-if="props.msgType === 'msgSend'">
                        <FileComponent fileMode="C" ref="fileRef" />
                    </v-col>
                    <v-col v-else>
                        <FileComponent fileMode="R" ref="fileRef" />
                    </v-col>
                    <v-col cols="1"></v-col>
                </v-row>
            </v-form>

            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Close" variant="plain" @click="fnClose"></v-btn>
                <v-btn v-if="props.msgType === 'msgSend'" color="primary" text="Send" variant="tonal" type="submit"
                    @click="fnSendMsg"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped></style>