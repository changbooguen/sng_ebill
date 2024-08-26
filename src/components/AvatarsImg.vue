<script setup>

import {ref, shallowRef, computed, watch, defineEmits, defineProps} from "vue";
const props = defineProps({
  url: String,
  size: String
});

const arrayBuffer = ref(null);

function byteToUint8Array(byteArray) {
    var uint8Array = new Uint8Array(byteArray.length);
    uint8Array.set(Java.from(byteArray));
    return uint8Array;
}

function isArrayBuffer(data) {
  return data instanceof ArrayBuffer;
}


const fnViewAvatar= (base64String)=>{
console.log('base64String :: ', base64String);
try{


  if(base64String!=null){
    
    
    if(!isArrayBuffer(base64String)){
      // Base64 디코딩
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      // Uint8Array를 ArrayBuffer로 변환
      arrayBuffer.value = byteArray.buffer;
    }else{
      arrayBuffer.value = base64String;
    }

    // ArrayBuffer를 Blob으로 변환
    const blob = new Blob([arrayBuffer.value], { type: 'application/octet-stream' });
    const objectURL = URL.createObjectURL(blob);

    return objectURL;
    
  }


}catch(e){
  if(e instanceof Error) console.log(e.message)
  else console.log(e)
}

return null;

}  


</script>

<template>

    <v-avatar start :size="props.size">
      <v-img :src="fnViewAvatar(props.url)" v-if="props.url"></v-img>
      <v-icon v-if="props.url === null || props.url === ''">mdi-account</v-icon>
    </v-avatar>

</template>          
<style scoped>
</style>
