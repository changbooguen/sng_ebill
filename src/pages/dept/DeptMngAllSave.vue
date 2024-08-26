<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';
import * as XLSX from 'xlsx'; //npm install xlsx 

/* 변수선언 */
const router = useRouter();
const userVailCount = ref(0);
const tableDatas = ref([]); 
const delChecked = ref([]);
const headers = [
            { title: '부서코드', align: 'center', key: 'deptId', sortable: false },
            { title: '담당자ID', align: 'center', key: 'mngrId', sortable: false },
            { title: '부서명', align: 'center', key: 'deptNm', sortable: true },
            { title: '부서약칭', align: 'center', key: 'shrtNm', sortable: true },
            { title: '순서', align: 'center', key: 'ord', sortable: true },
            { title: '상위부서아이디', align: 'center', key: 'uprDeptId', sortable: false },
            { title: '부서신설일', align: 'center', key: 'bgDt', sortable: false },
            { title: '부서폐쇄일', align: 'center', key: 'edDt', sortable: false },
]; 

/** function List */

/** excel파일 업로드 */
const fnExcelUpload = (event) => {
  const file = event.target.files[0]; // 업로드된 파일 가져오기
  
  if (file) {
    const reader = new FileReader(); // 파일을 읽기 위한 FileReader 객체 생성
    
    reader.onload = async (e) => { // 파일 로드 완료시 실행
      const data = new Uint8Array(e.target.result); // 파일 데이터를 Uint8Array로 변환
      const workbook = XLSX.read(data, { type: 'array' }); // 엑셀 파일을 읽음
      
      const firstSheetNm = workbook.SheetNames[0]; // 첫 번째 시트 명 가져오기
      const worksheet = workbook.Sheets[firstSheetNm]; // 첫 번째 시트 가져오기
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // sheet_to_json을 사용하여 시트를 JSON 데이터로 변환
      
      const formattedData = jsonData.slice(1).map(row => ({
        deptId: row[0],
        mngrId: row[1],
        deptNm: row[2],
        shrtNm: row[3],
        ord: row[4],
        uprDeptId: row[5],
        bgDt: row[6],
        edDt: row[7],
      }));

      tableDatas.value = formattedData // 데이터 행(첫 번째 행 제외)를 가져와 저장
      tableDatas.value.sort((a, b) => parseInt(a.deptId) - parseInt(b.deptId));
      await fnIdSearch();
    };
    
    reader.readAsArrayBuffer(file); // 파일을 ArrayBuffer로 읽음
  }
}

/** DB에 등록된 아이디 조회 */
const fnIdSearch = () => {
  const excelUserId = ref([]);

  for (let i = 0;  i < tableDatas.value.length; i++){
    excelUserId.value.push(tableDatas.value[i].deptId);
  }

  console.log(excelUserId.value)

  const listUrl = `/api/deptVail/${excelUserId.value}`;
  let params = {};
  params.API_PATH = listUrl;

  store.dispatch('API_LIST',params).then((data) => {
    userVailCount.value = data.resultList.data.count
  }).catch(({message}) => {
    console.log("message : ",message)
  })

}

/** 엑셀데이터 중 중복된 아이디 조회 */
const validateId = () => {
  const ids = {}; 
  for (let i = 0; i < tableDatas.value.length; i++) {
    const deptId = tableDatas.value[i].deptId; 

    if (ids[deptId]) {
      return false; // 중복된 아이디 발견 시 false 반환
    }
    ids[deptId] = true; // 객체에 아이디 저장
  }
  return true; // 중복된 아이디가 없으면 true 반환
}

/** 등록 */
const fnSave = async () => {

  if (!validateId()) {
    alert("중복되는 부서코드가 존재합니다.")
    return false; 
  }


  const loginId = ref(store.getters.userId)
  for (let i = 0; i < tableDatas.value.length; i++) {
    const { deptId ='', mngrId='', deptNm='', shrtNm='', ord='', uprDeptId='', bgDt='', edDt='' } = tableDatas.value[i];
    const jsonData = {
      deptId : `${deptId}`,
      mngrId : `${mngrId}`,
      deptNm : `${deptNm}`,
      shrtNm : `${shrtNm}`,
      ord : ord,
      uprDeptId : `${uprDeptId}`,
      bgDt : `${bgDt}`,
      edDt : `${edDt}`,
      regId : loginId.value
    }


    const apiUrl = "/api/departments";
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData;

    store.dispatch('API_SAVE', params).then((data) => {
    }).catch(({message}) => {
      console.log("message : ", message);
    })
  }

  alert("일괄 저장되었습니다.");

  tableDatas.value = [];

}

/** 선택항목 삭제 */
const fnDelete = () => {
  const deptIdsToDelete = delChecked.value.map(item => item.deptId);
  const filteredData = tableDatas.value.filter(item => !deptIdsToDelete.includes(item.deptId));

  tableDatas.value = filteredData;
}

const fnGoList = () => {
  router.push('/departmentMng');
}

/** Dom객체 완성이후 */
onMounted( () => {

});



</script>

<template>
  <v-container>
    <v-row>
        ■ 부서 일괄 등록
    </v-row>
    <v-row>
      최대 000명까지 등록할 수 있습니다.
    </v-row>

    <v-row>
      <v-col cols="3"></v-col>
      <v-col>
        <v-file-input label="File input" id="excelFile" type="file" @change="fnExcelUpload"></v-file-input>
      </v-col>
      <v-col>
        <v-btn variant="outlined" id="xlsxDown" href="/files/부서_저장양식.xlsx" download>양식 다운로드</v-btn>
      </v-col>
    </v-row>

    <v-row justify="end"> 
      <v-col cols="auto">
        <v-btn variant="outlined" @click="fnDelete">삭제</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" @click="fnSave">등록</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" @click="fnGoList">목록</v-btn>
      </v-col>
    </v-row>

    <v-row>
      전체 {{ tableDatas.length }}개 ({{ userVailCount }}개 등록가능 {{ tableDatas.length - userVailCount}}개 등록 불가능)
    </v-row>  

    <v-row>
      <v-data-table
        :headers="headers"
        item-key="id"
        :items="tableDatas"
        show-select
        return-object
        v-model="delChecked"
      >
      </v-data-table>
    </v-row>  

  </v-container>
</template>

<style scoped>

</style>