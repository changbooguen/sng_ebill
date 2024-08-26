  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import axios from '@/axios';
  import PagePerItems from "@/components/PagePerItems.vue";
  import PagingComponent from "@/components/PagingComponent.vue";
  import { defineEmits } from 'vue';
 import AgeMng from '@/pages/age/AgeMng.vue';
import { useLayout } from 'vuetify/lib/framework.mjs';

  // Define emit
  const emit = defineEmits(['ageSelected']);
  

  const props = defineProps({
    showInSession: {
      type: Boolean,
      default: true
    }

});
  
  // Local state
  const page = ref(1);
  const pageSize = ref(10);
  const ageData = ref([]);
  const totalPages = ref(0);

  const showInSession = ref(true);


  const modalVisible = ref(false); 
  const show = ref(false);

  // Fetch data
  const fetchAges = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/ages?page=${page.value}&size=${pageSize.value}`);
      ageData.value = response.data.data.content;
      totalPages.value = response.data.data.totalPage;
      console.log("Data:", ageData.value);
    } catch (e) {
      console.error(e instanceof Error ? e.message : e);
    }
  };
    // Watch for changes in modal visibility
    watch(modalVisible, (newValue) => {
    console.log("Modal visibility changed:", newValue);
    modalVisible.value = newValue;
  });
  
  // Select age
  const selectAge = (age) => {
    if (!modalVisible.value) {
      emit('ageSelected', age);
    }

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
  
//select all(for deleting)
const selectAll =(event) => {
  const isChecked = event.target.checked;
  ageData.value.forEach(data=>{
    data.selected = isChecked;
  })
};
//delete
const deleteAge = async () => {
  let selectedAges = [];
  selectedAges = ageData.value.filter(data => data.selected).map(data => data.id);

  if (selectedAges.length === 0){
    window.alert("삭제할 항목을 선택해주세요");
    return;
  }
  const confirmDelete = window.confirm("선택된 항목들을 삭제하시겠습니까?");
  if (!confirmDelete){
    return;
  }
  try{
      await axios.delete("http://localhost:8080/api/ages",{
        data: selectedAges
        });
    ageData.value = ageData.value.filter(data => !selectedAges.includes(data.id));
    selectAllChecked.value = false;
    alert("삭제되었습니다");
  }catch(error){
    console.log(error instanceof Error ? error.message : error);
  }
};
  // Update current page
  const updateCurrentPage = (pageNumber) => {
    page.value = pageNumber;
    fetchAges();
  };
  
  // Update number of items per page
  const updateNumItems = (newPageSize) => {
    pageSize.value = newPageSize;
    page.value = 1;
    fetchAges();
  };

  // On component mounted
  onMounted(() => {
    fetchAges();
  });
  </script>
  
  <template>
    <div style="margin: 0.8rem 0;"></div>
      <div class="buttonGroup_left">
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
                <td v-if="showInSession"><input type="checkbox"></td>
                <td @click="selectAge(data)">{{ data.age }}</td>
                <td @click="selectAge(data)">{{ data.ageStartDate.slice(0, data.ageStartDate.indexOf('T')) }}</td>
                <td @click="selectAge(data)">{{ data.ageEndDate.slice(0, data.ageEndDate.indexOf('T')) }}</td>
                <td v-if="showInSession" @click="selectAge(data)">{{ data.description }}</td>
                <td v-if="showInSession" @click="selectAge(data)">{{ data.createdBy }}</td>
                <td v-if="showInSession" @click="selectAge(data)">{{ data.createdDate.slice(0, data.createdDate.indexOf('T')) }}</td>
                <td v-if="showInSession" @click="selectAge(data)">{{ data.order }}</td>
              </tr>
        </template>
        </tbody>
      </v-data-table>
      <PagingComponent :currentPage="page" :totalPage="totalPages" @update-current-page="updateCurrentPage" />
  </template>
  
  