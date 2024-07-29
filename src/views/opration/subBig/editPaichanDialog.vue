<template>
	<div class="edit-paichan-container">
		<el-dialog v-model="isShowDialog" :width="850" draggable>
			<template #header>
				<div style="color: #fff">
					<span>修改排产信息</span>
				</div>
			</template>
			<div>
				<div>
					<div>
						当前排产信息：
						<div>
							<el-table ref="tableRef" class="tables"
								:header-cell-style="{ background: '#031743', color: '#FFF' }" ax-height="300"
								:data="dischargeList2" v-loading="loading" row-key="id" border size="small"
								@row-click="handleRowClick" @selection-change="handleSelectionChange">
								<el-table-column type="selection" width="45" />
								<el-table-column prop="colorRgb" label="颜色" width="55" show-overflow-tooltip>
									<template #default="scope">
										<div class="rank"
											:style="{ 'background-color': `rgb(${scope.row.colorRgb})`, border: '1px solid white' }"
											style="font-size: 10px; color: transparent; user-select: none">
											<span style="opacity: 0">{{ scope.row.id }}</span>
										</div>
									</template>
								</el-table-column>
								<el-table-column prop="produceCode" label="产品编号" show-overflow-tooltip>
									<template #default="scope">
										<div>{{ scope.row.produceCode }}</div>
									</template>
								</el-table-column>
								<!-- <el-table-column prop="produceName" label="产品名称" show-overflow-tooltip>
								<template #default="scope">
									<div>{{ scope.row.produceName }}</div>
								</template>
							</el-table-column> -->
								<el-table-column prop="deliveryDate" label="交期" show-overflow-tooltip>
									<template #default="scope">{{ formatDate(scope.row.deliveryDate) }}</template>
								</el-table-column>
								<el-table-column prop="qty" label="班次产量" width="45" show-overflow-tooltip>
									<template #default="scope">
										<div>{{ scope.row.qty }}</div>
									</template>
								</el-table-column>

								<!-- <el-table-column prop="orderIdBatchNumber" label="订单批号" show-overflow-tooltip>
								<template #default="scope">
									<span>{{ scope.row.orderIdBatchNumber }}</span>
								</template>
							</el-table-column> -->
							</el-table>
						</div>
						<!-- <el-row :gutter="20">
							<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
								颜色:
								<el-tag
									:style="{ 'background-color': `rgb(${orderDetailModel.colorRgb})`, 'width': '3rem' }"
								></el-tag>
							</el-col>
							<el-col
								:xs="24"
								:sm="12"
								:md="12"
								:lg="8"
								:xl="8"
							>产品编号: {{ orderDetailModel.produceIdProduceName }}</el-col>
							<el-col
								:xs="24"
								:sm="12"
								:md="12"
								:lg="8"
								:xl="8"
							>批次号: {{ orderDetailModel.orderDetailCode }}</el-col>
						</el-row> -->
						<!-- <div>
							<el-tag
								:style="{ 'background-color': `rgb(${orderDetailModel.colorRgb})`, 'width': '3rem' }">
							</el-tag>
							<div style="width: 80%; color: white; display: inline; padding: 1rem;">
								产品编号: {{ orderDetailModel.produceIdProduceName }}
							</div>
							<div style=" width: 80%; color: white;display: inline; padding: 1rem;">
								批次号: {{ orderDetailModel.orderDetailCode }}
							</div>
						</div>-->
					</div>
				</div>选择目标设备：
				<el-select clearable v-model="deviceId" placeholder="请选择设备" @change="switchDevice()">
					<el-option v-for="(item, index) in deviceDeviceIdDropdownList" :key="index" :label="item.label"
						:value="item.value" />
				</el-select>
				<div>
					<el-table class="tables" :header-cell-style="{ background: '#031743', color: '#FFF' }"
						ax-height="300" :data="dischargeList" v-loading="loading" row-key="id" border size="small">
						<el-table-column prop="orderId" label="颜色" show-overflow-tooltip>
							<template #default="scope">
								<div class="rank"
									:style="{ 'background-color': `rgb(${scope.row.colorRgb})`, border: '1px solid white' }"
									style="font-size: 10px; color: transparent; user-select: none">
									<span style="opacity: 0">{{ scope.row.id }}</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="produceCode" label="产品编号" show-overflow-tooltip>
							<template #default="scope">
								<div>{{ scope.row.produceCode }}</div>
							</template>
						</el-table-column>
						<el-table-column prop="deliveryDate" label="交期" show-overflow-tooltip>
							<template #default="scope">{{ formatDate(scope.row.deliveryDate) }}</template>
						</el-table-column>
						<el-table-column prop="qty" label="班次产量" show-overflow-tooltip>
							<template #default="scope">
								<span>{{ scope.row.qty ?? 0 }}</span>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<!-- <el-divider>移动到 ↓ </el-divider>
				选择目标设备：
				<el-select clearable filterable v-model="deviceId" placeholder="请选择设备" @change="switchDevice()">
					<el-option v-for="(item, index) in deviceDeviceIdDropdownList" :key="index" :label="item.label"
						:value="item.value" />
				</el-select>
				<div>
					<el-table class="tables" :header-cell-style="{ background: '#031743', color: '#FFF' }"
						ax-height="300" :data="dischargeList" v-loading="loading" row-key="id" border="" size="small">
						<el-table-column prop="orderId" label="颜色" show-overflow-tooltip="">
							<template #default="scope">
								<div class="rank"
									:style="{ 'background-color': `rgb(${scope.row.colorRgb})`, border: '1px solid white' }"
									style="font-size: 10px; color: transparent; user-select: none">
									<span style="opacity: 0">{{ scope.row.id }}</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="produceIdProduceName" label="产品编号" show-overflow-tooltip=""><template
								#default="scope">
								<div>
									{{ scope.row.produceCode }}
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="deliveryDate" label="交期" show-overflow-tooltip="">
							<template #default="scope">
								{{ formatDate(scope.row.deliveryDate) }}
							</template>
						</el-table-column>
						<el-table-column prop="qty" label="班次产量" show-overflow-tooltip="">
							<template #default="scope">
								<span>{{ scope.row.qty ?? 0 }}</span>
							</template>
						</el-table-column>
					</el-table>
				</div>-->
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="doneAndOffline" type="customize" plain>终结完工</el-button>
					<el-button @click="done" type="customize" plain>小计完工</el-button>
					<el-button @click="deleteOne" type="down" plain>下 线</el-button>
					<el-divider />
					<el-button type="customize" @click="submit">移 机</el-button>
					<el-button type="customize" @click="cancel">取 消</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 终结完工弹框 -->
		<el-dialog v-model="isShowDialogDone" :width="650" draggable>
			<template #header>
				<div style="color: #fff">
					<span>终结完工</span>
				</div>
			</template>
			<div>
				<div class="formArea" style="margin: 1% 0; color: white">
					<el-form :model="ruleForm2" ref="ruleForm2Ref" label-width="auto" :rules="rules2">
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="完工数量" prop="qty">
									<el-input v-model="ruleForm2.qty" placeholder="请输入完工数量" maxlength="20" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="非生产时间(小时)" prop="deviceErrorTime">
									<el-input v-model="ruleForm2.deviceErrorTime" placeholder="请输入时间" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="14" :md="14" :lg="14" :xl="14" class="mb20">
								<el-form-item label="非生产时间类型" prop="deviceErrorTypeId">
									<el-select v-model="ruleForm2.deviceErrorTypeId" filterable clearable
										:loading="loading">
										<el-option v-for="(item, index) in deviceErrorTypeDropdownList" :key="index"
											:label="item.label" :value="item.value" />
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="customize" @click="isShowDialogDone = false">取 消</el-button>
					<el-button type="customize" @click="submitDone">确 定</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 小计完工弹框 -->
		<el-dialog v-model="isShowDialogDone3" :width="650" draggable>
			<template #header>
				<div style="color: #fff">
					<span>小计完工</span>
				</div>
			</template>
			<div>
				<div class="formArea" style="margin: 1% 0; color: white">
					<el-form :model="ruleForm3" ref="ruleForm3Ref" label-width="auto" :rules="rules3">
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="完工数量" prop="qty">
									<el-input v-model="ruleForm3.qty" placeholder="请输入完工数量" maxlength="20" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="非生产时间(小时)" prop="deviceErrorTime">
									<el-input v-model="ruleForm3.deviceErrorTime" placeholder="请输入时间" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="非生产时间类型" prop="deviceErrorTypeId">
									<el-select v-model="ruleForm3.deviceErrorTypeId" filterable clearable>
										<el-option v-for="(item, index) in deviceErrorTypeDropdownList" :key="index"
											:label="item.label" :value="item.value" />
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="customize" @click="isShowDialogDone3 = false">取 消</el-button>
					<el-button type="customize" @click="submitDone3">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import type { FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { listDevice } from '/@/api/main/device';
import { auth } from '/@/utils/authFunction';
import { listOrderDetailByDeviceId, addOrderDetail, updateOrderDetail, batchUpdateDevices, batchDelete, updateDone, doneAndNext, deviceErrorTypeDropdown, deleteOrderDetail } from '/@/api/main/orderDetail';
import { getOrderOrderIdDropdown, getDeviceDeviceIdDropdown, getOrderDetail, getSysUserOperatorUsersDropdown } from '/@/api/main/orderDetail';

interface ListItem {
	value: string;
	label: string;
}

const isShowDialog = ref(false);
const isShowDialogDone = ref(false);
const isShowDialogDone3 = ref(false);
const deviceTypeId = ref<number>();
const orderDetailId = ref<any>();
// const deviceErrorTime = ref<any>();
const errorTypeDropdown = ref<ListItem[]>([]);
const loading = ref(false);
// const ruleFormRef = ref();
const deviceId = ref<any>();
const ruleForm = ref<any>({});
const ruleForm2Ref = ref();
const ruleForm2 = ref<any>({});
const ruleForm3Ref = ref();
const ruleForm3 = ref<any>({});
const dischargeList2 = ref<any>([]);
const tableRef = ref(null);
const orderModel = ref<any>({});
//自行添加其他规则
// const rules = ref<FormRules>({
// 	deviceId: [{ required: true, message: '请选择设备！', trigger: 'change' }],
// 	operatorUsers: [{ required: true, message: '请选择操作人员！', trigger: 'change' }],
// 	qty: [{ required: true, message: '请输入班次产量！', trigger: 'blur' }],
// });
//自行添加其他规则
const validateDeviceErrorType = (rule: any, value: number, callback: any) => {
	if (ruleForm2.value.deviceErrorTime && ruleForm2.value.deviceErrorTime > 0) {
		if (!value || value == 0) {
			callback(new Error('非生产工时类型不能为空！'));
		} else {
			callback();
		}
	} else {
		callback();
	}
};
const rules2 = ref<FormRules>({
	deviceErrorTime: [
		{
			pattern: /^\d+(\.\d{1})?$/, // 正则表达式，确保为1位小数的数字
			message: '请输入整数或1位小数的数字！',
			trigger: 'blur',
		},
	],
	deviceErrorTypeId: [
		{
			validator: validateDeviceErrorType,
			trigger: 'blur',
		},
	],
	qty: [{ required: true, message: '请输入完工数量！', trigger: 'blur' }],
});
const validateDeviceErrorType3 = (rule: any, value: number, callback: any) => {
	if (ruleForm3.value.deviceErrorTime && ruleForm3.value.deviceErrorTime > 0) {
		if (!value || value == 0) {
			callback(new Error('非生产工时类型不能为空！'));
		} else {
			callback();
		}
	} else {
		callback();
	}
};
//自行添加其他规则
const rules3 = ref<FormRules>({
	deviceErrorTime: [
		{
			pattern: /^\d+(\.\d{1})?$/, // 正则表达式，确保为1位小数的数字
			message: '请输入整数或1位小数的数字！',
			trigger: 'blur',
		},
	],
	deviceErrorTypeId: [
		{
			validator: validateDeviceErrorType3,
			trigger: 'blur',
		},
	],
	qty: [{ required: true, message: '请输入完工数量！', trigger: 'blur' }],
});

//父级传递来的函数，用于回调
const emit = defineEmits(['reloadDeviceList']);

// 打开弹窗
const openDialog = async (data: any) => {
	// console.log('data', data);

	orderDetailId.value = data.orderDetailId;
	deviceTypeId.value = data.deviceType;
	// ruleForm.value = JSON.parse(JSON.stringify(orderDetailId.value));

	let rowModel = JSON.parse(JSON.stringify(orderDetailId.value));
	const operatorUsers = rowModel.operatorUsers.split(',').map((x: any) => Number(x));
	rowModel.operatorUsers = operatorUsers;
	// console.log(rowModel);
	ruleForm.value = rowModel;
	deviceId.value = rowModel.deviceId;
	await getDeviceDeviceIdDropdownList();
	await getOrderDetailModel();
	await getlistOrderDetailByDeviceId2();
	await getlistOrderDetailByDeviceId();
	await getSysUserOperatorUsersDropdownList();

	isShowDialog.value = true;
};


// 关闭弹窗
const closeDialog = () => {
	emit('reloadDeviceList', { deviceTypeId: deviceTypeId.value });
	isShowDialog.value = false;
	isShowDialogDone.value = false;
	isShowDialogDone3.value = false;
};

// 取消
const cancel = () => {
	isShowDialog.value = false;
};

// 提交
const submit = async () => {

	//通过Element-Plus表格的getSelectionRows的方法，获取已选中的数据
	let tableData = tableRef.value.getSelectionRows();

	console.log("选中数据", tableData)
	// const filteredItems = tableData.map(item => ({ id: item.id}));
	let arr = tableData.map((item) => { return item.id })
	// console.log(arr,deviceId.value)
	const params = {
		ids: arr,
		deviceId: deviceId.value,
	};
	console.log(params)
	await batchUpdateDevices(params);
	ElMessage.success('操作成功');
	closeDialog();
	// 原代码
	// ruleFormRef.value.validate(async (isValid: boolean, fields?: any) => {
	// 	if (isValid) {
	// 		let values = ruleForm.value;
	// 		const operatorUsers = values.operatorUsers.join(',');
	// 		values.operatorUsers = operatorUsers;
	// 		await updateOrderDetail(values);
	// 		closeDialog();
	// 	} else {
	// 		ElMessage({
	// 			message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
	// 			type: 'error',
	// 		});
	// 	}
	// });
};
// 终结完工弹框
const doneAndOffline = () => {
	let tableData = tableRef.value.getSelectionRows();

	console.log("选中数据", tableData.length)
	if (tableData.length == 1) {
		isShowDialogDone.value = true;
		ruleForm2.value = {};
		ruleForm2.value.qty = tableData[0].qty;
	} else {
		ElMessage.error('只能选择一个');
	}

	// remoteMethod('1');
};
// 终结完工 接口
const submitDone = async () => {
	let tableData = tableRef.value.getSelectionRows();

	console.log("选中数据", tableData[0].id)
	ruleForm2Ref.value.validate(async (isValid: boolean, fields?: any) => {
		if (isValid) {
			// 深拷贝ruleForm2赋值给params
			const params = JSON.parse(JSON.stringify(ruleForm2.value));
			// params.id = orderDetailId.value.id;
			params.id = tableData[0].id
			await updateDone(params);
			ElMessage.success('操作成功');
			closeDialog();
		} else {
			ElMessage({
				message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
				type: 'error',
			});
		}
	});
	// isShowDialogDone.value = false;
	// isShowDialog.value = false;
};

// 小计完工
const done = async () => {

	let tableData = tableRef.value.getSelectionRows();

	console.log("选中数据", tableData)
	if (tableData.length == 1) {
		isShowDialogDone3.value = true;
		ruleForm3.value = {};
		ruleForm3.value.qty = tableData[0].qty;
	} else {
		ElMessage.error('只能选择一个');
	}

};
// 小计完工 接口
const submitDone3 = async () => {
	let tableData = tableRef.value.getSelectionRows();
	console.log("选中数据", tableData[0].id)
	ruleForm3Ref.value.validate(async (isValid: boolean, fields?: any) => {
		if (isValid) {
			// 深拷贝ruleForm2赋值给params
			const params = JSON.parse(JSON.stringify(ruleForm3.value));
			// params.id = orderDetailId.value.id;
			params.id = tableData[0].id
			console.log('params', params);
			await doneAndNext(params);
			ElMessage.success('操作成功');
			closeDialog();
		} else {
			ElMessage({
				message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
				type: 'error',
			});
		}
	});
};

// 删除排产
const deleteOne = async () => {
	//通过Element-Plus表格的getSelectionRows的方法，获取已选中的数据
	let tableData = tableRef.value.getSelectionRows();
	let arr = tableData.map((item) => { return item.id })
	ElMessageBox.confirm(`确定要删除该排产吗?`, `删除排产`, {
		//  - ${orderDetailId.value.id}
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const params = {
				ids: arr,
			};
			console.log(params)
			await batchDelete(params);
			closeDialog();
			ElMessage.success('删除成功');
		})
		.catch(() => { });
};
// 修改排产时 - 切换设备
const switchDevice = async () => {
	await getlistOrderDetailByDeviceId();
};
// 查看设备下的排产信息
const dischargeList = ref<any>([]);
const getlistOrderDetailByDeviceId = async () => {
	let list = await listOrderDetailByDeviceId({ deviceId: deviceId.value });
	dischargeList.value = list.data.result ?? [];
	// console.log('list', list.data.result);
};


const getlistOrderDetailByDeviceId2 = async () => {
	let list = await listOrderDetailByDeviceId({ deviceId: deviceId.value });
	dischargeList2.value = list.data.result ?? [];
	// console.log('list', list.data.result);
};
//排产信息表格多选
const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
	multipleSelection.value = val
	console.log(multipleSelection.value)
};
const handleRowClick = (row, column, event) => {
	console.log('行点击', row)
	// if (event.target.tagName.toUpperCase() !== 'INPUT') {
	// 	table.value.toggleRowSelection(row);
	// }

};

