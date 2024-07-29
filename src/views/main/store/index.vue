<template>
  <div class="store-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="关键字">
              <el-input v-model="queryParams.searchKey" clearable="" placeholder="请输入模糊查询关键字" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="仓库编号">
              <el-input v-model="queryParams.storeCode" clearable="" placeholder="请输入仓库编号" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="仓库名称">
              <el-input v-model="queryParams.storeName" clearable="" placeholder="请输入仓库名称" />

            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="库位">
              <el-input v-model="queryParams.storeLocation" clearable="" placeholder="请输入库位" />

            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="margin-right:20px;">
                <el-button icon="ele-Search" @click="handleQuery" v-auth="'store:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>

              </el-button-group>

              <el-button-group>
                <el-button icon="ele-Plus" @click="openAddStore" v-auth="'store:add'"> 新增 </el-button>

              </el-button-group>

            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px" :style="{ 'overflow-y': 'auto' }">
      <el-table :data="tableData" style="width: 100%" :highlight-current-row="true" v-loading="loading"
        tooltip-effect="light" row-key="id" border="" @current-change="handleCurrentRowChange">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="storeCode" label="仓库编号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="storeName" label="仓库名称" width="140" show-overflow-tooltip="" />
        <!-- <el-table-column prop="storeLocation" label="库位" width="140" show-overflow-tooltip="" /> -->
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
        <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
          v-if="auth('store:edit') || auth('store:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditStore(scope.row)"
              v-auth="'store:edit'"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delStore(scope.row)"
              v-auth="'store:delete'"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editStoreTitle" @reloadTable="handleQuery" />
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px" :style="{ 'overflow-y': 'auto' }">
      <el-tabs v-model="activeName">
        <el-tab-pane label="库位列表" name="/store/storeLocation">
          <el-table :data="tableData2" style="width: 100%" v-loading="loading2" tooltip-effect="light" row-key="id"
            border="">
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column prop="storeCode" label="仓库编号" width="140" show-overflow-tooltip="" />
            <el-table-column prop="storeLocationCode" label="库位" width="140" show-overflow-tooltip="" />
            <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-pagination v-model:currentPage="tableParams2.page" v-model:page-size="tableParams2.pageSize"
        :total="tableParams2.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
        @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
        layout="total, sizes, prev, pager, next, jumper" />
    </el-card>
    <editDialog ref="editDialogRef" :title="editStoreTitle" @reloadTable="handleQuery" />
  </div>
</template>

<script lang="ts" setup="" name="store">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
//import { formatDate } from '/@/utils/formatTime';

import editDialog from '/@/views/main/store/component/editDialog.vue'
import { pageStore, deleteStore } from '/@/api/main/store';
import { pageStoreLocation } from "/@/api/main/storeLocation";


const showAdvanceQueryUI = ref(false);
const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});

const loading2 = ref(false);
const tableData2 = ref<any>([]);
const queryParams2 = ref<any>({});
const tableParams2 = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const editStoreTitle = ref("");

const activeName = ref(`/store/storeLocation`);

// 改变高级查询的控件显示状态
const changeAdvanceQueryUI = () => {
  showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
}


// 查询操作
const handleQuery = async () => {
  loading.value = true;

  var res = await pageStore(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;

  tableData2.value = [];
  tableParams2.value.total = 0;

  loading.value = false;
};

// 查询操作
const handleQuery2 = async () => {
  loading2.value = true;
  var res = await pageStoreLocation(Object.assign(queryParams2.value, tableParams2.value));
  tableData2.value = res.data.result?.items ?? [];
  tableParams2.value.total = res.data.result?.total;
  loading2.value = false;
};

// 改变选中行
const handleCurrentRowChange = async (currentRow: any, oldCurrentRow: any) => {
  // console.log(currentRow);
  queryParams2.value = { storeId: currentRow.id };
  handleQuery2();
};

// 打开新增页面
const openAddStore = () => {
  editStoreTitle.value = '添加仓库';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditStore = (row: any) => {
  editStoreTitle.value = '编辑仓库';
  editDialogRef.value.openDialog(row);
};

// 删除
const delStore = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteStore(row);
      handleQuery();
      ElMessage.success("删除成功");
    })
    .catch(() => { });
};

// 改变页面容量
const handleSizeChange = (val: number) => {
  tableParams.value.pageSize = val;
  handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
  tableParams.value.page = val;
  handleQuery();
};

// 改变页面容量
const handleSizeChange2 = (val: number) => {
  tableParams2.value.pageSize = val;
  handleQuery2();
};

// 改变页码序号
const handleCurrentChange2 = (val: number) => {
  tableParams2.value.page = val;
  handleQuery2();
};

handleQuery();
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}
</style>
