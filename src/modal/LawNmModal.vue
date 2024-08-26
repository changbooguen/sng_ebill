<script setup>
import { defineEmits, defineProps, ref, onMounted, watch } from 'vue';
import store from '@/store';

const emit = defineEmits(['close', 'apply', 'input']); 

const props = defineProps({
    value: Boolean,
    show: Boolean,
});

const dialog = ref(props.show);

const searchLawNm = ref('');
const tableDatas = ref([]);
const headers = [
    { title: '법률명1', align: 'left', key: 'lawNm1', sortable: false},
    { title: '법률명2', align: 'left', key: 'lawNm2', sortable: false}
];

const close = () => {
    dialog.value = false;
    emit('close');
}

const selectLawNm = (e, row) => {

    emit('selectLawNm', {
      lawId: row.item.lawId,
      lawNm1: row.item.lawNm1,
      lawNm2: row.item.lawNm2
    });
    
    close();
}


/*조회*/
const fnSearch = () => {

const apiUrl = "/api/getBillInfo";
let params = {};
params.API_PATH = apiUrl;
params.lawNm = searchLawNm.value;
params.size = 1000;

store.dispatch('API_LIST', params).then((data) => {
    tableDatas.value = data.resultList;

}).catch(({ message }) => {
    console.log("message : ", message);
})
}



/*Dom객체 완성이후*/
onMounted(() => {

  fnSearch();

});

</script>
<template>
  
    <v-dialog v-model="dialog" persistent :max-width="700">
      <v-card>
        <v-card-title>
          <span class="headline">법률명 검색</span>
        </v-card-title>
        <v-card-text>
          <v-row class="lg-12">
            <v-col>
                <v-card variant="outlined">
                  <v-card-text>

                    <v-row align="center" class="lg-12">
                        <v-col cols="10">
                            <v-text-field label="법률명" type="input" @keydown.enter="fnSearch" v-model="searchLawNm">
                            </v-text-field>
                        </v-col>

                        <v-col cols="2">

                            <v-row align="center" justify="center">
                                <v-col cols="auto">
                                    <v-btn variant="outlined" @click="fnSearch">조회</v-btn>
                                </v-col>
                            </v-row>

                        </v-col>
                    </v-row>

                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="lg-12">
            <v-col>

                <v-card variant="outlined">
                    <v-row align="center" class="lg-12">
                        <v-data-table :headers="headers" :items="tableDatas" :items-per-page="5" density="compact" item-key="lawId"
                            @click:row="selectLawNm"  :hover="true">
                        </v-data-table>

                    </v-row>
                </v-card>

            </v-col>
        </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="close">취소</v-btn>

        </v-card-actions>
      </v-card>  


    </v-dialog>

  </template>

<style scoped>

</style>
