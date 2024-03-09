<template>
	<el-scrollbar style="padding-bottom: 1rem" ref="scrollbarRef" @wheel.prevent="handleScroll">
		<el-space alignment="flex-start">
			<el-card v-for="(item, index) in deviceList" :key="item.id" :body-style="{ padding: '0px', marginBottom: '1px', minHeight: '10rem', maxHeight: '24rem' }">
				<div>
					<el-text style="margin-left: 1rem">设备编号: {{ item.deviceName }}</el-text>
					<div style="position: relative; display: flex; float: right; right: 0"><el-button type="primary" @click="handleSetPaichanInfo(item.id, $event)">添加未排产订单</el-button></div>
				</div>
				<el-table :class="`tables${item.id}`" :data="orderDetails[item.id]" v-loading="loading" style="width: 100%" tooltip-effect="light" row-key="id" border="" size="small">
					<el-table-column prop="" label="" width="30" show-overflow-tooltip="">
						<template #default="scope">
							<el-icon class="rank" size="14" style="display: inline; vertical-align: middle; color: #095474"><ele-Rank /></el-icon>
						</template>
					</el-table-column>
					<el-table-column prop="orderId" label="颜色" width="100" show-overflow-tooltip="">
						<template #default="scope">
							<div :style="{ 'background-color': `rgb(${scope.row.colorRgb})` }" style="font-size: 10px; color: transparent">
								<span style="opacity: 0">{{ scope.row.id }}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="produceIdProduceName" label="产品编号" width="100" show-overflow-tooltip="" />
					<el-table-column prop="operatorUsersRealName" label="操作人员" width="100" show-overflow-tooltip="" />
					<el-table-column prop="qty" label="班次产量" width="70" show-overflow-tooltip="">
						<template #default="scope">
							<span>{{ (scope.row.qty ?? 0) + (scope.row.pUnit ?? '') }}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="70" align="center" fixed="right" show-overflow-tooltip="" v-if="auth('orderDetail:edit')">
						<template #default="scope">
							<el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditOrderDetail(scope.row, $event)" v-auth="'orderDetail:edit'"></el-button>
							<!-- <el-icon size="14" style="display: inline; vertical-align: middle; color: #095474; cursor: pointer" @click="deleteOne(scope.row.id, $event)"><ele-DeleteFilled /></el-icon> -->
						</template>
					</el-table-column>
				</el-table>
				<div style="text-align: center; width: 100%; position: relative; bottom: 0">
					<el-text> 产量: {{ orderDetailSums[item.id] }} &nbsp;&nbsp;&nbsp;&nbsp;生产批次数: {{ orderDetailCounts[item.id] }}</el-text>
				</div>
				<!-- <img :src="item.imgUrl" class="image multi-content" />
                <div style="padding: 14px">
                    <span>{{ item.name }}</span>
                    <div class="bottom card-header">
                        <div class="time">{{ currentDate }}</div>
                        <el-button text bg type="primary">开始派工</el-button>
                    </div>
                </div> -->
			</el-card>
		</el-space>
	</el-scrollbar>

	<addPaichanDialog ref="addPaichanDialogRef" @reloadDeviceList="initOrderDetailList" />
	<editPaichanDialog ref="editPaichanDialogRef" @reloadDeviceList="loadData" />
</template>

<script lang="ts" setup="" name="deviceList">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
import { pageDevice } from '/@/api/main/device';
import { listOrderDetailByDeviceId, setOrderDetailSort, deleteOrderDetail } from '/@/api/main/orderDetail';
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
let orderDetails = ref<any>({});
let orderDetailCounts = ref<any>({});
let orderDetailSums = ref<any>({});
const initDeviceList = async (dtId: any) => {
	var res = await pageDevice({ deviceTypeId: dtId });
	deviceList.value = res.data.result?.items ?? [];
	await initOrderDetailList();
};

const initOrderDetailList = async () => {
	// console.log(deviceList.value);
	const deviceIds = deviceList.value.map((v: { id: any }) => v.id);
	// console.log(deviceIds);
	for (const deviceId of deviceIds) {
		var orderDetailRes = await listOrderDetailByDeviceId({ deviceId });
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
				console.log(orderDetails.value[item]);

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
				console.log(newData);
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
