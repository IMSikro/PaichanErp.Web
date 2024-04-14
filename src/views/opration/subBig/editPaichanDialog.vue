<template>
	<div class="edit-paichan-container">
		<el-dialog v-model="isShowDialog" :width="850" draggable="">
			<template #header>
				<div style="color: #fff">
					<span> 修改排产信息 </span>
				</div>
			</template>
			<div>
				<div>
					<div>
						当前排产信息：
						<div style="width: 100px; color: white; text-align: center; display: inline; padding: 5px" :style="{ 'background-color': `rgb(${orderDetailModel.colorRgb})` }">
							批次号: {{ orderDetailModel.orderDetailCode }} 产品编号: {{ orderDetailModel.produceName }}
						</div>
					</div>
				</div>
				选择目标设备：
				<el-select clearable filterable v-model="deviceId" placeholder="请选择设备" @change="switchDevice()">
					<el-option v-for="(item, index) in deviceDeviceIdDropdownList" :key="index" :label="item.label" :value="item.value" />
				</el-select>
				<div>
					<el-table class="tables" :header-cell-style="{ background: '#031743', color: '#FFF' }" ax-height="300" :data="dischargeList" v-loading="loading" row-key="id" border="" size="small">
						<el-table-column prop="orderId" label="颜色" show-overflow-tooltip="">
							<template #default="scope">
								<div class="rank" :style="{ 'background-color': `rgb(${scope.row.colorRgb})` }" style="font-size: 10px; color: transparent; user-select: none">
									<span style="opacity: 0">{{ scope.row.id }}</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="produceIdProduceName" label="产品编号" show-overflow-tooltip=""
							><template #default="scope">
								<div>
									{{ scope.row.produceIdProduceName }}
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
				</div>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="doneAndOffline" type="customize" plain>终结完工</el-button>
					<el-button @click="done" type="customize" plain>小计完工</el-button>
					<el-button @click="deleteOne" type="down" plain>下 线</el-button>
					<el-divider direction="vertical" />
					<el-button type="customize" @click="submit">确 定</el-button>
					<el-button type="customize" @click="cancel">取 消</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 完工并下线弹框 -->
		<el-dialog v-model="isShowDialogDone" :width="650" draggable="">
			<template #header>
				<div style="color: #fff">
					<span> 完工并下线 </span>
				</div>
			</template>
			<div>
				<div class="formArea" style="margin: 1% 0; color: white">
					<el-form :model="ruleForm2" ref="ruleForm2Ref" label-width="auto" :rules="rules2">
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="产量" prop="qty">
									<el-input v-model="ruleForm2.qty" placeholder="请输入产量" maxlength="20" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="非生产时间(小时)" prop="deviceErrorTime">
									<el-input v-model="ruleForm2.deviceErrorTime" placeholder="请输入时间" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="14" :md="14" :lg="14" :xl="14" class="mb20">
								<el-form-item label="非生产时间类型" prop="timeType">
									<el-select v-model="ruleForm2.timeType" filterable allow-create collapse-tags collapse-tags-tooltip :loading="loading" :reserve-keyword="false" default-first-option>
										<el-option v-for="(item, index) in errorTypeDropdown" :key="index" :label="item.label" :value="item.value" />
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
		<!-- 完工弹框 -->
		<el-dialog v-model="isShowDialogDone3" :width="650" draggable="">
			<template #header>
				<div style="color: #fff">
					<span> 完工 </span>
				</div>
			</template>
			<div>
				<div class="formArea" style="margin: 1% 0; color: white">
					<el-form :model="ruleForm3" ref="ruleForm3Ref" label-width="auto" :rules="rules3">
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="产量" prop="qty">
									<el-input v-model="ruleForm3.qty" placeholder="请输入产量" maxlength="20" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="非生产时间(小时)" prop="deviceErrorTime">
									<el-input v-model="ruleForm3.deviceErrorTime" placeholder="请输入时间" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="非生产时间类型" prop="timeType">
									<el-select v-model="ruleForm3.timeType" filterable allow-create collapse-tags collapse-tags-tooltip :loading="loading" :reserve-keyword="false" default-first-option>
										<el-option v-for="(item, index) in errorTypeDropdown" :key="index" :label="item.label" :value="item.value" />
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
import { listOrderDetailByDeviceId, addOrderDetail, updateOrderDetail, doneAndNext, deviceErrorTypeDropdown, deleteOrderDetail } from '/@/api/main/orderDetail';
import { getOrderOrderIdDropdown, getDeviceDeviceIdDropdown, getOrderDetail, getSysUserOperatorUsersDropdown } from '/@/api/main/orderDetail';

interface ListItem {
	value: string;
	label: string;
}

