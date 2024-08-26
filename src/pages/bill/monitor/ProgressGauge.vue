<script setup>
import { defineProps } from "vue";

const props = defineProps({
    count: Number,
    progressValue: Number
})
</script>

<template>

    <div v-show="props.count < props.progressValue" class="stepper-item"
        :style="{ '--hide-before': props.count === 0 ? 'none' : 'block', '--hide-after': props.count === 6 ? 'none' : 'block' }">
        <div class="step-counter"></div>
    </div>

    <div v-show="props.count === props.progressValue" class="stepper-item active"
        :style="{ '--hide-before': props.count === 0 ? 'none' : 'block', '--hide-after': props.count === 6 ? 'none' : 'block' }">
        <div class="step-counter"></div>
    </div>

    <div v-show="props.count > props.progressValue" class="stepper-item proceed"
        :style="{ '--hide-before': props.count === 0 ? 'none' : 'block', '--hide-after': props.count === 6 ? 'none' : 'block' }">
        <div class="step-counter"></div>
    </div>

</template>

<style scoped>
.stepper-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
}

.stepper-item::before {
    position: absolute;
    content: "";
    border-bottom: 5px solid #537ac4;
    width: 100%;
    top: 8px;
    left: -50%;
    z-index: 2;
    display: var(--hide-before, block);
}

.stepper-item::after {
    position: absolute;
    content: "";
    border-bottom: 5px solid #537ac4;
    width: 100%;
    top: 8px;
    left: 50%;
    z-index: 2;
    display: var(--hide-after, block);
}

.stepper-item .step-counter {
    position: relative;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #537ac4;
    color: white;
}

.stepper-item.active .step-counter::after {
    content: "";
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: white;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.stepper-item.active::after {
    position: absolute;
    content: "";
    border-bottom: 5px solid #e8e8e8;
    width: 100%;
    top: 8px;
    left: 50%;
    z-index: 2;
    display: var(--hide-after, block);
}

.stepper-item.proceed .step-counter {
    background-color: #e8e8e8;
}

.stepper-item.proceed::after {
    position: absolute;
    content: "";
    border-bottom: 5px solid #e8e8e8;
    width: 100%;
    top: 8px;
    left: 50%;
    z-index: 3;
}

.stepper-item.proceed::before {
    position: absolute;
    content: "";
    border-bottom: 5px solid #e8e8e8;
    width: 100%;
    top: 8px;
    left: -50%;
    z-index: 2;
}

/* .stepper-item:first-child::before {
  content: none;
}
.stepper-item:last-child::after {
  content: none;
} */
</style>