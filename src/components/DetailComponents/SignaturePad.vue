<template>

  <Vue3Signature  ref="signature1" :sigOption="state.option" :w="'320px'" :h="'140px'"
                  :disabled="state.disabled" class="example"></Vue3Signature>
  <div class="signature_btn_bundle">
    <button @click="save('image/jpeg')">Save</button>
    <button @click="clear">Clear</button>
    <button @click="undo">Undo</button>
    <button @click="addWaterMark">addWaterMark</button>
    <button @click="fromDataURL">fromDataURL</button>
    <button @click="handleDisabled">disabled</button>
  </div>

</template>

<script setup>
import {reactive, ref} from 'vue'

const state = reactive({
  count: 0,
  option: {
    penColor: "rgb(0, 0, 0)",
    backgroundColor: "rgb(255,255,255)"
  },
  disabled: false
})

const signature1 = ref(null)

const save = (t) => {
  console.log(signature1.value.save(t))
}

const clear = () => {
  signature1.value.clear()
}

const undo = () => {
  signature1.value.undo();
}

const addWaterMark = () => {
  signature1.value.addWaterMark({
    text: "mark text",          // watermark text, > default ''
    font: "20px Arial",         // mark font, > default '20px sans-serif'
    style: 'all',               // fillText and strokeText,  'all'/'stroke'/'fill', > default 'fill
    fillStyle: "red",           // fillcolor, > default '#333'
    strokeStyle: "blue",	       // strokecolor, > default '#333'
    x: 100,                     // fill positionX, > default 20
    y: 200,                     // fill positionY, > default 20
    sx: 100,                    // stroke positionX, > default 40
    sy: 200                     // stroke positionY, > default 40
  });
}

const fromDataURL = (url) => {
  signature1.value.fromDataURL("https://avatars2.githubusercontent.com/u/17644818?s=460&v=4");
}

const handleDisabled = () => {
  state.disabled = !state.disabled
}

</script>

<style lang="scss" scoped>

</style>