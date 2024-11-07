<template>
	<div class="order-container">
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
						<el-input v-model="ruleForm.startDate" v-show="false" />
						<el-input v-model="ruleForm.endDate" v-show="false" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="订单编号" prop="orderCode">
							<el-input v-model="ruleForm.orderCode" placeholder="请输入订单编号" maxlength="100" show-word-limit
								clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="批次号" prop="batchNumber">
							<el-input v-model="ruleForm.batchNumber" placeholder="请输入批次号" maxlength="50" show-word-limit
								clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="下单日期" prop="orderDate">
							<el-date-picker v-model="ruleForm.orderDate" type="date" placeholder="下单日期" />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="交货日期" prop="deliveryDate">
							<el-date-picker v-model="ruleForm.deliveryDate" type="date" placeholder="交货日期" />

						</el-form-item>

					</el-col>
					<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="实际开工时间" prop="startDate">
							<el-date-picker v-model="ruleForm.startDate" type="date" placeholder="实际开工时间" />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="实际完成时间" prop="endDate">
							<el-date-picker v-model="ruleForm.endDate" type="date" placeholder="实际完成时间" />

						</el-form-item>

					</el-col> -->
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="产品选择" prop="produceId">
							<el-select clearable filterable v-model="ruleForm.produceId" placeholder="请选择产品选择"
								@change="selectChange">
								<el-option v-for="(item, index) in produceProduceIdDropdownList" :key="index"
									:value="item.value" :label="item.label" />

							</el-select>

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="产品名称" prop="produceName">
							<el-input v-model="ruleForm.produceName" placeholder="请输入产品名称" maxlength="50"
								show-word-limit clearable :disabled="true" />

						</el-form-item>

					</el-col>

					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="批次总量" prop="quantity">
							<el-input v-model="ruleForm.quantity" placeholder="请输入批次总量" maxlength="53" show-word-limit
								clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="计量单位" prop="pUnit">
							<el-input v-model="ruleForm.pUnit" placeholder="请输入计量单位" maxlength="20" show-word-limit
								clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="客户" prop="customer">
							<el-input v-model="ruleForm.customer" placeholder="请输入客户" maxlength="50" show-word-limit
								clearable />

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
import { isMobile } from "/@/utils/other";
import { addOrder, updateOrder } from "/@/api/main/order";
import { getProduceProduceIdDropdown } from '/@/api/main/order';

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
	orderCode: [{ required: true, message: '请输入订单编号！', trigger: 'blur', },],
	orderDate: [{ required: true, message: '请选择下单日期！', trigger: 'change', },],
	deliveryDate: [{ required: true, message: '请选择交货日期！', trigger: 'change', },],
	produceId: [{ required: true, message: '请选择产品！', trigger: 'change', },],
	batchNumber: [{ required: true, message: '请输入批次号！', trigger: 'blur', },],
	quantity: [{ required: true, message: '请输入批次总量！', trigger: 'blur', },],
});

const selectChange = () => {
	let produceItem = produceProduceIdDropdownList.value.find((v: { value: any; }) => v.value == ruleForm.value.produceId);
	ruleForm.value.produceName = produceItem.text;
	ruleForm.value.pUnit = produceItem.unit;
};

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
				await addOrder(values);
			} else {
				await updateOrder(values);
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
