<template>
	<div class="produceFormula-container">
		<el-dialog v-model="isShowDialog" :width="800" draggable="">
			<template #header>
				<div style="color: #fff">
					<!--<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>-->
					<span>{{ props.title }}</span>
				</div>
			</template>

			<el-table ref="tableRef" v-loading="loading" :data="produceTableData" highlight-current-row
				@selection-change="handleSelectionChange" @row-click="handleRowSelect">
				<el-table-column type="selection" width="55" />
				<!-- <el-table-column prop="produceTypeTypeName" label="产品类型" width="180" /> -->
				<!-- <el-table-column prop="produceCode" label="产品编号" width="180" /> -->
				<el-table-column prop="produceCode" label="产品编号" width="180" />
				<el-table-column prop="produceName" label="产品名称" width="180" />
				<el-table-column prop="colorRgb" label="产品颜色" width="80">
					<template #default="scope">
					  <div :style="{ 'background-color': `rgb(${scope.row.colorRgb})` }">
					    &nbsp;
					  </div>
					</template>
				</el-table-column>
				<el-table-column prop="produceCoefficient" label="产品系数" width="180" />
				<el-table-column prop="produceSeries" label="产品系列" width="170" />
				<el-table-column prop="pUnit" label="计量单位" width="100" />
			</el-table>

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
	import { ref, onMounted,provide } from "vue";
	import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
	import { ElMessage } from "element-plus";
	import type { FormRules } from "element-plus";
	import { addProduceFormula, updateProduceFormula,produceForProduceFormulaTableList } from "/@/api/main/produceFormula";
	import { getProduceProduceIdDropdown } from '/@/api/main/produceFormula';

	//父级传递来的参数
	var props = defineProps({
		title: {
			type: String,
			default: "",
		},
	});
	const tableRef = ref();
	const produceTableData =ref<any>([]);
	const loading = ref(false);
	const tableParams = ref({
		page: 1,
		pageSize: 10,
		total: 0,
	});


	//父级传递来的函数，用于回调
	// const emit = defineEmits(["reloadTable"]);
	const ruleFormRef = ref();
	const isShowDialog = ref(false);
	const ruleForm = ref<any>({});
	
	const multipleSelection = ref([]);
	const handleSelectionChange = (val : []) => {
		console.log(val);
		if (val.length > 1) {
			tableRef.value!.toggleRowSelection(val[0], val[val.length - 1]);
			multipleSelection.value = [val[val.length - 1]];
		} else {
			multipleSelection.value = val;
		}
	};
	const handleRowSelect = (row) => {
		tableRef.value!.toggleRowSelection(row, undefined);
	};
	
	
	const handleQuery = async () => {
	  loading.value = true;
	  var res = await produceForProduceFormulaTableList(Object.assign(tableParams.value));
	  var produceList = res.data.result?.items ?? []
	  for (const p of produceList) {
	    p.deviceTypeList = p.deviceTypes?.split(',') ?? [];
	  }
	  produceTableData.value = produceList;
	  tableParams.value.total = res.data.result?.total;
	
	  loading.value = false;
	};

	// 打开弹窗
	const openDialog = (row : any) => {
		ruleForm.value = JSON.parse(JSON.stringify(row));
		isShowDialog.value = true;
		handleQuery()
		
	};

	// 关闭弹窗
	const closeDialog = () => {
		emit("reloadTable");
		isShowDialog.value = false;
	};

	// 取消
	const cancel = () => {
		isShowDialog.value = false;
	};

	// 提交
	
	// 在子组件中派发handleEditId自定义事件，用于触发父组件中的handleEditId事件
	const emit = defineEmits(['handleEditId']);

	const submit = async () => {
		console.log(JSON.parse(JSON.stringify(multipleSelection.value))[0].id)
		let pid={
			id:JSON.parse(JSON.stringify(multipleSelection.value))[0].id,
			produceName:JSON.parse(JSON.stringify(multipleSelection.value))[0].produceName,
		}
		isShowDialog.value = false;
		emit('handleEditId', pid);
		// ruleFormRef.value.validate(async (isValid : boolean, fields ?: any) => {
		// 	if (isValid) {
		// 		let values = ruleForm.value;
		// 		if (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == "" || ruleForm.value.id == 0) {
		// 			await addProduceFormula(values);
		// 		} else {
		// 			await updateProduceFormula(values);
		// 		}
		// 		closeDialog();
		// 	} else {
		// 		ElMessage({
		// 			message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
		// 			type: "error",
		// 		});
		// 	}
		// });
	};

	const produceProduceIdDropdownList = ref<any>([]);
	const getProduceProduceIdDropdownList = async () => {
		let list = await getProduceProduceIdDropdown();
		produceProduceIdDropdownList.value = list.data.result ?? [];
	};
	getProduceProduceIdDropdownList();
handleQuery()






	// 页面加载时
	onMounted(async () => {
	});

	//将属性或者函数暴露给父组件
	defineExpose({ openDialog });
</script>