<template>
  <div class="content">
    <div class="content-title">
      <div class="row">
        <div class="col-xs-6 col-lg-6">
          <p>Driver</p>
        </div>

        <div class="col-xs-6 col-lg-6">
          <p>Points</p>
        </div>
      </div>
    </div>
    <div class="content-table">
      <template v-for="item in listDriveAssign">
        <!--        <div>{{item}}</div>-->

        <div class="row" :key="item.driverUserId" style="margin-bottom: 10px">
          <div class="col-xs-6 col-lg-6">
            <div class="content-table-text-name">
              <span>{{ item.driverName ? item.driverName : '' }}</span>
            </div>
          </div>

          <div class="col-xs-6 col-lg-6">
            <div class="content-table-text-points">
              <span> {{ item.total ? item.total : '' }} Points</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'listDriveGMap',
  data() {
    return {
      modalArray: [{ label: 'Select Driver', value: '' }]
    };
  },
  components: {},
  props: {
    arrayProps: {
      type: Array,
      default() {
        return [];
      }
    },
    getListZone: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    listDriveAssign: {
      get() {
        let arr = [];
        if (this.getListZone) {
          arr = [];
          this.getListZone.map((item) => {
            let obj = {};
            item.totalItem.map((job) => {
              if (job.driverUserId && job.driverUserId.value in obj) {
                obj[job.driverUserId.value].total = obj[job.driverUserId.value].total + 1;
              } else {
                obj[job.driverUserId.value] = {
                  driverUserId: job.driverUserId.value,
                  driverName: this.checkDriveName(job.driverUserId.value) || '',
                  total: 1
                };
              }
            });
            arr.push({ ...obj });
          });
        }
        return this.renderListDriver(arr);
      },
      set(val) {
        return val;
      }
    }
  },
  watch: {},

  created() {},
  methods: {
    checkDriveName(id) {
      return this.arrayProps.find((item) => item.value === id)?.label || '';
    },
    // {
    //   3:1,
    //
    // }
    // [
    //   {
    //     3: {
    //       total: 1
    //     },
    //     12: {total: 1}
    //   },

    //   {
    //     3: {total: 1},
    //     12: {total: 1}
    //   },
    //  ]
    renderListDriver(arrayValue) {
      const result = {};
      arrayValue.forEach((item) => {
        Object.keys(item).forEach((k) => {
          if (!result[k]) {
            result[k] = item[k];
          } else {
            result[k].total += item[k].total;
          }
        });
      });
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  margin-top: 60px;
  margin-left: 20px;
  padding: 1rem;
  width: 400px;
  max-height: 540px;
  overflow: auto;
  //overflow-x: hidden;

  background: #ffffff;
  /* Color/Grey 80 */
  border: 2px solid #66717c;
  box-sizing: border-box;
  box-shadow: 22.9053px 154.309px 161px rgba(0, 0, 0, 0.21),
    11.5958px 78.1191px 70.1859px rgba(0, 0, 0, 0.14175), 4.58106px 30.8619px 26.1625px rgba(0, 0, 0, 0.105),
    1.00211px 6.75103px 9.30781px rgba(0, 0, 0, 0.06825);
  border-radius: 12px;
  &-title {
    margin-top: 10px;
    p {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.32px;
      color: #000000;
    }
  }
  &-table {
    &-text-name {
      span {
        color: #010219;
        font-size: 16px;
        line-height: 20px;
      }
    }
    &-text-points {
      span {
        font-size: 14px;
        line-height: 20px;
        color: #000000;
      }
    }
  }
}
</style>
