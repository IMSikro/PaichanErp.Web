<template>
  <div class="sysWechatPay-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="支付订单号">
              <el-input v-model="queryParams.transactionId" clearable="" placeholder="请输入支付订单号" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="交易类型">
              <el-input v-model="queryParams.tradeType" clearable="" placeholder="请输入交易类型" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group>
                <el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'sysWechatPay:page'"> 查询
                </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>

              </el-button-group>

            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="transactionId" label="支付订单号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="tradeType" label="交易类型" width="140" show-overflow-tooltip="" />
        <el-table-column prop="tradeState" label="交易状态" width="140" show-overflow-tooltip="" />
        <el-table-column prop="tradeStateDescription" label="交易状态描述" width="90" show-overflow-tooltip="" />
        <el-table-column prop="bankType" label="付款银行类型" width="90" show-overflow-tooltip="" />
        <el-table-column prop="total" label="订单总金额" width="140" show-overflow-tooltip="" />
        <el-table-column prop="payerTotal" label="用户支付金额" width="90" show-overflow-tooltip="" />
        <el-table-column prop="successTime" label="支付完成时间" width="90" show-overflow-tooltip="" />
        <el-table-column prop="expireTime" label="交易结束时间" width="90" show-overflow-tooltip="" />
        <el-table-column prop="description" label="商品描述" width="140" show-overflow-tooltip="" />
        <el-table-column prop="settlement" label="结算信息" width="140" show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
          v-if="auth('sysWechatPay:edit') || auth('sysWechatPay:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" v-if="scope.row.tradeState != ''"
              @click="openEditSysWechatPay(scope.row)" v-auth="'sysWechatPay:edit'"> 继续支付 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editSysWechatPayTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="sysWechatPay">
import { ref, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
//import { formatDate } from '/@/utils/formatTime';
import { useRoute, useRouter } from 'vue-router';

import editDialog from '/@/views/main/sysWechatPay/component/editDialog.vue'
import { pageSysWechatPay, deleteSysWechatPay } from '/@/api/main/sysWechatPay';


import { clearAccessTokens, getAPI } from '/@/utils/axios-utils';
import { SysWechatPayApi } from '/@/api-services/api';
import { SysWechatPay } from '/@/api-services/models';


const router = useRoute();
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
const editSysWechatPayTitle = ref("");

// 页面加载时
onMounted(async () => {
  console.log(router.query.isAutoPay);

});

// 改变高级查询的控件显示状态
const changeAdvanceQueryUI = () => {
  showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
}


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageSysWechatPay(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddSysWechatPay = () => {
  editSysWechatPayTitle.value = '添加充值中心';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditSysWechatPay = (row: any) => {
  editSysWechatPayTitle.value = '编辑充值中心';
  editDialogRef.value.openDialog(row);
};

// 删除
const delSysWechatPay = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteSysWechatPay(row);
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

