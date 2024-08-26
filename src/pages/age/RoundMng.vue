<script setup>
import axios from '@/axios';
import {ref} from "vue";
import roundModal from "@/modal/RoundModal.vue";

const roundData = ref({})
const modalVisible = ref(false)
const rowDatas = ref(null)
const selectedItems = ref([])

const request = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/rounds", {
      params: {
        page: 1,
        size: 10,
      }
    });
    roundData.value = response.data.data;
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
  }
};

request()
  /*
  await axios.get("").then((response) => {
    roundData.value = response.data.data
  }).catch((e) => {
    if (e instanceof Error) console.log(e.message)
    else console.log(e)
  })
}
*/
const openModal = (data = null) => {
  rowDatas.value = data;
  modalVisible.value = true;
}

const closeModal = () => {
  modalVisible.value = false;
}

const handleSubmit = async (formData) => {
  try {
    if (formData.id){
      const response = await axios.put(`http://localhost:8080/api/rounds/${formData.id}`, formData);
      console.log("round data edited:", response.data);
      }else{
        const response = await axios.post("http://localhost:8080/rounds/ages", formData);
        console.log("new round data added", response.data);
      }
      closeModal();
      request();
  } catch (error) {
    console.error("Error adding/updating round data:", error);
  }
};

const confirmDelete = async() => {
  if (selectedItems.value.length === 0) {
    window.alert('삭제할 항목을 선택해주세요.');
  } else {
    if (window.confirm('삭제하시겠습니까?')) {
      try{
        await Promise.all(selectedItems.value.map(async(id) => {
          await axios.delete(`http://lcoalhost:8080/api/rounds/${id}`);
        }));
        console.log("삭제됨");
        request();
      }
      catch(error){
        console.log("Error deleting round data", error);
      }
    } else {
      console.log('취소됨.');
    }
  }
}

</script>

<template>
  <div style="margin: 0.8rem 0;">

  </div>
  <div>
    <button @click="confirmDelete">선택 삭제</button>
    <button @click="openModal()">등록</button>
  </div>
  <table class="table table-hover">
    <thead>
      <tr class="table-primary">
        <th>선택</th>
        <th>회기코드</th>
        <th>차수코드</th>
        <th>회의종류</th>
        <th>회의구분</th>
        <th>회의일자</th>
        <th>개의예정시간</th>
        <th>개의시간</th>
        <th>산회시간</th>
        <th>비고</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="!roundData.value || roundData.value.length === 0">
        <td colspan = "10">데이터가 없습니다</td>
      </tr>
      <template v-for="(data) in roundData.content" :key=data.id>
        <tr :id="data.id">
          <td><input type="checkbox" v-model="selectedItems" :value="data.id"></td>
          <td @click="openModal({id: data.id, code: data.age, startDate: data.roundStartDate, endDate: data.roundEndDate, remark: data.description })">{{ data.round }}</td>
          <td>{{ data.roundStartDate ? data.roundStartDate.slice(0, data.roundStartDate.indexOf('T')) : ""}}</td>
          <td>{{ data.roundEndDate ? data.roundEndDate.slice(0, data.roundEndDate.indexOf('T')) : ""}}</td>
          <td>{{ data.description }}</td>
          <td></td>
          <td></td>
          <td>{{ data.order }}</td>
        </tr>
      </template>

      <!--
      <tr>
        <td><input type="checkbox" id="ageDelete" value="1" v-model="selectedItems"></td>
        <td @click="openModal({ code: '398', sessionCode: '제397회', type: '본회의', kind: '임시회', remark: '' })">398</td>
        <td>제397회</td>
        <td>본회의</td>
        <td>임시회</td>
        <td>2022-05-29</td>
        <td>1930</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    -->
    </tbody>  
  </table>
  <roundModal v-if="modalVisible" @close="closeModal" :rowDatas="rowDatas" :show="modalVisible" @submit="handleSubmit"/>
</template>

<style scoped>

</style>