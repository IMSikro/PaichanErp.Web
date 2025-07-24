<template>
  <div class="materialStoreRecords-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="入库单号">
              <el-input v-model="queryParams.inStoreOrderNumber" clearable="" placeholder="请输入入库单号"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="入库日期">
              <el-date-picker placeholder="请选择入库日期" value-format="YYYY/MM/DD" type="daterange" v-model="queryParams.inStoreDateRange" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group>
                <el-button type="primary"  icon="ele-Search" @click="handleQuery" v-auth="'materialStoreRecords:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>
              </el-button-group>
              <el-button-group style="margin-left:20px">
                <el-button type="primary" icon="ele-Plus" @click="openAddMaterialStoreRecords" v-auth="'materialStoreRecords:add'"> 新增 </el-button>
              </el-button-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table
				:data="tableData"
				style="width: 100%"
				v-loading="loading"
				tooltip-effect="light"
				row-key="id"
				border="">
        <el-table-column type="index" label="序号" width="55" align="center"/>
        <el-table-column prop="inStoreOrderNumber" label="入库单号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="inStoreDate" label="入库日期" width="140" show-overflow-tooltip="" />
        <el-table-column prop="paymentAmount" label="付款金额" width="140" show-overflow-tooltip="" />
        <el-table-column prop="qualityAuditUserId" label="品控审核" width="140" show-overflow-tooltip="" />
        <el-table-column prop="storeConfirmationUserId" label="仓库确认" width="140" show-overflow-tooltip="" />
        <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="" v-if="auth('materialStoreRecords:edit') || auth('materialStoreRecords:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditMaterialStoreRecords(scope.row)" v-auth="'materialStoreRecords:edit'"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delMaterialStoreRecords(scope.row)" v-auth="'materialStoreRecords:delete'"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:total="tableParams.total"
				:page-sizes="[10, 20, 50, 100, 200, 500]"
				small=""
				background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
	/>
      <editDialog
        ref="editDialogRef"
        :title="editMaterialStoreRecordsTitle"
        @reloadTable="handleQuery"
      />
    </el-card>
    
    <el-card class="full-table" shadow="hover" style="margin-top: 8px" :style="{ 'overflow-y': 'auto' }">
      <el-tabs v-model="activeName">
        <el-tab-pane label="物料列表" name="/store/materialStoreDetail">
          <el-table :data="tableData2" style="width: 100%" v-loading="loading2" tooltip-effect="light" row-key="id" border="">
            <el-table-column type="index" label="序号" width="55" align="center"/>
            <el-table-column prop="materialName" label="原料名称" width="140" show-overflow-tooltip="" />
            <el-table-column prop="materialNumber" label="原料批号" width="140" show-overflow-tooltip="" />
            <el-table-column prop="inStoreOrderNumber" label="采购单号" width="140" show-overflow-tooltip="" />
            <!-- <el-table-column prop="supplierId" label="供应商" width="120" show-overflow-tooltip="">
              <template #default="scope">
                <span>{{scope.row.supplierIdSupplierName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="model" label="规格型号" width="140" show-overflow-tooltip="" />
            <el-table-column prop="unit" label="单位" width="140" show-overflow-tooltip="" />
            <el-table-column prop="unitCost" label="采购单价" width="140" show-overflow-tooltip="" />
            <el-table-column prop="taxRate" label="税率" width="140" show-overflow-tooltip="" /> -->
            <el-table-column prop="inStoreCount" label="入库数量" width="140" show-overflow-tooltip="" />
            <!-- <el-table-column prop="subtotal" label="小计" width="140" show-overflow-tooltip="" /> -->
            <el-table-column prop="storeId" label="仓库" width="120" show-overflow-tooltip="">
              <template #default="scope">
                <span>{{scope.row.storeIdStoreCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="storeLocation" label="库位" width="120" show-overflow-tooltip="">
              <template #default="scope">
                <span>{{scope.row.storeLocationStoreLocationCode}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="safeStock" label="安全库存" width="140" show-overflow-tooltip="" />
            <el-table-column prop="quantityStock" label="现存数量" width="140" show-overflow-tooltip="" />
            <el-table-column prop="availableStock" label="可用库存" width="140" show-overflow-tooltip="" /> -->
            <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
              v-if="auth('store:edit')">
              <template #default="scope">
                <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditMaterialStoreRecords(scope.row)"
                  v-auth="'store:edit'"> 编辑 </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-model:currentPage="tableParams2.page" v-model:page-size="tableParams2.pageSize"
            :total="tableParams2.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
            @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
            layout="total, sizes, prev, pager, next, jumper" />
        </el-tab-pane>
        <!-- <el-tab-pane label="导入" name="/store/materialStoreDetailImport">
          <el-card>
            <div>
              <el-upload ref="uploadRef" drag :auto-upload="false" :limit="1" :file-list="state.fileList" action=""
                :on-change="handleChange" accept=".xls,.xlsx">
                <el-icon class="el-icon--upload">
                  <ele-UploadFilled />
                </el-icon>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <template #tip>
                  <div class="el-upload__tip">请上传大小不超过 10MB 的文件</div>
                </template>
              </el-upload>
              <div>
                点击此处下载文件模板
                <el-button @click="downloadExcel">下载模板</el-button>
              </div>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="state.dialogUploadVisible = false">取消</el-button>
                <el-button type="primary" @click="uploadFile">确定</el-button>
              </span>
            </template>
          </el-card>

        </el-tab-pane> -->
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="materialStoreRecords">
  import { reactive,ref } from "vue";
  import { ElMessageBox, ElMessage } from "element-plus";
  import { auth } from '/@/utils/authFunction';
  import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
  //import { formatDate } from '/@/utils/formatTime';
import { downloadByData, getFileName } from '/@/utils/download';

  import editDialog from '/@/views/main/materialStoreRecords/component/editDialog.vue'
  import { pageMaterialStoreRecords, deleteMaterialStoreRecords } from '/@/api/main/materialStoreRecords';
  import { pageMaterialStoreDetails, deleteMaterialStoreDetails } from '/@/api/main/materialStoreDetails';


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
  const editMaterialStoreRecordsTitle = ref("");
  
const loading2 = ref(false);
const tableData2 = ref<any>([]);
const queryParams2 = ref<any>({});
const tableParams2 = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const editStoreTitle = ref("");
const currentRowId = ref<any>({});
const state = reactive({
  dialogUploadVisible: true,
  fileList: [] as any,
});
const activeName = ref(`/store/materialStoreDetail`);

  // 改变高级查询的控件显示状态
  const changeAdvanceQueryUI = () => {
    showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
  }
  

  // 查询操作
  const handleQuery = async () => {
    loading.value = true;
    var res = await pageMaterialStoreRecords(Object.assign(queryParams.value, tableParams.value));
    tableData.value = res.data.result?.items ?? [];
    tableParams.value.total = res.data.result?.total;
    loading.value = false;
  };

// 查询操作
const handleQuery2 = async () => {
  loading2.value = true;
  var res = await pageMaterialStoreDetails(Object.assign(queryParams2.value, tableParams2.value));
  tableData2.value = res.data.result?.items ?? [];
  tableParams2.value.total = res.data.result?.total;
  loading2.value = false;
};

  // 打开新增页面
  const openAddMaterialStoreRecords = () => {
    editMaterialStoreRecordsTitle.value = '添加物料入库单';
    editDialogRef.value.openDialog({});
  };

  // 打开编辑页面
  const openEditMaterialStoreRecords = (row: any) => {
    editMaterialStoreRecordsTitle.value = '编辑物料入库单';
    editDialogRef.value.openDialog(row);
  };
// 通过onChanne方法获得文件列表
const handleChange = (file: any, fileList: []) => {
  state.fileList = fileList;
};

  // 删除
  const delMaterialStoreRecords = (row: any) => {
    ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
  .then(async () => {
    await deleteMaterialStoreRecords(row);
    handleQuery();
    ElMessage.success("删除成功");
  })
  .catch(() => {});
  };
// 上传
// const uploadFile = async () => {
//   if (state.fileList.length < 1) return;
//   let storeId = queryParams2.value?.storeId ?? 0;
//   if (storeId == 0) {
//     ElMessage.error('请先选择仓库!');
//     return;
//   }
//   const params = new FormData();
//   params.append('file', state.fileList[0].raw);
//   await importStoreLocationExcel(params, storeId);
//   handleQuery();
//   activeName.value = `/store/storeLocation`;
//   ElMessage.success('上传成功');
// };

// const downloadExcel = async () => {
//   var res = await getStoreLocationTempExcel();
//   var fileName = getFileName(res.headers);
//   downloadByData(res.data, fileName);
// }

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

// 改变页面容量
const handleSizeChange2 = (val: number) => {
  tableParams2.value.pageSize = val;
  handleQuery2();
};

// 改变页码序号
const handleCurrentChange2 = (val: number) => {
  tableParams2.value.page = val;
  handleQuery2();
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

