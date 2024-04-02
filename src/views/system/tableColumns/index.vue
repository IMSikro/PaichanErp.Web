<template>
	<div class="tableColumns-container">
		<div class="control_area" style="margin: 0.2% 0 1% 0">
			<el-button type="primary" @click="resetNormal()" style="width: 8%">重置为默认</el-button>
		</div>
		<vxe-grid ref="xGrid2" v-bind="gridOptions2" @resizable-change="resizableChange" @custom="toolbarCustomEvent">
			<template #color_default="{ row }">
				<div class="rank" :style="{ 'background-color': `rgb(${row.colorRgb})` }" style="font-size: 10px; color: transparent; user-select: none">&nbsp;</div>
			</template>
		</vxe-grid>
		<el-button type="primary" @click="saveTableBTN()" style="width: 8%">保存修改</el-button>
		<div class="json_area">
			<el-input v-model="jsonData" style="width: 100%" :rows="25" disabled type="textarea" />
		</div>
	</div>
</template>

<script lang="ts" setup name="tableColumns">
import { ElMessageBox, ElMessage } from 'element-plus';

import { reactive, ref, onUnmounted, nextTick, onMounted } from 'vue';
import { VXETable, VxeGridInstance, VxeGridProps, VxeTableEvents } from 'vxe-table';
import Sortable from 'sortablejs';

import { tableColumnPage, tableColumnReset, tableColumnUpdateList } from '/@/api/main/orderDetail';

const xGrid2 = ref({} as VxeGridInstance);
const jsonData = ref('');

// 重置为默认
const resetNormal = () => {
	const newData = [
		{
			id: 33187620429061,
			orderId: 31705350596165,
			orderIdBatchNumber: 'S2024010001',
			orderDetailCode: 'S2024010001-7',
			sn: 7,
			startDate: null,
			endDate: null,
			deliveryDate: '2024-01-31 00:00:00',
			deviceTypeId: 31640794926405,
			deviceId: 32450617877829,
			deviceErrorTime: null,
			deviceErrorType: null,
			deviceIdDeviceCode: 'JC001',
			operatorUsers: '32835490344773',
			operatorUsersRealName: '张三',
			qty: 1,
			pUnit: '吨',
			produceId: 31640920050757,
			produceIdProduceName: 'PM00001TN',
			produceName: 'PM00001TN',
			colorRgb: '207,75,34',
			sort: 999,
			remark: '',
			createUserName: '超级管理员',
			updateUserName: null,
		},
	];
	gridOptions2.data = newData;
	ElMessageBox.confirm('确定要重置吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(() => {
		tableColumnReset().then(() => {
			ElMessage({
				message: '重置成功',
				type: 'success',
			});
		});
	});
};

const saveTableBTN = () => {
	const $table = xGrid2.value;
	if ($table) {
		const visibleColumn = $table.getColumns();
		saveTable(visibleColumn);
	}
};

// 保存修改
const saveTable = (newTable: any) => {
	let params = [];
	params = gridOptions2.columns;
	console.log('old', gridOptions2.columns);
	console.log('newTable', newTable);

	// 解析newTable，提取以下结构：{prop: 'name', lable: 'Name', width: '100', isHidden: true, sort: 0}
	// newTable.forEach((item: any, index: any) => {
	// 	console.log(item);
	// 	params.push({
	// 		prop: item.field,
	// 		lable: item.title,
	// 		width: item.width,
	// 		isHidden: item.visible,
	// 		sort: index,
	// 	});
	// });
	// gridOptions2.columns = params;
	// console.log('new', gridOptions2.columns);
	tableColumnUpdateList(params).then(() => {
		ElMessage({
			message: '保存成功',
			type: 'success',
		});
	});
};

const gridOptions2 = reactive({
	border: true,
	showOverflow: true,
	resizable: true,
	rowConfig: {
		height: 28,
	},
	class: 'sortable-column-demo',
	headerCellStyle: {
		height: '28px',
	},
	columnConfig: {
		useKey: true,
	},
	scrollX: {
		enabled: false,
	},
	toolbarConfig: {
		custom: true,
	},
	columns: [
		{ field: 'name', title: 'Name' },
		{ field: 'role', title: 'Role' },
	],
	data: [
		{
			id: 33187620429061,
			orderId: 31705350596165,
			orderIdBatchNumber: 'S2024010001',
			orderDetailCode: 'S2024010001-7',
			sn: 7,
			startDate: null,
			endDate: null,
			deliveryDate: '2024-01-31 00:00:00',
			deviceTypeId: 31640794926405,
			deviceId: 32450617877829,
			deviceErrorTime: null,
			deviceErrorType: null,
			deviceIdDeviceCode: 'JC001',
			operatorUsers: '32835490344773',
			operatorUsersRealName: '张三',
			qty: 1,
			pUnit: '吨',
			produceId: 31640920050757,
			produceIdProduceName: 'PM00001TN',
			produceName: 'PM00001TN',
			colorRgb: '207,75,34',
			sort: 999,
			remark: '',
			createUserName: '超级管理员',
			updateUserName: null,
		},
	],
} as VxeGridProps);

