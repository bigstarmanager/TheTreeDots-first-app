<template>
  <div>
    <modalCommon v-model="isOpen" :modalTitle="'test'">
      <template #content>
        <div>fsdaklfjlas</div>
      </template>
    </modalCommon>
  </div>
</template>

<script>
export default {
  components: {
    datePicker: () => import('src/components/jobs/main/datePicker.vue')
  },
  data() {
    return {
      isOpen: true,
      options: [
        { value: 1, label: 'Google' },
        { value: 2, label: 'Facebook' },
        { value: 3, label: 'Twitter' },
        { value: 4, label: 'Apple' }
        // 'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ]
    };
  }
};
</script>

<style></style>