// 远程搜索
// const remoteMethod = async (query: string) => {
// 	if (query) {
// 		loading.value = true;
// 		try {
// 			// 调用接口获取远程数据
// 			const res = await deviceErrorTypeDropdown();
// 			// 处理接口返回的数据，将其格式化为列表项
// 			const options = res.data.result.map((item: any) => ({
// 				value: item.value,
// 				label: item.label,
// 			}));
// 			console.log('options', options);
// 			errorTypeDropdown.value = options;
// 			// options.value = options.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
// 		} catch (error) {
// 			console.error('Error fetching remote data:', error);
// 			errorTypeDropdown.value = [];
// 		} finally {
// 			loading.value = false;
// 		}
// 	} else {
// 		errorTypeDropdown.value = [];
// 	}
// };

// 页面加载时
onMounted(async () => { });

// 查看排产详情信息
const orderDetailModel = ref<any>({});
const getOrderDetailModel = async () => {
	let list = await getOrderDetail({ id: orderDetailId.value.id });
	orderDetailModel.value = list.data.result ?? {};
	// orderModel.value = orderDetailModel.value
	orderModel.value = orderDetailModel.value ?? {};
	console.log('orderModel', orderModel.value);
	console.log('tableRef', tableRef.value)
	console.log('第一条数据', dischargeList2.value[0])
	setTimeout(() => {
		dischargeList2.value.forEach(row => {
			console.log(row)
			if (row.id == orderModel.value.id) {
				tableRef.value.toggleRowSelection(row, true)
			} else {
				tableRef.value.toggleRowSelection(row, false)
			}
		})
	}, 1000);

};

