<script setup>
import store from '@/store';
import { ref, defineEmits, onMounted, defineProps } from 'vue';


/*변수선언*/
const props = defineProps({
    show: String,
    deptId: String
})

const emit = defineEmits(['close'])
const showModal = ref(props.show)


const nonList = ref([])
const checkItems = ref([])
const srchText = ref('')
const srchIs = ref('Id')
const headers = [
    { title: '아이디', value: 'userId', align: 'center' },
    { title: '이름', value: 'userNm', align: 'center' }
]


/** function List */
const fnSaveBtn = () => {
    let params = {}
    params.API_PATH = "/api/unUserReg"

    const userIds = checkItems.value.map(item => item.userId);

    const jsonData = {
        userId: userIds,
        deptId: props.deptId
    }

    params.JSON_DATA = jsonData;

    store.dispatch('API_UPDATE', params).then((data) => {
        emit('reload')
        emit('close')
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnSearch = () => {
    let params = {}
    params.API_PATH = "/api/dept/null"
    params.srchValue = srchIs.value
    params.srchText = srchText.value

    store.dispatch('API_LIST', params).then((data) => {
        nonList.value = data.resultList
    }).catch(({ message }) => {
        console.log(message)
    })
}



onMounted(() => {
    fnSearch();
})
</script>

<template>
    <v-dialog v-model="showModal" max-width="600" @update:modelValue="val => !val && emit('close')">
        <v-card>
            <v-card-title>■ 미지정 직원 등록</v-card-title>

            <v-row>
                <v-col><v-select v-model="srchIs" :items="['Id', 'Name']"
                        style="margin-left : 15px;"></v-select></v-col>
                <v-col><v-text-field class="inputBox" v-model="srchText"
                        @keydown.enter="fnSearch"></v-text-field></v-col>
                <v-col><v-btn class="srcBtn" @click="fnSearch"> 검색</v-btn></v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-data-table :headers="headers" :items="nonList" show-select v-model="checkItems" return-object>
                    </v-data-table>
                </v-col>
            </v-row>

            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="close" variant="plain" @click="emit('close')"></v-btn>
                <v-btn text="save" variant="tonal" @click="fnSaveBtn" type="submit" color="primary"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped></style>