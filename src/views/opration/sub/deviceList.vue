<template>
	<el-scrollbar style="padding-bottom: 1rem" ref="scrollbarRef" @wheel.prevent="handleScroll">
		<el-space alignment="flex-start">
			<el-card
				:style="{ 'min-height': minHeight + 55 + 'px' }"
				style="max-width: 500px; position: relative"
				v-for="item in deviceList"
				:key="item.id"
				:body-style="{ padding: '0px', marginBottom: '1px', minHeight: '10rem', maxHeight: '24rem' }"
			>
				<div style="display: flex; flex-direction: column; position: relative; padding-left: 2%">
					<div style="flex: 1" @click="goToDeviceManageDevice()">设备编号: {{ item.deviceCode }}</div>
					<div style="flex: 1" @click="changeOperator(item.id, item.operatorUsers)">人员: {{ renderingUsers(item.operatorUsers) }}</div>
					<div style="position: absolute; top: 0; right: 0">
						<el-button type="primary" size="small" @click="handleSetPaichanInfo(item.id, $event)">添加</el-button>
					</div>
				</div>
				<div class="tableArea" style="position: relative; display: flex; flex-direction: column" @wheel.prevent="handleScroll">
					<!-- <vxe-toolbar class="bar" ref="xToolbar1" custom style="height: 28px; position: relative; z-index: 999"> </vxe-toolbar> -->
					<vxe-table
						border
						show-overflow
						:row-config="{ useKey: true, height: 28 }"
						:id="item.id.toString()"
						:class="`tables${item.id}`"
						:height="minHeight - 20"
						:data="orderDetails[item.id]"
						:custom-config="{ storage: true }"
						:toolbar-onfig="{ custom: true }"
					>
						<vxe-column
							v-for="config in tableColumn"
							:key="config.key"
							:type="config.type"
							:field="config.field"
							:visible="config.show"
							:title="config.title"
							:fixed="config.fixed"
							:width="config.width"
						>
							<template v-if="config.field == 'colorRgb'" #default="{ row }">
								<div class="rank" :style="{ 'background-color': `rgb(${row.colorRgb})` }" style="font-size: 10px; color: transparent; user-select: none; border: 1px solid #fff">&nbsp;</div>
							</template>
							<template v-if="config.field == 'produceIdProduceName'" #default="{ row }">
								<div @click="openEditOrderDetail(row, $event)">
									{{ row.produceIdProduceName }}
								</div>
							</template>
							<template v-if="config.field == 'deliveryDate'" #default="{ row }">
								<span>{{ formatDate(row.deliveryDate) }}</span>
							</template>
						</vxe-column>
					</vxe-table>
					<div style="text-align: center">
						<el-text> 数量: {{ orderDetailSums[item.id] }} &nbsp;&nbsp;&nbsp;&nbsp;批数: {{ orderDetailCounts[item.id] }}</el-text>
					</div>
				</div>
				<div style="position: absolute; right: 2%; bottom: 1%; z-index: 99"><el-button link @click="showMore(item.id)" v-if="orderDetailCounts[item.id] > 10">更多</el-button></div>
			</el-card>
		</el-space>
	</el-scrollbar>
	<addPaichanDialog ref="addPaichanDialogRef" @reloadDeviceList="initOrderDetailList" />
	<editPaichanDialog ref="editPaichanDialogRef" @reloadDeviceList="loadData" />
	<!-- // 修改设备绑定人员 -->
	<el-dialog v-model="editOperatorDialog" :width="500" draggable="">
		<template #header>
			<div style="color: #fff">修改操作人员</div>
		</template>
		<div>
			<el-select multiple collapse-tags collapse-tags-tooltip v-model="operatorUsers" placeholder="请选择操作人员">
				<el-option v-for="(item, index) in sysUserOperatorUsersDropdownList" :key="index" :value="item.value" :label="item.label" />
			</el-select>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup="" name="deviceList">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
