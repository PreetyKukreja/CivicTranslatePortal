<template>
  <tbody>
    <tr v-for="n in rows" :key="n" class="skel-row">
      <td><div class="skel-line" style="width: 60px" /></td>
      <td>
        <div class="skel-cell">
          <div class="skel-line" style="width: 220px" />
          <div class="skel-line" style="width: 140px; height: 10px" />
        </div>
      </td>
      <td><div class="skel-line" style="width: 70px; height: 22px; border-radius: 20px" /></td>
      <td><div class="skel-line" style="width: 55px; height: 22px; border-radius: 20px" /></td>
      <td><div class="skel-line" style="width: 80px" /></td>
      <td><div class="skel-line" style="width: 90px" /></td>
      <td><div class="skel-line" style="width: 50px; margin-left: auto" /></td>
    </tr>
  </tbody>
</template>

<script setup>
defineProps({
  rows: {
    type: Number,
    default: 5
  }
})
</script>

<style scoped>
.skel-row td { padding: 14px 16px; }
.skel-cell { display: flex; flex-direction: column; gap: 6px; }
.skel-line {
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 600px 100%;
  animation: shimmer 1.5s infinite linear;
}
@keyframes shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
}
</style>
