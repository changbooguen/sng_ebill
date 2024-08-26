<script setup>
import { defineEmits, defineProps, ref, onMounted, watch } from 'vue';
import store from '@/store';

const emit = defineEmits(['close', 'apply', 'input']); 


const props = defineProps({
    ord: Number,
    users: Array,
    savedMembers:Array,
    show: Boolean,
    grpId: Number
});

const dialog = ref(props.show);
const saveForm = ref(false);
const formValid = ref(false);
//filteredUsers

//const filteredGroups = ref([]);//

const savedMembersList = ref(props.savedMembers.filter(member => member.agreeYn == 'Y').map(member=>member.proposerId));
//friends
//tempSelectedUserList

//const filteredUsers = ref([]);//
//const tempSelectedUserList = ref([]);

const filteredUsers = ref(props.users);//
const tempSelectedUserList = ref([]);




const selectedUserList = ref(null);
const grpDetail = ref(null);

//const groupList = ref(props.groups);
const query = ref('');//
const groupName = ref('');//
const userList = ref(props.users);

  //선택한 유저리스트를 autocomp 용으로 가공한다. 추가로 서명 동의한 유저 리스트도 만든다. 
  //selectedUserList.value = props.savedMembers.filter(member => member.agreeYn == 'Y').map(member=>member.memberId);
  //alert('selectedUserList.value',selectedUserList.value)

const groupNameRules = [
  v => (v != null && v.length >= 1) || 'Please enter the group name.'
];

//memberListRules
const memberListRules = [
  v => (v != null && v.length >= 1) || 'Please select one or more members.'
];

const close = () => {
    dialog.value = false;
    emit('close');
}

const apply = () => {

    saveModalForm();
    
}

const fnValidate= (e)=>{
    const data = saveForm.value?.validate();
    
    if(formValid.value){

      if(tempSelectedUserList.value.length>0){
        return formValid.value;
      }
    }
    
    return false;
 
};

const saveModalForm = async () => {
  if(!fnValidate()) {
        return;
    } 
    
    selectedUserList.value = tempSelectedUserList.value.map(user => user.value);

    const actionType = grpDetail.value ? 'API_UPDATE' : 'API_SAVE';
    const jsonData = {
        grpId : grpDetail.value?grpDetail.value.grpId:null,
        grpNm : groupName.value,
        ord : grpDetail.value?grpDetail.value.ord:props.ord,
        memberList : selectedUserList.value? selectedUserList.value: null
    }

    const apiUrl = "/api/myinfo/group";

    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData

    store.dispatch(actionType,params).then((data) => {

        console.log(data);
        
        close();

    }).catch(({message}) => {
        console.log("message : ", message);
    })

}

const filterList = () => {
      const q = query.value.toLowerCase();
      filteredUsers.value = filteredUsers.value.filter(item => item.title.toLowerCase().includes(q));
}

//addTempList
const addTempList = (item, i) => {
      filteredUsers.value.splice(i, 1);
      tempSelectedUserList.value.push(item);
}


const removeUser = (item, i) => {

  tempSelectedUserList.value.splice(i, 1);
  filteredUsers.value.push(item);
 
}
const searchFilteredUsers =ref([]);
const isVisible = (item) => {
    const q = query.value.toLowerCase();
    return item.title.toLowerCase().includes(q);
}

const visibleUsersCount = () => {
    return filteredUsers.value.filter(item => isVisible(item)).length;
}

const hasVisibleItems = () => {
    return filteredUsers.value.some(item => isVisible(item));
}

const highlightQuery = (text) => {

    if (!query.value) {
      return text;
    }
    
    const q = query.value.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&'); 
    const regex = new RegExp(`(${q})`, 'gi');

    return text.replace(regex, '<span class="highlight">$1</span>');
}

const fnGetData= ()=>{

const listUrl = `/api/myinfo/group/${props.grpId}`;
let params = {};
params.API_PATH = listUrl;

store.dispatch('API_LIST',params).then((data) => {
  console.log(data.resultList);
  grpDetail.value = data.resultList.data.group;
  groupName.value = grpDetail.value.grpNm;
  selectedUserList.value = data.resultList.data.group.memberList;

  tempSelectedUserList.value = selectedUserList.value.map(memberId => {
    const member = props.users.find(user => user.value === memberId);
    return member ? { value: member.value, title: member.title } : null;
  }).filter(member => member !== null);


  const valuesToRemove = tempSelectedUserList.value.map(item => item.value);
  filteredUsers.value = props.users.filter(item => !valuesToRemove.includes(item.value));

  console.log('filteredUsers.value ::',filteredUsers.value);

}).catch(({message}) => {
  console.log("message : ", message);
})

}


