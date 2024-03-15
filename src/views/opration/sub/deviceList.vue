<template>
	<el-scrollbar height="20vw" style="padding-bottom: 1rem" ref="scrollbarRef" @wheel.prevent="handleScroll">
		<el-space alignment="flex-start">
			<el-card v-for="item in deviceList" :key="item.id" :body-style="{ padding: '0px', marginBottom: '1px', minHeight: '10rem', maxHeight: '24rem' }">
				<div>
					<el-text style="margin-left: 1rem">设备编号: {{ item.deviceName }}</el-text>
					<el-text style="margin: 0 2rem" @click="changeOperator(item.id)">操作人员: {{ renderingUsers(item.operatorUsers) }}</el-text>
					<div style="position: relative; display: flex; float: right; right: 0"><el-button type="primary" size="small" @click="handleSetPaichanInfo(item.id, $event)">添加未排产订单</el-button></div>
				</div>
				<el-table max-height="300" :class="`tables${item.id}`" :data="orderDetails[item.id]" v-loading="loading" row-key="id" border="" size="small">
					<el-table-column prop="orderId" label="颜色" show-overflow-tooltip="">
						<template #default="scope">
							<div class="rank" :style="{ 'background-color': `rgb(${scope.row.colorRgb})` }" style="font-size: 10px; color: transparent; user-select: none">
								<span style="opacity: 0">{{ scope.row.id }}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="produceIdProduceName" label="产品编号" show-overflow-tooltip=""
						><template #default="scope">
							<div @click="openEditOrderDetail(scope.row, $event)">
								{{ scope.row.produceIdProduceName }}
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="deliveryDate" label="交期" show-overflow-tooltip="">
						<template #default="scope">
							{{ formatDate(scope.row.deliveryDate) }}
						</template>
					</el-table-column>
					<!-- <el-table-column prop="operatorUsersRealName" label="操作人员" width="100" show-overflow-tooltip="" /> -->
					<el-table-column prop="qty" label="班次产量" show-overflow-tooltip="">
						<template #default="scope">
							<span>{{ scope.row.qty ?? 0 }}</span>
						</template>
					</el-table-column>
				</el-table>
				<div style="text-align: center; width: 100%; position: relative; bottom: 0">
					<el-text> 总产量: {{ orderDetailSums[item.id] }} &nbsp;&nbsp;&nbsp;&nbsp;总批次: {{ orderDetailCounts[item.id] }}</el-text>
				</div>
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
		</template></el-dialog
	>
</template>

<script lang="ts" setup="" name="deviceList">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
import { pageDevice } from '/@/api/main/device';
import { listOrderDetailByDeviceId, setOrderDetailSort, deleteOrderDetail } from '/@/api/main/orderDetail';
import { getSysUserOperatorUsersDropdown } from '/@/api/main/orderDetail';
import { updateDevice } from '/@/api/main/device';

import editPaichanDialog from '/@/views/opration/sub/editPaichanDialog.vue';
import addPaichanDialog from '/@/views/opration/sub/addPaichanDialog.vue';
// 表格拖拽
import Sortable from 'sortablejs';

//父级传递来的参数
var props = defineProps({
	dt: {},
});

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
let deviceList = ref<any>([]);
let deviceType = ref<any>({});
let deviceId = ref<any>('');
let orderDetails = ref<any>({});
let orderDetailCounts = ref<any>({});
let orderDetailSums = ref<any>({});
const initDeviceList = async (dtId: any) => {
	var res = await pageDevice({ deviceTypeId: dtId });
	deviceList.value = res.data.result?.items ?? [];
	await initOrderDetailList();
};

// 渲染操作人员
const renderingUsers = (users: string) => {
	if (users == null) {
		return;
	}
	// 将字符串转换为数组
	const userValues = users.split(',');

	// 遍历用户值数组
	const labels = userValues.map((userValue) => {
		// 找到对应value的label
		const user = sysUserOperatorUsersDropdownList.value.find((item) => item.value === parseInt(userValue, 10));
		// 如果找到了对应的label，则返回label，否则返回原始值
		return user ? user.label : userValue;
	});

	// console.log(labels); // 输出找到的labels数组
	// 返回以逗号分隔的label字符串
	return labels.join(',');
};

// 修改设备操作人员
const operatorUsers = ref('');
const changeOperator = async (devId: any) => {
	deviceId.value = devId;
	// operatorUsers.value = deviceList.value.find((v: { id: any }) => v.id === devId).operatorUsers;
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

// 加载各个设备排产列表
const initOrderDetailList = async () => {
	const deviceIds = deviceList.value.map((v: { id: any }) => v.id);
	for (const deviceId of deviceIds) {
		var orderDetailRes = await listOrderDetailByDeviceId({ deviceId });
		// 给表格赋值
		orderDetails.value[deviceId] = orderDetailRes.data.result ?? [];
		orderDetailCounts.value[deviceId] = orderDetailRes.data.result?.length ?? 0;
		orderDetailSums.value[deviceId] = getSumNumber(orderDetailRes.data.result?.map((v: { qty: any }) => v.qty) ?? []);
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
	// console.log('orderDetails', orderDetails.value[deviceIds]);
	if (!deviceIds.length) {
		return;
	}
	deviceIds.forEach((item: string | number, i: any) => {
		const el = document.querySelector(`.tables${item} .el-table__body-wrapper  table tbody`);
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
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
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
</style>
