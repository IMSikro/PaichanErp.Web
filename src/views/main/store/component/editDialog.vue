<template>
	<div class="store-container">
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
						<el-form-item label="仓库编号" prop="storeCode">
							<el-input v-model="ruleForm.storeCode" placeholder="请输入仓库编号" maxlength="100" show-word-limit
								clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="仓库名称" prop="storeName">
							<el-input v-model="ruleForm.storeName" placeholder="请输入仓库名称" maxlength="100" show-word-limit
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

			<el-divider content-position="left">库位</el-divider>
			<el-table :data="ruleForm.storeLocations" style="width: 100%" max-height="400">
				<el-table-column prop="storeLocationCode" label="库位" width="220" fixed>
					<template #default="scope">
						<el-input v-model="scope.row.storeLocationCode" autocomplete="off"
							:disable="scope.row.isDelete" />
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="描述" width="220">
					<template #default="scope">
						<el-input v-model="scope.row.remark" autocomplete="off" :disable="scope.row.isDelete" />
					</template>
				</el-table-column>
				<el-table-column label="操作" minWidth="200" align="center" fixed="right">
					<template #default="scope">
						<el-button link type="danger" icon="el-icon-delete" v-if="!scope.row.isDelete"
							@click.prevent="handleColDelete(scope.$index)">删除</el-button>
						<el-button link type="primary" icon="el-icon-delete" v-else
							@click.prevent="handleColRecover(scope.$index)">恢复</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div style="text-align: left; margin-top: 10px">
				<el-button icon="ele-Plus" @click="addStoreLocation">新增库位</el-button>
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
import { ref, onMounted } from "vue";
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
import { ElMessage } from "element-plus";
import type { FormRules } from "element-plus";
import { addStore, updateStore } from "/@/api/main/store";

// 页面加载时
onMounted(async () => {
});

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
	storeCode: [{ required: true, message: '请输入仓库编号！', trigger: 'blur', },],
	storeName: [{ required: true, message: '请输入仓库名称！', trigger: 'blur', },],
});

// 打开弹窗
const openDialog = (row: any) => {
	ruleForm.value = JSON.parse(JSON.stringify(row));
	if (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == "" || ruleForm.value.id == 0) {
		ruleForm.value.storeLocations = [{
			id: 0,
			storeId: 0,
			storeLocationCode: '',
			remark: '',
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
				await addStore(values);
			} else {
				await updateStore(values);
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




// 增加库位行
function addStoreLocation() {
	ruleForm.value.storeLocations.push({
		id: 0,
		storeId: (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == "" || ruleForm.value.id == 0) ? 0 : ruleForm.value.id,
		storeLocationCode: '',
		remark: '',
		isDelete: 0,
	});
}

// 删除
function handleColDelete(index: number) {
	if (ruleForm.value.storeLocations[index].id == 0) {
		ruleForm.value.storeLocations.splice(index, 1);
	}
	else {
		ruleForm.value.storeLocations[index].isDelete = true;
	}
}

// 恢复
function handleColRecover(index: number) {
	ruleForm.value.storeLocations[index].isDelete = false;
}

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
