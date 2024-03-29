<template>
  <div class="device-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="设备类型">
              <el-select clearable="" filterable="" v-model="queryParams.deviceTypeId" placeholder="请选择设备类型">
                <el-option v-for="(item, index) in  deviceTypeDeviceTypeIdDropdownList" :key="index" :value="item.value"
                  :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="设备编号">
              <el-input v-model="queryParams.deviceCode" clearable="" placeholder="请输入设备编号" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="设备名称">
              <el-input v-model="queryParams.deviceName" clearable="" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
            <el-form-item>
              <el-button-group>
                <el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'device:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>
              </el-button-group>

              <el-button-group style="margin-left:20px">
                <el-button type="primary" icon="ele-Plus" @click="openAddDevice" v-auth="'device:add'"> 新增 </el-button>
              </el-button-group>
              <el-button-group style="margin-left:20px">
                <el-button type="success" icon="ele-Plus" @click="openImportDevice" v-auth="'device:import'"> 导入 </el-button>
              </el-button-group>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="deviceTypeId" label="设备类型" width="120" show-overflow-tooltip="">
          <template #default="scope">
            <span>{{ scope.row.deviceTypeIdTypeName }}</span>

          </template>

        </el-table-column>
        <el-table-column prop="deviceCode" label="设备编号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="deviceName" label="设备名称" width="140" show-overflow-tooltip="" />
        <el-table-column prop="deviceCoefficient" label="设备系数" width="140" show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
        <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
          v-if="auth('device:edit') || auth('device:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditDevice(scope.row)"
              v-auth="'device:edit'"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delDevice(scope.row)"
              v-auth="'device:delete'"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editDeviceTitle" @reloadTable="handleQuery" />
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

<script lang="ts" setup="" name="device">
import { reactive,ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
//import { formatDate } from '/@/utils/formatTime';
import { downloadByData,getFileName } from '/@/utils/download';

import editDialog from '/@/views/main/device/component/editDialog.vue'
import { pageDevice, deleteDevice,getDeviceTempExcel,importDeviceExcel } from '/@/api/main/device';
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
const editDeviceTitle = ref("");

// 改变高级查询的控件显示状态
const changeAdvanceQueryUI = () => {
  showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
}

const state = reactive({
	dialogUploadVisible: false,
	fileList: [] as any,
});

// 打开上传页面
const openImportDevice = () => {
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
	await importDeviceExcel(params);
	handleQuery();
	ElMessage.success('上传成功');
	state.dialogUploadVisible = false;
};

const downloadExcel = async () => {
  var res = await getDeviceTempExcel();
  var fileName = getFileName(res.headers);
  console.log(res,res.data);
  
  downloadByData(res.data,fileName);
}


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageDevice(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddDevice = () => {
  editDeviceTitle.value = '添加设备列表';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditDevice = (row: any) => {
  editDeviceTitle.value = '编辑设备列表';
  editDialogRef.value.openDialog(row);
};

// 删除
const delDevice = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteDevice(row);
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

const deviceTypeDeviceTypeIdDropdownList = ref<any>([]);
const getDeviceTypeDeviceTypeIdDropdownList = async () => {
  let list = await getDeviceTypeDeviceTypeIdDropdown();
  deviceTypeDeviceTypeIdDropdownList.value = list.data.result ?? [];
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

