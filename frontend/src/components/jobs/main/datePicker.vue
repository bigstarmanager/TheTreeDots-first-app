<template>
  <div style="border: 1px #d4d4d4 solid; padding: 0 0.5rem">
    <q-input borderless v-model="displayDate" dense readonly>
      <template v-slot:before>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale" :breakpoint="1024">
            <q-date v-model="date" landscape range mask="DD/MM/YYYY" @input="updateValue" />
          </q-popup-proxy>
        </q-icon>
      </template>
      <template v-slot:after v-if="displayDate">
        <q-icon name="clear" class="cursor-pointer" @click="clearValue" />
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: {},
      displayDate: ''
    };
  },
  methods: {
    updateValue(val) {
      if (typeof val === 'string') {
        this.displayDate = val + ' - ' + val;
        let startDate = val.split('/');
        let endDate = val.split('/');
        let getTimeStartDate = new Date(Date.UTC(startDate[2], startDate[1] - 1, startDate[0]))
          .setHours(0, 0, 0, 0)
          .toString();
        let getTimeEndDate = new Date(Date.UTC(endDate[2], endDate[1] - 1, endDate[0]))
          .setUTCHours(23, 59, 59, 999)
          .toString();

        this.$emit('updateData', getTimeStartDate, getTimeEndDate);
        return;
      }

      if (val) {
        this.displayDate = val.from + ' - ' + val.to;
        let startDate = val.from.split('/');
        let endDate = val.to.split('/');
        let getTimeStartDate = new Date(Date.UTC(startDate[2], startDate[1] - 1, startDate[0]));
        let getTimeEndDate = new Date(Date.UTC(endDate[2], endDate[1] - 1, endDate[0]));
        startDate = getTimeStartDate.getTime().toString();
        endDate = getTimeEndDate.getTime().toString();

        this.$emit('updateData', startDate, endDate);
      }
    },
    clearValue() {
      if (this.displayDate) {
        this.displayDate = '';
        this.date = {};
        this.$emit('updateData', '', '');
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