const orderOrderIdDropdownList = ref<any>([]);
const getOrderOrderIdDropdownList = async () => {
	let list = await getOrderOrderIdDropdown();
	orderOrderIdDropdownList.value = list.data.result ?? [];
};
getOrderOrderIdDropdownList();

const deviceErrorTypeDropdownList = ref<any>([]);
const getDeviceErrorTypeDropdownList = async () => {
	let list = await deviceErrorTypeDropdown();
	deviceErrorTypeDropdownList.value = list.data.result ?? [];
};
getDeviceErrorTypeDropdownList();

const deviceDeviceIdDropdownList = ref<any>([]);
const getDeviceDeviceIdDropdownList = async () => {
	let list = await listDevice({});
	deviceDeviceIdDropdownList.value =
		list.data.result
			?.filter((x: { deviceTypeId: number | undefined }) => x.deviceTypeId == deviceTypeId.value)
			.map((v: { deviceCode: any; id: any }) => {
				return {
					label: v.deviceCode,
					value: v.id,
				};
			}) ?? [];
};

const sysUserOperatorUsersDropdownList = ref<any>([]);
const getSysUserOperatorUsersDropdownList = async () => {
	let list = await getSysUserOperatorUsersDropdown();
	sysUserOperatorUsersDropdownList.value = list.data.result ?? [];
};

