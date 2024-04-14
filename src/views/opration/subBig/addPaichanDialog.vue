<template>
	<div class="add-paichan-container">
		<el-dialog v-model="isShowDialog" :width="850" draggable="" @close="closeDialog">
			<template #header>
				<div style="color: #fff">
					<span> 添加未排产订单 </span>
				</div>
			</template>
			<div>
				<el-select class="custom-select" clearable filterable v-model="deviceId" placeholder="请选择设备外键" @change="switchDevice()">
					<el-option v-for="(item, index) in deviceDeviceIdDropdownList" :key="index" :label="item.label" :value="item.value" />
				</el-select>
				<div class="dischargeOrderList">
					<el-table
						class="tables"
						stripe
						:header-cell-style="{ background: '#031743', color: '#FFF' }"
						:data="dischargeOrderList"
						v-loading="loading"
						style="width: 100%"
						tooltip-effect="light"
						size="small"
					>
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
						<el-table-column prop="deliveryDate" label="交货日期" width="100" show-overflow-tooltip="">
							<template #default="scope">
								<span>{{ formatDate(scope.row.deliveryDate) }}</span>
							</template>
						</el-table-column>
						<el-table-column label="班次产量" width="100" show-overflow-tooltip="">
							<template #default="scope">
								<el-input class="yieldNum" v-model="scope.row.classOutput" @change="changeClassOutput(scope.row, $event)" size="small" style="width: 100%" />
							</template>
						</el-table-column>
						<el-table-column label="操作" width="50" show-overflow-tooltip="">
							<template #default="scope">
								<el-button style="color: #4080ff" icon="ele-Promotion" size="small" text="" type="primary" @click="addPaiChan(scope.row, $event)" v-auth="'orderDetail:edit'"></el-button
							></template>
						</el-table-column>
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

const loading = ref(true);
const isShowDialog = ref(false);
const childBorder = ref(false);
const deviceTypeId = ref<any>();
const orderDetailCode = ref<any>();
const deviceId = ref<any>();
const formPaiChan = ref<any>({
	operatorUsers: '',
	classOutput: 0,
	sort: 999,
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
	formPaiChan.value.classOutput = row.classOutput;
	if (formPaiChan.value.classOutput == 0) {
		ElMessage({
			message: '班次产量不得为0',
			type: 'error',
		});
		return;
	}
	const params = {
		qty: formPaiChan.value.classOutput,
		pUnit: row.pUnit,
		sort: formPaiChan.value.sort,
		remark: formPaiChan.value.remark,
		orderId: row.id,
		orderDetailCode: orderDetailCode.value,
		deviceId: deviceId.value,
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
	await getDeviceDeviceIdDropdownList();
	await getdischargeOrderList();
	await getSysUserOperatorUsersDropdownList();
	isShowDialog.value = true;
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
	// 遍历list.data.result的orderSurplusQuantity赋值给每一行的classOutput2;
	dischargeOrderList.value.forEach((item: any) => {
		item.classOutput = item.orderSurplusQuantity;
	});
	// formPaiChan.value.classOutput = list.data.result[0].orderSurplusQuantity;
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
	padding: 5% 3% 1% 1%;
	min-height: 530px;
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
	top: 130%;
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
</style>
