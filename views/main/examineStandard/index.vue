<template>
  <div class="examineStandard-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>

          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="检验标准编号">
              <el-input v-model="queryParams.examineStandardCode" clearable="" placeholder="请输入检验标准编号" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="检验标准名称">
              <el-input v-model="queryParams.examineStandardName" clearable="" placeholder="请输入检验标准名称" />

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
            <el-form-item label="工艺设备">
              <el-select clearable="" filterable="" v-model="queryParams.deviceTypeId" placeholder="请选择工艺设备">
                <el-option v-for="(item, index) in  deviceTypeDeviceTypeIdDropdownList" :key="index" :value="item.value"
                  :label="item.label" />

              </el-select>

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="检验项目">
              <el-select clearable="" filterable="" v-model="queryParams.examineProjectId" placeholder="请选择检验项目">
                <el-option v-for="(item, index) in  examineProjectExamineProjectIdDropdownList" :key="index"
                  :value="item.value" :label="item.label" />

              </el-select>

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="margin-right:20px;">
                <el-button icon="ele-Search" @click="handleQuery" v-auth="'examineStandard:page'"> 查询
                </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>

              </el-button-group>

              <el-button-group>
                <el-button icon="ele-Plus" @click="openAddExamineStandard" v-auth="'examineStandard:add'"> 新增
                </el-button>

              </el-button-group>

            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border=""
        highlight-current-row="true">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="examineStandardCode" label="检验标准编号" width="90" show-overflow-tooltip="" />
        <el-table-column prop="examineStandardName" label="检验标准名称" width="90" show-overflow-tooltip="" />
        <el-table-column prop="produceCode" label="产品编号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="produceName" label="产品名称" width="140" show-overflow-tooltip="" />
        <el-table-column prop="deviceTypeName" label="工艺设备名称" width="90" show-overflow-tooltip="" />
        <el-table-column prop="examineProjectCode" label="检验项目编号" width="90" show-overflow-tooltip="" />
        <el-table-column prop="examineProjectName" label="检验项目名称" width="90" show-overflow-tooltip="" />
        <el-table-column prop="standardValue" label="标准值" width="140" show-overflow-tooltip="" />
        <el-table-column prop="tolerance1" label="正公差" width="140" show-overflow-tooltip="" />
        <el-table-column prop="tolerance2" label="负公差" width="140" show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
        <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
          v-if="auth('examineStandard:edit') || auth('examineStandard:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditExamineStandard(scope.row)"
              v-auth="'examineStandard:edit'"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delExamineStandard(scope.row)"
              v-auth="'examineStandard:delete'"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editExamineStandardTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="examineStandard">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
//import { formatDate } from '/@/utils/formatTime';

import editDialog from '/@/views/main/examineStandard/component/editDialog.vue'
import { pageExamineStandard, deleteExamineStandard } from '/@/api/main/examineStandard';
import { getProduceProduceIdDropdown } from '/@/api/main/examineStandard';
import { getDeviceTypeDeviceTypeIdDropdown } from '/@/api/main/examineStandard';
import { getExamineProjectExamineProjectIdDropdown } from '/@/api/main/examineStandard';


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
const editExamineStandardTitle = ref("");

// 改变高级查询的控件显示状态
const changeAdvanceQueryUI = () => {
  showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
}


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageExamineStandard(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddExamineStandard = () => {
  editExamineStandardTitle.value = '添加检验标准';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditExamineStandard = (row: any) => {
  editExamineStandardTitle.value = '编辑检验标准';
  editDialogRef.value.openDialog(row);
};

// 删除
const delExamineStandard = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteExamineStandard(row);
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

const deviceTypeDeviceTypeIdDropdownList = ref<any>([]);
const getDeviceTypeDeviceTypeIdDropdownList = async () => {
  let list = await getDeviceTypeDeviceTypeIdDropdown();
  deviceTypeDeviceTypeIdDropdownList.value = list.data.result ?? [];
};
getDeviceTypeDeviceTypeIdDropdownList();

const examineProjectExamineProjectIdDropdownList = ref<any>([]);
const getExamineProjectExamineProjectIdDropdownList = async () => {
  let list = await getExamineProjectExamineProjectIdDropdown();
  examineProjectExamineProjectIdDropdownList.value = list.data.result ?? [];
};
getExamineProjectExamineProjectIdDropdownList();

handleQuery();
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}
</style>