const console_Log = () => {
	console.log(ruleForm.value.operatorUsers);
};

// 格式化日期
const formatDate = (dateString: string | number | Date) => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};
//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>

<style scoped>
/* 弹出框样式 */
:deep(.el-dialog) {
	--el-dialog-bg-color: transparent;
	background: url('../../../assets/bigScreen/add_bg.png') no-repeat center center / 100% 100%;
	padding: 4% 3% 1% 1%;
	min-height: 530px;
	color: white;
}

@media screen and (max-width: 768px) {
	:deep(.el-dialog) {
		height: 100%;
		overflow: auto;
		padding: 0;
		min-height: 330px;
		background: url('../../../assets/bigScreen/add_bg_phone.png') no-repeat center center / 100% 100% !important;
	}

	:deep(.el-dialog__header) {
		padding-top: 25%;
	}

	:deep(.el-dialog__body) {
		padding: 40% 5% 10% !important;
	}

	:deep(.el-dialog__footer) {
		/* position: absolute; */
		width: 100%;
		position: fixed;
		bottom: 4%;
		right: 5%;
		/* margin-bottom: 80px; */
		/* bottom: 4%; */
	}
}

:deep(.el-divider__text) {
	color: white;
	top: 10px;
	background-color: transparent;
}

:deep(.el-dialog__body) {
	color: white;
	padding: 5%;
	max-height: calc(100vh - 177px) !important;
}

