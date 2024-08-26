<script setup>
import AgeModal from "@/modal/AgeModal.vue";
import { ref, onMounted,defineEmits } from 'vue';
import PagePerItems from "@/components/PagePerItems.vue";
import PagingComponent from "@/components/PagingComponent.vue";
import axios from '@/axios';

// Local state
const ageData = ref([]);
const selectedData = ref({});
const selectAllChecked = ref(false);

const isNew = ref(false);
const modalVisible = ref(false);

const page = ref(1);
const pageSize = ref(10);
const totalPages = ref(0);

const props = defineProps({
  showInSession: {
    type: Boolean,
    default: true,
  }
})

// Fetch ages
const fetchAges = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/ages?page=${page.value}&size=${pageSize.value}`);
    ageData.value = response.data.data.content;
    totalPages.value = response.data.data.totalPage;
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
  }
};
// Open modal
const openModal = (data = null) => {
  if (!modalVisible.value){
    selectedData.value = data ? { ...data } : { age: '', ageStartDate: '', ageEndDate: '', description: '' };
    isNew.value = data === null;
    modalVisible.value = true;
  }
};

// Close modal
const closeModal = () => {
  modalVisible.value = false;
};
//paging
const updateCurrentPage = (pageNumber) => {
  page.value = pageNumber;
  fetchAges();
};
const updateNumItems = (newPageSize) =>{
  pageSize.value = newPageSize;
  page.value = 1;
  fetchAges();
};
// Confirm modify
const confirmModify = async (updatedData) => {
  const age = updatedData.age;
  const ageStartDate = updatedData.ageStartDate ? new Date(updatedData.ageStartDate).toISOString().slice(0, -5) : '';
  const ageEndDate = updatedData.ageEndDate ? new Date(updatedData.ageEndDate).toISOString().slice(0, -5) : '';
  const description = updatedData.description;

  try {
    if (!updatedData.id) {
      // Create new age
      if (ageStartDate > ageEndDate) {
        alert("날짜를 잘못 입력했습니다");
        return;
      }

      const formData = { age, ageStartDate, ageEndDate, order: 1, description };
      await axios.post(`http://localhost:8080/api/ages`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      alert("저장되었습니다");
      fetchAges();
    } else {
      // Update existing age
      await axios.put(`http://localhost:8080/api/ages/${updatedData.id}`, {
        age, ageStartDate, ageEndDate, description
      });

      alert("저장되었습니다");
      fetchAges();
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      alert("이미 존재하는 대수입니다!");
    }
    console.error("Error:", error.response?.data || error.message);
    alert("저장중 오류가 발생했습니다");
  }

  closeModal();
};
// Select all ages
const selectAll = (event) => {
  const isChecked = event.target.checked;
  ageData.value.forEach(data => {
    data.selected = isChecked;
  });
};

// Delete ages
const deleteAge = async () => {
  const selectedAges = ageData.value.filter(data => data.selected).map(data => data.id);
  if (selectedAges.length === 0) {
    alert("삭제할 항목을 선택하세요.");
    return;
  }

  const confirmDelete = window.confirm("선택된 항목들을 삭제하시겠습니까?");
  if (!confirmDelete) return;

  try {
    await axios.delete("http://localhost:8080/api/ages", {
      data: selectedAges
    });

    ageData.value = ageData.value.filter(data => !selectedAges.includes(data.id));
    selectAllChecked.value = false;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};

// Fetch ages on component mount
onMounted(() => {
  fetchAges();
});

</script>

<template>
  <div :class="{ 'modal-open': modalVisible }">
    <div class="overlay" v-if="modalVisible"></div>
    <p v-if="showInSession" class="title">■ 대수 관리</p>
    <div style="margin: 0.8rem 0;"></div>
    <div v-if="showInSession" class="buttonGroup_left">
      <v-btn variant="outlined" color="red" @click="deleteAge">삭제</v-btn>
      <v-btn variant="outlined" color="primary" @click="openModal(null)">등록</v-btn>
      <PagePerItems v-if="showInSession" style="margin-left: auto;" :numItems="pageSize" @updateNumItems="updateNumItems"></PagePerItems>
    </div>

    <v-data-table :headers="headers" :hide-default-footer="true">
        <thead>
        <tr class="table-primary">
          <th v-if="showInSession"><input type="checkbox" v-model="selectAllChecked" @change="selectAll($event)"></th>
          <th data-i18n="A:10073" style="font-weight: bold;" >대별코드</th>
          <th data-i18n="A:10070" style=" font-weight: bold;">대별시작일</th>
          <th data-i18n="10071" style=" font-weight: bold;">대별종료일</th>
          <th v-if="showInSession" data-i18n="A:10074" style="font-weight: bold;">비고</th>
          <th v-if="showInSession" data-i18n="10075" style="font-weight: bold;">작성자</th>
          <th v-if="showInSession" data-i18b="A:10080" style="font-weight: bold;">작성일</th>
          <th v-if="showInSession" data-i18b="A:10080" style="font-weight: bold;">순서</th>
        </tr>
        </thead>
        <tbody>
            <tr v-if="!ageData.value === null|| ageData.count === 0">
                <td colspan = "7">데이터가 없습니다</td>
            </tr>
            <template v-for="(data) in ageData" :key=data.id>
              <tr :id="data.id">
                <td v-if="showInSession"><input type="checkbox" v-model="data.selected"></td>
                <td @click="openModal(data)">{{ data.age }}</td>
                <td @click="openModal(data)">{{ data.ageStartDate.slice(0, data.ageStartDate.indexOf('T')) }}</td>
                <td @click="openModal(data)">{{ data.ageEndDate.slice(0, data.ageEndDate.indexOf('T')) }}</td>
                <td v-if="showInSession" @click="openModal(data)">{{ data.description }}</td>
                <td v-if="showInSession" @click="openModal(data)">{{ data.createdBy }}</td>
                <td v-if="showInSession" @click="openModal(data)">{{ data.createdDate.slice(0, data.createdDate.indexOf('T')) }}</td>
                <td v-if="showInSession" @click="openModal(data)">{{ data.order }}</td>
              </tr>
        </template>
        </tbody>
      </v-data-table>
      <PagingComponent :currentPage="page" :totalPage="totalPages" @update-current-page="updateCurrentPage" />
      <AgeModal v-if="modalVisible" @close="closeModal" :data="selectedData" :show="modalVisible" :isNew="isNew" @confirmModify="confirmModify"/>
  </div>
</template>

<style scoped>
.modal-open {
  pointer-events: none;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
.modal-wrapper{
  pointer-events: auto;
  z-index: 20;
}
.title{
  font-weight: bold;
  margin-top: 2%;
  font-size: large;
  display: flex;
}



</style>
