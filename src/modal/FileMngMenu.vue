<script setup>
import { ref, defineProps, defineEmits } from 'vue';


/** 변수 선언 */
const props = defineProps({
    show: Boolean
});
const dialog = ref(props.show);
const emit = defineEmits(['close']);

/** function List */

</script>

<template>
    <v-menu v-model="dialog" @update:modelValue="val => !val && emit('close')" location="end">

        <v-card min-width="200">
            <!-- <v-list>
                <v-list-item
                    title="폴더 생성"
                    @click="fnShowModal('folder')"
                >
                </v-list-item>
            </v-list>

            <v-divider></v-divider> -->

            <v-list>
                <v-list-item
                    title="폴더 생성"
                    @click="emit('menuKind', 'folderAdd');"
                >
                </v-list-item>

                <v-list-item
                    title="파일 생성"
                    @click="emit('menuKind', 'fileAdd');"
                >
                </v-list-item>
            </v-list>

        </v-card>
    </v-menu>

</template>

<style scoped>

</style>