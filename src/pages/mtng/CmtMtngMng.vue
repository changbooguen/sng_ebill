<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';

/*변수선언*/
const router = useRouter();
const searchTitle = ref('')
const tableDatas = ref([]);
const itemsPerPage = ref(10)
const currentPage = ref(1)
// const stDt = ref(new Date().toISOString().slice(0, 10))
// const edDt = ref(new Date().toISOString().slice(0, 10))

const headers = [
    { title: '번호', align: 'center', key: 'no', sortable: true },
    { title: '위원회', align: 'center', key: 'mtngTypeCd', sortable: false }, //회의구분코드?
    { title: '일정', align: 'center', key: 'mtngSj', sortable: false },
    { title: '회/차', align: 'center', key: 'cmtNm', sortable: false },
    { title: '회의구분', align: 'center', key: 'openDtm', sortable: false },
    { title: '회의상태', align: 'center', key: 'closeDtm', sortable: false },
    { title: '출결', align: 'center', key: 'closeDtm', sortable: false },
    { title: '비고', align: 'center', key: 'closeDtm', sortable: false },
];


/*Function List*/

const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const stDt = ref(formatDateTime(new Date()).slice(0, 10))
const edDt = ref(formatDateTime(new Date()).slice(0, 10))


/*검색어리셋*/
const fnReset = (e) => {
    searchTitle.value = "";
}

/*조회*/
const fnSearch = () => {

    let params = {};
    params.API_PATH = "/api/mtng/list";
    params.mtngSj = searchTitle.value;
    params.openDtm = stDt.value;
    params.closeDtm = edDt.value;
    params.mtngTypeCd = '상임위원회'
    params.size = 1000;

    store.dispatch('API_LIST', params).then((data) => {
        tableDatas.value = data.resultList.data;
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnGoDetail = (e, row) => {
    router.push({ name: 'mtngDetailCmt', params: { id: row.item.mtngId } });
}


const fnGoSaveCmt = (e, row) => {
    router.push({ name: 'mtngDetailCmt', params: { id: '0' } });
}

/*Dom객체 완성이후*/
onMounted(() => {

    fnSearch();//초기조회

});

</script>

<template>

    <v-container class="lg-12">

        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>
                <v-card>
                    <v-card-title>■ 위원회 회의 등록</v-card-title>
                    <v-row class="lg-12"><v-col></v-col></v-row>
                    <v-row></v-row>
                    <v-row align="center" class="lg-12">
                        <v-col>
                            <v-text-field label="제목" type="input" @keydown.enter="fnSearch" v-model="searchTitle">
                            </v-text-field>
                        </v-col>

                        <v-col>
                            <v-text-field type="date" v-model="stDt"></v-text-field>
                        </v-col>
                        <v-col cols="auto">~</v-col>
                        <v-col>
                            <v-text-field type="date" v-model="edDt"></v-text-field>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn variant="outlined" @click="fnSearch">조회</v-btn>
                            <v-btn variant="outlined" @click="fnReset">reset</v-btn>
                        </v-col>
                    </v-row>

                    <v-row class="lg-12"><v-col></v-col></v-row>
                </v-card>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>

        <v-row class="lg-12">
            <v-col cols="1"></v-col>

            <v-col align="end">
                <v-btn @click="fnGoSaveCmt" color="primary">위원회 회의등록</v-btn>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>


        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>

                <v-card variant="outlined">
                    <v-row class="lg-12"><v-col></v-col></v-row>
                    <v-row align="center" class="lg-12">

                        <v-data-table :headers="headers" :items="tableDatas" density="compact" item-key="id"
                            @dblclick:row="fnGoDetail" :items-per-page="itemsPerPage" :page="currentPage" :hover="true">
                            <template v-slot:[`item.no`]="{ index }">
                                {{ (index + 1) + ((currentPage - 1) * itemsPerPage) }}
                            </template>
                        </v-data-table>
                    </v-row>
                    <v-row class="lg-12"><v-col></v-col></v-row>
                </v-card>

            </v-col>
            <v-col cols="1"></v-col>
        </v-row>

    </v-container>

</template>

<style scoped></style>