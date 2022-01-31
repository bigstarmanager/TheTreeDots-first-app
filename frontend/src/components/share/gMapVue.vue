<template>
  <div style="position: relative">
    <gmap-map
      ref="gmap"
      map-type-id="roadmap"
      :center="defaultCenter"
      :zoom="12"
      :style="styleCustom"
      :options="{
        zoomControl: true,
        scaleControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        disableDefaultUi: true,
        draggable: true,
        draggableCursor: true
      }"
    >
      <gmap-polygon
        :paths="polygonPaths"
        :editable="editable"
        @paths_changed="updateEdited($event)"
        @rightclick="handleClickForDelete"
      />
      <gmap-polygon
        :paths="polygonPathsAddNew"
        :editable="true"
        ref="polygon"
        @paths_changed="updateEdited($event)"
        @rightclick="handleClickForDelete"
      />
      <gmap-marker
        v-for="(m, index) in defaultMarket"
        :key="index"
        :position="m.latlngInvoices"
        :clickable="true"
        :draggable="false"
        @click="(e) => handleClickMap(e, m)"
      />
      <!--              @mouseout="statusText = null"
-->
      <!--      <template #visible>-->
      <!--        <div style="top: 0; left: 100px; background-color: #0000FF; color: white; position: absolute; z-index: 100">-->
      <!--          {{statusText}}-->
      <!--        </div>-->
      <!--      </template>-->
    </gmap-map>
    <div class="button-gmap-custom">
      <q-btn
        v-if="(addable && !addPaths) || polygonPaths.length === 0"
        no-wrap
        dense
        no-caps
        padding="0.5rem 1rem"
        color="button-fill-active-map"
        rounded
        style="margin-right: 10px"
        @click="addPath"
        text-color="button-fill-active-map"
      >
        <span>+ Polygon</span>
      </q-btn>
      <q-btn
        v-if="addClear && polygonPathsAddNew.length > 0"
        no-wrap
        dense
        no-caps
        padding="0.5rem 1rem"
        color="button-fill-active-map"
        rounded
        style="margin-right: 10px"
        @click="removePath"
        text-color="button-fill-active-map"
      >
        <span> Clear</span>
      </q-btn>
      <q-btn
        v-if="addDelete && polygonPaths.length > 0"
        no-wrap
        dense
        no-caps
        padding="0.5rem 1rem"
        color="negative"
        rounded
        style="margin-right: 10px"
        @click="deleteZone"
      >
        <span> Delete</span>
      </q-btn>
    </div>
  </div>
</template>

<script>
// const pointInPolygon = require('point-in-polygon');
import { gmapApi } from 'gmap-vue';

export default {
  name: 'gMapVue',
  props: {
    defaultMarket: {
      type: Array,
      default() {
        return [];
      }
    },
    defaultPaths: {
      type: Array,
      default() {
        return [];
      }
    },
    defaultCenter: {
      type: Object,
      default() {
        return { lat: 1.355257, lng: 103.86788 };
      }
    },
    styleCustom: {
      type: String,
      default: 'min-width: 500px; min-height:670px;'
    },
    editable: {
      type: Boolean,
      default: false
    },
    addable: {
      type: Boolean,
      default: false
    },
    addClear: {
      type: Boolean,
      default: false
    },
    addDelete: {
      type: Boolean,
      default: false
    }
  },
  components: {
    gmapApi
  },
  data() {
    return {
      paths: [],
      pathsNew: [],
      mvcPaths: null,
      addPaths: false,
      statusText: ''
      // markers: [
      //   {lat: 1.455257, lng: 103.96788},
      //   {lat: 1.355257, lng: 103.86788},
      //   // { lat: 1.555257, lng: 103.86788 },
      //   // { lat: 1.655257, lng: 103.76788 },
      // ],
      // center: {lat: 1.355257, lng: 103.86788},
      // polygon: [[1, 1], [1, 2], [2, 2], [2, 1]],
    };
  },
  computed: {
    google: gmapApi,
    polygonPaths() {
      return this.paths;
    },
    polygonPathsAddNew() {
      if (!this.mvcPaths) return this.pathsNew;
      let paths = [];

      for (let i = 0; i < this.mvcPaths.getLength(); i++) {
        let path = [];
        for (let j = 0; j < this.mvcPaths.getAt(i).getLength(); j++) {
          let point = this.mvcPaths.getAt(i).getAt(j);
          path.push({ lat: point.lat(), lng: point.lng() });
        }
        paths.push(path);
      }
      this.$emit('changePaths', paths);
      return paths;
    }
  },
  watch: {
    defaultPaths: {
      deep: true,
      handler() {
        // this.paths = val
        this.calculatorPaths();
      }
    }
  },
  created() {
    if (this.defaultPaths) this.calculatorPaths();
  },
  async mounted() {
    await this.$gmapApiPromiseLazy();
  },
  methods: {
    handleClickMap(market, value) {
      this.$emit('handleClickMap', value);
    },
    updateEdited: function (mvcPaths) {
      this.mvcPaths = mvcPaths;
    },
    handleClickForDelete($event, ref, index) {
      if ($event.vertex) {
        this.$refs.polygon.$polygonObject.getPaths().getAt($event.path).removeAt($event.vertex);
      }
    },
    calculatorPaths() {
      let arr = [];
      this.defaultPaths.map((item) => {
        arr.push(item.paths);
      });
      this.paths = [...arr];
    },

    //   add paths
    addPath() {
      // obtain the bounds, so we can guess how big the polygon should be
      let bounds = this.$refs.gmap.$mapObject.getBounds();
      let northEast = bounds.getNorthEast();
      let southWest = bounds.getSouthWest();
      let center = bounds.getCenter();
      let degree = this.pathsNew.length + 1;
      let f = Math.pow(0.66, degree);

      // Draw a triangle. Use f to control the size of the triangle.
      // i.e., every time we add a path, we reduce the size of the triangle
      let path = [
        { lng: center.lng(), lat: (1 - f) * center.lat() + f * northEast.lat() },
        {
          lng: (1 - f) * center.lng() + f * southWest.lng(),
          lat: (1 - f) * center.lat() + f * southWest.lat()
        },
        {
          lng: (1 - f) * center.lng() + f * northEast.lng(),
          lat: (1 - f) * center.lat() + f * southWest.lat()
        }
      ];
      this.addPaths = true;
      this.pathsNew.push(path);
      this.$emit('changePaths', this.pathsNew);
    },
    removePath() {
      this.pathsNew.splice(0, 1);
      this.mvcPaths = null;
      this.addPaths = false;
      this.$emit('changePaths', this.pathsNew);
    },
    deleteZone() {
      this.$emit('deleteZone');
    }
    //   hover
    //   hoverMarket(index) {
    //     this.statusText = 'ádasdasjkdjkasjkdjkh'
    //     console.log(`gmimap${index}`)
    //     console.log(document.getElementById(`gmimap${index}`))
    //   },
    //   outHoverMarket() {
    //     // this.statusText = null
    //   }
  }
};
</script>

<style lang="scss" scoped>
.button-gmap-custom {
  position: absolute;
  top: 16px;
  right: 22px;
  z-index: 2;
}
</style>
