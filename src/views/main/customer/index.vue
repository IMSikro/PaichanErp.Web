<template>
  <div class="customer-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <!-- <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="关键字">
              <el-input v-model="queryParams.searchKey" clearable="" placeholder="请输入模糊查询关键字"/>
              
            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="客户编号">
              <el-input v-model="queryParams.customerCode" clearable="" placeholder="请输入客户编号" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="客户名称">
              <el-input v-model="queryParams.customerName" clearable="" placeholder="请输入客户名称" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="姓名">
              <el-input v-model="queryParams.surname" clearable="" placeholder="请输入姓名" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="margin-right:20px;">
                <el-button icon="ele-Search" @click="handleQuery" v-auth="'customer:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>

              </el-button-group>

              <el-button-group>
                <el-button icon="ele-Plus" @click="openAddCustomer" v-auth="'customer:add'"> 新增 </el-button>
                <!-- <el-button icon="ele-Plus" @click="openImportDevice" v-auth="'customer:import'"> 导入</el-button> -->

              </el-button-group>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="customerCode" label="客户编号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="customerName" label="客户名称" width="140" show-overflow-tooltip="" />
        <el-table-column prop="contractStartDate" label="签约开始日期" width="90" show-overflow-tooltip="" />
        <el-table-column prop="contractEndDate" label="签约结束日期" width="90" show-overflow-tooltip="" />
        <el-table-column prop="province" label="省份" width="140" show-overflow-tooltip="" />
        <el-table-column prop="city" label="城市" width="140" show-overflow-tooltip="" />
        <el-table-column prop="area" label="区县" width="140" show-overflow-tooltip="" />
        <el-table-column prop="address" label="详细地址" width="140" show-overflow-tooltip="" />
        <el-table-column prop="surname" label="姓名" width="140" show-overflow-tooltip="" />
        <el-table-column prop="customerPos" label="职位" width="140" show-overflow-tooltip="" />
        <el-table-column prop="telPhone" label="固定电话" width="140" show-overflow-tooltip="" />
        <el-table-column prop="mobile" label="手机号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="email" label="邮箱" width="140" show-overflow-tooltip="" />
        <el-table-column prop="qQ" label="QQ" width="140" show-overflow-tooltip="" />
        <el-table-column prop="accountName" label="开户名称" width="140" show-overflow-tooltip="" />
        <el-table-column prop="accountBank" label="开户银行" width="140" show-overflow-tooltip="" />
        <el-table-column prop="bankNumber" label="银行账号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="invoiceHeader" label="发票抬头" width="140" show-overflow-tooltip="" />
        <el-table-column prop="taxpayerIdentification" label="纳税人识别码" width="90" show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
        <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
          v-if="auth('customer:edit') || auth('customer:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditCustomer(scope.row)"
              v-auth="'customer:edit'"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delCustomer(scope.row)"
              v-auth="'customer:delete'"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editCustomerTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="customer">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
//import { formatDate } from '/@/utils/formatTime';

import editDialog from '/@/views/main/customer/component/editDialog.vue'
import { pageCustomer, deleteCustomer } from '/@/api/main/customer';


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
const editCustomerTitle = ref("");

// 改变高级查询的控件显示状态
const changeAdvanceQueryUI = () => {
  showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
}


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageCustomer(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddCustomer = () => {
  editCustomerTitle.value = '添加客户';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditCustomer = (row: any) => {
  editCustomerTitle.value = '编辑客户';
  editDialogRef.value.openDialog(row);
};

// 删除
const delCustomer = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteCustomer(row);
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
