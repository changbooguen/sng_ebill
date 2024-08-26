<script setup>
import {inject, onMounted, onUpdated, ref} from "vue";
import authListTab from "@/pages/auth/AuthListTab.vue";
import authUserTab from "@/pages/auth/AuthUserTab.vue";

/*변수선언*/
const tabKind = ref(null)

</script>

<template>
    <v-container>

        <v-tabs v-model="tabKind">

            <v-tab 
                text="권한별"
                value="authListTab"
            ></v-tab>
            
            <v-tab 
                text="사용자별"
                value="authUserTab"
            ></v-tab>
            
        </v-tabs>

        <v-tabs-window v-model="tabKind">

            <v-tabs-window-item value="authListTab">
                <authListTab />
            </v-tabs-window-item>

            <v-tabs-window-item value="authUserTab">
                <authUserTab />
            </v-tabs-window-item>

        </v-tabs-window>
    </v-container>
</template>

<style scoped>

</style>