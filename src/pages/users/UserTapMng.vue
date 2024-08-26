<script setup>
import MemberMng from '@/pages/users/member/MemberMng.vue';
import UserMng from '@/pages/users/user/UserMng.vue';
import { ref } from 'vue';

const tapKind =  ref(sessionStorage.getItem('tapKind') || 'member');
const resetKind = sessionStorage.setItem('tapKind', '');

const memberMng = () => {
  tapKind.value = 'member';
  resetKind;
};
const userMng = () => {
  tapKind.value = 'user';
  resetKind;
};


</script>

<template>
  <div class="container">
    <div class="tapGroup">
      <v-sheet class="mx-auto">
        <v-btn
            :color="isSelected ? 'primary' : undefined"
            class="ma-2"
            rounded
            @click="memberMng"
            :class="{ active: tapKind === 'member' }"
        >
          국회 의원
        </v-btn>
        <v-btn
            :color="isSelected ? 'primary' : undefined"
            class="ma-2"
            rounded
            @click="userMng"
            :class="{ active: tapKind === 'user' }"
        >
          국회 직원
        </v-btn>
      </v-sheet>
    </div>
    <MemberMng v-if="tapKind === 'member'" />
    <UserMng v-if="tapKind === 'user'" />
  </div>
</template>

<style scoped>
button.active {
  background-color: #007bff;
  color: white;
}
</style>