:deep(.el-dialog__header) {
	width: 280px;
	height: 40px;
	position: absolute;
	top: 1.5%;
	left: 38%;
	font-size: 18.68px;
	background-color: transparent;
}

:deep(.el-dialog__headerbtn) {
	right: -89% !important;
	top: 258%;
}

/* 下拉框样式 */
:deep(.el-select__wrapper) {
	background-color: transparent;
	box-shadow: 0 0 0 1px #00a0e9 inset;
}

:deep(.el-select__placeholder) {
	color: white !important;
}

.el-select-dropdown__item {
	background-color: #001730;
	color: white;
	--el-scrollbar-bg-color: white;
	--el-scrollbar-hover-bg-color: white;
}

:deep(.el-scrollbar__view .el-select-dropdown__list) {
	padding-top: 0 !important;
}

/* el-table样式 */
.tables {
	margin: 2% 0 0 0;
	--el-table-border-color: transparent;
}

:deep(.el-table .cell) {
	color: white;
}

/* striped先开启斑马纹属性，这里是修改斑马纹颜色 */
:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
	background: #03275a;
}

/* 非斑马纹颜色 */
:deep(.el-table tr) {
	background: #061a40;
}

/* 斑马纹颜色定义完之后会显示自带的边框颜色，这里要重置 */
:deep(.el-table td, .building-top .el-table th.is-leaf) {
	border: none;
	color: white;
}