let sortable2: any;

const columnDrop2 = () => {
	const $grid = xGrid2.value;
	sortable2 = Sortable.create($grid.$el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'), {
		handle: '.vxe-header--column',
		onEnd: (sortableEvent: { item: any; newIndex: number; oldIndex: number }) => {
			const targetThElem = sortableEvent.item;
			const newIndex = sortableEvent.newIndex as number;
			const oldIndex = sortableEvent.oldIndex as number;
			const { fullColumn, tableColumn } = $grid.getTableColumn();
			const wrapperElem = targetThElem.parentNode as HTMLElement;
			const newColumn = fullColumn[newIndex];
			if (newColumn.fixed) {
				// 错误的移动
				const oldThElem = wrapperElem.children[oldIndex] as HTMLElement;
				if (newIndex > oldIndex) {
					wrapperElem.insertBefore(targetThElem, oldThElem);
				} else {
					wrapperElem.insertBefore(targetThElem, oldThElem ? oldThElem.nextElementSibling : oldThElem);
				}
				VXETable.modal.message({ content: '固定列不允许拖动！', status: 'error' });
				return;
			}
			// 获取列索引 columnIndex > fullColumn
			const oldColumnIndex = $grid.getColumnIndex(tableColumn[oldIndex]);
			const newColumnIndex = $grid.getColumnIndex(tableColumn[newIndex]);
			// 移动到目标列
			const currRow = fullColumn.splice(oldColumnIndex, 1)[0];
			fullColumn.splice(newColumnIndex, 0, currRow);
			$grid.loadColumn(fullColumn);
		},
	});
};

let initTime: any;
nextTick(() => {
	// 加载完成之后在绑定拖动事件
	initTime = setTimeout(() => {
		columnDrop2();
	}, 500);
});

onUnmounted(() => {
	clearTimeout(initTime);
	if (sortable2) {
		sortable2.destroy();
	}
});

onMounted(async () => {
	handleQuery();
	loadjsonData();
});

const loadjsonData = () => {
	setTimeout(() => {
		nextTick(() => {
			jsonData.value = JSON.stringify(gridOptions2.columns, null, 2);
		});
	}, 1000);
};

// 改变列宽
const resizableChange = (params: any) => {
	// console.log('resizableChange', params);
	// console.log(params.columnIndex, params.resizeWidth);
	gridOptions2.columns[params.columnIndex].width = params.resizeWidth;
	// console.log('columns', gridOptions2.columns);
	loadjsonData();
	// 提示新列宽
	ElMessage({
		message: `列宽：${params.resizeWidth}px`,
		type: 'success',
	});
};

// 自定义工具栏按钮事件
const toolbarCustomEvent: VxeTableEvents.Custom = (params) => {
	const $table = xGrid2.value;
	if ($table) {
		const visibleColumn = $table.getColumns();
		switch (params.type) {
			case 'confirm': {
				VXETable.modal.message({ content: `点击了确认，显示为 ${visibleColumn.length} 列`, status: 'info' });
				saveTable(visibleColumn);
				break;
			}
			case 'reset': {
				// VXETable.modal.message({ content: `点击了重置，显示为 ${visibleColumn.length} 列`, status: 'info' });
				break;
			}
			case 'close': {
				// VXETable.modal.message({ content: `关闭了面板，显示为 ${visibleColumn.length} 列`, status: 'info' });
				break;
			}
		}
	}
};

// 查询操作
const handleQuery = async () => {
	const params = {
		pageType: '',
		prop: '',
		lable: '',
	};
	var orderDetailRes = await tableColumnPage(params);
	const newData = orderDetailRes.data.result.map((item: { prop: any; lable: any; width: string }, index: number) => {
		let newItem = {
			key: index + 6,
			field: item.prop,
			title: item.lable,
			width: parseInt(item.width),
		};

		// 添加条件：当title为颜色时，添加一个字段
		if (item.lable === '颜色') {
			newItem.slots = {
				default: 'color_default',
			};
		}

		return newItem;
	});

	gridOptions2.columns = newData;
};
</script>
