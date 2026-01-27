<template>
  <v-navigation-drawer permanent width="300">
    <v-list-item-title class="text-h6 px-4 pt-4">Components</v-list-item-title>
    <v-treeview
      :items="tree"
      item-key="id"
      open-all
      selectable
      activatable
      multiple-active
      :selected.sync="selected"
      :open.sync="open"
    >
      <template #prepend="{ item, open }">
        <v-icon v-if="item.children">{{
          open ? "mdi-folder-open" : "mdi-folder"
        }}</v-icon>
        <v-icon v-else>mdi-checkbox-blank-outline</v-icon>
      </template>
    </v-treeview>
  </v-navigation-drawer>
</template>

<style scoped>
  .v-navigation-drawer {
    background-color: #f9f9f9;
  }
</style>
