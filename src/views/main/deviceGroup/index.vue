<template>
  <div class="deviceGroup-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="分组编号">
              <el-input v-model="queryParams.groupCode" clearable="" placeholder="请输入分组编号" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="分组名称">
              <el-input v-model="queryParams.groupName" clearable="" placeholder="请输入分组名称" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="margin-right:20px;">
                <el-button icon="ele-Search" @click="handleQuery" v-auth="'deviceGroup:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>

              </el-button-group>

              <el-button-group>
                <el-button icon="ele-Plus" @click="openAddDeviceGroup" v-auth="'deviceGroup:add'"> 新增 </el-button>

              </el-button-group>

            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
        <el-table-column prop="groupCode" label="编号" width="55" show-overflow-tooltip="" />
        <el-table-column prop="groupName" label="分组名称" width="140" show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
        <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" width="110" align="center" fixed="left" show-overflow-tooltip=""
          v-if="auth('deviceGroup:edit') || auth('deviceGroup:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditDeviceGroup(scope.row)"
              v-auth="'deviceGroup:edit'"> 修改 </el-button>
            <el-dropdown>
              <el-button icon="ele-MoreFilled" size="small" text type="primary" style="padding-left: 12px" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item icon="ele-Edit" size="small" text="" type="primary"
                    @click="openEditDeviceGroup2(scope.row)" :disabled="!auth('deviceGroup:edit')"> 设置分组
                  </el-dropdown-item>
                  <el-dropdown-item icon="ele-Delete" size="small" text="" type="primary"
                    @click="delDeviceGroup(scope.row)" divided :disabled="!auth('deviceGroup:delete')"> 删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <editDialog ref="editDialogRef" :title="editDeviceGroupTitle" @reloadTable="handleQuery" />
      <editDialog2 ref="editDialog2Ref" :title="editDeviceGroup2Title" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="deviceGroup">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
//import { formatDate } from '/@/utils/formatTime';

import editDialog from '/@/views/main/deviceGroup/component/editDialog.vue'
import editDialog2 from '/@/views/main/deviceGroup/component/editDialog2.vue'
import { pageDeviceGroup, deleteDeviceGroup } from '/@/api/main/deviceGroup';


const showAdvanceQueryUI = ref(false);
const editDialogRef = ref();
const editDialog2Ref = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const editDeviceGroupTitle = ref("");
const editDeviceGroup2Title = ref("");

// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageDeviceGroup(Object.assign(queryParams.value));
  tableData.value = res.data.result ?? [];
  loading.value = false;
};

// 打开新增页面
const openAddDeviceGroup = () => {
  editDeviceGroupTitle.value = '添加分组';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditDeviceGroup = (row: any) => {
  editDeviceGroupTitle.value = '编辑分组信息';
  editDialogRef.value.openDialog(row);
};

// 打开编辑页面
const openEditDeviceGroup2 = (row: any) => {
  editDeviceGroup2Title.value = '设置分组';
  editDialog2Ref.value.openDialog(row);
};

// 删除
const delDeviceGroup = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteDeviceGroup(row);
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
