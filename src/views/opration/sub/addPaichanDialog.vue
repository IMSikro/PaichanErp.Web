<template>
	<div class="add-paichan-container">
		<el-dialog v-model="isShowDialog" :width="850" draggable="" @close="closeDialog">
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
				<div class="dischargeOrderList">
					<div style="margin: 2% 0 1% 0">未排产订单列表：</div>
					<el-table class="tables" :data="dischargeOrderList" v-loading="loading" style="width: 100%" tooltip-effect="light" border="" size="small">
						<el-table-column type="expand">
							<template #default="props">
								<div style="display: flex; justify-content: space-between; align-items: center; padding: 0 0.5%">
									<div style="display: flex; align-items: center">
										<div>操作人员：</div>
										<div>
											<el-select multiple collapse-tags collapse-tags-tooltip size="small" v-model="formPaiChan.operatorUsers" placeholder="请选择操作人员" @change="console_Log" style="width: 165px">
												<el-option v-for="(item, index) in sysUserOperatorUsersDropdownList" :key="index" :value="item.value" :label="item.label" />
											</el-select>
										</div>
									</div>
									<div style="display: flex; align-items: center">
										<div>班次产量：</div>
										<el-input
											v-model="formPaiChan.classOutput"
											@change="changeClassOutput(props.row, $event)"
											:placeholder="'不得大于' + props.row.orderSurplusQuantity + props.row.pUnit"
											size="small"
											style="width: 100px"
										/>
									</div>
									<div style="display: flex; align-items: center">
										<div>备注：</div>
										<el-input v-model="formPaiChan.remark" size="small" placeholder="请输入备注" style="width: 150px" clearable />
									</div>
									<div style="display: flex; align-items: center">
										<div>排序：</div>
										<el-input-number v-model="formPaiChan.sort" size="small" placeholder="请输入排序" style="width: 75px" clearable />
									</div>
									<div>
										<el-button icon="ele-Promotion" size="small" text="" type="primary" @click="addPaiChan(props.row, $event)" v-auth="'orderDetail:edit'"></el-button>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="orderId" label="颜色" width="100" show-overflow-tooltip="">
							<template #default="scope">
								<div :style="{ 'background-color': `rgb(${scope.row.colorRgb})` }">&nbsp;</div>
							</template>
						</el-table-column>
						<el-table-column prop="produceName" label="产品名称" width="" show-overflow-tooltip="" />
						<el-table-column prop="produceIdProduceName" label="产品编号" width="100" show-overflow-tooltip="" />
						<el-table-column prop="quantity" label="批次总量" width="100" show-overflow-tooltip="">
							<template #default="scope">
								<span>{{ scope.row.quantity + (scope.row.pUnit ?? '') }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="orderSurplusQuantity" label="订单余量" width="100" show-overflow-tooltip="">
							<template #default="scope">
								<span>{{ scope.row.orderSurplusQuantity + (scope.row.pUnit ?? '') }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="deliveryDate" label="交货日期" width="" show-overflow-tooltip="" />
					</el-table>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { addOrderDetail, updateOrderDetail } from '/@/api/main/orderDetail';
import { pageOrderDetail } from '/@/api/main/orderDetail';
import { listDevice } from '/@/api/main/device';
import { getOrderOrderIdDropdown, getDeviceDeviceIdDropdown, getSysUserOperatorUsersDropdown, listNotPaichanOrderByDeviceId } from '/@/api/main/orderDetail';

import { auth } from '/@/utils/authFunction';

const loading = ref(true);
const isShowDialog = ref(false);
const childBorder = ref(false);
const deviceTypeId = ref<any>();
const orderDetailCode = ref<any>();
const deviceId = ref<any>();
const formPaiChan = ref<any>({
	operatorUsers: '',
	classOutput: 0,
	sort: 0,
	remark: '',
});
const produceName = ref<any>();
//修改排产产量
const changeClassOutput = (row: any, e: any) => {
	if (formPaiChan.value.classOutput > row.orderSurplusQuantity) {
		ElMessage({
			message: `不得大于订单余量：${row.orderSurplusQuantity}`,
			type: 'error',
		});
		formPaiChan.value.classOutput = row.orderSurplusQuantity;
	}
};

// 计算班次序号
const calcSN = async (row: any) => {
	let detailListModel = await pageOrderDetail(Object.assign({ orderId: row.id }));
	const detailList = detailListModel.data.result;
	// console.log(detailList);
	let sn = detailList.total > 0 ? Number(detailList.items.findLast((d: { id: number }) => d.id > 0).orderDetailCode.split('-')[1]) + 1 : 1;
	// console.log('sn', sn);
	orderDetailCode.value = row.batchNumber + '-' + sn;
};

// 未排产订单列表 变量
const dischargeOrderList = ref<any>();
// 添加排产
const addPaiChan = async (row: any, e: any) => {
	// 先执行calcSN
	await calcSN(row);
	if (formPaiChan.value.operatorUsers.length == 0) {
		ElMessage({
			message: '请选择操作人员',
			type: 'error',
		});
		return;
	}

	if (formPaiChan.value.classOutput == 0) {
		ElMessage({
			message: '班次产量不得为0',
			type: 'error',
		});
		return;
	}
	const operatorUsersNew = formPaiChan.value.operatorUsers.join(',');
	const params = {
		qty: formPaiChan.value.classOutput,
		pUnit: row.pUnit,
		sort: formPaiChan.value.sort,
		remark: formPaiChan.value.remark,
		orderId: row.id,
		orderDetailCode: orderDetailCode.value,
		deviceId: deviceId.value,
		operatorUsers: operatorUsersNew,
	};
	// console.log(params);
	let res = await addOrderDetail(params);
	if (res.data.code == 200) {
		nextTick(async () => {
			await getdischargeOrderList();
		});
	}
};

const console_Log = () => {
	console.log(formPaiChan.value.operatorUsers);
};

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
	// isShowDialog.value = false;
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
	console.log('');
};

// 页面加载时
onMounted(async () => {
	loading.value = false;
	await nextTick(); // 确保DOM已经渲染完毕
});

// 获取未排产订列表
const getdischargeOrderList = async () => {
	const params = {
		deviceId: deviceId.value,
	};
	let list = await listNotPaichanOrderByDeviceId(params);
	dischargeOrderList.value = list.data.result ?? [];
	formPaiChan.value.classOutput = list.data.result[0].orderSurplusQuantity;
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
