<template>
  <div>
    <a-row>
      <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 0 }">
        <a-input-search
          placeholder="input search text"
          enter-button
          @search="onSearch"
          :size="SITE_CONFIG.SIZE_ELEMENT"
        />
      </a-col>
      <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 0 }">
        <div class="btn-create">
          <a-button type="primary" :size="SITE_CONFIG.SIZE_ELEMENT" icon="plus" @click="handleCreate">
            Create Batch Job
          </a-button>
        </div>
      </a-col>
    </a-row>
    <br />
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="Unassigned">
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane key="1" tab="Collection" />
          <a-tab-pane key="2" tab="Storgrate" />
          <a-tab-pane key="3" tab="Paking" />
          <a-tab-pane key="4" tab="Delivery" />
        </a-tabs>
        <a-table
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :columns="columns"
          :data-source="data"
        >
          <a slot="id" slot-scope="id" @click="goto(id)"> #{{ id }} </a>
          <div slot="action">
            <a-icon type="close" />
          </div>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Assigned">
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane key="1" tab="Collection" />
          <a-tab-pane key="2" tab="Storgrate" />
          <a-tab-pane key="3" tab="Paking" />
          <a-tab-pane key="4" tab="Delivery" />
        </a-tabs>
        <a-table
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :columns="[...columns, fieldAssign]"
          :data-source="data"
        >
          <a slot="id" slot-scope="id" @click="goto(id)"> #{{ id }} </a>
          <div slot="action">
            <a-icon type="close" />
          </div>
        </a-table>
      </a-tab-pane>
    </a-tabs>

    <modal-create-batch-job :show.sync="isSHowModalCreateBatchJob" />
  </div>
</template>

<script>
import { SITE_CONFIG } from '../../../config/site.config';
import ModalCreateBatchJob from '../../../components/jobs/main/modalCreateBatchJob';
import { queryAllJobs } from '../../../api/management/jobsManagement';
import { _ } from '../../../utils/function';

const columns = [
  {
    title: 'Job ID',
    key: 'id',
    dataIndex: 'id',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: 'Supplier',
    key: 'supplier',
    dataIndex: 'supplier'
  },
  {
    title: '# Order',
    key: 'order',
    dataIndex: 'order'
  },
  {
    title: '# Invoice',
    key: 'invoice',
    dataIndex: 'invoice'
  },
  {
    title: 'Delivery Date',
    key: 'deliveryDate',
    dataIndex: 'deliveryDate'
  },
  {
    title: '',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
];
const fieldAssign = {
  title: 'Assign',
  key: 'assign',
  dataIndex: 'assign'
};

const data = [];
for (let i = 1; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
    id: i,
    supplier: `Supplier ${i}`,
    order: 1000 + i,
    invoice: 1011 + i,
    deliveryDate: '29 Jul 2021'
  });
}

export default {
  name: 'index',
  components: { ModalCreateBatchJob },
  data() {
    return {
      SITE_CONFIG,
      // data,
      columns,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      isSHowModalCreateBatchJob: false,
      fieldAssign
    };
  },
  created() {
    this.initData();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
    data() {
      const _allJobsStore = this.$store.state.jobsManagement.data;
      const data = _allJobsStore.map((x, index) => {
        return {
          key: _.get(x, 'id', index),
          id: _.get(x, 'id', 'No information'),
          supplier: `Supplier ${index}`,
          order: _.get(x, 'td_order_id', 'No information'),
          invoice: _.get(x, 'td_invoice_id', 'No information'),
          deliveryDate: _.get(x, 'delivery_date', 'No information')
        };
      });
      return data;
    }
  },
  methods: {
    initData() {
      this.$apollo
        .query({
          query: queryAllJobs,
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          this.$store.dispatch('setAllJobsManagement', _.get(res, 'data.allJobs', []));
        })
        .catch((error) => {
          console.log('error ::: ', error);
        });
    },
    callback(key) {
      console.log(key);
    },
    start() {
      this.loading = true;
      // ajax request after empty completing
      setTimeout(() => {
        this.loading = false;
        this.selectedRowKeys = [];
      }, 1000);
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    onSearch() {},
    handleCreate() {
      this.isSHowModalCreateBatchJob = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-create {
  text-align: right;
}

.ml-2 {
  margin-left: 8px;
}
</style>
