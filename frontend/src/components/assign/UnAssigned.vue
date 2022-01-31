<template>
  <a-table
    :row-selection="{
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange,
      fixed: true,
      columnWidth: 35
    }"
    :row-key="(record, index) => record.id"
    :loading="loading"
    :columns="columns"
    :data-source="dataTable"
    :scroll="scrollDefault"
    :pagination="pagination"
    class="table-custom"
    size="middle"
    @change="onTableOptionsChanged"
  >
    <div slot="invoices" slot-scope="text, record">
      {{ record.td_invoice_id || 0 }}
      <!--      <div class="tagInvoices">-->
      <!--        <span>{{ record.td_invoice_id || 0 }}</span>-->
      <!--        <img :src="icon_arrow_up" alt="">-->
      <!--      </div>-->
    </div>

    <div slot="supplier" slot-scope="text, record">
      <a-tooltip placement="bottomLeft">
        <template slot="title" v-if="record.supplier_name && record.supplier_name.length > 15">
          <span>{{ $splitString(record.supplier_name, 700) }}</span>
        </template>
        {{ $splitString(record.supplier_name, 15) || '' }}
      </a-tooltip>
    </div>
    <div slot="Qty" slot-scope="text, record">
      {{ record.qty || '' }}
    </div>
    <div slot="zone" slot-scope="text, record">
      {{ record.zones || '' }}
    </div>

    <div slot="deliveryDate" slot-scope="text, record">
      {{ getTimeStamp(record.delivery_date) || '' }}
    </div>

    <div slot="deliveryWindow" slot-scope="text, record">
      {{ record.delivery_window || '' }}
    </div>

    <div slot="vehicleType" slot-scope="text, record">
      {{ record.vehicle_requirement || '' }}
    </div>
    <div slot="packingAllocation" slot-scope="text, record, index">
      <template v-if="checkAllocation(record, 3)"> Not selected </template>
      <template v-else> N/A </template>
    </div>
    <div slot="deliveryAllocation" slot-scope="text, record">
      <template v-if="checkAllocation(record, 4)"> Not selected </template>
      <template v-else> N/A </template>
    </div>
    <div slot="collectionAllocation" slot-scope="text, record">
      <template v-if="checkAllocation(record, 1)"> Not selected </template>
      <template v-else> N/A </template>
    </div>
    <div slot="action" class="btn-pointer" slot-scope="record" @click="emitAssign(record)">
      <img :src="icon_assign_3pl" style="margin-right: 10px" alt="" /> Assign 3PL

      <!--      <a-icon type="edit" @click="handleEdit(record)"/>-->
    </div>
  </a-table>
</template>

<script>
import { columns, fieldAssign } from '../../constants/assign/index';
import { changeTimeStamp, changeHourStamp } from '../../utils/function';
import moment from 'moment';
import singleSelect from '../jobs/main/singleSelect';
import icon_cube from '../../../src/assets/images/icon/icon_cube.png';
import icon_assign_3pl from '../../../src/assets/images/icon/icon_assign_3pl.png';
import icon_arrow_up from '../../../src/assets/images/icon/icons_arrow-up-right.png';

export default {
  name: 'UnAssigned',
  props: {
    listSelect: {
      type: Array,
      default() {
        return [];
      }
    },
    getDataTable: {
      type: Array,
      default() {
        return [];
      }
    },
    getPagination: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {
    singleSelect
  },
  data() {
    return {
      icon_cube,
      icon_assign_3pl,
      icon_arrow_up,
      columns: [...columns, fieldAssign],
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      scrollDefault: {
        x: 1100,
        y: 500
      },
      getListSelect: [],
      dataTable: [],
      // data : []
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50']
      }
    };
  },
  watch: {
    listSelect: {
      deep: true,
      handler(value) {
        this.getListSelect = value;
      }
    },
    getDataTable: {
      deep: true,
      handler(value) {
        console.log(value);
        this.dataTable = value;
      }
    },
    getPagination: {
      deep: true,
      handler(value) {
        this.pagination = {
          ...this.pagination,
          current: value.current,
          pageSize: value.pageSize,
          total: value.total
        };
      }
    }
  },
  created() {
    if (this.listSelect) this.getListSelect = this.listSelect;
    if (this.getDataTable) this.dataTable = this.getDataTable;
    if (this.getPagination)
      this.pagination = {
        ...this.pagination,
        ...this.getPagination
      };
  },
  computed: {},
  methods: {
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      let arr = this.dataTable.filter((item) => {
        if (selectedRowKeys.includes(item.id)) return item;
      });
      this.$emit('onSelectChange', arr);
    },
    getTimeStamp(time) {
      return changeTimeStamp(time);
    },
    getHourStamp(date) {
      return changeHourStamp(date);
    },
    handleSetDataTable(data) {
      let arr = [...data];
      this.dataTable = arr;
      console.log('this.dataTable', this.dataTable);
    },
    handleSetDataSelectedRowKey(data) {
      let arr = [...data];
      this.selectedRowKeys = arr;
      console.log('this.selectedRowKeys', this.selectedRowKeys);
    },
    checkAllocation(item, type) {
      let check = false;
      item.TlServices.map((item2) => {
        if (item2.tl_service_type_id === type) {
          check = true;
          return;
        }
      });
      return check;
    },
    emitAssign(item) {
      this.$emit('emitAssign', item);
    },
    onTableOptionsChanged(pagination) {
      this.$emit('onTableOptionsChanged', pagination);
    }
  }
};
</script>

<style scoped></style>
