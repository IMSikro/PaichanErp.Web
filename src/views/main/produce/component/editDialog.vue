﻿<template>
	<div class="produce-container">
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
						<el-form-item label="产品类型" prop="produceType">
							<el-select clearable filterable v-model="ruleForm.produceType" placeholder="请选择产品类型"
								@change="handleSelect">
								<el-option v-for="(item, index) in produceTypeProduceTypeDropdownList" :key="index"
									:value="item.value" :label="item.label" />

							</el-select>

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="产品编号" prop="produceCode">
							<el-input v-model="ruleForm.produceCode"
								@input="ruleForm.produceCode = ruleForm.produceCode.toUpperCase()" placeholder="请输入产品编号"
								maxlength="100" show-word-limit clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="产品名称" prop="produceName">
							<el-input v-model="ruleForm.produceName" placeholder="请输入产品名称" maxlength="100"
								show-word-limit clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="产品LAB颜色" prop="colorLab">
							<el-input v-model="ruleForm.colorLab" placeholder="请输入产品LAB颜色" maxlength="100"
								show-word-limit clearable @blur="handleColor" />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="产品RGB颜色" prop="colorRgb">
							<el-input v-model="ruleForm.colorRgb" placeholder="请输入产品RGB颜色" maxlength="100"
								show-word-limit clearable :disabled="true" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="颜色显示" prop="colorRgb">
							<el-tag :color="`rgb(${ruleForm.colorRgb ?? '255,255,255'})`" :style="{ width: '100%' }" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"
						v-for="v in deviceTypeDeviceTypeIdDropdownList" :key="v.value" :label="v.label">
						<el-form-item :label="v.label">
							<el-switch v-model="ruleFormdeviceType[v.value]" active-text="是" inactive-text="否" />
						</el-form-item>
						<!-- <el-form-item label="是否挤出" prop="isExtrusion">
							<el-switch v-model="ruleForm.isExtrusion" active-text="是" inactive-text="否" />

						</el-form-item>
						<el-form-item label="是否破碎" prop="isMill">
							<el-switch v-model="ruleForm.isMill" active-text="是" inactive-text="否" />

						</el-form-item>
						<el-form-item label="是否破碎" prop="isMill">
							<el-switch v-model="ruleForm.isMill" active-text="是" inactive-text="否" />

						</el-form-item> -->


					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="产品系数" prop="produceCoefficient">
							<el-input v-model="ruleForm.produceCoefficient" placeholder="请输入产品系数" maxlength="255"
								show-word-limit clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="产品系列" prop="produceSeries">
							<el-input v-model="ruleForm.produceSeries" placeholder="请输入产品系列" maxlength="255"
								show-word-limit clearable :disabled="true" />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="计量单位" prop="unitId">
							<el-select clearable filterable v-model="ruleForm.unitId" placeholder="请选择计量单位">
								<el-option v-for="(item, index) in systemUnitDropdownList" :key="index"
									:value="item.value" :label="item.label" />

							</el-select>
						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入备注" maxlength="255"
								show-word-limit clearable />

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
import { addProduce, updateProduce } from "/@/api/main/produce";
import { LabToRgb } from "/@/utils/convertLabtoRgb";
import { getProduceTypeProduceTypeDropdown, systemUnitDropdown } from '/@/api/main/produce';
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
const ruleFormdeviceType = ref<any>({});
//自行添加其他规则
const rules = ref<FormRules>({
	produceCode: [{ required: true, message: '请输入产品编号！', trigger: 'blur', },],
	produceName: [{ required: true, message: '请输入产品名称！', trigger: 'blur', },],
	colorLab: [{ required: true, message: '请输入产品LAB颜色！', trigger: 'blur', },],
	colorRgb: [{ required: true, message: '请输入产品RGB颜色！', trigger: 'blur', },],
});

// 打开弹窗
const openDialog = (row: any) => {
	ruleForm.value = JSON.parse(JSON.stringify(row));
	ruleFormdeviceType.value = {};

	var dtList = ruleForm.value?.deviceTypes?.split(',') ?? []
	for (const dt of dtList) {
		ruleFormdeviceType.value[dt] = true;
	}

	if (ruleForm.value.produceType) handleSelect();

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

			var deviceTypes = [];
			var keys = Object.keys(ruleFormdeviceType.value);
			for (const k of keys) {
				if (ruleFormdeviceType.value[k]) deviceTypes.push(k)
			}
			values.deviceTypes = deviceTypes.join(',')
			if (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == "" || ruleForm.value.id == 0) {
				await addProduce(values);
			} else {
				await updateProduce(values);
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

const produceTypeProduceTypeDropdownList = ref<any>([]);
const getProduceTypeProduceTypeDropdownList = async () => {
	let list = await getProduceTypeProduceTypeDropdown();
	produceTypeProduceTypeDropdownList.value = list.data.result ?? [];
};
getProduceTypeProduceTypeDropdownList();

const systemUnitDropdownList = ref<any>([]);
const getSystemUnitDropdownList = async () => {
	let list = await systemUnitDropdown();
	systemUnitDropdownList.value = list.data.result ?? [];
};
getSystemUnitDropdownList();

const deviceTypeDeviceTypeIdDropdownList = ref<any>([]);
const deviceTypeListRef = ref<any>({});
const getDeviceTypeDeviceTypeIdDropdownList = async () => {
	let list = await getDeviceTypeDeviceTypeIdDropdown();
	deviceTypeDeviceTypeIdDropdownList.value = list.data.result ?? [];
	console.log(deviceTypeDeviceTypeIdDropdownList.value);

};
getDeviceTypeDeviceTypeIdDropdownList();

const handleColor = () => {
	var rgb = LabToRgb(ruleForm.value.colorLab);
	ruleForm.value.colorRgb = rgb;
};

const handleSelect = () => {
	var produceType = produceTypeProduceTypeDropdownList.value.find((x: { value: number }) => x.value == ruleForm.value.produceType);
	ruleForm.value.produceSeries = produceType.produceSeries;
};




// 页面加载时
onMounted(async () => {
});

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