import { pageDevice } from '/@/api/main/device';
import { listOrderDetailByDeviceId, setOrderDetailSort, deleteOrderDetail, tableColumnPage } from '/@/api/main/orderDetail';
import { getSysUserOperatorUsersDropdown } from '/@/api/main/orderDetail';
import { updateDevice } from '/@/api/main/device';

import editPaichanDialog from '/@/views/opration/sub/editPaichanDialog.vue';
import addPaichanDialog from '/@/views/opration/sub/addPaichanDialog.vue';
// 表格拖拽
import Sortable from 'sortablejs';
import { VxeTableInstance, VxeToolbarInstance, VxeColumnProps } from 'vxe-table';
import router from '/@/router';

//父级传递来的参数
var props = defineProps({
	dt: {},
});

const tableColumn = ref<(VxeColumnProps & { key: number })[]>([]);

const loadTableHeader = async () => {
	const params = {
		pageType: '',
		prop: '',
		lable: '',
	};
	var orderDetailRes = await tableColumnPage(params);
	const newData = orderDetailRes.data.result.map((item: { prop: any; lable: any; width: string }, index: number) => ({
		key: index + 6,
		field: item.prop,
		title: item.lable,
		show: item.isHidden,
		width: parseInt(item.width),
	}));
	tableColumn.value = newData;
};

const minHeight = ref(355);
const loading = ref(true);
const scrollbarRef = ref();
const addPaichanDialogRef = ref();
const editPaichanDialogRef = ref();
const editOperatorDialog = ref(false);
const handleScroll = (e: any) => {
	const wheelDelta = e.wheelDelta || -e.deltaY * 40;
	scrollbarRef.value.setScrollLeft(scrollbarRef.value.wrapRef.scrollLeft - wheelDelta);
};
// 添加未排产订单弹窗事件
const handleSetPaichanInfo = async (deviceId: any, e: any) => {
	await addPaichanDialogRef.value.openDialog({ deviceId, deviceType: deviceType.value.id });
};

const openEditOrderDetail = async (orderDetailId: any, e: any) => {
	await editPaichanDialogRef.value.openDialog({ orderDetailId, deviceType: deviceType.value.id });
};

const currentDate = new Date().toDateString();
const moreThen10 = ref(false);
let deviceList = ref<any>([]);
let deviceType = ref<any>({});
let deviceId = ref<any>('');
let orderDetails = ref<any>({});
let orderDetailsSplit = ref<any>({});
let orderDetailCounts = ref<any>({});
let orderDetailSums = ref<any>({});
const initDeviceList = async (dtId: any) => {
	var res = await pageDevice({ deviceTypeId: dtId });
	deviceList.value = res.data.result?.items ?? [];
	await initOrderDetailList();
};

// 跳转设备列表页面
const goToDeviceManageDevice = () => {
	router.push({ name: 'device' });
};
// 展示更多
const showMore = (id: any) => {
	// 根据需要的高度重新计算min-height的值
	const rowHeight = 40; // 一行内容的高度

	const rowCount = orderDetailCounts.value[id]; // 根据具体的数据获取行数
	console.log(rowHeight * rowCount);

	// 如果已经展开，则重置为355px，否则根据行数计算适合的高度
	minHeight.value = minHeight.value === 355 ? rowHeight * rowCount : 355;
	if (minHeight.value === 355) {
		initOrderDetailList();
	} else {
		initOrderDetailListAll();
	}
};

// 渲染操作人员
const renderingUsers = (users: string) => {
	// console.log(users);

	if (users == null) {
		return;
	}
	// 将字符串转换为数组
	const userValues = users.split(',');

	// 遍历用户值数组
	const labels = userValues.map((userValue) => {
		// 找到对应value的label
		const user = sysUserOperatorUsersDropdownList.value.find((item: { value: number }) => item.value === parseInt(userValue, 10));
		// 如果找到了对应的label，则返回label，否则返回原始值
		return user ? user.label : userValue;
	});

	// console.log(labels); // 输出找到的labels数组
	// 返回以逗号分隔的label字符串
	return labels.join('\n');
};

