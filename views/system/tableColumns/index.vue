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
	if (newTable.length === 0) {
		gridOptions2.columns.forEach((item: any, index: any) => {
			params.push({
				prop: item.field,
				lable: item.title,
				width: item.width,
				isHidden: false,
				sort: index,
			});
		});
	} else {
		// // 在newTable和gridOptions2.columns中遍历对比，
		// 提取数据组成新的数组
		const newData = gridOptions2.columns.map((gridItem, index) => {
			// 在 newTable 中查找是否存在相同的 field
			const tableItem = newTable.find((item) => item.field === gridItem.field);

			// 如果找到了对应的项，则使用 tableItem 的数据，否则使用默认数据
			if (tableItem) {
				return {
					prop: tableItem.field, // prop 取 field
					label: tableItem.title, // label 取 title
					width: gridItem.width.toString(), // width 取 width，转换为字符串
					isHidden: true, // 因为找到了对应的项，所以 isHidden 为 true
					sort: index, // 使用循环的下标作为 sort 的值
				};
			} else {
				// 如果未找到对应的项，则使用默认数据
				return {
					prop: gridItem.field, // prop 取 field
					label: gridItem.title, // 使用默认的 label
					width: gridItem.width.toString(), // width 取 width，转换为字符串
					isHidden: false, // 因为未找到对应的项，所以 isHidden 为 false
					sort: index, // 使用循环的下标作为 sort 的值
				};
			}
		});

		// 输出结果
		params = newData;
		console.log(newData);
	}
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
	columns: [],
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
	const $table = xGrid2.value;
	if ($table) {
		setTimeout(() => {
			nextTick(() => {
				const visibleColumn = $table.getColumns();
				saveTable(visibleColumn);
			});
		}, 500);
	}
	// // 提示新列宽
	// ElMessage({
	// 	message: `列宽：${params.resizeWidth}px`,
	// 	type: 'success',
	// });
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
			visible: item.isHidden,
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
	console.log('newData', newData);

	gridOptions2.columns = newData;
};
</script>
