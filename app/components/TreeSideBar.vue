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

<script setup>
  const selected = ref([])
  const open = ref([])

  const tree = [
    {
      id: "corners",
      name: "Corners",
      children: [
        { id: "corner1", name: "Corner1" },
        { id: "corner2", name: "Corner2" },
      ],
    },
    {
      id: "lines",
      name: "Lines",
      children: [
        { id: "line1", name: "Line1" },
        { id: "line2", name: "Line2" },
        { id: "line3", name: "Line3" },
      ],
    },
    {
      id: "surfaces",
      name: "Surfaces",
      children: [
        { id: "surface1", name: "Surface1" },
        { id: "surface2", name: "Surface2" },
        { id: "surface3", name: "Surface3" },
      ],
    },
    {
      id: "blocks",
      name: "Blocks",
      children: [
        { id: "block1", name: "Block1" },
        { id: "block2", name: "Block2" },
        { id: "block3", name: "Block3" },
      ],
    },
  ]
</script>

<style scoped>
  .v-navigation-drawer {
    background-color: #f9f9f9;
  }
</style>
