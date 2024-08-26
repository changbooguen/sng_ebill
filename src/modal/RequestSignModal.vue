<script setup>
import { defineEmits, defineProps, ref, onMounted, watch } from 'vue';

const emit = defineEmits(['close', 'apply', 'input']); 


const props = defineProps({
    groups: Array,
    users: Array,
    savedMembers:Array,
    show: Boolean,
});

const dialog = ref(props.show);
//filteredUsers
const filteredUsers = ref([]);//
const filteredGroups = ref([]);//

const savedMembersList = ref(props.savedMembers.filter(member => member.agreeYn == 'Y').map(member=>member.proposerId));
//friends
const selectedGroupList = ref([]);
const selectedUserList = ref(savedMembersList.value);

//const groupList = ref(props.groups);
const userList = ref(props.users);
const groupList = ref(props.groups);



  //선택한 유저리스트를 autocomp 용으로 가공한다. 추가로 서명 동의한 유저 리스트도 만든다. 
  //selectedUserList.value = props.savedMembers.filter(member => member.agreeYn == 'Y').map(member=>member.memberId);
  //alert('selectedUserList.value',selectedUserList.value)





const close = () => {
    dialog.value = false;
    emit('close');
}

const apply = () => {
    emit('apply', {
      groups: selectedGroupList.value,
      users: selectedUserList.value
    });
    close();
}


const removeGroup = (id) => {
    selectedGroupList.value = selectedGroupList.value.filter(group => group !== id);
    
}

const removeUser = (id) => {

    selectedUserList.value = selectedUserList.value.filter(user => user !== id);
 
}

//isPreselected
const isPreselected = (proposerId) => {
  alert('dfdfd');
  return savedMembersList.value.includes(proposerId);

}

watch(selectedGroupList, (newValue, oldValue) => {
  filteredGroups.value = props.groups.filter(group => newValue.includes(group.value));
});

watch(selectedUserList, (newValue, oldValue = []) => {

  const removedElements = oldValue.filter(item => !newValue.includes(item));
  console.log('removedElements',removedElements);

  const removedElement = removedElements[0];

  if (removedElements.length > 0 && savedMembersList.value.includes(removedElement)) {
    
    selectedUserList.value = oldValue;
  
  }else{
    filteredUsers.value = props.users.filter(user => newValue.includes(user.value));
  }

  

});


/*Dom객체 완성이후*/
onMounted(() => {

  filteredUsers.value = props.users.filter(user => selectedUserList.value.includes(user.value));

});

</script>

<template>
    <v-dialog v-model="dialog" persistent :max-width="700">
      <v-card>
        <v-card-title>
          <span class="headline">서명 요청 대상 지정</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-autocomplete
                v-model="selectedGroupList"
                :items="groupList"
                label="그룹 선택"
                multiple
              >
                <template v-slot:selection="data">
                  <v-chip
                    :selected="data.selected"
                    closable
                    @click:close="removeGroup(data.item.value)"
                  >{{ data.item.title }}</v-chip>
                </template>
                <v-list>
                <template v-slot:item="data" >
                  
                  <template v-if="data.item">
                    {{ data.item.title }}
                  </template>
                  </template>
                </v-list>
              </v-autocomplete>
            </v-col>
            <v-col>
              <v-autocomplete
                v-model="selectedUserList"
                :items="userList"
                label="의원 선택"
                multiple
                hide-selected
              >
                <template v-slot:selection="data">

                  <template v-if="savedMembersList.includes(data.item.value)">
                    <v-chip
                  :selected="data.selected"
                  >
                    {{ data.item.title }}
                  </v-chip>
                  </template>

                  <template v-else>
                    <v-chip
                  :selected="data.selected"
                  closable
                  @click:close="removeUser(data.item.value)"
                  >
                    {{ data.item.title }}
                  </v-chip>
                  </template>










                </template>
                <v-list>
                <template v-slot:item="data" >

                  <template v-if="data.item">
                      {{ data.item.title }}
                  </template>


                  </template>
                </v-list>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col>
              <h5>선택된 그룹 및 사용자</h5>

              <template v-for="(item,index) in filteredGroups" :key="index">

                <v-chip
                  variant="outlined"
                  >
                  {{ item.title }}
                </v-chip>
              </template>

              <template v-for="(item,index) in filteredUsers" :key="index">
                <v-chip
                  variant="outlined"
                  >
                  {{ item.title }}
                </v-chip>
              </template>
            </v-col>
          </v-row>
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

</style>