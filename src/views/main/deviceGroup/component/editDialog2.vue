<template>
	<div class="deviceGroup-container">
		<el-dialog v-model="isShowDialog" :fullscreen="state.fullscreen" draggable="">
			<template #header>
				<div style="color: #fff">
					<!--<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>-->
					<span>{{ props.title }}</span>
				</div>
			</template>
			<el-form :model="ruleForm" ref="ruleFormRef" label-width="auto" :rules="rules">

			</el-form>
			<el-row :gutter="35" style="padding-left: 2.5rem;">
				<el-card style="margin-right: 2.5rem;" v-for="(item, index) in deviceTypeAndChildList" :key="index">
					<template #header>
						<div class="card-header">
							<span>{{ item.typeName }}</span>
						</div>
					</template>
					<el-checkbox-group v-model="checkedValues" direction="vertical">
						<el-checkbox v-for="items in item.devices" :label="items.id" :key="items.id">
							{{ items.deviceName }}
						</el-checkbox>
					</el-checkbox-group>
					<!-- <el-tree ref="deviceTreeRef[item.id]" :data="item.devices" :props="TreeProps" :height="208"
						:check-on-click-node="state.clickNode" :show-checkbox="state.showCheckbox"
						@check-change="handleCheck" node-key="deviceTypeId"
						:default-checked-keys="array" highlight-current>
						<template #default="{ node, data }">
							<span class="custom-tree-node">
								<span> {{ node.label }} </span>
							</span>
						</template>
					</el-tree> -->
				</el-card>
			</el-row>

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

.custom-tree-node {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 1.2rem;
	padding-right: 1rem;
}

.el-checkbox {
	display: block;
	margin-bottom: 10px;
}
</style>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormRules } from "element-plus";
import { addDeviceGroup, updateDeviceGroup } from "/@/api/main/deviceGroup";
import { listDeviceTypeAndChild } from '/@/api/main/deviceType';
var array = ref([])
const checkedValues = ref([]);
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
let deviceTreeRef = {} as any;
const deviceTree2Ref = ref<any>({});

const state = {
	fullscreen: true,
	clickNode: true,
	showCheckbox: true,
}

//自行添加其他规则
const rules = ref<FormRules>({
});

const handleCheck = (data, checked, nodes) => {
	let deviceIds = deviceTree2Ref.value[data.deviceTypeId];
	if (checked && !deviceIds.some(x => x == data.id))
		deviceIds.push(data.id);
	if (!checked && deviceIds.some(x => x == data.id))
		deviceIds = deviceIds.filter(x => x != data.id);
	deviceTree2Ref.value[data.deviceTypeId] = deviceIds;
	// console.log(deviceTreeRef);
	console.log(deviceTree2Ref.value);
}

// 打开弹窗
const openDialog = async (row: any) => {
	ruleForm.value = JSON.parse(JSON.stringify(row));
	await getDeviceTypeAndChildList();
	await setCheckedKeys();
	isShowDialog.value = true;
};

const setCheckedKeys = async () => {

	let allTypeIds = deviceTypeAndChildList.value.map(x => x.id);
	for (let i = 0; i < allTypeIds.length; i++) {
		const e = allTypeIds[i];

		let alldIds = deviceTypeAndChildList.value.find(x => x.id == e).devices;
		let xianyou = ruleForm.value.deviceIds?.split(',').map(x => Number(x)) ?? [];
		let jiaoji = alldIds.filter(x => xianyou.indexOf(x.id) > -1);
		let jiaojiIds = jiaoji.map(x => x.id);

		let dids = [];
		dids.push(...jiaojiIds);
		// console.log(dids);
		deviceTree2Ref.value[e] = dids;
		checkedValues.value = xianyou
		console.log(dids, jiaojiIds, jiaoji, xianyou, alldIds)
		// dids.forEach(v => {
		// 	deviceTreeRef.value[e].setChecked(v, true, false);
		// })
		// console.log(e);
		// array.value=ruleForm.value.deviceIds?.split(',').map(x => Number(x)) ?? [];
		// array.value.push(e)
		// console.log(array.value)
		// deviceTreeRef[e].value!.setCheckedKeys(dids, false);
	}
	// console.log(deviceTreeRef.value);
	console.log(deviceTree2Ref.value);
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
	let isLonger = false;
	let allTypeIds = Object.keys(deviceTree2Ref.value);
	let hasTypeIds = [];
	let alldIds = [];
	for (let i = 0; i < allTypeIds.length; i++) {
		const e = allTypeIds[i];
		let dids = deviceTree2Ref.value[e];
		if (dids.length > 0) hasTypeIds.push(e);
		alldIds.push(...dids);
		if (dids.length > 6)
			isLonger = true;
	}
	ruleForm.value.deviceTypeIds = hasTypeIds.join(',');
	// ruleForm.value.deviceIds = alldIds.join(',');
	ruleForm.value.deviceIds = checkedValues.value.join(',')
	console.log(ruleForm.value);

	if (isLonger) {
		ElMessageBox.confirm(
			'当前选择有某一工艺大于6台设备,可能会导致展示效果不佳,是否确认?',
			'警告',
			{
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}
		)
			.then(() => {
				ruleFormRef.value.validate(async (isValid: boolean, fields?: any) => {
					if (isValid) {
						let values = ruleForm.value;
						if (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == "" || ruleForm.value.id == 0) {
							await addDeviceGroup(values);
						} else {
							await updateDeviceGroup(values);
						}
						closeDialog();
					} else {
						ElMessage({
							message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
							type: "error",
						});
					}
				});
			})
			.catch(() => {
			})
	}
	else {
		ruleFormRef.value.validate(async (isValid: boolean, fields?: any) => {
			if (isValid) {
				let values = ruleForm.value;
				console.log(checkedValues.value)
				if (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == "" || ruleForm.value.id == 0) {
					await addDeviceGroup(values);
				} else {
					await updateDeviceGroup(values);
				}
				closeDialog();
			} else {
				ElMessage({
					message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
					type: "error",
				});
			}
		});
	}

};

const deviceTypeAndChildList = ref<any>([]);
const TreeProps = {
	value: 'id',
	label: 'deviceCode',
	children: 'children',
}
const getDeviceTypeAndChildList = async () => {
	let list = await listDeviceTypeAndChild();
	let listData = list.data.result ?? [];
	deviceTypeAndChildList.value = listData;
	for (let i = 0; i < listData.length; i++) {
		const e = listData[i];
		// deviceTreeRef[e.id] = ref<any>();
	}
};



// 页面加载时
onMounted(async () => {
});

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>