<template>
  <div class="storeDeploy-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="调拨单号">
              <el-input v-model="queryParams.storeDeployCode" clearable="" placeholder="请输入调拨单号" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="调拨日期">
              <el-date-picker placeholder="请选择调拨日期" value-format="YYYY/MM/DD" type="daterange"
                v-model="queryParams.storeDeployDateRange" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="产品">
              <el-select clearable="" filterable="" v-model="queryParams.produceId" placeholder="请选择产品">
                <el-option v-for="(item, index) in  produceProduceIdDropdownList" :key="index" :value="item.value"
                  :label="item.label" />

              </el-select>

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="调出仓库">
              <el-select clearable="" filterable="" v-model="queryParams.outStoreId" placeholder="请选择调出仓库">
                <el-option v-for="(item, index) in  storeOutStoreIdDropdownList" :key="index" :value="item.value"
                  :label="item.label" />

              </el-select>

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="调入仓库">
              <el-select clearable="" filterable="" v-model="queryParams.inStoreId" placeholder="请选择调入仓库">
                <el-option v-for="(item, index) in  storeInStoreIdDropdownList" :key="index" :value="item.value"
                  :label="item.label" />

              </el-select>

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="margin-right:20px;">
                <el-button icon="ele-Search" @click="handleQuery" v-auth="'storeDeploy:page'"> 查询
                </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>

              </el-button-group>

              <el-button-group>
                <el-button icon="ele-Plus" @click="openAddStoreDeploy" v-auth="'storeDeploy:add'"> 新增
                </el-button>

              </el-button-group>

            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="storeDeployCode" label="调拨单号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="storeDeployDate" label="调拨日期" width="140" show-overflow-tooltip="" />
        <el-table-column prop="storeDeployNumber" label="调拨数量" width="140" show-overflow-tooltip="" />
        <el-table-column prop="produceCode" label="产品编号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="produceName" label="产品名称" width="140" show-overflow-tooltip="" />
        <el-table-column prop="outStoreCode" label="调出仓库编号" width="90" show-overflow-tooltip="" />
        <el-table-column prop="outStoreName" label="调出仓库名称" width="90" show-overflow-tooltip="" />
        <el-table-column prop="outStoreLocation" label="调出仓库库位" width="90" show-overflow-tooltip="" />
        <el-table-column prop="inStoreCode" label="调入仓库编号" width="90" show-overflow-tooltip="" />
        <el-table-column prop="inStoreName" label="调入仓库名称" width="90" show-overflow-tooltip="" />
        <el-table-column prop="inStoreLocation" label="调入仓库库位" width="90" show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
        <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
          v-if="auth('storeDeploy:edit') || auth('storeDeploy:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditStoreDeploy(scope.row)"
              v-auth="'storeDeploy:edit'"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delStoreDeploy(scope.row)"
              v-auth="'storeDeploy:delete'"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editStoreDeployTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="storeDeploy">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
//import { formatDate } from '/@/utils/formatTime';

import editDialog from '/@/views/main/storeDeploy/component/editDialog.vue'
import { pageStoreDeploy, deleteStoreDeploy } from '/@/api/main/storeDeploy';
import { getProduceProduceIdDropdown } from '/@/api/main/storeDeploy';
import { getStoreOutStoreIdDropdown } from '/@/api/main/storeDeploy';
import { getStoreInStoreIdDropdown } from '/@/api/main/storeDeploy';


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
const editStoreDeployTitle = ref("");

// 改变高级查询的控件显示状态
const changeAdvanceQueryUI = () => {
  showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
}


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageStoreDeploy(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddStoreDeploy = () => {
  editStoreDeployTitle.value = '添加库存调拨';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditStoreDeploy = (row: any) => {
  editStoreDeployTitle.value = '编辑库存调拨';
  editDialogRef.value.openDialog(row);
};

// 删除
const delStoreDeploy = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteStoreDeploy(row);
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

const produceProduceIdDropdownList = ref<any>([]);
const getProduceProduceIdDropdownList = async () => {
  let list = await getProduceProduceIdDropdown();
  produceProduceIdDropdownList.value = list.data.result ?? [];
};
getProduceProduceIdDropdownList();

const storeOutStoreIdDropdownList = ref<any>([]);
const getStoreOutStoreIdDropdownList = async () => {
  let list = await getStoreOutStoreIdDropdown();
  storeOutStoreIdDropdownList.value = list.data.result ?? [];
};
getStoreOutStoreIdDropdownList();

const storeInStoreIdDropdownList = ref<any>([]);
const getStoreInStoreIdDropdownList = async () => {
  let list = await getStoreInStoreIdDropdown();
  storeInStoreIdDropdownList.value = list.data.result ?? [];
};
getStoreInStoreIdDropdownList();

handleQuery();
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}
</style>
