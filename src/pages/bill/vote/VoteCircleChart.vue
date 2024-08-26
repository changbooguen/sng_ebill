<script setup>
import { ref, computed } from 'vue';

const section1 = ref(75);
const section2 = ref(95);

// 예시: 원형 차트 크기 조절을 위한 변수 (동적 크기 적용)
const chartSize = ref(200);

const chartStyle = computed(() => {
    return {
        background: `conic-gradient(#18285e 0% ${section1.value}%, #3756bd ${section1.value}% ${section2.value}%, #adbcec ${section2.value}% 100%)`,
        width: `${chartSize.value}px`,
        height: `${chartSize.value}px`
    };
});
</script>

<template>
    <v-container fluid>
        <!-- 중앙 정렬을 위한 v-row 사용 -->
        <v-row dense justify="center" align="center" class="chart-container">
            <div class="pie-chart" :style="chartStyle"></div>
        </v-row>
        
        <v-row dense justify="center" align="center">
            <v-col class="dotCmt1"></v-col>
            <v-col>{{ '찬성 ' + section1 + '%' }}</v-col>

            <v-col class="dotCmt2"></v-col>
            <v-col>{{ '반대 ' + (section2 - section1) + '%' }}</v-col>

            <v-col class="dotCmt3"></v-col>
            <v-col>{{ '기권 ' + (100 - section2) + '%' }}</v-col>
        </v-row>

    </v-container>
</template>

<style scoped>
.pie-chart {
    display: inline-block;
    border-radius: 50%;
    width: 200px;
    height: 200px;
}

.chart-container {
    height: 100%;
}

.dotCmt1 {
    max-width: 10px;
    height: 10px;
    background-color: #18285e;
}
.dotCmt2 {
    max-width: 10px;
    height: 10px;
    background-color: #3756bd;
}
.dotCmt3 {
    max-width: 10px;
    height: 10px;
    background-color: #adbcec;
}
</style>
