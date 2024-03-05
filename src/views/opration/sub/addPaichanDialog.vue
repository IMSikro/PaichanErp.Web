<template>
	<div class="add-paichan-container">
		<el-dialog v-model="isShowDialog" :width="800" draggable="">
			<template #header>
				<div style="color: #fff">
					<!--<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>-->
					<span> 添加未排产订单 </span>
				</div>
			</template>
			<div>
				<el-select clearable filterable v-model="deviceId" placeholder="请选择设备外键" @change="switchDevice()">
					<el-option v-for="(item, index) in deviceDeviceIdDropdownList" :key="index" :label="item.label" :value="item.value" />
				</el-select>
				<div class="dischargeOrderList">未排产订单列表：</div>
			</div>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { addOrderDetail, updateOrderDetail } from '/@/api/main/orderDetail';
import { listDevice } from '/@/api/main/device';
import { getOrderOrderIdDropdown, getDeviceDeviceIdDropdown, getSysUserOperatorUsersDropdown, listNotPaichanOrderByDeviceId } from '/@/api/main/orderDetail';

const isShowDialog = ref(false);
const deviceTypeId = ref<any>();
const deviceId = ref<any>();
// 未排产订单列表 变量
const dischargeOrderList = ref<any>();

//父级传递来的函数，用于回调
const emit = defineEmits(['reloadDeviceList']);

// 打开弹窗
const openDialog = async (data: any) => {
	deviceId.value = data.deviceId;
	deviceTypeId.value = data.deviceType;
	isShowDialog.value = true;

	await getDeviceDeviceIdDropdownList();
	await getdischargeOrderList();
};

// 关闭弹窗
const closeDialog = () => {
	emit('reloadDeviceList', { deviceTypeId: deviceTypeId.value });
	isShowDialog.value = false;
};

// 取消
const cancel = () => {
	isShowDialog.value = false;
};

// 切换设备
const switchDevice = async () => {
	await getdischargeOrderList();
};

// 提交
const submit = async () => {
	// todo 业务代码
	closeDialog();
};

// 页面加载时
onMounted(async () => {});

// 获取未排产订列表
const getdischargeOrderList = async () => {
	const params = {
		deviceId: deviceId.value,
	};
	let list = await listNotPaichanOrderByDeviceId(params);
	dischargeOrderList.value = list.data.result ?? [];
	console.log('123:', dischargeOrderList.value);
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
			?.filter((x: { deviceTypeId: any }) => x.deviceTypeId == deviceTypeId.value)
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

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
(: { deviceTypeId: any; })(: { deviceCode: any; id: any; })
