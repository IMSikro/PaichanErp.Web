<template>
  <div class="produce-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="产品类型">
              <el-select clearable="" filterable="" v-model="queryParams.produceType" placeholder="请选择产品类型">
                <el-option v-for="(item, index) in  produceTypeProduceTypeDropdownList" :key="index" :value="item.value"
                  :label="item.label" />

              </el-select>

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="产品编号">
              <el-input v-model="queryParams.produceCode" clearable="" placeholder="请输入产品编号" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="产品名称">
              <el-input v-model="queryParams.produceName" clearable="" placeholder="请输入产品名称" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
            <el-form-item>
              <el-button-group>
                <el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'produce:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>
              </el-button-group>

              <el-button-group style="margin-left:20px">
                <el-button type="primary" icon="ele-Plus" @click="openAddProduce" v-auth="'produce:add'"> 新增 </el-button>
              </el-button-group>

              <el-button-group style="margin-left:20px">
                <el-button type="success" icon="ele-Plus" @click="openImportProduce" v-auth="'produce:import'"> 导入 </el-button>
              </el-button-group>

            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="produceType" label="产品类型" width="120" show-overflow-tooltip="">
          <template #default="scope">
            <span>{{ scope.row.produceTypeTypeName }}</span>

          </template>

        </el-table-column>
        <el-table-column prop="produceCode" label="产品编号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="produceName" label="产品名称" width="140" show-overflow-tooltip="" />
        <el-table-column prop="colorLab" label="产品LAB颜色" width="105" show-overflow-tooltip="" />
        <el-table-column prop="colorRgb" label="产品RGB颜色" width="105" show-overflow-tooltip="" />
        <el-table-column prop="colorRgb" label="产品RGB颜色" width="105" show-overflow-tooltip="">
          <template #default="scope">
            <div :style="{ 'background-color': `rgb(${scope.row.colorRgb})` }">
              &nbsp;
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="deviceTypes" label="工艺列表" width="120" show-overflow-tooltip="">
          <template #default="scope">
            <el-tag v-for="(v,i) in scope.row.deviceTypeList" :key="i"> {{ deviceTypeListRef[v] }} </el-tag>
          </template>

        </el-table-column>
        <el-table-column prop="produceCoefficient" label="产品系数" width="140" show-overflow-tooltip="" />
        <el-table-column prop="produceSeries" label="产品系列" width="140" show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
        <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" width="80" align="center" fixed="left" show-overflow-tooltip=""
          v-if="auth('produce:edit') || auth('produce:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditProduce(scope.row)"
              v-auth="'produce:edit'">  </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delProduce(scope.row)"
              v-auth="'produce:delete'">  </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editProduceTitle" @reloadTable="handleQuery" />
    </el-card>

		<el-dialog v-model="state.dialogUploadVisible" :lock-scroll="false" draggable width="400px">
			<template #header>
				<div style="color: #fff">
					<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-UploadFilled /> </el-icon>
					<span> 上传文件 </span>
				</div>
			</template>
			<div>
				<el-upload ref="uploadRef" drag :auto-upload="false" :limit="1" :file-list="state.fileList" action="" :on-change="handleChange" accept=".xls,.xlsx">
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
		</el-dialog>

  </div>
</template>

<script lang="ts" setup="" name="produce">
import { reactive,ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
//import { formatDate } from '/@/utils/formatTime';
import { downloadByData,getFileName } from '/@/utils/download';

import editDialog from '/@/views/main/produce/component/editDialog.vue'
import { pageProduce, deleteProduce,getProduceTempExcel,importProduceExcel } from '/@/api/main/produce';
import { getProduceTypeProduceTypeDropdown } from '/@/api/main/produce';
import { getDeviceTypeDeviceTypeIdDropdown } from '/@/api/main/device';


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
const editProduceTitle = ref("");


const state = reactive({
	dialogUploadVisible: false,
	fileList: [] as any,
});

// 打开上传页面
const openImportProduce = () => {
	state.fileList = [];
	state.dialogUploadVisible = true;
};
// 通过onChanne方法获得文件列表
const handleChange = (file: any, fileList: []) => {
	state.fileList = fileList;
};
// 上传
const uploadFile = async () => {
	if (state.fileList.length < 1) return;
  const params = new FormData();
  params.append('file',state.fileList[0].raw);
	await importProduceExcel(params);
	handleQuery();
	ElMessage.success('上传成功');
	state.dialogUploadVisible = false;
};

const downloadExcel = async () => {
  var res = await getProduceTempExcel();
  var fileName = getFileName(res.headers);
  console.log(res,res.data);
  
  downloadByData(res.data,fileName);
}


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageProduce(Object.assign(queryParams.value, tableParams.value));
  var produceList = res.data.result?.items ?? []
  for (const p of produceList) {
    p.deviceTypeList = p.deviceTypes?.split(',') ?? [];
  }

  tableData.value = produceList;
  tableParams.value.total = res.data.result?.total;

  loading.value = false;
};

// 打开新增页面
const openAddProduce = () => {
  editProduceTitle.value = '添加产品列表';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditProduce = (row: any) => {
  editProduceTitle.value = '编辑产品列表';
  editDialogRef.value.openDialog(row);
};

// 删除
const delProduce = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteProduce(row);
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

const produceTypeProduceTypeDropdownList = ref<any>([]);
const getProduceTypeProduceTypeDropdownList = async () => {
  let list = await getProduceTypeProduceTypeDropdown();
  produceTypeProduceTypeDropdownList.value = list.data.result ?? [];
};
getProduceTypeProduceTypeDropdownList();

const deviceTypeDeviceTypeIdDropdownList = ref<any>([]);
const deviceTypeListRef = ref<any>({});
const getDeviceTypeDeviceTypeIdDropdownList = async () => {
  let list = await getDeviceTypeDeviceTypeIdDropdown();
  var deviceTypes = list.data.result ?? [];
  for (const dt of deviceTypes) {
    deviceTypeListRef.value[dt.value] = dt.label;
  }
  deviceTypeDeviceTypeIdDropdownList.value = deviceTypes;
};
getDeviceTypeDeviceTypeIdDropdownList();

handleQuery();
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}
</style>

