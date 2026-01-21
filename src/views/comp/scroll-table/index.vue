<template>
  <div class="chen-scroll-table--wrap">
    <div class="item">
      <div class="title">自动滚动（需要添加v-model 设置默认索引）</div>
      <ScrollTable :autoScroll="true" :data="gridInfo.data" v-model="currentIndex" @current-change="currentChange"
        ref="scrollTableRef">
        <el-table-column v-for="(item, index) in gridInfo.columnKeyList" :key="index" :prop="item.prop" align="center"
          :label="item.label">
        </el-table-column>
      </ScrollTable>
    </div>
    <!--  -->
    <div class="item">
      <div class="title">自动滚动(传入interval 设置滚动间隔)</div>
      <ScrollTable :autoScroll="true" v-model="currentIndex1" :interval="1000" :data="gridInfo.data1"
        @current-change="currentChange" ref="scrollTableRef">
        <el-table-column v-for="(item, index) in gridInfo.columnKeyList" :key="index" :prop="item.prop" align="center"
          :label="item.label">
        </el-table-column>
      </ScrollTable>
    </div>
    <!--  -->
    <div class="item">
      <div class="title">关闭滚动</div>
      <ScrollTable :autoScroll="false" :data="gridInfo.data" @current-change="currentChange" ref="scrollTableRef">
        <el-table-column v-for="(item, index) in gridInfo.columnKeyList" :key="index" :prop="item.prop" align="center"
          :label="item.label">
        </el-table-column>
      </ScrollTable>
    </div>

    <!--  -->
    <div class="item">
      <div class="title">使用el-table功能</div>
      <ScrollTable :data="filterTableData" v-model="currentIndex2" @current-change="currentChange" ref="scrollTableRef">
        <el-table-column label="Date" prop="date" />
        <el-table-column label="Name" prop="name" />
        <el-table-column align="right">
          <template #header>
            <el-input v-model="search" size="small" placeholder="Type to search" />
          </template>
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
              Edit
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </ScrollTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';
// import ScrollTable from './components/scroll-table.vue';
import ScrollTable from '@cjc/scroll-table';


let currentIndex = ref(0);
let currentIndex1 = ref(0);
let currentIndex2 = ref(0);

let tableDatas = [
    { pro: 'SG20220430', pro1: '2022年4月30日', pro2: '11111' },
    { pro: 'SG20220430', pro1: '2022年4月30日', pro2: '22222' },
    { pro: 'SG20220430', pro1: '2022年4月30日', pro2: '33333' },
    { pro: 'SG20220430', pro1: '2022年4月30日', pro2: '44444' },
    { pro: 'SG20220430', pro1: '2022年4月30日', pro2: '55555' },
    { pro: 'SG20220430', pro1: '2022年4月30日', pro2: '66666' },
    { pro: 'SG20220430', pro1: '2022年4月30日', pro2: '77777' },
    { pro: 'SG20220430', pro1: '2022年4月30日', pro2: '88888' },
    { pro: 'SG20220430', pro1: '2022年4月30日', pro2: '999999' },
  ];

let gridInfo = reactive({
  columnKeyList: [
    { prop: 'pro', label: '编号', width: '' },
    { prop: 'pro1', label: '发生时间', width: '' },
    { prop: 'pro2', label: '影响情况', width: '' },
  ],
  data: tableDatas,
  data1: [],
})

setTimeout(() => {
  gridInfo.data1 = tableDatas;
}, 5000);

let currentChange = (row) => {
  // 当前选中的行数据
  // console.log(row)
}


interface User {
  date: string
  name: string
  address: string
}

const search = ref('')
const filterTableData = computed(() =>
  tableData.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
)
const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)
}

const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'John',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Morgan',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

</script>

<style lang="less" scoped>
.chen-scroll-table--wrap {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
}

.item {
  width: 49%;
  height: 49%;
  margin-bottom: 10px;
  margin-right: 10px;

  .title {
    // display: flex;
    // justify-content: center;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}
</style>
