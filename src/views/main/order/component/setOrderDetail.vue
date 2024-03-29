<template>
	<div class="orderDetail-container">
		<el-dialog v-model="isShowDialog" :width="800" draggable="">
			<template #header>
				<div style="color: #fff">
					<!--<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>-->
					<span>{{ props.title }}</span>
				</div>
			</template>
			<el-form :model="ruleForm" ref="ruleFormRef" label-width="auto" :rules="rules">
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
						<el-input v-model="ruleForm.startDate" />
						<el-input v-model="ruleForm.endDate" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="订单批号" prop="orderId">
							<el-select clearable filterable v-model="ruleForm.orderId" placeholder="请选择订单批号" :disabled="true">
								<el-option v-for="(item, index) in orderOrderIdDropdownList" :key="index" :value="item.value" :label="item.label" :disable="true" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="班次序号" prop="orderDetailCode">
							<el-input v-model="ruleForm.orderDetailCode" placeholder="请输入班次序号" maxlength="255" show-word-limit clearable :disable="true" :disabled="true" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="设备" prop="deviceId">
							<el-select clearable filterable v-model="ruleForm.deviceId" placeholder="请选择设备" @change="setDeviceQty">
								<el-option v-for="(item, index) in deviceDeviceIdDropdownList" :key="index" :value="item.value" :label="item.label" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="操作人员" prop="operatorUsers">
							<el-select filterable v-model="ruleForm.operatorUsers" placeholder="请选择操作人员" multiple>
								<el-option v-for="(item, index) in sysUserOperatorUsersDropdownList" :key="index" :value="item.value" :label="item.label" />
							</el-select>
						</el-form-item> </el-col
					><el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="班次产量" prop="qty">
							<el-input v-model="ruleForm.qty" placeholder="请输入班次产量" maxlength="53" show-word-limit clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="计量单位" prop="pUnit">
							<el-input v-model="ruleForm.pUnit" placeholder="请输入计量单位" maxlength="255" show-word-limit clearable :disabled="true" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="排序" prop="sort">
							<el-input-number v-model="ruleForm.sort" placeholder="请输入排序" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="ruleForm.remark" placeholder="请输入备注" maxlength="255" show-word-limit clearable />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="submit">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<style scoped>
:deep(.el-select),
:deep(.el-input-number) {
	width: 100%;
}
</style>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
import { ElMessage } from 'element-plus';
import type { FormRules } from 'element-plus';
import { getProduce } from '/@/api/main/order';
import { pageOrderDetail } from '/@/api/main/orderDetail';
import { addOrderDetail, updateOrderDetail } from '/@/api/main/orderDetail';
import { getOrderOrderIdDropdown } from '/@/api/main/orderDetail';
import { getDeviceDeviceIdDropdown } from '/@/api/main/orderDetail';
import { getSysUserOperatorUsersDropdown } from '/@/api/main/orderDetail';
import { log } from 'console';

