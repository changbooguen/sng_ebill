<script setup>
import axios from '@/axios';
import {ref, onMounted} from "vue";
import sessionModal from '@/modal/SessionModal.vue'; 
import PagePerItems from "@/components/PagePerItems.vue";
import PagingComponent from "@/components/PagingComponent.vue";

const sessionData = ref([])
const selectedData = ref({});
const selectAllChecked = ref(false);

const page = ref(1);
const pageSize = ref(10);
const totalPages = ref(0);
    
const isNew = ref(false);
const modalVisible = ref(false);

//fetch
const request = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/sessions?page=${page.value}&size=${pageSize.value}`);
    sessionData.value = response.data.data.content;
    totalPages.value = response.data.data.totalPage;

    console.log("SessionData:", sessionData.value);
   
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
  }
};

const openModal = (data = null) => {
  if (!modalVisible.value) {
    selectedData.value = data ? {...data} : {session:'', ageId:Number(), meetingType:'', sessionStartDate:'', sessionEndDate:'', description:''};

    isNew.value = data === null;
    modalVisible.value = true
  }
};

const closeModal = () => {
  modalVisible.value = false;
};

//paging
const updateCurrentPage = (pageNumber) => {
  page.value = pageNumber;
  request();
};
const updateNumItems = (newPageSize) =>{
  pageSize.value = newPageSize;
  page.value = 1;
  request();
};
// create or update
const confirmModify = async (updatedData) => {
  const session = updatedData.session;
  const ageId = Number(updatedData.ageId);
  const meetingType = updatedData.meetingType;
  const sessionStartDate = updatedData.sessionStartDate? new Date(updatedData.sessionStartDate).toISOString().slice(0, -5): '';
  const sessionEndDate = updatedData.sessionEndDate ? new Date(updatedData.sessionEndDate).toISOString().slice(0, -5): '';
  const description = updatedData.description;

  try{
    if (!updatedData.id){
      if (sessionStartDate >= sessionEndDate){
        alert("날짜를 잘못 입력했습니다");
        return;
      }
      const formData = {
        session: session,
        ageId: ageId,
        meetingType: meetingType,
        sessionStartDate: sessionStartDate,
        sessionEndDate: sessionEndDate,
        description: description
      }

      axios.post(`http://localhost:8080/api/sessions`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(() => {
            alert("저장되었습니다");
        
      
          }).catch(error => {
            if (error.response.status == 409){
              alert("이미 존재하는 회기입니다!");
                    }
            else if (error.response.status == 404){
              alert("해당 대별토드ID가 존재하지 않습니다.");
          
            }
            else{
              console.error("Error:", error.response.data);
              alert("저장중 오류가 발생했습니다");
 
  
            }
          });
      }
      //update exsisting session
      else{
            axios.put(`http://localhost:8080/api/sessions/${updatedData.id}`,{
              session: session,
              ageId: ageId,
              meetingType: meetingType,
              sessionStartDate: sessionStartDate,
              sessionEndDate: sessionEndDate,
              description: description,
            }).then(() => {
          alert("저장되었습니다");
        
       
        })
        .catch(error => {
              console.error("Error:", error.response.data);
              alert("저장중 오류가 발생했습니다");
          });
    }
  }catch(error){
    console.log(error instanceof Error ? error.message : error);
  }
  closeModal();
};

//select all(for deleting)
const selectAll =(event) => {
  const isChecked = event.target.checked;
  sessionData.value.forEach(data=>{
    data.selected = isChecked;
  })
};
//delete
const deleteSession = async () => {
  let selectedSessions = [];
  selectedSessions = sessionData.value.filter(data => data.selected).map(data => data.id);

  if (selectedSessions.length === 0){
    window.alert("삭제할 항목을 선택해주세요");
    return;
  }
  const confirmDelete = window.confirm("선택된 항목들을 삭제하시겠습니까?");
  if (!confirmDelete){
    return;
  }
  try{
      await axios.delete("http://localhost:8080/api/sessions",{
        data: selectedSessions
        });
    sessionData.value = sessionData.value.filter(data => !selectedSessions.includes(data.id));
    selectAllChecked.value = false;
    alert("삭제되었습니다");
  }catch(error){
    console.log(error instanceof Error ? error.message : error);
  }
};
onMounted(() => {
    request();
  });
</script>

<template>
  <div :class="{ 'modal-open': modalVisible }">
    <div class="overlay" v-if="modalVisible"></div>
    <p class="title">■ 회기 관리</p>
    <div style="margin: 0.8rem 0;"></div>
    <div class="buttonGroup_left">
      <v-btn variant="outlined" color="red" @click="deleteSession">삭제</v-btn>
      <v-btn variant="outlined" color="primary" @click="openModal(null)">등록</v-btn>
      <PagePerItems style="margin-left: auto;" :numItems="pageSize" @updateNumItems="updateNumItems"></PagePerItems>
    </div>

    <v-data-table :headers="headers" :hide-default-footer="true">
      <thead>
        <tr class="table-primary">
          <th><input type="checkbox" v-model="selectAllChecked" @change="selectAll($event)"></th>
          <th style="font-weight: bold;">회기코드</th>
          <th style="font-weight: bold;">대별코드ID</th>
          <th style="font-weight: bold;">회의종류</th>
          <th style="font-weight: bold;">시작일</th>
          <th style="font-weight: bold;">종료일</th>
          <th style="font-weight: bold;">비고</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!sessionData.value === null|| sessionData.count === 0">
          <td colspan = "7">데이터가 없습니다</td>
        </tr>
        <template v-for="(data) in sessionData" :key=data.id>
          <tr :id="data.id">
            <td><input type="checkbox" v-model="data.selected"></td>
            <td  @click="openModal(data)">{{ data.session }}</td>
            <td  @click="openModal(data)">{{ data.ageId }}</td>
            <td  @click="openModal(data)">{{ data.meetingType }}</td>
            <td  @click="openModal(data)">{{ data.sessionStartDate.slice(0, data.sessionStartDate.indexOf('T')) }}</td>
            <td  @click="openModal(data)" >{{ data.sessionEndDate.slice(0, data.sessionEndDate.indexOf('T')) }}</td>
            <td  @click="openModal(data)">{{ data.description }}</td>
          </tr>
        </template>
      </tbody>  
    </v-data-table>
    <PagingComponent :currentPage="page" :totalPage="totalPages" @update-current-page="updateCurrentPage" />
    <sessionModal v-if="modalVisible" @close="closeModal" :data="selectedData" :show="modalVisible" :isNew="isNew" @confirmModify="confirmModify"/>
    </div>
  </template>

<style scoped>
.title{
  font-weight: bold;
  margin-top: 2%;
  font-size: large;
  display: flex;
}
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

</style>
















