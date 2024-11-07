<template>
	<div class="produceFormula-container">
		<el-dialog v-model="isShowDialog" :width="800" draggable="">
			<template #header>
				<div style="color: #fff">
					<!--<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>-->
					<span>{{ props.title }}</span>
				</div>
			</template>
			<el-form :model="ruleForm" ref="ruleFormRef" label-width="auto" :rules="rules" style="margin-top: 5px;">
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" v-show="false" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="配方编号" prop="produceFormulaCode">
							<el-input v-model="ruleForm.produceFormulaCode" disabled placeholder="请输入配方编号"
								maxlength="100" show-word-limit clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="产品外键" prop="produceName">
							<!-- <el-select clearable filterable v-model="ruleForm.produceId" placeholder="请选择产品外键">
								<el-option v-for="(item,index) in produceProduceIdDropdownList" :key="index" :value="item.value" :label="item.label" />
								
							</el-select> -->
							<el-input v-model="ruleForm.produceName" placeholder="请选择产品外键" @click="openproduceId"
								maxlength="100" show-word-limit clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="配方名称" prop="produceFormulaName">
							<el-input v-model="ruleForm.produceFormulaName" placeholder="请输入配方名称" maxlength="100"
								show-word-limit clearable />

						</el-form-item>

					</el-col>
					<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="配方版本" prop="formulaVersion">
							<el-input v-model="ruleForm.formulaVersion" placeholder="请输入配方版本" maxlength="100" show-word-limit clearable />
							
						</el-form-item>
						
					</el-col> -->
					<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="是否启用" prop="isEnable">
							<el-switch v-model="ruleForm.isEnable" active-text="是" inactive-text="否" />

						</el-form-item>

					</el-col> -->
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="ruleForm.remark" placeholder="请输入备注" maxlength="255" show-word-limit
								clearable />

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
		<produceIdDialog ref="produceIdDialogRef" :title="produceIdTitle" @handle-editId="handleEditId" />
	</div>
</template>
<style scoped>
	:deep(.el-select),
	:deep(.el-input-number) {
		width: 100%;
	}
</style>
<script lang="ts" setup>
	import { ref, onMounted } from "vue";
	import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
	import { ElMessage } from "element-plus";
	import type { FormRules } from "element-plus";
	import { addProduceFormula, updateProduceFormula } from "/@/api/main/produceFormula";
	import { getProduceProduceIdDropdown } from '/@/api/main/produceFormula';
	import produceIdDialog from '/@/views/main/produceFormula/component/produceIdDialog.vue'
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
	const produceIdDialogRef = ref();
	// ruleForm.value.produceId = produceIdDialogRef?.value.name
	
	//自行添加其他规则
	const rules = ref<FormRules>({
		// produceFormulaCode: [{ required: true, message: '请输入配方编号！', trigger: 'blur', },],
		produceFormulaName: [{ required: true, message: '请输入配方名称！', trigger: 'blur', },],
		formulaVersion: [{ required: true, message: '请输入配方版本！', trigger: 'blur', },],
	});
	const produceIdTitle = ref("");
	// 打开产品外键页面
	const openproduceId = () => {
		console.log(111);
		produceIdTitle.value = '选择产品外键';
		produceIdDialogRef.value.openDialog({});
	};

	// 打开弹窗
	const openDialog = (row : any) => {
		ruleForm.value = JSON.parse(JSON.stringify(row));
		isShowDialog.value = true;
	};
	
	// 获取新增、修改时传递的id
	function handleEditId(val: object) {
		console.log(val)
	  ruleForm.value.produceId = val.id;
	  ruleForm.value.produceName = val.produceName;
	}


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
		ruleFormRef.value.validate(async (isValid : boolean, fields ?: any) => {
			if (isValid) {
				let values = ruleForm.value;
				if (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == "" || ruleForm.value.id == 0) {
					let formulaVersion={formulaVersion:'V1'}
					const mergedObject = { ...formulaVersion, ...values };
					await addProduceFormula(mergedObject);
				} else {
					await updateProduceFormula(values);
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

	const produceProduceIdDropdownList = ref<any>([]);
	const getProduceProduceIdDropdownList = async () => {
		let list = await getProduceProduceIdDropdown();
		produceProduceIdDropdownList.value = list.data.result ?? [];
	};
	getProduceProduceIdDropdownList();







	// 页面加载时
	onMounted(async () => {
		
	});

	//将属性或者函数暴露给父组件
	defineExpose({ openDialog });
</script>