//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: '',
	},
});
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});
//自行添加其他规则
const rules = ref<FormRules>({
	orderDetailCode: [{ required: true, message: '请输入班次序号！', trigger: 'blur' }],
	deviceId: [{ required: true, message: '请选择设备！', trigger: 'blur' }],
	orderId: [{ required: true, message: '请选择订单！', trigger: 'blur' }],
	operatorUsers: [{ required: true, message: '请选择操作人员！', trigger: 'blur' }],
	qty: [{ required: true, message: '请输入班次产量！', trigger: 'blur' }],
	pUnit: [{ required: true, message: '请输入计量单位！', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = async (row: any) => {
	await getDeviceDeviceIdDropdownList();
	let rowModel = JSON.parse(JSON.stringify(row));
	if ('isAdd' in rowModel) {
		// let orderModel = await getProduce({ id: rowModel.orderId });
		// const order = orderModel.data.result ?? {};
		
		let detailListModel = await pageOrderDetail(Object.assign({ orderId: rowModel.orderId }));
		const detailList = detailListModel.data.result;
		// console.log(order, detailList);

		let sn = detailList.total > 0 ? (detailList.items.findLast((d) => d.id > 0).sn ?? 0) + 1 : 1;

		let qty = 0;
		if(ruleForm.value.deviceId > 0)
			if (detailList.total > 0){
				var deviceTypeId = deviceDeviceIdDropdownList.value.find(d => d.value == ruleForm.value.deviceId).deviceTypeId;
				var itemList = detailList.items.filter(od => od.deviceTypeId == deviceTypeId);
				for (var i = itemList.length - 1; i >= 0; i--) {
					qty += itemList[i].qty;
				}
			
			qty = rowModel.quantity - qty;
		}
		console.log(qty);
		ruleForm.value = { orderId: rowModel.orderId, orderDetailCode: `${rowModel.orderDetailCode}-${sn}`, qty, pUnit: rowModel.pUnit, sort: sn };
	} else {
		const operatorUsers = rowModel.operatorUsers.split(',').map((x) => Number(x));
		rowModel.operatorUsers = operatorUsers;
		console.log(rowModel);
		ruleForm.value = rowModel;
	}
	isShowDialog.value = true;
};

const setDeviceQty = async () => {
	let orderModel = await getProduce({ id: ruleForm.value.orderId });
	const order = orderModel.data.result ?? {};

	let detailListModel = await pageOrderDetail(Object.assign({ orderId: ruleForm.value.orderId }));
	const detailList = detailListModel.data.result;
	console.log(order, detailList);

	let qty = 0;
	if(ruleForm.value.deviceId > 0)
		if (detailList.total > 0){
			var deviceTypeId = deviceDeviceIdDropdownList.value.find(d => d.value == ruleForm.value.deviceId).deviceTypeId;
			var itemList = detailList.items.filter(od => od.deviceTypeId == deviceTypeId);
			for (var i = itemList.length - 1; i >= 0; i--) {
				qty += itemList[i].qty;
			}
		
		qty = order.quantity - qty;
	}
	ruleForm.value.qty = qty
}

// 关闭弹窗
const closeDialog = () => {
	emit('reloadTable');
	isShowDialog.value = false;
};

// 取消
const cancel = () => {
	isShowDialog.value = false;
};

// 提交
const submit = async () => {
	ruleFormRef.value.validate(async (isValid: boolean, fields?: any) => {
		if (isValid) {
			let values = ruleForm.value;
			const operatorUsers = values.operatorUsers.join(',');
			console.log(operatorUsers);
			values.operatorUsers = operatorUsers;
			if (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == '' || ruleForm.value.id == 0) {
				await addOrderDetail(values);
			} else {
				await updateOrderDetail(values);
			}
			closeDialog();
		} else {
			ElMessage({
				message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
				type: 'error',
			});
		}
	});
};

const orderOrderIdDropdownList = ref<any>([]);
const getOrderOrderIdDropdownList = async () => {
	let list = await getOrderOrderIdDropdown();
	orderOrderIdDropdownList.value = list.data.result ?? [];
};
getOrderOrderIdDropdownList();

const deviceDeviceIdDropdownList = ref<any>([]);
const getDeviceDeviceIdDropdownList = async () => {
	let list = await getDeviceDeviceIdDropdown();
	deviceDeviceIdDropdownList.value = list.data.result ?? [];
};
// getDeviceDeviceIdDropdownList();

const sysUserOperatorUsersDropdownList = ref<any>([]);
const getSysUserOperatorUsersDropdownList = async () => {
	let list = await getSysUserOperatorUsersDropdown();
	sysUserOperatorUsersDropdownList.value = list.data.result ?? [];
};
getSysUserOperatorUsersDropdownList();

// 页面加载时
onMounted(async () => {});

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
<style scoped>
::v-deep .el-space {
	align-items: start !important;
}
</style>
