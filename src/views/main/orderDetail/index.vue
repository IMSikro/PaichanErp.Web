<template>
  <div class="orderDetail-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="关键字">
              <el-input v-model="queryParams.searchKey" clearable="" placeholder="请输入模糊查询关键字"/>
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="订单批号">
              <el-select clearable="" filterable="" v-model="queryParams.orderId" placeholder="请选择订单批号">
                <el-option v-for="(item,index) in  orderOrderIdDropdownList" :key="index" :value="item.value" :label="item.label" />
                
              </el-select>
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="班次序号">
              <el-input v-model="queryParams.orderDetailCode" clearable="" placeholder="请输入班次序号"/>
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group>
                <el-button type="primary"  icon="ele-Search" @click="handleQuery" v-auth="'orderDetail:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>
                <el-button icon="ele-ZoomIn" @click="changeAdvanceQueryUI" v-if="!showAdvanceQueryUI"> 高级 </el-button>
                <el-button icon="ele-ZoomOut" @click="changeAdvanceQueryUI" v-if="showAdvanceQueryUI"> 隐藏 </el-button>
                
              </el-button-group>
              
              <el-button-group style="margin-left:20px">
                <el-button type="primary" icon="ele-Plus" @click="openAddOrderDetail" v-auth="'orderDetail:add'"> 新增 </el-button>
                
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
        <el-table-column prop="orderId" label="订单批号" width="120" show-overflow-tooltip="">
          <template #default="scope">
            <span>{{scope.row.orderIdBatchNumber}}</span>
            
          </template>
          
        </el-table-column>
        <el-table-column prop="orderDetailCode" label="班次序号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="startDate" label="开始时间" width="140" show-overflow-tooltip="" />
        <el-table-column prop="endDate" label="结束时间" width="140" show-overflow-tooltip="" />
        <el-table-column prop="deviceId" label="设备外键" width="120" show-overflow-tooltip="">
          <template #default="scope">
            <span>{{scope.row.deviceIdDeviceCode}}</span>
            
          </template>
          
        </el-table-column>
        <el-table-column prop="operatorUsers" label="操作人员" width="120" show-overflow-tooltip="">
          <template #default="scope">
            <span>{{scope.row.operatorUsersRealName}}</span>
            
          </template>
          
        </el-table-column>
        <el-table-column prop="qty" label="班次产量" width="140" show-overflow-tooltip="" />
        <el-table-column prop="pUnit" label="计量单位" width="140" show-overflow-tooltip="" />
        <el-table-column prop="sort" label="排序" width="140" show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
        <el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="" v-if="auth('orderDetail:edit') || auth('orderDetail:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditOrderDetail(scope.row)" v-auth="'orderDetail:edit'"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delOrderDetail(scope.row)" v-auth="'orderDetail:delete'"> 删除 </el-button>
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
        :title="editOrderDetailTitle"
        @reloadTable="handleQuery"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="orderDetail">
  import { ref } from "vue";
  import { ElMessageBox, ElMessage } from "element-plus";
  import { auth } from '/@/utils/authFunction';
  import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
  //import { formatDate } from '/@/utils/formatTime';

  import editDialog from '/@/views/main/orderDetail/component/editDialog.vue'
  import { pageOrderDetail, deleteOrderDetail } from '/@/api/main/orderDetail';
  import { getOrderOrderIdDropdown } from '/@/api/main/orderDetail';


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
  const editOrderDetailTitle = ref("");

  // 改变高级查询的控件显示状态
  const changeAdvanceQueryUI = () => {
    showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
  }
  

  // 查询操作
  const handleQuery = async () => {
    loading.value = true;
    var res = await pageOrderDetail(Object.assign(queryParams.value, tableParams.value));
    tableData.value = res.data.result?.items ?? [];
    tableParams.value.total = res.data.result?.total;
    loading.value = false;
  };

  // 打开新增页面
  const openAddOrderDetail = () => {
    editOrderDetailTitle.value = '添加订单排产';
    editDialogRef.value.openDialog({});
  };

  // 打开编辑页面
  const openEditOrderDetail = (row: any) => {
    editOrderDetailTitle.value = '编辑订单排产';
    editDialogRef.value.openDialog(row);
  };

  // 删除
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

  const orderOrderIdDropdownList = ref<any>([]); 
  const getOrderOrderIdDropdownList = async () => {
    let list = await getOrderOrderIdDropdown();
    orderOrderIdDropdownList.value = list.data.result ?? [];
  };
  getOrderOrderIdDropdownList();

  handleQuery();
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
	width: 100%;
}
</style>

