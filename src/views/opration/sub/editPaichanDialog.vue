<template>
	<div class="edit-paichan-container">
		<el-dialog v-model="isShowDialog" :width="800" draggable="">
			<template #header>
				<div style="color: #fff">
					<!--<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>-->
					<span> 修改排产信息 </span>
				</div>
			</template>
			<div>
				<el-select clearable filterable v-model="deviceId" placeholder="请选择设备">
					<el-option v-for="(item, index) in deviceDeviceIdDropdownList" :key="index" :value="item.value" :label="item.label" />
				</el-select>
				<!-- <div class="formArea" style="margin: 1% 0">
					<el-form :model="ruleForm" ref="ruleFormRef" label-width="auto" :rules="rules">
						<el-row :gutter="35">
							<el-form-item v-show="false">
								<el-input v-model="ruleForm.id" />
							</el-form-item>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="订单批号" prop="orderId">
									<el-select clearable disabled filterable v-model="ruleForm.orderId" placeholder="请选择订单批号">
										<el-option v-for="(item, index) in orderOrderIdDropdownList" :key="index" :value="item.value" :label="item.label" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="班次序号" prop="orderDetailCode">
									<el-input disabled v-model="ruleForm.orderDetailCode" placeholder="请输入班次序号" maxlength="255" show-word-limit clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="设备" prop="deviceId">
									<el-select clearable filterable v-model="ruleForm.deviceId" placeholder="请选择设备">
										<el-option v-for="(item, index) in deviceDeviceIdDropdownList" :key="index" :value="item.value" :label="item.label" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="操作人员" prop="operatorUsers">
									<el-select filterable v-model="ruleForm.operatorUsers" placeholder="请选择操作人员" multiple @change="console_Log">
										<el-option v-for="(item, index) in sysUserOperatorUsersDropdownList" :key="index" :value="item.value" :label="item.label" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="计量单位" prop="pUnit">
									<el-input disabled v-model="ruleForm.pUnit" placeholder="请输入计量单位" maxlength="20" show-word-limit clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="班次产量" prop="qty">
									<el-input v-model="ruleForm.qty" placeholder="请输入班次产量" maxlength="20" clearable />
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
				</div> -->
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="doneOne" type="success" plain>完工并下线</el-button>
					<el-button @click="deleteOne" type="danger" plain>下 线</el-button>
					<el-divider direction="vertical" />
					<el-button type="primary" @click="submit">确 定</el-button>
					<el-button @click="cancel">取 消</el-button>
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
				<div class="formArea" style="margin: 1% 0">
					<el-form :model="ruleForm2" ref="ruleForm2Ref" label-width="auto" :rules="rules2">
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="产量" prop="qty">
									<el-input v-model="ruleForm2.qty" placeholder="请输入产量" maxlength="20" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="非生产时间(小时)" prop="deviceErrorTime">
									<el-input v-model="ruleForm2.deviceErrorTime" placeholder="请输入非生产时间(小时)" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="非生产时间类型" prop="timeType">
									<el-select v-model="ruleForm2.timeType" multiple filterable remote reserve-keyword>
										<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
									</el-select>
								</el-form-item>
							</el-col>
							<!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" style="opacity: 1;">
								<el-form-item label="日期" prop="endDate">
									<el-date-picker placeholder="请选择完工日期" value-format="YYYY/MM/DD" type="date" v-model="ruleForm2.endDate" />
								</el-form-item>
							</el-col> -->
						</el-row>
					</el-form>
				</div>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="isShowDialogDone = false">取 消</el-button>
					<el-button type="primary" @click="submitDone">确 定</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 下线弹框 -->
		<el-dialog v-model="isShowDialogDone3" :width="650" draggable="">
			<template #header>
				<div style="color: #fff">
					<span> 下线 </span>
				</div>
			</template>
			<div>
				<div class="formArea" style="margin: 1% 0">
					<el-form :model="ruleForm3" ref="ruleForm3Ref" label-width="auto" :rules="rules3">
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="产量" prop="qty">
									<el-input v-model="ruleForm3.qty" placeholder="请输入产量" maxlength="20" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="非生产时间(小时)" prop="deviceErrorTime">
									<el-input v-model="ruleForm3.deviceErrorTime" placeholder="请输入非生产时间(小时)" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="非生产时间类型" prop="timeType">
									<el-select v-model="ruleForm3.timeType" multiple filterable remote reserve-keyword>
										<!-- <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" /> -->
									</el-select>
								</el-form-item>
							</el-col>
							<!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" style="opacity: 1;">
								<el-form-item label="日期" prop="endDate">
									<el-date-picker placeholder="请选择完工日期" value-format="YYYY/MM/DD" type="date" v-model="ruleForm2.endDate" />
								</el-form-item>
							</el-col> -->
						</el-row>
					</el-form>
				</div>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="isShowDialogDone3 = false">取 消</el-button>
					<el-button type="primary" @click="submitDone3">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import type { FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { addOrderDetail, updateOrderDetail, doneAndNext } from '/@/api/main/orderDetail';
import { listDevice } from '/@/api/main/device';
import { auth } from '/@/utils/authFunction';
import { getOrderOrderIdDropdown, getDeviceDeviceIdDropdown, getOrderDetail, getSysUserOperatorUsersDropdown } from '/@/api/main/orderDetail';

const isShowDialog = ref(false);
const isShowDialogDone = ref(false);
const isShowDialogDone3 = ref(false);
const deviceTypeId = ref<number>();
const orderDetailId = ref<number>();
const deviceErrorTime = ref<any>();
const ruleFormRef = ref();
const deviceId = ref();
const ruleForm = ref<any>({});
const ruleForm2Ref = ref();
const ruleForm2 = ref<any>({});
const ruleForm3Ref = ref();
const ruleForm3 = ref<any>({});
//自行添加其他规则
const rules = ref<FormRules>({
	deviceId: [{ required: true, message: '请选择设备！', trigger: 'change' }],
	operatorUsers: [{ required: true, message: '请选择操作人员！', trigger: 'change' }],
	qty: [{ required: true, message: '请输入班次产量！', trigger: 'blur' }],
});
//自行添加其他规则
const rules2 = ref<FormRules>({
	deviceErrorTime: [
		{ required: true, message: '请输入非生产时间(小时)！', trigger: 'blur' },
		{
			pattern: /^\d+(\.\d{1})?$/, // 正则表达式，确保为1位小数的数字
			message: '请输入整数或1位小数的数字！',
			trigger: 'blur',
		},
	],
	qty: [{ required: true, message: '请输入产量！', trigger: 'blur' }],
});
//自行添加其他规则
const rules3 = ref<FormRules>({
	deviceErrorTime: [
		{ required: true, message: '请输入非生产时间(小时)！', trigger: 'blur' },
		{
			pattern: /^\d+(\.\d{1})?$/, // 正则表达式，确保为1位小数的数字
			message: '请输入整数或1位小数的数字！',
			trigger: 'blur',
		},
	],
	qty: [{ required: true, message: '请输入产量！', trigger: 'blur' }],
});

//父级传递来的函数，用于回调
const emit = defineEmits(['reloadDeviceList']);

// 打开弹窗
const openDialog = async (data: any) => {
	console.log('data', data);

	orderDetailId.value = data.orderDetailId;
	deviceTypeId.value = data.deviceType;
	isShowDialog.value = true;
	// ruleForm.value = JSON.parse(JSON.stringify(orderDetailId.value));

	let rowModel = JSON.parse(JSON.stringify(orderDetailId.value));
	const operatorUsers = rowModel.operatorUsers.split(',').map((x: any) => Number(x));
	rowModel.operatorUsers = operatorUsers;
	console.log(rowModel);
	ruleForm.value = rowModel;
	deviceId.value = rowModel.deviceId;
	await getDeviceDeviceIdDropdownList();
	await getOrderDetailModel();
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
	ruleFormRef.value.validate(async (isValid: boolean, fields?: any) => {
		if (isValid) {
			let values = ruleForm.value;
			const operatorUsers = values.operatorUsers.join(',');
			values.operatorUsers = operatorUsers;
			await updateOrderDetail(values);
			closeDialog();
		} else {
			ElMessage({
				message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
				type: 'error',
			});
		}
	});
};
// 完工弹框
const doneOne = () => {
	isShowDialogDone.value = true;
	ruleForm2.value.qty = orderDetailId.value.qty;
};
// 完工 接口
const submitDone = async () => {
	ruleForm2Ref.value.validate(async (isValid: boolean, fields?: any) => {
		if (isValid) {
			ruleForm2.value.id = orderDetailId.value.id;
			ruleForm2.value.deviceErrorTime = deviceErrorTime.value;
			// 完工日期
			// 使用 ref 存储当前日期对象
			const currentDate = ref(new Date());
			const year = currentDate.value.getFullYear();
			const month = currentDate.value.getMonth() + 1;
			const day = currentDate.value.getDate();
			ruleForm2.value.endDate = `${year}-${month}-${day}`;
			let values = ruleForm2.value;
			console.log('values', values);

			await updateOrderDetail(values);
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

// 删除排产 - 下线
const deleteOne = async () => {
	isShowDialogDone3.value = true;
};
// 下线 接口
const submitDone3 = async () => {
	ruleForm3Ref.value.validate(async (isValid: boolean, fields?: any) => {
		if (isValid) {
			ruleForm3.value.id = orderDetailId.value.id;
			ruleForm3.value.deviceErrorTime = deviceErrorTime.value;
			// 完工日期
			// 使用 ref 存储当前日期对象
			const currentDate = ref(new Date());
			const year = currentDate.value.getFullYear();
			const month = currentDate.value.getMonth() + 1;
			const day = currentDate.value.getDate();
			ruleForm3.value.endDate = `${year}-${month}-${day}`;
			let values = ruleForm3.value;
			console.log('values', values);
			// await doneAndNext(values);
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

// 页面加载时
onMounted(async () => {});

const orderDetailModel = ref<any>({});
const getOrderDetailModel = async () => {
	let list = await getOrderDetail({ id: orderDetailId.value });
	orderDetailModel.value = list.data.result ?? {};
	console.log(orderDetailModel.value);
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
getSysUserOperatorUsersDropdownList();
const console_Log = () => {
	console.log(ruleForm.value.operatorUsers);
};
//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
