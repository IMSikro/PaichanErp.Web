﻿<template>
  <div class="systemUnit-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="计量单位">
              <el-input v-model="queryParams.unitName" clearable="" placeholder="请输入计量单位" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="margin-right:20px;">
                <el-button icon="ele-Search" @click="handleQuery" v-auth="'systemUnit:page'"> 查询
                </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>
              </el-button-group>

              <el-button-group style="margin-left:20px">
                <el-button icon="ele-Plus" @click="openAddSystemUnit" v-auth="'systemUnit:add'"> 新增
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
        <el-table-column prop="unitName" label="计量单位" width="140" show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
        <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" width="80" align="center" fixed="left" show-overflow-tooltip=""
          v-if="auth('systemUnit:edit') || auth('systemUnit:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditSystemUnit(scope.row)"
              v-auth="'systemUnit:edit'"> </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delSystemUnit(scope.row)"
              v-auth="'systemUnit:delete'"> </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editSystemUnitTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="systemUnit">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
//import { formatDate } from '/@/utils/formatTime';

import editDialog from '/@/views/main/systemUnit/component/editDialog.vue'
import { pageSystemUnit, deleteSystemUnit } from '/@/api/main/systemUnit';


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
const editSystemUnitTitle = ref("");

// 改变高级查询的控件显示状态
const changeAdvanceQueryUI = () => {
  showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
}


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageSystemUnit(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddSystemUnit = () => {
  editSystemUnitTitle.value = '添加计量单位';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditSystemUnit = (row: any) => {
  editSystemUnitTitle.value = '编辑计量单位';
  editDialogRef.value.openDialog(row);
};

// 删除
const delSystemUnit = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteSystemUnit(row);
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
