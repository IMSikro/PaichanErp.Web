<template>
  <div class="tableColumn-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <!-- <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="页面">
              <el-input v-model="queryParams.pageType" clearable="" placeholder="请输入页面" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="字段">
              <el-input v-model="queryParams.prop" clearable="" placeholder="请输入字段" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="展示">
              <el-input v-model="queryParams.lable" clearable="" placeholder="请输入展示" />

            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="margin-right:20px;">
                <!-- <el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'tableColumn:page'"> 查询
                </el-button> -->
                <el-button icon="ele-Box" @click="handleUpdateList" v-auth="'tableColumn:save'"> 保存
                </el-button>

              </el-button-group>
              <el-button-group>
                <el-button icon="ele-Refresh" @click="handleReset" v-auth="'tableColumn:reset'"> 重置
                </el-button>

              </el-button-group>

              <!-- <el-button-group style="margin-left:20px">
                <el-button type="primary" icon="ele-Plus" @click="openAddTableColumn" v-auth="'tableColumn:add'"> 新增
                </el-button>

              </el-button-group> -->

            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="pageType" label="页面" width="140" show-overflow-tooltip="" />
        <el-table-column prop="prop" label="字段" width="140" show-overflow-tooltip="" />
        <el-table-column prop="lable" label="展示" width="140" show-overflow-tooltip="">
          <template #default="scope">
            <el-input v-model="scope.row.lable" clearable />
          </template>
        </el-table-column>
        <el-table-column prop="width" label="列宽" width="140" show-overflow-tooltip="">
          <template #default="scope">
            <el-input-number v-model="scope.row.width" />
          </template>
        </el-table-column>
        <el-table-column prop="isHidden" label="是否展示" width="120" show-overflow-tooltip="">
          <template #default="scope">
            <el-switch v-model="scope.row.isHidden" active-text="是" inactive-text="否" />
          </template>

        </el-table-column>
        <el-table-column prop="sort" label="排序" width="140" show-overflow-tooltip="">
          <template #default="scope">
            <el-input-number v-model="scope.row.sort" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
          v-if="auth('tableColumn:edit') || auth('tableColumn:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditTableColumn(scope.row)"
              v-auth="'tableColumn:edit'"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delTableColumn(scope.row)"
              v-auth="'tableColumn:delete'"> 删除 </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editTableColumnTitle" @reloadTable="handleQuery" /> -->
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="tableColumn">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
//import { formatDate } from '/@/utils/formatTime';

// import editDialog from '/@/views/main/tableColumn/component/editDialog.vue'
import { pageTableColumn, resetTableColumn, updateListTableColumn } from '/@/api/main/tableColumn';


// const showAdvanceQueryUI = ref(false);
// const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
// const tableParams = ref({
//   page: 1,
//   pageSize: 10,
//   total: 0,
// });
// const editTableColumnTitle = ref("");

// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageTableColumn(queryParams.value);
  tableData.value = res.data.result ?? [];
  loading.value = false;
};

// 查询操作
const handleUpdateList = async () => {
  loading.value = true;
  await updateListTableColumn(tableData.value);
  await handleQuery();
};


// 查询操作
const handleReset = async () => {
  loading.value = true;
  await resetTableColumn();
  await handleQuery();
};


// // 打开新增页面
// const openAddTableColumn = () => {
//   editTableColumnTitle.value = '添加显示列';
//   editDialogRef.value.openDialog({});
// };

// // 打开编辑页面
// const openEditTableColumn = (row: any) => {
//   editTableColumnTitle.value = '编辑显示列';
//   editDialogRef.value.openDialog(row);
// };

// // 删除
// const delTableColumn = (row: any) => {
//   ElMessageBox.confirm(`确定要删除吗?`, "提示", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//     type: "warning",
//   })
//     .then(async () => {
//       await deleteTableColumn(row);
//       handleQuery();
//       ElMessage.success("删除成功");
//     })
//     .catch(() => { });
// };

// // 改变页面容量
// const handleSizeChange = (val: number) => {
//   tableParams.value.pageSize = val;
//   handleQuery();
// };

// // 改变页码序号
// const handleCurrentChange = (val: number) => {
//   tableParams.value.page = val;
//   handleQuery();
// };

handleQuery();
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}
</style>