// 修改设备操作人员
const operatorUsers = ref<number[]>([]);
const changeOperator = async (devId: any, users: string) => {
	deviceId.value = devId;
	operatorUsers.value = users?.split(',')?.map((u) => parseInt(u, 10)) ?? [];
	editOperatorDialog.value = true;
};

// 提交 - 修改设备操作人员
const submit = async () => {
	const params = {
		id: deviceId.value,
		operatorUsers: operatorUsers.value.join(','),
	};
	await updateDevice(params);
	loadData();
	editOperatorDialog.value = false;
};

// 取消
const cancel = () => {
	editOperatorDialog.value = false;
};

const sysUserOperatorUsersDropdownList = ref<any>([]);
const getSysUserOperatorUsersDropdownList = async () => {
	let list = await getSysUserOperatorUsersDropdown();
	sysUserOperatorUsersDropdownList.value = list.data.result ?? [];
};
getSysUserOperatorUsersDropdownList();

// 加载各个设备排产列表 - 前十条
const initOrderDetailList = async () => {
	const deviceIds = deviceList.value.map((v: { id: any }) => v.id);
	for (const deviceId of deviceIds) {
		var orderDetailRes = await listOrderDetailByDeviceId({ deviceId });
		// 给表格赋值
		orderDetailsSplit.value[deviceId] = orderDetailRes ?? [];
		orderDetails.value[deviceId] = orderDetailRes.data.result.slice(0, 10) ?? [];
		orderDetailCounts.value[deviceId] = orderDetailRes.data.result?.length ?? 0;
		orderDetailSums.value[deviceId] = getSumNumber(orderDetailRes.data.result?.map((v: { qty: any }) => v.qty) ?? []);
	}
};
// 加载各个设备排产列表 - 全部数据
const initOrderDetailListAll = async () => {
	const deviceIds = deviceList.value.map((v: { id: any }) => v.id);
	for (const deviceId of deviceIds) {
		// var orderDetailRes = await listOrderDetailByDeviceId({ deviceId });
		// 给表格赋值
		orderDetails.value[deviceId] = orderDetailsSplit.value[deviceId].data.result ?? [];
		orderDetailCounts.value[deviceId] = orderDetailsSplit.value[deviceId].data.result?.length ?? 0;
		orderDetailSums.value[deviceId] = getSumNumber(orderDetailsSplit.value[deviceId].data.result?.map((v: { qty: any }) => v.qty) ?? []);
	}
};

const getSumNumber = (arr: number[]) => {
	let sum = 0;
	for (let i = 0; i < arr.length; i++) {
		sum += arr[i] ?? 0;
	}
	return sum;
};

// 拖拽排序
const rowDrop = () => {
	const deviceIds = deviceList.value.map((v: { id: any }) => v.id);
	if (!deviceIds.length) {
		return;
	}
	deviceIds.forEach((item: string | number, i: any) => {
		const el = document.querySelector(`.tables${item} .vxe-table--render-wrapper .vxe-table--body-wrapper  table tbody`);
		Sortable.create(el, {
			animation: 150,
			ghostClass: 'blue-background-class',
			handle: '.rank', // 如果需要点击某个图标拖拽的话需要吧那个图标的class写在这里
			// 写完以上部分就已经可以实现基本的拖拽功能了，以下是拓展
			//始拖拽事件
			onEnd: function (/**Event*/ evt: { newIndex: any; oldIndex: any; item: any; to: any; from: any; clone: any; pullMode: any }) {
				let newIndex = evt.newIndex; // 排序后的索引位置
				let oldIndex = evt.oldIndex; // 排序前的索引位置
				var itemEl = evt.item; // 拖拽 HTMLElement
				evt.to; // 目标表
				evt.from; // 上一个列表
				evt.oldIndex; // 元素在旧父级中的旧索引
				evt.newIndex; // 元素在新父级中的新索引
				evt.clone; // 克隆元件
				evt.pullMode; // 当项目在另一个可排序表中时：`“clone”`如果克隆，`true`如果移动
				// 下面将拖拽后的顺序进行修改
				// console.log(orderDetails.value[item]);

				const currRow = orderDetails.value[item].splice(evt.oldIndex, 1)[0];
				orderDetails.value[item].splice(evt.newIndex, 0, currRow);
				const newData: {
					id: any;
					sort: number;
				}[] = [];
				orderDetails.value[item].forEach((item: { id: any }, index: number) => {
					newData[index] = {
						id: item.id,
						sort: index + 1,
					};
				});
				// console.log(newData);
				setSort(newData);

				// let classValue = '';
				// const divElement = itemEl.querySelector('tr td div > div > span');
				// if (divElement) {
				// 	classValue = divElement.innerHTML;
				// }
			},
			//点击选中元素事件
			onChoose: function (/**Event*/ evt: { oldIndex: any }) {
				evt.oldIndex;
			},
			//取消选中事件
			onUnchoose: function (/**Event*/ evt: any) {},
		});
	});
};

