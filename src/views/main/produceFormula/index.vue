<template>
  <div class="produceFormula-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="配方编号">
              <el-input v-model="queryParams.produceFormulaCode" clearable="" placeholder="请输入配方编号" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="产品外键">
              <el-select clearable="" filterable="" v-model="queryParams.produceId" placeholder="请选择产品外键">
                <el-option v-for="(item, index) in  produceProduceIdDropdownList" :key="index" :value="item.value"
                  :label="item.label" />

              </el-select>

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="配方名称">
              <el-input v-model="queryParams.produceFormulaName" clearable="" placeholder="请输入配方名称" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="配方版本">
              <el-input v-model="queryParams.formulaVersion" clearable="" placeholder="请输入配方版本" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group>
                <el-button icon="ele-Search" @click="handleQuery" v-auth="'produceFormula:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>

              </el-button-group>

              <el-button-group style="margin-left:20px">
                <el-button icon="ele-Plus" @click="openAddProduceFormula" v-auth="'produceFormula:add'"> 新增 </el-button>

              </el-button-group>

            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table key="formula" :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light"
        row-key="id" border="" @current-change="handleCurrentRowChange">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="produceFormulaCode" label="配方编号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="produceId" label="产品外键" width="120" show-overflow-tooltip="">
          <template #default="scope">
            <span>{{ scope.row.produceIdProduceCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="produceFormulaName" label="配方名称" width="140" show-overflow-tooltip="" />
        <el-table-column prop="formulaVersion" label="配方版本" width="140" show-overflow-tooltip="" />
        <el-table-column prop="isEnable" label="是否启用" width="120" show-overflow-tooltip="">
          <template #default="scope">
            <el-tag v-if="scope.row.isEnable"> 是 </el-tag>
            <el-tag type="danger" v-else> 否 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="formulaCosts" label="配方成本" width="140" show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
        <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
          v-if="auth('produceFormula:edit') || auth('produceFormula:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditProduceFormula(scope.row)"
              v-auth="'produceFormula:edit'"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delProduceFormula(scope.row)"
              v-auth="'produceFormula:delete'"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px" :style="{ 'overflow-y': 'auto' }">
      <el-tabs v-model="activeName">
        <el-tab-pane label="物料列表" name="produceFormula">
          <el-table key="formulaMaterial" :data="tableDataMaterial" style="width: 100%" v-loading="loading"
            tooltip-effect="light" row-key="id" border="">
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column prop="produceFormulaId" label="配方" width="120" show-overflow-tooltip="">
              <template #default="scope">
                <span>{{ scope.row.produceFormulaIdProduceFormulaCode }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="materialCode" label="物料编号" width="140" show-overflow-tooltip="" />
            <el-table-column prop="materialName" label="物料名称" width="140" show-overflow-tooltip="" />
            <el-table-column prop="materialNorm" label="物料规格" width="140" show-overflow-tooltip="" />
            <el-table-column prop="costPrice" label="采购单价" width="140" show-overflow-tooltip="" />
            <el-table-column prop="dutyRate" label="税率(%)" width="140" show-overflow-tooltip="" />
            <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
            <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
            <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
            <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
              v-if="auth('produceFormulaMaterial:edit') || auth('produceFormulaMaterial:delete')">
              <template #default="scope">
                <el-button icon="ele-Edit" size="small" text="" type="primary"
                  @click="openEditProduceFormulaMaterial(scope.row)" v-auth="'produceFormulaMaterial:edit'"> 编辑
                </el-button>
                <el-button icon="ele-Delete" size="small" text="" type="primary"
                  @click="delProduceFormulaMaterial(scope.row)" v-auth="'produceFormulaMaterial:delete'"> 删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-model:currentPage="tableParamsMaterial.page" v-model:page-size="tableParamsMaterial.pageSize"
            :total="tableParamsMaterial.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
            @size-change="handleMaterialSizeChange" @current-change="handleMaterialCurrentChange"
            layout="total, sizes, prev, pager, next, jumper" />
        </el-tab-pane>
        <el-tab-pane label="工艺标准" name="processStandard">
          <el-table key="processStandard" :data="tableDataProcess" style="width: 100%" v-loading="loading"
            tooltip-effect="light" row-key="id" border="">
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column prop="produceFormulaCode" label="配方编号" width="140" show-overflow-tooltip="" />
            <el-table-column prop="produceId" label="产品外键" width="120" show-overflow-tooltip="">
              <template #default="scope">
                <span>{{ scope.row.produceIdProduceCode }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="produceFormulaName" label="配方名称" width="140" show-overflow-tooltip="" />
            <el-table-column prop="formulaVersion" label="配方版本" width="140" show-overflow-tooltip="" />
            <el-table-column prop="isEnable" label="是否启用" width="120" show-overflow-tooltip="">
              <template #default="scope">
                <el-tag v-if="scope.row.isEnable"> 是 </el-tag>
                <el-tag type="danger" v-else> 否 </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="formulaCosts" label="配方成本" width="140" show-overflow-tooltip="" />
            <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
            <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
            <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
            <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
              v-if="auth('store:edit')">
              <template #default="scope">
                <el-button icon="ele-Edit" size="small" text="" type="primary"
                  @click="openEditProduceFormula(scope.row)" v-auth="'produceFormula:edit'"> 编辑 </el-button>
                <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delProduceFormula(scope.row)"
                  v-auth="'produceFormula:delete'"> 删除 </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-model:currentPage="tableParamsProcess.page" v-model:page-size="tableParamsProcess.pageSize"
            :total="tableParamsProcess.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
            @size-change="handleProcessSizeChange" @current-change="handleProcessCurrentChange"
            layout="total, sizes, prev, pager, next, jumper" />
        </el-tab-pane>
        <el-tab-pane label="检验标准" name="examineStandard">
          <el-table key="examineStandard" :data="tableDataExamine" style="width: 100%" v-loading="loading"
            tooltip-effect="light" row-key="id" border="">
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column prop="produceFormulaCode" label="配方编号" width="140" show-overflow-tooltip="" />
            <el-table-column prop="produceId" label="产品外键" width="120" show-overflow-tooltip="">
              <template #default="scope">
                <span>{{ scope.row.produceIdProduceCode }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="produceFormulaName" label="配方名称" width="140" show-overflow-tooltip="" />
            <el-table-column prop="formulaVersion" label="配方版本" width="140" show-overflow-tooltip="" />
            <el-table-column prop="isEnable" label="是否启用" width="120" show-overflow-tooltip="">
              <template #default="scope">
                <el-tag v-if="scope.row.isEnable"> 是 </el-tag>
                <el-tag type="danger" v-else> 否 </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="formulaCosts" label="配方成本" width="140" show-overflow-tooltip="" />
            <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
            <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
            <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
            <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
              v-if="auth('store:edit')">
              <template #default="scope">
                <el-button icon="ele-Edit" size="small" text="" type="primary"
                  @click="openEditProduceFormula(scope.row)" v-auth="'produceFormula:edit'"> 编辑 </el-button>
                <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delProduceFormula(scope.row)"
                  v-auth="'produceFormula:delete'"> 删除 </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-model:currentPage="tableParamsExamine.page" v-model:page-size="tableParamsExamine.pageSize"
            :total="tableParamsExamine.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
            @size-change="handleExamineSizeChange" @current-change="handleExamineCurrentChange"
            layout="total, sizes, prev, pager, next, jumper" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <editDialog ref="editDialogRef" :title="editProduceFormulaTitle" @reloadTable="handleQuery" />
  </div>
</template>

<script lang="ts" setup="" name="produceFormula">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
//import { formatDate } from '/@/utils/formatTime';
import { useRoute, useRouter } from 'vue-router';

import editDialog from '/@/views/main/produceFormula/component/editDialog.vue'
import { pageProduceFormula, deleteProduceFormula } from '/@/api/main/produceFormula';
import { getProduceProduceIdDropdown } from '/@/api/main/produceFormula';


const router = useRoute();
const showAdvanceQueryUI = ref(false);
const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const tableDataMaterial = ref<any>([]);
const tableDataProcess = ref<any>([]);
const tableDataExamine = ref<any>([]);
const queryParams = ref<any>({});
const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const tableParamsMaterial = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const tableParamsProcess = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const tableParamsExamine = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const editProduceFormulaTitle = ref("");
const activeName = ref('produceFormula');

// 改变高级查询的控件显示状态
const changeAdvanceQueryUI = () => {
  showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
}

// 根据路由显示tab
const showTabByRoute = () => {
  console.log(router.name);
  activeName.value = router.name?.toString() ?? 'produceFormula';
}

// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageProduceFormula(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;

  tableDataMaterial.value = [];
  tableParamsMaterial.value.total = 0;
  tableDataProcess.value = [];
  tableParamsProcess.value.total = 0;
  tableDataExamine.value = [];
  tableParamsExamine.value.total = 0;
  loading.value = false;
};


// 查询操作
const handleQueryMaterial = async () => {
  loading.value = true;
  var res = await pageProduceFormula(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;

  tableDataMaterial.value = [];
  tableParamsMaterial.value.total = 0;
  tableDataProcess.value = [];
  tableParamsProcess.value.total = 0;
  tableDataExamine.value = [];
  tableParamsExamine.value.total = 0;
  loading.value = false;
};


// 查询操作
const handleQueryProcess = async () => {
  loading.value = true;
  var res = await pageProduceFormula(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;

  tableDataMaterial.value = [];
  tableParamsMaterial.value.total = 0;
  tableDataProcess.value = [];
  tableParamsProcess.value.total = 0;
  tableDataExamine.value = [];
  tableParamsExamine.value.total = 0;
  loading.value = false;
};

// 查询操作
const handleQueryExamine = async () => {
  loading.value = true;
  var res = await pageProduceFormula(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;

  tableDataMaterial.value = [];
  tableParamsMaterial.value.total = 0;
  tableDataProcess.value = [];
  tableParamsProcess.value.total = 0;
  tableDataExamine.value = [];
  tableParamsExamine.value.total = 0;
  loading.value = false;
};

// 改变选中行
const handleCurrentRowChange = async (currentRow: any, oldCurrentRow: any) => {
  // console.log(currentRow);
  let formulaData = { produceFormulaId: currentRow.id };
  switch (activeName.value) {
    case 'produceFormula':
      handleQueryMaterial();
      break;
    case 'processStandard':
      handleQueryProcess();
      break;
    case 'examineStandard':
      handleQueryExamine();
      break;
    default:
      handleQueryMaterial();
      break;
  }
};

// 打开新增页面
const openAddProduceFormula = () => {
  editProduceFormulaTitle.value = '添加产品配方';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditProduceFormula = (row: any) => {
  editProduceFormulaTitle.value = '编辑产品配方';
  editDialogRef.value.openDialog(row);
};

// 删除
const delProduceFormula = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteProduceFormula(row);
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

// 改变页面容量
const handleMaterialSizeChange = (val: number) => {
  tableParamsMaterial.value.pageSize = val;
  handleQuery();
};

// 改变页码序号
const handleMaterialCurrentChange = (val: number) => {
  tableParamsMaterial.value.page = val;
  handleQuery();
};

// 改变页面容量
const handleProcessSizeChange = (val: number) => {
  tableParamsProcess.value.pageSize = val;
  handleQuery();
};

// 改变页码序号
const handleProcessCurrentChange = (val: number) => {
  tableParamsProcess.value.page = val;
  handleQuery();
};

// 改变页面容量
const handleExamineSizeChange = (val: number) => {
  tableParamsExamine.value.pageSize = val;
  handleQuery();
};

// 改变页码序号
const handleExamineCurrentChange = (val: number) => {
  tableParamsExamine.value.page = val;
  handleQuery();
};

const produceProduceIdDropdownList = ref<any>([]);
const getProduceProduceIdDropdownList = async () => {
  let list = await getProduceProduceIdDropdown();
  produceProduceIdDropdownList.value = list.data.result ?? [];
};
getProduceProduceIdDropdownList();

handleQuery();
showTabByRoute();
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}
</style>
