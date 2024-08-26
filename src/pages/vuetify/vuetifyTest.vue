<script setup>
import {ref, shallowRef} from "vue";
import { VTreeview } from 'vuetify/labs/VTreeview'

const tab = ref(null);
const selected = ref([]);
const radios = ref("");
const isSns = ref([]);
const date = shallowRef()
const tree = ref("");
const treeItems = [
  {
    id: 1,
    title: 'Applications :',
    children: [
      { id: 2, title: 'Calendar : app' },
      { id: 3, title: 'Chrome : app' },
      { id: 4, title: 'Webstorm : app' },
    ],
  },
  {
    id: 5,
    title: 'Documents :',
    children: [
      {
        id: 6,
        title: 'vuetify :',
        children: [
          {
            id: 7,
            title: 'src :',
            children: [
              { id: 8, title: 'index : ts' },
              { id: 9, title: 'bootstrap : ts' },
            ],
          },
        ],
      },
      {
        id: 10,
        title: 'material2 :',
        children: [
          {
            id: 11,
            title: 'src :',
            children: [
              { id: 12, title: 'v-btn : ts' },
              { id: 13, title: 'v-card : ts' },
              { id: 14, title: 'v-window : ts' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 15,
    title: 'Downloads :',
    children: [
      { id: 16, title: 'October : pdf' },
      { id: 17, title: 'November : pdf' },
      { id: 18, title: 'Tutorial : html' },
    ],
  },
  {
    id: 19,
    title: 'Videos :',
    children: [
      {
        id: 20,
        title: 'Tutorials :',
        children: [
          { id: 21, title: 'Basic layouts : mp4' },
          { id: 22, title: 'Advanced techniques : mp4' },
          { id: 23, title: 'All about app : dir' },
        ],
      },
      { id: 24, title: 'Intro : mov' },
      { id: 25, title: 'Conference introduction : avi' },
    ],
  },
]

const items = [ {
  name: 'African Elephant',
  species: 'Loxodonta africana',
  diet: 'Herbivore',
  habitat: 'Savanna, Forests',
},]
const value = 70;
</script>

<template>
  <div class="header">
    <div>vuetify Test</div>
    <div><a href="https://vuetifyjs.com/en/components/all/#containment">링크</a></div>
  </div>
  <div class="main">
    <div>
      button :
      <v-btn>
        Button
      </v-btn>
      <v-btn variant="outlined">
        outlined
      </v-btn>
      <v-btn variant="tonal">
        tonal
      </v-btn>
      <v-btn variant="text">
        text
      </v-btn>
      <v-btn variant="plain">
        plain
      </v-btn>
    </div>
  <hr/>
    <div>
      tabs :
      <v-card>
        <v-tabs
            v-model="tab"
            bg-color=""
        >
          <v-tab value="one">Item One</v-tab>
          <v-tab value="two">Item Two</v-tab>
          <v-tab value="three">Item Three</v-tab>
        </v-tabs>

        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="one">
              One
            </v-tabs-window-item>

            <v-tabs-window-item value="two">
              Two
            </v-tabs-window-item>

            <v-tabs-window-item value="three">
              Three
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </div>
  </div>
  <hr/>
  <div>
    <v-container fluid>
      checkBox :
      {{selected}}
      <v-checkbox
          v-model="selected"
          label="John"
          value="John"
      ></v-checkbox>
      <v-checkbox
          v-model="selected"
          label="Jacob"
          value="Jacob"
      ></v-checkbox>
    </v-container>
  </div>
  <hr/>
  <div>
    comboBox :
    <v-combobox
        label="Combobox"
        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
        variant="solo"
    ></v-combobox>
  </div>
  <hr/>
  <div>
    inputBox :
    <v-text-field
        label="inputBox"
        variant="outlined"
        placeholder="aa"
    ></v-text-field>
  </div>
  <div>
    autoComplete :
    <v-autocomplete
        label="Autocomplete"
        :items="['이범수', '이성규', '김신', '아이나직', '박연진']"
    ></v-autocomplete>
  </div>
  <div>
    fileInput :
    <v-file-input label="File input"></v-file-input>
  </div>
  <div>
    radio : {{radios}}
    <v-radio-group v-model="radios">
      <v-radio label="Radio One" value="one"></v-radio>
      <v-radio label="Radio Two" value="two"></v-radio>
      <v-radio label="Radio Three" value="three"></v-radio>
    </v-radio-group>
  </div>
  <div>
    switch : {{isSns}}
    <v-switch label="faceBook" value="FaceBook" v-model="isSns"></v-switch>
    <v-switch label="YouTube" value="YouTube" v-model="isSns"></v-switch>
    <v-switch label="twitterX" value="TwitterX" v-model="isSns"></v-switch>
    <v-switch
        :model-value="false"
        label="off loading"
        loading="warning"
    ></v-switch>
    <v-switch>
        :model-value="true"
        label="on loading"
        loading="warning"
    ></v-switch>
  </div>
  <div>
    textArea :
    <v-textarea
        clear-icon="mdi-close-circle"
        label="Text"
        model-value="This is clearable text."
        clearable
    ></v-textarea>
  </div>
  <div>
    date : {{date}}
    <v-confirm-edit v-model="date">
      <template v-slot:default="{ model: proxyModel, actions }">
        <v-date-picker v-model="proxyModel.value">
          <template v-slot:actions>
            <component :is="actions"></component>
          </template>
        </v-date-picker>
      </template>
    </v-confirm-edit>

  </div>
  <div>
    dataTable :
    <v-data-table
        :items="items"
    ></v-data-table>
  </div>
  <div>
    slide :
    <v-sheet
        class="mx-auto"
        max-width="600"
    >
      <v-slide-group
          show-arrows
      >
        <v-slide-group-item
            v-for="n in 25"
            :key="n"
            v-slot="{ isSelected, toggle }"
        >
          <v-btn
              :color="isSelected ? 'primary' : undefined"
              class="ma-2"
              rounded
              @click="toggle"
          >
            Options {{ n }}
          </v-btn>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </div>
  <div>
    badge :
    <v-list
        class="mx-auto"
        max-width="256"
        border
    >
      <v-list-item
          prepend-icon="mdi-inbox-arrow-down"
          title="Inbox"
          link
      >
        <template v-slot:append>
          <v-badge
              color="error"
              content="6"
              inline
          ></v-badge>
        </template>
      </v-list-item>

      <v-list-item
          prepend-icon="mdi-send"
          title="Sent Mail"
          link
      ></v-list-item>

      <v-list-item
          prepend-icon="mdi-delete"
          title="Trash"
          link
      >
        <template v-slot:append>
          <v-badge
              color="info"
              content="12"
              inline
          ></v-badge>
        </template>
      </v-list-item>

      <v-list-item
          prepend-icon="mdi-alert-circle"
          title="Spam"
          link
      ></v-list-item>
    </v-list>
  </div>
  <div>
    circular :
    <v-progress-circular
        :size="50"
        color="dark-blue"
        indeterminate
    ></v-progress-circular>
    <div class="text-center">
      <v-progress-circular :model-value="value" :rotate="360" :size="100" :width="15" color="teal">
        <template v-slot:default> {{ value }} % </template>
      </v-progress-circular>
    </div>

  </div>
  <div>
    treeView : {{tree}}
      <v-treeview
          v-model:selected="tree"
          :items="treeItems"
          selectable = true
          activatable
          item-value ="title"
          select-strategy ='classic'
      ></v-treeview>
  </div>

</template>

<style scoped>
.header{
  height : 70px;
}
.main{
  margin-top : 30px;
}
</style>