// 删除排产
const deleteOne = async (id: any, e: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const params = {
				id: id,
			};
			await deleteOrderDetail(params);
			loadData();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
};

// 格式化日期
const formatDate = (dateString: string | number | Date) => {
	const date = new Date(dateString);
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${month}-${day}`;
};

// 设置排序
const setSort = async (newData: { id: any; sort: number }[]) => {
	const params = newData;
	await setOrderDetailSort(params);
};
const loadData = async () => {
	loading.value = false;
	deviceType.value = props.dt;
	const dtid = deviceType.value.id;
	await initDeviceList(dtid);
	rowDrop();
};

onMounted(async () => {
	loadTableHeader();
	loadData();
	// console.log(deviceType.value.id);

	// lists.value = [
	//     {
	//         imgUrl:
	//             'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
	//         name: 'Deer',
	//     },
	//     {
	//         imgUrl:
	//             'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
	//         name: 'Horse',
	//     },
	//     {
	//         imgUrl:
	//             'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
	//         name: 'Mountain Lion',
	//     }, {
	//         imgUrl:
	//             'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
	//         name: 'Deer',
	//     },
	//     {
	//         imgUrl:
	//             'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
	//         name: 'Horse',
	//     },
	//     {
	//         imgUrl:
	//             'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
	//         name: 'Mountain Lion',
	//     }, {
	//         imgUrl:
	//             'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
	//         name: 'Deer',
	//     },
	//     {
	//         imgUrl:
	//             'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
	//         name: 'Horse',
	//     },
	//     {
	//         imgUrl:
	//             'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
	//         name: 'Mountain Lion',
	//     }, {
	//         imgUrl:
	//             'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
	//         name: 'Deer',
	//     },
	//     {
	//         imgUrl:
	//             'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
	//         name: 'Horse',
	//     },
	//     {
	//         imgUrl:
	//             'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
	//         name: 'Mountain Lion',
	//     }, {
	//         imgUrl:
	//             'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
	//         name: 'Deer',
	//     },
	//     {
	//         imgUrl:
	//             'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
	//         name: 'Horse',
	//     },
	//     {
	//         imgUrl:
	//             'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
	//         name: 'Mountain Lion',
	//     },
	// ]

	loading.value = false;
});
</script>

<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
	width: 100%;
}

.image {
	width: 100%;
	display: block;
}

.scrollbar-flex-content {
	display: flex;
}

.scrollbar-demo-item {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100px;
	height: 50px;
	margin: 10px;
	text-align: center;
	border-radius: 4px;
	background: var(--el-color-danger-light-9);
	color: var(--el-color-danger);
}

:deep(.el-collapse-item__content) {
	overflow: auto !important;
}
</style>
<style>
.el-collapse-item__content {
	overflow: auto !important;
}
</style>
