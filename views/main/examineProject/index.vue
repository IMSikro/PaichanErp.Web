<template>
  <div class="examineProject-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <!-- <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="关键字">
              <el-input v-model="queryParams.searchKey" clearable="" placeholder="请输入模糊查询关键字"/>
              
            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="检验项目编号">
              <el-input v-model="queryParams.examineProjectCode" clearable="" placeholder="请输入检验项目编号" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="检验项目名称">
              <el-input v-model="queryParams.examineProjectName" clearable="" placeholder="请输入检验项目名称" />

            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="备注">
              <el-input v-model="queryParams.remark" clearable="" placeholder="请输入备注"/>
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="创建者姓名">
              <el-input v-model="queryParams.createUserName" clearable="" placeholder="请输入创建者姓名"/>
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="修改者姓名">
              <el-input v-model="queryParams.updateUserName" clearable="" placeholder="请输入修改者姓名"/>
              
            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="margin-right:20px;">
                <el-button icon="ele-Search" @click="handleQuery" v-auth="'examineProject:page'"> 查询
                </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>

              </el-button-group>

              <el-button-group>
                <el-button icon="ele-Plus" @click="openAddExamineProject" v-auth="'examineProject:add'">
                  新增 </el-button>

              </el-button-group>

            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="examineProjectCode" label="检验项目编号" width="90" show-overflow-tooltip="" />
        <el-table-column prop="examineProjectName" label="检验项目名称" width="90" show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
        <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
          v-if="auth('examineProject:edit') || auth('examineProject:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditExamineProject(scope.row)"
              v-auth="'examineProject:edit'"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delExamineProject(scope.row)"
              v-auth="'examineProject:delete'"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editExamineProjectTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="examineProject">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
//import { formatDate } from '/@/utils/formatTime';

import editDialog from '/@/views/main/examineProject/component/editDialog.vue'
import { pageExamineProject, deleteExamineProject } from '/@/api/main/examineProject';


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
const editExamineProjectTitle = ref("");

// 改变高级查询的控件显示状态
const changeAdvanceQueryUI = () => {
  showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
}


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageExamineProject(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddExamineProject = () => {
  editExamineProjectTitle.value = '添加检验标准项';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditExamineProject = (row: any) => {
  editExamineProjectTitle.value = '编辑检验标准项';
  editDialogRef.value.openDialog(row);
};

// 删除
const delExamineProject = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteExamineProject(row);
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
