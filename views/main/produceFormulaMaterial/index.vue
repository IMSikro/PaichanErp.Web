<template>
  <div class="produceFormulaMaterial-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="配方">
              <el-select clearable="" filterable="" v-model="queryParams.produceFormulaId" placeholder="请选择配方">
                <el-option v-for="(item,index) in  produceFormulaProduceFormulaIdDropdownList" :key="index" :value="item.value" :label="item.label" />
                
              </el-select>
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="物料">
              <el-select clearable="" filterable="" v-model="queryParams.materialId" placeholder="请选择物料">
                <el-option v-for="(item,index) in  materialMaterialIdDropdownList" :key="index" :value="item.value" :label="item.label" />
                
              </el-select>
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group>
                <el-button type="primary"  icon="ele-Search" @click="handleQuery" v-auth="'produceFormulaMaterial:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>
                
              </el-button-group>
              
              <el-button-group style="margin-left:20px">
                <el-button type="primary" icon="ele-Plus" @click="openAddProduceFormulaMaterial" v-auth="'produceFormulaMaterial:add'"> 新增 </el-button>
                
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
        <el-table-column prop="produceFormulaId" label="配方" width="120" show-overflow-tooltip="">
          <template #default="scope">
            <span>{{scope.row.produceFormulaIdProduceFormulaCode}}</span>
            
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
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="" v-if="auth('produceFormulaMaterial:edit') || auth('produceFormulaMaterial:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditProduceFormulaMaterial(scope.row)" v-auth="'produceFormulaMaterial:edit'"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delProduceFormulaMaterial(scope.row)" v-auth="'produceFormulaMaterial:delete'"> 删除 </el-button>
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
        :title="editProduceFormulaMaterialTitle"
        @reloadTable="handleQuery"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="produceFormulaMaterial">
  import { ref } from "vue";
  import { ElMessageBox, ElMessage } from "element-plus";
  import { auth } from '/@/utils/authFunction';
  import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
  //import { formatDate } from '/@/utils/formatTime';

  import editDialog from '/@/views/main/produceFormulaMaterial/component/editDialog.vue'
  import { pageProduceFormulaMaterial, deleteProduceFormulaMaterial } from '/@/api/main/produceFormulaMaterial';
  import { getProduceFormulaProduceFormulaIdDropdown } from '/@/api/main/produceFormulaMaterial';
  import { getMaterialMaterialIdDropdown } from '/@/api/main/produceFormulaMaterial';


  const showAdvanceQueryUI = ref(true);
  const editDialogRef = ref();
  const loading = ref(false);
  const tableData = ref<any>([]);
  const queryParams = ref<any>({});
  const tableParams = ref({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const editProduceFormulaMaterialTitle = ref("");

  // 改变高级查询的控件显示状态
  const changeAdvanceQueryUI = () => {
    showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
  }
  

  // 查询操作
  const handleQuery = async () => {
    loading.value = true;
    var res = await pageProduceFormulaMaterial(Object.assign(queryParams.value, tableParams.value));
    tableData.value = res.data.result?.items ?? [];
    tableParams.value.total = res.data.result?.total;
    loading.value = false;
  };

  // 打开新增页面
  const openAddProduceFormulaMaterial = () => {
    editProduceFormulaMaterialTitle.value = '添加配方物料';
    editDialogRef.value.openDialog({});
  };

  // 打开编辑页面
  const openEditProduceFormulaMaterial = (row: any) => {
    editProduceFormulaMaterialTitle.value = '编辑配方物料';
    editDialogRef.value.openDialog(row);
  };

  // 删除
  const delProduceFormulaMaterial = (row: any) => {
    ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
  .then(async () => {
    await deleteProduceFormulaMaterial(row);
    handleQuery();
    ElMessage.success("删除成功");
  })
  .catch(() => {});
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

  const produceFormulaProduceFormulaIdDropdownList = ref<any>([]); 
  const getProduceFormulaProduceFormulaIdDropdownList = async () => {
    let list = await getProduceFormulaProduceFormulaIdDropdown();
    produceFormulaProduceFormulaIdDropdownList.value = list.data.result ?? [];
  };
  getProduceFormulaProduceFormulaIdDropdownList();

  const materialMaterialIdDropdownList = ref<any>([]); 
  const getMaterialMaterialIdDropdownList = async () => {
    let list = await getMaterialMaterialIdDropdown();
    materialMaterialIdDropdownList.value = list.data.result ?? [];
  };
  getMaterialMaterialIdDropdownList();

  handleQuery();
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
	width: 100%;
}
</style>

