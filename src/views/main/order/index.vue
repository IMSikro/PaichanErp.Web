<template>
  <div class="order-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="批次号">
              <el-input v-model="queryParams.batchNumber" clearable="" placeholder="请输入批次号" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="产品选择">
              <el-select clearable="" filterable="" v-model="queryParams.produceId" placeholder="请选择产品选择">
                <el-option v-for="(item, index) in  produceProduceIdDropdownList" :key="index" :value="item.value"
                  :label="item.label" />

              </el-select>

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="完工状态">
              <el-select v-model="queryParams.orderEndStatus" placeholder="请选择完工状态" clearable class="w100">
                <el-option label="全部" value=""></el-option>
                <el-option label="未完工" value="false"></el-option>
                <el-option label="已完工" value="true"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="下单日期">
              <el-date-picker placeholder="请选择下单日期" value-format="YYYY/MM/DD" type="daterange"
                v-model="queryParams.orderDateRange" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="交货日期">
              <el-date-picker placeholder="请选择交货日期" value-format="YYYY/MM/DD" type="daterange"
                v-model="queryParams.deliveryDateRange" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="客户">
              <el-input v-model="queryParams.customer" clearable="" placeholder="请输入客户" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb10">
            <el-form-item>
              <el-button-group style="margin-right:20px;">
                <el-button icon="ele-Search" @click="handleQuery" v-auth="'order:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>
              </el-button-group>
              <el-button-group style="margin-right:20px;">
                <el-button icon="ele-ZoomIn" @click="changeAdvanceQueryUI" v-if="!showAdvanceQueryUI"> 更多 </el-button>
                <el-button icon="ele-ZoomOut" @click="changeAdvanceQueryUI" v-if="showAdvanceQueryUI"> 隐藏 </el-button>
              </el-button-group>

              <el-button-group>
                <el-button icon="ele-Plus" @click="openAddOrder" v-auth="'order:add'"> 新增 </el-button>
                <el-button icon="ele-Plus" @click="openImportOrder" v-auth="'order:import'"> 导入
                </el-button>
              </el-button-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
        <!-- <el-table-column type="expand" fixed>
          <template #default="scope">
            <el-table :data="scope.row.orderDetails" style="margin-left: 48px; width: calc(100% - 48px)"
              v-loading="loading" tooltip-effect="light" row-key="id" border="" size="small">
              <el-table-column type="index" label="序号" width="55" align="center" />
              <el-table-column prop="orderId" label="订单批号" width="120" show-overflow-tooltip="">
                <template #default="scope">
                  <span>{{ scope.row.orderIdBatchNumber }}</span>
                </template>
</el-table-column>
<el-table-column prop="orderDetailCode" label="班次序号" width="140" show-overflow-tooltip="" />
<el-table-column prop="startDate" label="开始时间" width="140" show-overflow-tooltip="" />
<el-table-column prop="endDate" label="结束时间" width="140" show-overflow-tooltip="" />
<el-table-column prop="deviceId" label="设备" width="120" show-overflow-tooltip="">
  <template #default="scope">
                  <span>{{ scope.row.deviceIdDeviceCode }}</span>
                </template>
</el-table-column>
<el-table-column prop="operatorUsersRealName" label="操作人员" width="140" show-overflow-tooltip="" />
<el-table-column prop="qty" label="班次产量" width="140" show-overflow-tooltip="" />
<el-table-column prop="pUnit" label="计量单位" width="140" show-overflow-tooltip="" />
<el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
<el-table-column label="操作" width="70" align="center" fixed="left" show-overflow-tooltip=""
  v-if="auth('orderDetail:edit') || auth('orderDetail:delete')">
  <template #default="scope">
                  <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditOrderDetail(scope.row)"
                    v-auth="'orderDetail:edit'"> </el-button>
                  <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delOrderDetail(scope.row)"
                    v-auth="'orderDetail:delete'"> </el-button>
                </template>