/*Dom객체 완성이후*/
onMounted(() => {
  filterList();
  if(props.grpId!=null){
    fnGetData();
  }
  

});

</script>

<template>
    <v-dialog v-model="dialog" persistent :max-width="700">
      <v-card>
        <v-card-title>
          <span class="headline">서명 요청 대상 그룹 설정</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent ref="saveForm" v-model="formValid" lazy-validation>
          <v-row>
            <v-col>
              <v-text-field
                        v-model="groupName"
                        label="그룹명"
                        required
                        :rules="groupNameRules"
                        ></v-text-field>
            </v-col>
          </v-row>
          <v-row>

            <v-col>

    
            
            <v-text-field
            v-model="query"
            class="mx-auto"
            density="comfortable"
            menu-icon=""
            placeholder="의원 및 정당 검색"
            prepend-inner-icon="mdi-magnify"
            style="max-width: 350px;"
            theme="light"
            variant="solo"
            auto-select-first
            rounded
            ></v-text-field>            



            </v-col>
            <v-col></v-col>
            <!--
            <v-col>
              <h5>선택된 사용자</h5>



              <template v-for="(item,index) in filteredUsers" :key="index">
                <v-chip
                  variant="outlined"
                  >
                  {{ item.title }}
                </v-chip>
              </template>
            </v-col>
            -->
          </v-row>
          <v-row>
            <v-col>  
              <v-card class="mx-auto custom-card">
              <v-list>
                <v-list-subheader>의원 목록 </v-list-subheader>
                
              </v-list>
              
                <v-list class="custom-list">
                  <template v-if="hasVisibleItems">
                    <v-list-item
                      v-for="(item, i) in filteredUsers"
                      :key="i"
                      :value="item"
                      color="primary"
                      variant="plain"
                      @click="addTempList(item, i)"
                      :class="{ hidden: !isVisible(item) }"
                    >
                      <template v-slot:prepend>
                        <v-icon :icon="item.icon"></v-icon>
                      </template>

                      <v-list-item-title v-html="highlightQuery(item.title)"></v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-else>
                    <v-list-item class="no-content">
                      <v-list-item-title>선택할 의원이 없습니다</v-list-item-title>
                    </v-list-item>
                  </template>
                </v-list>

              </v-card>
            </v-col>
            
            <v-col>  
              <v-card class="mx-auto custom-card">
                <v-list>
                  <v-list-subheader>그룹 추가 의원</v-list-subheader>
                </v-list>
                
                <v-list class="custom-list">
                  <template v-if="tempSelectedUserList.length">
                  <v-list-item
                    v-for="(item, i) in tempSelectedUserList"
                    :key="i"
                    :value="item"
                    color="primary"
                    variant="plain"
                  >
                    <template v-slot:prepend>
                      <v-icon :icon="item.icon"></v-icon>
                    </template>

                    <v-list-item-title v-text="item.title"></v-list-item-title>

                    <template v-slot:append>
                      <v-icon @click="removeUser(item, i)">mdi-close</v-icon>
                    </template>

                  </v-list-item>
                </template>
                <template v-else>
                    <v-list-item
                      color="primary"
                      class="no-content"
                    >

                      <v-list-item-title>선택된 의원이 없습니다.</v-list-item-title>
                    </v-list-item>
                </template>
                </v-list>
                

              </v-card>
            </v-col>            
          </v-row>
          <v-divider></v-divider>

        </v-form>
        </v-card-text>
      
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">취소</v-btn>
          <v-btn color="blue darken-1" text @click="apply">적용</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>


<style scoped>
.custom-card {
}

.custom-list {
  max-height: 200px;
  min-height: 200px;
  overflow-y: auto;
}
.no-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}

.hidden {
  display: none !important;
}
.highlight {
  position: relative;
  display: inline-block;
  background-color: rgba(255, 255, 0, 0.5) !important; /* 반투명 노란색 */
  color: inherit !important; /* 텍스트 색상 상속 */
}

</style>