/* 这里是滑过斑马纹滑过时的颜色 */
:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
	background-color: #1e116d;
}

:deep(.el-table__inner-wrapper::before) {
	background-color: transparent;
}

/* 班次产量 */
:deep(.el-input__wrapper) {
	background-color: transparent;
	border: 1px solid #00539f;
	box-shadow: unset;
}

:deep(.el-input__inner) {
	text-align: center;
	color: white;
}

.el-button--customize {
	border: 0;
	color: white;
	background: url('../../../assets/bigScreen/addbtn.png') no-repeat center center / 100% 100%;
}

.el-button--customize:hover {
	border: 0;
	color: white;
	background: url('../../../assets/bigScreen/customize_bg.png') no-repeat center center / 100% 100% !important;
}

.el-button--down {
	border: 0;
	color: white;
	background: url('../../../assets/bigScreen/dange_btn_bg.png') no-repeat center center / 100% 100%;
}

.el-button--down:hover {
	border: 0;
	color: white;
	background-color: rgba(255, 49, 0, 0.5);
}

:deep(.el-form-item__label) {
	color: white;
}

/* 隐藏 Element Plus 表格多选框的CSS */
::v-deep .el-table .el-table__header-wrapper .el-checkbox {
	display: none;
}

/* 隐藏浏览器自带的滚动条 */

:deep(.el-dialog)::-webkit-scrollbar {
	display: none;
}

:deep(.el-dialog__body)::-webkit-scrollbar {
	display: none;
}


.:deep(.el-dialog)::-webkit-scrollbar-track {
	background-color: transparent;
	/* 设置滚动条轨道背景色为透明 */
}

:deep(.el-dialog)::-webkit-scrollbar-thumb {
	background-color: rgba(0, 0, 0, 0.2);
	/* 设置滚动条滑块颜色 */
	border-radius: 0.25em;
	/* 设置滚动条滑块圆角 */
}

/* 显示页面内的滚动条 */
.scrollable-content {
	overflow-y: auto;
	/* 启用垂直滚动条 */
}
</style>