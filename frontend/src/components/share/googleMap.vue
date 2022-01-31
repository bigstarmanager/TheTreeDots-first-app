<template>
  <div class="google_maps mb-5 mb-md-10">
    <div id="map" style="width: 100%; height: 100%" />
    <div id="coords"></div>
  </div>
</template>

<script>
// import { map as mapLodash } from 'lodash'
import marker from '../../assets/images/icon/market.svg';
// GeoJSON, describing the locations and names of some cities.
const cities = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-87.65, 41.85] },
      properties: { name: 'Chicago' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-149.9, 61.218] },
      properties: { name: 'Anchorage' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-99.127, 19.427] },
      properties: { name: 'Mexico City' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-0.126, 51.5] },
      properties: { name: 'London' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [28.045, -26.201] },
      properties: { name: 'Johannesburg' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [15.322, -4.325] },
      properties: { name: 'Kinshasa' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [151.207, -33.867] },
      properties: { name: 'Sydney' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [0, 0] },
      properties: { name: '0°N 0°E' }
    }
  ]
};
export default {
  name: 'googleMap',
  props: {
    listAddress: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      iconMarker: marker,
      locations: [],

      //
      cities,
      gallPetersMapType: null
    };
  },
  watch: {
    // listAddress (val) {
    //   if (val) {
    //     this.initGGMap()
    //   }
    // }
  },
  created() {
    // this.getLocation()
  },
  async mounted() {
    try {
      // await this.initGGMap()
      await this.initMap();
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async initGGMap() {
      try {
        const google = await this.$google();
        const map = new google.maps.Map(document.getElementById('map'), {
          zoom: 8
        });
        // const arr = mapLodash(this.listAddress, x => x.address)
        //
        this.listAddress.forEach(({ address, lat, lng, name }, i) => {
          if (i === 0) {
            map.setCenter({ lat, lng });
          }

          // maker + info
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map,
            animation: google.maps.Animation.DROP,
            title: 'Address'
          });

          const infowindow = new google.maps.InfoWindow({
            content: `<div style="color: #000000;"> ${name} </div>`
          });
          marker.addListener('click', () => {
            infowindow.open({
              anchor: marker,
              map,
              shouldFocus: false
            });
          });
        });
      } catch (error) {
        console.error(error);
      }
    },

    //
    async initMap() {
      const google = await this.$google();
      // Create a map. Use the Gall-Peters map type.
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: { lat: 0, lng: 0 },
        mapTypeControl: false
      });

      await this.initGallPeters();
      map.mapTypes.set('gallPeters', this.gallPetersMapType);
      map.setMapTypeId('gallPeters');

      // Show the lat and lng under the mouse cursor.
      const coordsDiv = document.getElementById('coords');

      map.controls[google.maps.ControlPosition.TOP_CENTER].push(coordsDiv);
      map.addListener('mousemove', (event) => {
        coordsDiv.textContent =
          'lat: ' + Math.round(event.latLng.lat()) + ', ' + 'lng: ' + Math.round(event.latLng.lng());
      });
      // Add some markers to the map.
      map.data.setStyle((feature) => {
        return {
          title: feature.getProperty('name'),
          optimized: false
        };
      });
      map.data.addGeoJson(cities);
      const infoWindow = new google.maps.InfoWindow({
        content: '<p>Marker Location:' + marker.getPosition() + '</p>'
      });

      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(map, marker);
      });
    },
    async initGallPeters() {
      const google = await this.$google();
      const GALL_PETERS_RANGE_X = 800;
      const GALL_PETERS_RANGE_Y = 512;

      // Fetch Gall-Peters tiles stored locally on our server.
      this.gallPetersMapType = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
          console.log(coord, zoom);
          const scale = 1 << zoom;
          // Wrap tiles horizontally.
          const x = ((coord.x % scale) + scale) % scale;
          // Don't wrap tiles vertically.
          const y = coord.y;

          // if (y < 0 || y >= scale) return "";
          // return (
          //   "https://developers.google.com/maps/documentation/" +
          //   "javascript/examples/full/images/gall-peters_" +
          //   zoom +
          //   "_" +
          //   x +
          //   "_" +
          //   y +
          //   ".png"
          // );
        },
        tileSize: new google.maps.Size(GALL_PETERS_RANGE_X, GALL_PETERS_RANGE_Y),
        // minZoom: 0,
        // maxZoom: 1,
        name: 'Gall-Peters'
      });
      // Describe the Gall-Peters projection used by these tiles.
      this.gallPetersMapType.projection = {
        fromLatLngToPoint: function (latLng) {
          const latRadians = (latLng.lat() * Math.PI) / 180;
          return new google.maps.Point(
            GALL_PETERS_RANGE_X * (0.5 + latLng.lng() / 360),
            GALL_PETERS_RANGE_Y * (0.5 - 0.5 * Math.sin(latRadians))
          );
        },
        fromPointToLatLng: function (point, noWrap) {
          const x = point.x / GALL_PETERS_RANGE_X;
          const y = Math.max(0, Math.min(1, point.y / GALL_PETERS_RANGE_Y));
          return new google.maps.LatLng((Math.asin(1 - 2 * y) * 180) / Math.PI, -180 + 360 * x, noWrap);
        }
      };
    }
  }
};
</script>

<style scoped lang="scss">
.google_maps {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  @media (max-width: 480px) {
    height: 285px;
  }
}
</style>
