<template>
  <div class="material-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="物料类型">
              <el-select clearable="" filterable="" v-model="queryParams.materialTypeId" placeholder="请选择物料类型">
                <el-option v-for="(item, index) in  materialTypeMaterialTypeIdDropdownList" :key="index"
                  :value="item.value" :label="item.label" />

              </el-select>

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="物料编号">
              <el-input v-model="queryParams.materialCode" clearable="" placeholder="请输入物料编号" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="物料名称">
              <el-input v-model="queryParams.materialName" clearable="" placeholder="请输入物料名称" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="供应商">
              <el-select clearable="" filterable="" v-model="queryParams.supplierId" placeholder="请选择供应商">
                <el-option v-for="(item, index) in  supplierSupplierIdDropdownList" :key="index" :value="item.value"
                  :label="item.label" />

              </el-select>

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="margin-right:20px;">
                <el-button icon="ele-Search" @click="handleQuery" v-auth="'material:page'"> 查询
                </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>

              </el-button-group>

              <el-button-group>
                <el-button icon="ele-Plus" @click="openAddMaterial" v-auth="'material:add'"> 新增
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
        <el-table-column prop="materialTypeId" label="物料类型" width="120" show-overflow-tooltip="">
          <template #default="scope">
            <span>{{ scope.row.materialTypeIdMaterialTypeName }}</span>

          </template>

        </el-table-column>
        <el-table-column prop="materialCode" label="物料编号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="materialName" label="物料名称" width="140" show-overflow-tooltip="" />
        <el-table-column prop="materialNorm" label="物料规格" width="140" show-overflow-tooltip="" />
        <el-table-column prop="costPrice" label="采购单价" width="140" show-overflow-tooltip="" />
        <el-table-column prop="dutyRate" label="税率(%)" width="140" show-overflow-tooltip="" />
        <el-table-column prop="supplierId" label="供应商" width="120" show-overflow-tooltip="">
          <template #default="scope">
            <span>{{ scope.row.supplierIdSupplierName }}</span>

          </template>

        </el-table-column>
        <el-table-column prop="safetyStock" label="安全库存" width="140" show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
        <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
          v-if="auth('material:edit') || auth('material:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditMaterial(scope.row)"
              v-auth="'material:edit'"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delMaterial(scope.row)"
              v-auth="'material:delete'"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editMaterialTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="material">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
//import { formatDate } from '/@/utils/formatTime';

import editDialog from '/@/views/main/material/component/editDialog.vue'
import { pageMaterial, deleteMaterial } from '/@/api/main/material';
import { getMaterialTypeMaterialTypeIdDropdown } from '/@/api/main/material';
import { getSupplierSupplierIdDropdown } from '/@/api/main/material';


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
const editMaterialTitle = ref("");

// 改变高级查询的控件显示状态
const changeAdvanceQueryUI = () => {
  showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
}


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageMaterial(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddMaterial = () => {
  editMaterialTitle.value = '添加物料';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditMaterial = (row: any) => {
  editMaterialTitle.value = '编辑物料';
  editDialogRef.value.openDialog(row);
};

// 删除
const delMaterial = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteMaterial(row);
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

const materialTypeMaterialTypeIdDropdownList = ref<any>([]);
const getMaterialTypeMaterialTypeIdDropdownList = async () => {
  let list = await getMaterialTypeMaterialTypeIdDropdown();
  materialTypeMaterialTypeIdDropdownList.value = list.data.result ?? [];
};
getMaterialTypeMaterialTypeIdDropdownList();

const supplierSupplierIdDropdownList = ref<any>([]);
const getSupplierSupplierIdDropdownList = async () => {
  let list = await getSupplierSupplierIdDropdown();
  supplierSupplierIdDropdownList.value = list.data.result ?? [];
};
getSupplierSupplierIdDropdownList();

handleQuery();
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}
</style>
