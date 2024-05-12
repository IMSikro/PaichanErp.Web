<template>
	<div class="device-container">
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
						<el-form-item label="工艺设备" prop="deviceTypeId">
							<el-select clearable filterable v-model="ruleForm.deviceTypeId" placeholder="请选择工艺设备">
								<el-option v-for="(item, index) in deviceTypeDeviceTypeIdDropdownList" :key="index"
									:value="item.value" :label="item.label" />

							</el-select>

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="设备编号" prop="deviceCode">
							<el-input v-model="ruleForm.deviceCode"
								@input="ruleForm.deviceCode = ruleForm.deviceCode.toUpperCase()" placeholder="请输入设备编号"
								maxlength="100" show-word-limit clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="设备名称" prop="deviceName">
							<el-input v-model="ruleForm.deviceName" placeholder="请输入设备名称" maxlength="100"
								show-word-limit clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="设备系数" prop="deviceCoefficient">
							<el-input v-model="ruleForm.deviceCoefficient" placeholder="请输入设备系数" maxlength="255"
								show-word-limit clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入备注" maxlength="255"
								show-word-limit clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="排序" prop="sort">
							<el-input-number v-model="ruleForm.sort" placeholder="请输入排序" clearable />
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
import { ref, onMounted } from "vue";
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
import { ElMessage } from "element-plus";
import type { FormRules } from "element-plus";
import { addDevice, updateDevice } from "/@/api/main/device";
import { getDeviceTypeDeviceTypeIdDropdown } from '/@/api/main/device';

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
	deviceCode: [{ required: true, message: '请输入设备编号！', trigger: 'blur', },],
	deviceName: [{ required: true, message: '请输入设备名称！', trigger: 'blur', },],
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
				await addDevice(values);
			} else {
				await updateDevice(values);
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

const deviceTypeDeviceTypeIdDropdownList = ref<any>([]);
const getDeviceTypeDeviceTypeIdDropdownList = async () => {
	let list = await getDeviceTypeDeviceTypeIdDropdown();
	deviceTypeDeviceTypeIdDropdownList.value = list.data.result ?? [];
};
getDeviceTypeDeviceTypeIdDropdownList();







// 页面加载时
onMounted(async () => {
});

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
