<template>
	<div class="material-container">
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
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="物料类型" prop="materialTypeId">
							<el-select clearable filterable v-model="ruleForm.materialTypeId" placeholder="请选择物料类型">
								<el-option v-for="(item,index) in materialTypeMaterialTypeIdDropdownList" :key="index" :value="item.value" :label="item.label" />
								
							</el-select>
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="物料编号" prop="materialCode">
							<el-input v-model="ruleForm.materialCode" placeholder="请输入物料编号" maxlength="100" show-word-limit clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="物料名称" prop="materialName">
							<el-input v-model="ruleForm.materialName" placeholder="请输入物料名称" maxlength="100" show-word-limit clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="物料规格" prop="materialNorm">
							<el-input v-model="ruleForm.materialNorm" placeholder="请输入物料规格" maxlength="100" show-word-limit clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="采购单价" prop="costPrice">
							<el-input v-model="ruleForm.costPrice" placeholder="请输入采购单价" maxlength="53" show-word-limit clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="税率(%)" prop="dutyRate">
							<el-input v-model="ruleForm.dutyRate" placeholder="请输入税率(%)" maxlength="53" show-word-limit clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="供应商" prop="supplierId">
							<el-select clearable filterable v-model="ruleForm.supplierId" placeholder="请选择供应商">
								<el-option v-for="(item,index) in supplierSupplierIdDropdownList" :key="index" :value="item.value" :label="item.label" />
								
							</el-select>
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="安全库存" prop="safetyStock">
							<el-input v-model="ruleForm.safetyStock" placeholder="请输入安全库存" maxlength="53" show-word-limit clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="ruleForm.remark" placeholder="请输入备注" maxlength="255" show-word-limit clearable />
							
						</el-form-item>
						
					</el-col>
				</el-row>
			</el-form>
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
	import { addMaterial, updateMaterial } from "/@/api/main/material";
	import { getMaterialTypeMaterialTypeIdDropdown } from '/@/api/main/material';
	import { getSupplierSupplierIdDropdown } from '/@/api/main/material';

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
		materialCode: [{required: true, message: '请输入物料编号！', trigger: 'blur',},],
		materialName: [{required: true, message: '请输入物料名称！', trigger: 'blur',},],
		materialNorm: [{required: true, message: '请输入物料规格！', trigger: 'blur',},],
		costPrice: [{required: true, message: '请输入采购单价！', trigger: 'blur',},],
		dutyRate: [{required: true, message: '请输入税率(%)！', trigger: 'blur',},],
		safetyStock: [{required: true, message: '请输入安全库存！', trigger: 'blur',},],
	});

	// 打开弹窗
	const openDialog = (row: any) => {
		ruleForm.value = JSON.parse(JSON.stringify(row));
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
					await addMaterial(values);
				} else {
					await updateMaterial(values);
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

	const materialTypeMaterialTypeIdDropdownList = ref<any>([]); 
	const getMaterialTypeMaterialTypeIdDropdownList = async () => {
		let list = await getMaterialTypeMaterialTypeIdDropdown();
		materialTypeMaterialTypeIdDropdownList.value = list.data.result ?? [];
	};
	getMaterialTypeMaterialTypeIdDropdownList();
	
	const supplierSupplierIdDropdownList = ref<any>([]); 
	const getSupplierSupplierIdDropdownList = async () => {
		let list = await getSupplierSupplierIdDropdown();
		supplierSupplierIdDropdownList.value = list.data.result ?? [];
	};
	getSupplierSupplierIdDropdownList();
	






	// 页面加载时
	onMounted(async () => {
	});

	//将属性或者函数暴露给父组件
	defineExpose({ openDialog });
</script>




