<script setup>
import { onMounted, ref, defineEmits } from "vue";
import store from '@/store';

/*변수선언*/
const emit = defineEmits(['close'])


/*Function List*/

/*글저장*/

const fnValidate = (e) => {
    const data = saveForm.value?.validate();
    return formValid.value;
};

const fnSave = (e) => {
    const jsonData = {
        brdSj: title.value,
        brdCn: contents.value,
        pupYn: 1
    }

    const apiUrl = "/api/sample/comBoard";

    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData

    store.dispatch('API_SAVE', params).then((data) => {
        emit('close')
    }).catch(({ message }) => {
        console.log("message : ", message);
    })

}


/*Dom객체 완성이후*/
onMounted(() => {

});


</script>

<template>
    <v-dialog max-width=600>
        <v-card title="참석 예정자">
            <v-card-text>
                <v-data-table :headers="headers" :items="tableDatas" density="compact" item-key="id" show-select></v-data-table>
            </v-card-text>
            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Close" variant="plain" @click="emit('close')"></v-btn>
                <v-btn color="primary" text="save" variant="tonal" type="submit" @click="fnSave"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>



<style scoped></style>