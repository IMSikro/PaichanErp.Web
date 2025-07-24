<template>
	<div class="materialStoreRecords-container">
		<el-dialog v-model="isShowDialog" :width="800" draggable="">
			<template #header>
				<div style="color: #fff">
					<!--<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>-->
					<span>{{ props.title }}</span>
				</div>
			</template>
			<el-form :model="ruleForm" ref="ruleFormRef" label-width="auto" :rules="rules">
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" v-show="false" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="入库单号" prop="inStoreOrderNumber">
							<el-input v-model="ruleForm.inStoreOrderNumber" placeholder="请输入入库单号" maxlength="50" show-word-limit clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="入库日期" prop="inStoreDate">
							<el-date-picker v-model="ruleForm.inStoreDate" type="date" placeholder="入库日期" />
							
						</el-form-item>
						
					</el-col>
				</el-row>
			</el-form>
			
			<el-divider content-position="left">添加物料</el-divider>
			<el-table :data="ruleForm.materialStoreDetails" style="width: 100%" max-height="400">
				<el-table-column prop="materialId" label="物料" width="110">
					<template #default="scope">
						<el-select clearable filterable v-model="scope.row.materialId" placeholder="请选择物料" :disable="scope.row.isDelete">
							<el-option v-for="(item,index) in materialMaterialIdDropdownList" :key="index" :value="item.value"
								:label="item.label" />
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="materialNumber" label="原料批号" width="220">
					<template #default="scope">
						<el-input v-model="scope.row.materialNumber" placeholder="请输入原料批号" show-word-limit clearable  :disable="scope.row.isDelete"/>
					</template>
				</el-table-column>
				<el-table-column prop="storeId" label="仓库" width="110">
					<template #default="scope">
						<el-select clearable filterable v-model="scope.row.storeId" placeholder="请选择仓库" :disable="scope.row.isDelete">
							<el-option v-for="(item,index) in storeStoreIdDropdownList" :key="index" :value="item.value"
								:label="item.label" />
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="storeLocationId" label="库位" width="110">
					<template #default="scope">
						<el-select clearable filterable v-model="scope.row.storeLocationId" placeholder="请选择库位" :disable="scope.row.isDelete">
							<el-option v-for="(item,index) in storeLocationStoreLocationDropdownList" :key="index" :value="item.value"
								:label="item.label" />
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="inStoreCount" label="入库数量" width="110">
					<template #default="scope">
						<el-input v-model="scope.row.inStoreCount" placeholder="请输入入库数量" show-word-limit clearable  :disable="scope.row.isDelete"/>
					</template>
				</el-table-column>
				<el-table-column label="操作" minWidth="110" align="center" fixed="right">
					<template #default="scope">
						<el-button link type="danger" icon="el-icon-delete" v-if="!scope.row.isDelete"
							@click.prevent="handleColDelete(scope.$index)">删除</el-button>
						<el-button link type="primary" icon="el-icon-delete" v-else
							@click.prevent="handleColRecover(scope.$index)">恢复</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div style="text-align: left; margin-top: 10px">
				<el-button icon="ele-Plus" @click="addStoreMaterial">添加物料</el-button>
			</div>
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
	import { ref,onMounted } from "vue";
	import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
	import { ElMessage } from "element-plus";
	import type { FormRules } from "element-plus";
	import { addMaterialStoreRecords, updateMaterialStoreRecords } from "/@/api/main/materialStoreRecords";
	import { getMaterialMaterialIdDropdown,getStoreStoreIdDropdown,getStoreLocationStoreLocationDropdown } from '/@/api/main/materialStoreDetails';

	//父级传递来的参数
	var props = defineProps({
		title: {
		type: String,
		default: "",
	},
	});
	//父级传递来的函数，用于回调
	const emit = defineEmits(["reloadTable"]);
	const ruleFormRef = ref();
	const isShowDialog = ref(false);
	const ruleForm = ref<any>({});
	//自行添加其他规则
	const rules = ref<FormRules>({
		inStoreOrderNumber: [{required: true, message: '请输入入库单号！', trigger: 'blur',},],
		inStoreDate: [{required: true, message: '请选择入库日期！', trigger: 'change',},],
	});

	// 打开弹窗
	const openDialog = (row: any) => {
		ruleForm.value = JSON.parse(JSON.stringify(row));
		if (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == "" || ruleForm.value.id == 0) {
		ruleForm.value.materialStoreDetails = [{
			id: 0,
			materialId: 0,
			storeId: 0,
			storeLocationId: 0,
			isDelete: 0,
		}];
	}
		isShowDialog.value = true;
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
	const submit = async () => {
		ruleFormRef.value.validate(async (isValid: boolean, fields?: any) => {
			if (isValid) {
				let values = ruleForm.value;
				if (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == "" || ruleForm.value.id == 0) {
					await addMaterialStoreRecords(values);
				} else {
					await updateMaterialStoreRecords(values);
				}
				closeDialog();
			} else {
				ElMessage({
					message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
					type: "error",
				});
			}
		});
	};


	const materialMaterialIdDropdownList = ref<any>([]); 
	const getMaterialMaterialIdDropdownList = async () => {
		let list = await getMaterialMaterialIdDropdown();
		materialMaterialIdDropdownList.value = list.data.result ?? [];
	};
	getMaterialMaterialIdDropdownList();
	
	const storeStoreIdDropdownList = ref<any>([]); 
	const getStoreStoreIdDropdownList = async () => {
		let list = await getStoreStoreIdDropdown();
		storeStoreIdDropdownList.value = list.data.result ?? [];
	};
	getStoreStoreIdDropdownList();
	
	const storeLocationStoreLocationDropdownList = ref<any>([]); 
	const getStoreLocationStoreLocationDropdownList = async () => {
		let list = await getStoreLocationStoreLocationDropdown();
		storeLocationStoreLocationDropdownList.value = list.data.result ?? [];
	};
	getStoreLocationStoreLocationDropdownList();


	// 增加物料行
	function addStoreMaterial() {
		ruleForm.value.materialStoreDetails.push({
			id: 0,
			materialStoreRecordId: (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == "" || ruleForm.value.id == 0) ? 0 : ruleForm.value.id,
			materialId: 0,
			storeId: 0,
			storeLocationId: '',
			isDelete: 0,
		});
	}
	// 删除
	function handleColDelete(index: number) {
		if (ruleForm.value.materialStoreDetails[index].id == 0) {
			ruleForm.value.materialStoreDetails.splice(index, 1);
		}
		else {
			ruleForm.value.materialStoreDetails[index].isDelete = true;
		}
	}

	// 恢复
	function handleColRecover(index: number) {
		ruleForm.value.materialStoreDetails[index].isDelete = false;
	}
	// 页面加载时
	onMounted(async () => {
	});

	//将属性或者函数暴露给父组件
	defineExpose({ openDialog });
</script>




