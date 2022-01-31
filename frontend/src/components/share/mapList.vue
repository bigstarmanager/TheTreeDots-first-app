<template>
  <div class="content">
    <div class="content-search">
      <div style="width: 100%">
        <!-- <inputSearch placeholder="Search zone..." style="width: 360px" v-model="searchZone" /> -->
        <inputSearch
          class-header="custom-search-map"
          placeholder="Search zone..."
          @outputSearch="handleSearchZone"
          debounce="0"
        />
      </div>
    </div>

    <div class="content-title">
      <div class="row">
        <div class="col-xs-6 col-lg-6">
          <p>Zones</p>
        </div>

        <div class="col-xs-6 col-lg-6">
          <p>Driver</p>
        </div>
      </div>
    </div>

    <div class="content-table">
      <template v-for="item of listZone">
        <div class="row" :key="item.id">
          <div class="col-xs-6 col-lg-6">
            <focus-div :title-props="`${item.name}: ${item.totalItem.length} points`" />
          </div>

          <div class="col-xs-6 col-lg-6" style="margin-bottom: 10px">
            <selectSearch
              outlined
              :key="item.driverUserId.value"
              :keyName="`${item.id}`"
              :data-props="arrayProps"
              :defaultValue="item.driverUserId || defaultSelect"
              @updateData="selectZone"
              :width="'width: 180px'"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import selectSearch from '../jobs/main/selectSearch.vue';
import focusDiv from '../jobs/main/focusDiv.vue';
import inputSearch from 'src/components/share/Search.vue';

export default {
  name: 'mapList',
  data() {
    return {
      modalArray: [{ label: 'Select Driver', value: '' }],
      searchZone: '',
      dataMaplist: null,
      defaultSelect: { value: '', label: 'All Driver' }
    };
  },
  components: {
    selectSearch,
    focusDiv,
    inputSearch
  },
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
    // listZone() {
    //   let arr = []
    //   if (this.getListZone) {
    //     this.getListZone.map((item) => {
    //       arr.push({...item})
    //     })
    //     if (this.searchZone) {
    //       arr = arr.filter((item) => {
    //         if (item.name.toString()
    //           .toLowerCase()
    //           .includes(this.searchZone.toLowerCase())) {
    //           return item
    //         }
    //       });
    //     }
    //   }
    //   console.log(arr)
    //   return arr
    // },
    listZone: {
      get() {
        let arr = [];
        if (this.getListZone) {
          arr = [];
          this.getListZone.map((item) => {
            arr.push({ ...item });
          });
        }
        if (this.dataMaplist) {
          arr = [];
          this.dataMaplist.map((item) => {
            arr.push({ ...item });
          });
        }
        if (this.searchZone) {
          arr = arr.filter((item) => {
            if (item.name.toString().toLowerCase().includes(this.searchZone.toLowerCase())) {
              return item;
            }
          });
        }
        console.log(arr);
        return arr;
        // return this.defaultValue;
      },
      set(val) {
        this.dataMaplist = val;
        return val;
      }
    }
  },
  watch: {},

  created() {},
  methods: {
    selectZone(value, key) {
      let arr = [];
      this.listZone.map((item) => {
        let obj = { ...item };
        if (obj.id === Number(key)) {
          obj.driverUserId = value;
          obj.totalItem.forEach((item2) => (item2.driverUserId = value));
        }
        arr.push(obj);
      });
      this.listZone = arr;
      this.$emit('updateListPath', arr);
    },
    handleSearchZone(value) {
      this.searchZone = value;
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
}

.q-menu.q-position-engine.scroll.q-menu--square.popupStyle {
  width: auto;
}
.custom-search-map {
  padding: 0 !important;
  .q-field__control.relative-position.row.no-wrap.text-teal {
    height: 40px;
  }
}
</style>
