<script setup>
import store from '@/store';
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import TotalCount from '@/components/TotalCount.vue';
import * as XLSX from "xlsx";

/*변수선언*/
const router = useRouter();
const searchTitle = ref('');
const tableDatas = ref([]);
const count = ref(0);
const brdType = ref('전체')
const headers = [

    {   title: '제목',align: 'center', key: 'brdSj', sortable: true},
    {   title: '내용',align: 'center', key: 'brdCn', sortable: true},
    {   title: '유형',align: 'center', key: 'brdType', sortable: true},
    {   title: '순서',align: 'center', key: 'ord', sortable: true},
    {   title: '조회수',align: 'center', key: 'notiInqCnt', sortable: true},
    {   title: '등록일시',align: 'center', key: 'regDt', sortable: true},
];
const delChecked = ref([]);

/*Function List*/

/*검색어리셋*/
const fnReset= (e)=>{
    searchTitle.value = "";
    brdType.value = '전체';
}

/*조회*/
const fnSearch= ()=>{
    const apiUrl = "/api/board";
    let params = {};
    params.API_PATH = apiUrl;
    params.brdSj = searchTitle.value;
    params.brdType = brdType.value !== '전체' ? brdType.value : '';
    params.size = 1000;
    store.dispatch('API_LIST',params).then((data) => {

    tableDatas.value = data.resultList.sort((a,b) => new Date(b.regDt)-new Date(a.regDt));
    count.value = tableDatas.value.length;

    }).catch(({message}) => {
    console.log("message : ", message);
    })
}

/*삭제하기*/
const fnDelete= ()=>{
    if(!confirm("삭제 하시겠습니까?")){
    return;
    }
    const apiUrl = "/api/board/";
    const ids = delChecked.value.map(item => item.brdId);

    let params = {};
    params.API_PATH = apiUrl;
    params.deleteItems = ids;

    store.dispatch('API_DELETE',params).then((data) => {
    delChecked.value = [];
    fnSearch();
    
    }).catch(({message}) => {
    console.log("message : ", message);
    })
}
/*상세로 이동 */
const fnGoDetail= (e,row)=>{
    router.push({name : 'boardDetail', params : {  id: row.item.brdId }});
};

/*저장 */
const fnGoSave= (e,row)=>{
    router.push({name: 'boardSave'});
}
/*날짜만 남기고 시간 제거*/
const sliceDt = (Dt) => {
  if (Dt && Dt !== '') { 
    return Dt.slice(0, Dt.indexOf('T'));
  }
  return ''; 
}
/*내용 20글자까지 자르기 */
const truncateBrdCn = (brdCn)=>{
    return brdCn.length > 20 ? brdCn.substring(0, 20) + '...' : brdCn;
}

const fnExcelDownload= ()=>{

    // 포함할 헤더 지정
    const selectedHeaders = ["brdSj", "brdCn"];

    // 컬럼 헤더 지정
    const wsCols = ["제목", "내용"];  // 헤더명 배열

    // 헤더에 해당하는 데이터만 필터링
    const filteredData = tableDatas.value.map(item => {
    let filteredItem = {};
    selectedHeaders.forEach(header => {
        filteredItem[header] = item[header];
    });
    return filteredItem;
    });

    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(filteredData, {
    header: selectedHeaders,  // 헤더 순서
    skipHeader: false         // 헤더를 포함
    });

    // 직접 헤더를 삽입
    XLSX.utils.sheet_add_aoa(worksheet, [wsCols], { origin: "A1" });
    
    // 워크북 생성
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FilteredData");

    // 엑셀 파일 생성 및 다운로드
    XLSX.writeFile(workbook, "Filtered_Bills.xlsx");
};




/*Dom객체 완성이후*/
onMounted( () => {
    fnSearch();
});

</script>

<template>

<v-container class="lg-12">
    <v-row  class="lg-12">
        <v-col cols="1"></v-col>
        <v-col>
            <v-card  variant="outlined">
                <v-row class="lg-12"><v-col></v-col></v-row>
                <v-row align="center" class="lg-12">
                    <v-col cols="3">
                        <v-text-field label="제목"  type="input" @keydown.enter="fnSearch" v-model="searchTitle" variant="underlined" > </v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-select v-model="brdType" label="종류" :items="['전체', '공지사항', '자료실', 'FAQ']" variant="underlined"></v-select>
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
                <v-row class="lg-12"><v-col></v-col></v-row>
            </v-card>
        </v-col>
        <v-col cols="1"></v-col>
    </v-row>

    <v-row class="lg-12" justify="end">
        <v-col cols="1"></v-col>
        <v-col cols="auto">
            <v-btn variant="outlined"  @click="fnGoSave">등록</v-btn>
        </v-col>
        <v-col cols="auto">
            <v-btn variant="outlined" @click="fnDelete">삭제</v-btn>
        </v-col >
        <v-col cols="auto">
            <v-btn variant="outlined" @click="fnExcelDownload">엑셀다운로드</v-btn>
        </v-col >
        <v-col cols="1"></v-col>
    </v-row>

    <v-row class="lg-12">
        <v-col cols="1"></v-col>
        <v-col>
            <total-count :totalCount="count"></total-count>
            <v-card  variant="outlined">
                <v-row class="lg-12"><v-col></v-col></v-row>
                <v-row align="center" class="lg-12">
                    <v-data-table
                    v-model="delChecked"
                    :headers="headers"
                    :items="tableDatas"
                    density="compact"
                    show-select
                    return-object
                    @dblclick:row="fnGoDetail"
                    >
                    <template v-slot:[`item.brdCn`]="{item}">
                        {{ truncateBrdCn(item.brdCn) }}
                    </template>
                    <template #[`item.regDt`]="{item}">
                        {{ sliceDt(item.regDt) }}
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

<style>

</style>

