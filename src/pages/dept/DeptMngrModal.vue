<script setup>
import { defineProps, ref, defineEmits, onMounted } from 'vue'
import store from '@/store';

/*변수선언*/
const props = defineProps({
    show: String,
    deptIdIs: String,
    clickMng : Boolean
})

const emit = defineEmits(['close', 'mngrId', 'userId'])
const showModal = ref(props.show)
const tableDatas = ref([]);
const headers = [
    { title: '아이디', align: 'center', key: 'userId', sortable: false },
    { title: '이름', align: 'center', key: 'userNm', sortable: false },
];
const selectId = ref(null)
const deptNon = ref('yes')


/*Function List*/
const fnSearch = () => {
    let params = {};
    params.API_PATH = "/api/dept/mngr";
    params.deptId = props.deptIdIs
    params.deptNon = deptNon.value

    params.size = 1000;

    store.dispatch('API_LIST', params).then((data) => {
        tableDatas.value = data.resultList;

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}


const fnSaveDept = () => {
    console.log(selectId.value)
    emit('mngrId', selectId.value[0].userId)
    emit('userId', selectId.value[0].userNm)
    emit('close')
}

/*Dom객체 완성이후*/
onMounted(() => {
 if(props.clickMng) {
        deptNon.value = 'no'
    }
    fnSearch();//초기조회
   

});


</script>

<template>
    <v-dialog v-model="showModal" max-width="500" @update:modelValue="val => !val && emit('close')">
        <v-card height="600">
            <v-row>
                <v-col cols="1"></v-col>
                <v-col>
                    <v-card-text style="padding-top: 15px;">■ 담당자 Id 조회</v-card-text>
                    <v-data-table :headers="headers" :items="tableDatas" density="compact" show-select return-object item-key="userNm"
                        :items-per-page="-1" hide-default-footer v-model="selectId" select-strategy="single">
                    </v-data-table>
                </v-col>
                <v-col cols="1"></v-col>
            </v-row>

            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="close" variant="plain" @click="emit('close')"></v-btn>
                <v-btn text="save" variant="tonal" @click="fnSaveDept" type="submit" color="primary"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped></style>