</el-table-column>
</el-table>
</template>
</el-table-column> -->
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="orderCode" label="订单编号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="orderDate" label="下单日期" width="140" show-overflow-tooltip="">
          <template #default="scope">
            <span>{{ formatDate(scope.row.orderDate, 'YYYY-mm-dd') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryDate" label="交货日期" width="140" show-overflow-tooltip="">
          <template #default="scope">
            <span>{{ formatDate(scope.row.deliveryDate, 'YYYY-mm-dd') }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="startDate" label="实际开工时间" width="90" show-overflow-tooltip="" />
        <el-table-column prop="endDate" label="实际完成时间" width="90" show-overflow-tooltip="" /> -->
        <el-table-column prop="produceId" label="产品编号" width="120" show-overflow-tooltip="">
          <template #default="scope">
            <span>{{ scope.row.produceIdProduceName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="produceName" label="产品名称" width="140" show-overflow-tooltip="" />
        <el-table-column prop="batchNumber" label="批次号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="quantity" label="批次总量" width="140" show-overflow-tooltip="" />
        <el-table-column prop="pUnit" label="计量单位" width="140" show-overflow-tooltip="" />
        <el-table-column prop="customer" label="客户" width="140" show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" width="80" align="center" fixed="left" show-overflow-tooltip=""
          v-if="auth('order:edit') || auth('order:delete') || auth('orderDetail:add')">
          <template #default="scope">
            <!-- <el-button icon="ele-Promotion" size="small" text="" type="primary" @click="openAddOrderDetail(scope.row)"
              v-auth="'orderDetail:add'"> 排产 </el-button>
            <el-dropdown>
              <el-button icon="ele-MoreFilled" size="small" text type="primary" style="padding-left: 12px" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item icon="ele-Edit" size="small" text="" type="primary"
                    @click="openEditOrder(scope.row)" :disabled="!auth('order:edit')"> 修改 </el-dropdown-item>
                  <el-dropdown-item icon="ele-Delete" size="small" text="" type="primary" @click="delOrder(scope.row)"
                    divided :disabled="!auth('order:delete')"> 删除 </el-dropdown-item>
                </el-dropdown-menu>
              </template>
  </el-dropdown> -->
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditOrder(scope.row)"
              v-auth="'order:edit'"> </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delOrder(scope.row)"
              v-auth="'order:delete'">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editOrderTitle" @reloadTable="handleQuery" />
      <setOrderDetail ref="setOrderDetailRef" :title="setOrderDetailTitle" @reloadTable="handleQuery" />
    </el-card>

    <el-dialog v-model="state.dialogUploadVisible" :lock-scroll="false" draggable width="400px">
      <template #header>
        <div style="color: #fff">
          <el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-UploadFilled />
          </el-icon>
          <span> 上传文件 </span>
        </div>
      </template>
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
        <div v-if="state.extras">
          查看错误
          <el-badge :value="state.extras.count" type="danger" show-zero="false">
            <el-button @click="downloadErrorExcel">下载</el-button>
          </el-badge>
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

<script lang="ts" setup="" name="order">
import { reactive, ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
import { formatDate } from '/@/utils/formatTime';
import { downloadByData, downloadByUrl, getFileName } from '/@/utils/download';

import editDialog from '/@/views/main/order/component/editDialog.vue'
import setOrderDetail from '/@/views/main/order/component/setOrderDetail.vue'
import editDetailDialog from '/@/views/main/order/component/editDetailDialog.vue'
import { pageOrder, deleteOrder, getOrderTempExcel, importOrderExcel } from '/@/api/main/order';
import { getProduceProduceIdDropdown } from '/@/api/main/order';
import { deleteOrderDetail } from '/@/api/main/orderDetail';
import { url } from "inspector";

const showAdvanceQueryUI = ref(false);
const editDialogRef = ref();
const setOrderDetailRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const editOrderTitle = ref("");
const setOrderDetailTitle = ref("");

// 改变高级查询的控件显示状态
const changeAdvanceQueryUI = () => {
  showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
}

const state = reactive({
  dialogUploadVisible: false,
  fileList: [] as any,
});

// 打开上传页面
const openImportOrder = () => {
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
  params.append('file', state.fileList[0].raw);
  var res = await importOrderExcel(params);
  state.extras = res.data.extras;
  if (state.extras) {
    console.log(state.extras.url);
    return;
  }
  console.log(res);
  handleQuery();
  ElMessage.success('上传成功');
  state.dialogUploadVisible = false;
};

const downloadExcel = async () => {
  var res = await getOrderTempExcel();
  var fileName = getFileName(res.headers);

  downloadByData(res.data, fileName);
}

const downloadErrorExcel = async () => {
  if (state.extras)
    downloadByUrl({ url: state.extras.url, fileName: state.extras.fileName });
}


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageOrder(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddOrder = () => {
  editOrderTitle.value = '添加订单列表';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditOrder = (row: any) => {
  editOrderTitle.value = '编辑订单列表';
  editDialogRef.value.openDialog(row);
};

// 打开排产页面
const openAddOrderDetail = (row: any) => {
  setOrderDetailTitle.value = '添加排产';
  let detailModel = {
    orderId: row.id,
    orderDetailCode: row.batchNumber,
    quantity: row.quantity,
    pUnit: row.pUnit,
    isAdd: true
  }
  setOrderDetailRef.value.openDialog(detailModel);
};

// 打开编辑页面
const openEditOrderDetail = (row: any) => {
  setOrderDetailTitle.value = '编辑订单排产';
  setOrderDetailRef.value.openDialog(row);
};

// 删除
const delOrder = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteOrder(row);
      handleQuery();
      ElMessage.success("删除成功");
    })
    .catch(() => { });
};
// 删除排产
const delOrderDetail = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteOrderDetail(row);
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

handleQuery();
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}
</style>