const isShowDialog = ref(false);
const isShowDialogDone = ref(false);
const isShowDialogDone3 = ref(false);
const deviceTypeId = ref<number>();
const orderDetailId = ref<number>();
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
//自行添加其他规则
// const rules = ref<FormRules>({
// 	deviceId: [{ required: true, message: '请选择设备！', trigger: 'change' }],
// 	operatorUsers: [{ required: true, message: '请选择操作人员！', trigger: 'change' }],
// 	qty: [{ required: true, message: '请输入班次产量！', trigger: 'blur' }],
// });
//自行添加其他规则
const validateDeviceErrorType = (rule, value, callback) => {
	if (ruleForm2.value.deviceErrorTime && ruleForm2.value.deviceErrorTime > 0) {
		if (!value) {
			callback(new Error('非生产时间类型不能为空！'));
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
	deviceErrorType: [
		{
			validator: validateDeviceErrorType,
			trigger: 'blur',
		},
	],
	qty: [{ required: true, message: '请输入产量！', trigger: 'blur' }],
});
const validateDeviceErrorType3 = (rule, value, callback) => {
	if (ruleForm3.value.deviceErrorTime && ruleForm3.value.deviceErrorTime > 0) {
		if (!value) {
			callback(new Error('非生产时间类型不能为空！'));
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
	deviceErrorType: [
		{
			validator: validateDeviceErrorType3,
			trigger: 'blur',
		},
	],
	qty: [{ required: true, message: '请输入产量！', trigger: 'blur' }],
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
	const params = {
		id: orderDetailId.value.id,
		deviceId: deviceId.value,
	};

	await updateOrderDetail(params);
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
// 完工并下线弹框
const doneAndOffline = () => {
	isShowDialogDone.value = true;
	ruleForm2.value.qty = orderDetailId.value.qty;
	remoteMethod('1');
};
// 完工并下线 接口
const submitDone = async () => {
	ruleForm2Ref.value.validate(async (isValid: boolean, fields?: any) => {
		if (isValid) {
			// 深拷贝ruleForm2赋值给params
			const params = JSON.parse(JSON.stringify(ruleForm2.value));
			// 完工日期
			// 使用 ref 存储当前日期对象
			const currentDate = ref(new Date());
			const year = currentDate.value.getFullYear();
			const month = currentDate.value.getMonth() + 1;
			const day = currentDate.value.getDate();
			// 最终赋值
			params.id = orderDetailId.value.id;
			params.endDate = `${year}-${month}-${day}`;
			params.deviceErrorType = ruleForm2.value.timeType;
			delete params.timeType;
			console.log('params', params);
			await updateOrderDetail(params);
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

// 完工
const done = async () => {
	isShowDialogDone3.value = true;
	ruleForm3.value.qty = orderDetailId.value.qty;
};
// 完工 接口
const submitDone3 = async () => {
	ruleForm3Ref.value.validate(async (isValid: boolean, fields?: any) => {
		if (isValid) {
			// 深拷贝ruleForm2赋值给params
			const params = JSON.parse(JSON.stringify(ruleForm3.value));
			// 完工日期
			// 使用 ref 存储当前日期对象
			const currentDate = ref(new Date());
			const year = currentDate.value.getFullYear();
			const month = currentDate.value.getMonth() + 1;
			const day = currentDate.value.getDate();
			// 最终赋值
			params.id = orderDetailId.value.id;
			params.endDate = `${year}-${month}-${day}`;
			params.deviceErrorType = ruleForm3.value.timeType;
			delete params.timeType;
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
	ElMessageBox.confirm(`确定要删除该排产吗?`, `删除排产`, {
		//  - ${orderDetailId.value.id}
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const params = {
				id: orderDetailId.value.id,
			};
			await deleteOrderDetail(params);
			closeDialog();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
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

// 远程搜索
const remoteMethod = async (query: string) => {
	if (query) {
		loading.value = true;
		try {
			// 调用接口获取远程数据
			const res = await deviceErrorTypeDropdown();
			// 处理接口返回的数据，将其格式化为列表项
			const options = res.data.result.map((item: any) => ({
				value: item.value,
				label: item.label,
			}));
			console.log('options', options);
			errorTypeDropdown.value = options;
			// options.value = options.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
		} catch (error) {
			console.error('Error fetching remote data:', error);
			errorTypeDropdown.value = [];
		} finally {
			loading.value = false;
		}
	} else {
		errorTypeDropdown.value = [];
	}
};

// 页面加载时
onMounted(async () => {});

// 查看排产详情信息
const orderDetailModel = ref<any>({});
const getOrderDetailModel = async () => {
	console.log('orderDetailId', orderDetailId.value.id);

	let list = await getOrderDetail({ id: orderDetailId.value.id });
	orderDetailModel.value = list.data.result ?? {};
};

const orderOrderIdDropdownList = ref<any>([]);
const getOrderOrderIdDropdownList = async () => {
	let list = await getOrderOrderIdDropdown();
	orderOrderIdDropdownList.value = list.data.result ?? [];
};
getOrderOrderIdDropdownList();

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
	padding: 3.5% 3% 1% 1%;
	min-height: 530px;
	color: white;
}
:deep(.el-dialog__body) {
	color: white;
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
	top: 155%;
	opacity: 0;
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
</style>
