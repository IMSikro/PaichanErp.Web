<template>
  <div class="supplier-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="供应商编号">
              <el-input v-model="queryParams.supplierCode" clearable="" placeholder="请输入供应商编号" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="供应商名称">
              <el-input v-model="queryParams.supplierName" clearable="" placeholder="请输入供应商名称" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="姓名">
              <el-input v-model="queryParams.surname" clearable="" placeholder="请输入姓名" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="手机号">
              <el-input v-model="queryParams.mobile" clearable="" placeholder="请输入手机号" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="margin-right:20px;">
                <el-button icon="ele-Search" @click="handleQuery" v-auth="'supplier:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>

              </el-button-group>

              <el-button-group>
                <el-button icon="ele-Plus" @click="openAddSupplier" v-auth="'supplier:add'"> 新增 </el-button>

              </el-button-group>

            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="supplierCode" label="供应商编号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="supplierName" label="供应商名称" width="140" show-overflow-tooltip="" />
        <el-table-column prop="province" label="省份" width="140" show-overflow-tooltip="" />
        <el-table-column prop="city" label="城市" width="140" show-overflow-tooltip="" />
        <el-table-column prop="area" label="区县" width="140" show-overflow-tooltip="" />
        <el-table-column prop="address" label="详细地址" width="140" show-overflow-tooltip="" />
        <el-table-column prop="surname" label="姓名" width="140" show-overflow-tooltip="" />
        <el-table-column prop="supplierPos" label="职位" width="140" show-overflow-tooltip="" />
        <el-table-column prop="telPhone" label="固定电话" width="140" show-overflow-tooltip="" />
        <el-table-column prop="mobile" label="手机号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="email" label="邮箱" width="140" show-overflow-tooltip="" />
        <el-table-column prop="accountName" label="开户名称" width="140" show-overflow-tooltip="" />
        <el-table-column prop="accountBank" label="开户银行" width="140" show-overflow-tooltip="" />
        <el-table-column prop="bankNumber" label="银行账号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="invoiceHeader" label="发票抬头" width="140" show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
        <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
          v-if="auth('supplier:edit') || auth('supplier:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditSupplier(scope.row)"
              v-auth="'supplier:edit'"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delSupplier(scope.row)"
              v-auth="'supplier:delete'"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editSupplierTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="supplier">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
//import { formatDate } from '/@/utils/formatTime';

import editDialog from '/@/views/main/supplier/component/editDialog.vue'
import { pageSupplier, deleteSupplier } from '/@/api/main/supplier';


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
const editSupplierTitle = ref("");

// 改变高级查询的控件显示状态
const changeAdvanceQueryUI = () => {
  showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
}


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageSupplier(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddSupplier = () => {
  editSupplierTitle.value = '添加供应商';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditSupplier = (row: any) => {
  editSupplierTitle.value = '编辑供应商';
  editDialogRef.value.openDialog(row);
};

// 删除
const delSupplier = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteSupplier(row);
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

handleQuery();
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}
</style>
