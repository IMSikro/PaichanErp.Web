<template>
	<div class="examineStandard-container">
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
						<el-form-item label="检验标准编号" prop="examineStandardCode">
							<el-input v-model="ruleForm.examineStandardCode" placeholder="请输入检验标准编号" maxlength="100"
								show-word-limit clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="检验标准名称" prop="examineStandardName">
							<el-input v-model="ruleForm.examineStandardName" placeholder="请输入检验标准名称" maxlength="100"
								show-word-limit clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="产品" prop="produceCode">
							<el-select clearable filterable disabled v-model="ruleForm.produceCode" placeholder="请选择产品">
								<el-option v-for="(item,index) in produceProduceIdDropdownList" :key="index"
									:value="item.value" :label="item.label" />

							</el-select>

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="工艺设备" prop="deviceTypeId">
							<el-select clearable filterable v-model="ruleForm.deviceTypeId" placeholder="请选择工艺设备">
								<el-option v-for="(item,index) in deviceTypeDeviceTypeIdDropdownList" :key="index"
									:value="item.value" :label="item.label" />

							</el-select>

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="检验项目" prop="examineProjectId">
							<el-select clearable filterable v-model="ruleForm.examineProjectId" placeholder="请选择检验项目">
								<el-option v-for="(item,index) in examineProjectExamineProjectIdDropdownList"
									:disabled="disabledOptions[index]" :key="index" :value="item.value"
									:label="item.label" />

							</el-select>

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="标准值" prop="standardValue">
							<el-input v-model="ruleForm.standardValue" placeholder="请输入标准值" maxlength="53"
								show-word-limit clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="正公差" prop="tolerance1">
							<el-input v-model="ruleForm.tolerance1" placeholder="请输入正公差" maxlength="53" show-word-limit
								clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="负公差" prop="tolerance2">
							<el-input v-model="ruleForm.tolerance2" placeholder="请输入负公差" maxlength="53" show-word-limit
								clearable />

						</el-form-item>

					</el-col>
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
	</div>
</template>
<style scoped>
	:deep(.el-select),
	:deep(.el-input-number) {
		width: 100%;
	}
</style>
<script lang="ts" setup>
	import { ref, onMounted ,computed} from "vue";
	import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
	import { ElMessage } from "element-plus";
	import type { FormRules } from "element-plus";
	import { addExamineStandard, updateExamineStandard } from "/@/api/main/examineStandard";
	import { getProduceProduceIdDropdown } from '/@/api/main/examineStandard';
	import { getDeviceTypeDeviceTypeIdDropdown } from '/@/api/main/examineStandard';
	import { getExamineProjectExamineProjectIdDropdown } from '/@/api/main/examineStandard';

	//父级传递来的参数
	var props = defineProps({
		title: {
			type: String,
			default: "",
		},
		id: {},
		examineNameList:[]
	});
	//父级传递来的函数，用于回调
	const emit = defineEmits(["reloadTable"]);
	const ruleFormRef = ref();
	const isShowDialog = ref(false);
	const ruleForm = ref<any>({});
	//自行添加其他规则
	const rules = ref<FormRules>({
		examineProjectId: [{ required: true, message: '请选择检验项目！', trigger: 'change', },],
		examineStandardCode: [{ required: true, message: '请输入检验标准编号！', trigger: 'blur', },],
		examineStandardName: [{ required: true, message: '请输入检验标准名称！', trigger: 'blur', },],
		standardValue: [{ required: true, message: '请输入标准值！', trigger: 'blur', },],
		tolerance1: [{ required: true, message: '请输入正公差！', trigger: 'blur', },],
		tolerance2: [{ required: true, message: '请输入负公差！', trigger: 'blur', },],
	});

	// 打开弹窗
	const openDialog = (row : any) => {
		ruleForm.value = JSON.parse(JSON.stringify(row));
		setTimeout(function () {
			ruleForm.value.produceCode = props.id.produceIdProduceCode
			ruleForm.value.produceId = props.id.produceId
		}, 100);
		isShowDialog.value = true;
	};
	const disabledOptions = computed(() => {
		let list=props.examineNameList
		console.log(list)
	  return examineProjectExamineProjectIdDropdownList.value.map(option => list.includes(option.label));
	});

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

		let ProduceName = produceProduceIdDropdownList.value.filter(item => item.value === ruleForm.value.produceId)
		console.log(ProduceName)
		let DeviceTypeName = deviceTypeDeviceTypeIdDropdownList.value.filter(item => item.value === ruleForm.value.deviceTypeId)
		let ExamineProjectName = examineProjectExamineProjectIdDropdownList.value.filter(item => item.value === ruleForm.value.examineProjectId)
		const produceFormulaIds = {
			produceFormulaId: props.id.id,
			ProduceName: ProduceName[0].label,
			DeviceTypeName: DeviceTypeName[0].label,
			ExamineProjectName: ExamineProjectName[0].label
		}
		ruleFormRef.value.validate(async (isValid : boolean, fields ?: any) => {
			if (isValid) {
				let values = ruleForm.value;
				let valueItem = { ...produceFormulaIds, ...values }
				if (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == "" || ruleForm.value.id == 0) {
					await addExamineStandard(valueItem);
				} else {
					await updateExamineStandard(valueItem);
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

	const deviceTypeDeviceTypeIdDropdownList = ref<any>([]);
	const getDeviceTypeDeviceTypeIdDropdownList = async () => {
		let list = await getDeviceTypeDeviceTypeIdDropdown();
		deviceTypeDeviceTypeIdDropdownList.value = list.data.result ?? [];
	};
	getDeviceTypeDeviceTypeIdDropdownList();

	const examineProjectExamineProjectIdDropdownList = ref<any>([]);
	const getExamineProjectExamineProjectIdDropdownList = async () => {
		let list = await getExamineProjectExamineProjectIdDropdown();
		examineProjectExamineProjectIdDropdownList.value = list.data.result ?? [];
	};
	getExamineProjectExamineProjectIdDropdownList();







	// 页面加载时
	onMounted(async () => {
	});

	//将属性或者函数暴露给父组件
	defineExpose({ openDialog });
</script>