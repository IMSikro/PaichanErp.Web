<template>
	<div class="produceFormula-container">
		<el-dialog v-model="isShowDialog" :width="800" draggable="">
			<template #header>
				<div style="color: #fff">
					<!--<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>-->
					<span>{{ props.title }}</span>
				</div>
			</template>
			<el-button type="primary" @click="addItem(form.list.length)" style="margin-top: 10px;">
				+ 添加配方版本
			</el-button>
			<el-form :model="form" ref="formRef" class="form">
				<div v-for="(item, index) in form.list" :key="index" class="list-form">
					<el-form-item class="form-style" label="配方版本" :prop="'list.' + index + '.formulaVersion'" :rules="[
                        { required: true, message: '配方版本不能为空', trigger: 'blur' },
                    ]">
						<el-input v-model="item.formulaVersion" disabled :placeholder="'V'+(index+1)"
							style="width:160px" />
					</el-form-item>
					<el-form-item label="是否启用" :prop="'list.' + index + '.isEnable'"
						style="margin-left: 10px;margin-right: 10px;">
						<el-switch v-model="item.isEnable" active-text="是" inactive-text="否"
							@change="isEnableClick(item)" />
					</el-form-item>
					<el-form-item label-width="0" class="form-button">
						<!-- <el-button v-if="index + 1 == form.list.length" type="primary" @click="addItem(form.list.length)">
						+
					</el-button> -->
						<el-button v-if="index !== 0" type="danger" @click="deleteItem(item, index)">
							-
						</el-button>
					</el-form-item>
				</div>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel">关闭</el-button>
					<!-- <el-button type="primary" @click="submit">确 定</el-button> -->
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

	.form {
		margin-top: 5px;
	}

	.list-form {
		display: flex;

	}
</style>
<script lang="ts" setup>
	import { ref, onMounted, provide } from "vue";
	import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
	import { ElMessage } from "element-plus";
	import type { FormRules } from "element-plus";
	import { addProduceFormula, updateProduceFormula, listVersions, addFormulaVersion, enableVersion, deleteProduceFormula } from "/@/api/main/produceFormula";
	import { getProduceProduceIdDropdown } from '/@/api/main/produceFormula';

	//父级传递来的参数
	var props = defineProps({
		title: {
			type: String,
			default: "",
		},
	});

	const form = ref({
		list: [
			{
				formulaVersion: "",
				isEnable: ref(true),
			},
		],
		curItem: ''
	});

	//父级传递来的函数，用于回调
	// const emit = defineEmits(["reloadTable"]);
	const ruleFormRef = ref();
	const isShowDialog = ref(false);
	const ruleForm = ref<any>({});


	// const multipleSelection = ref([]);

	// 打开弹窗
	const openDialog = (row : any) => {
		ruleForm.value = JSON.parse(JSON.stringify(row));
		isShowDialog.value = true;
		handleQuery()
	};

	// 关闭弹窗
	// const closeDialog = () => {
	// 	// emit("reloadTable");
	// 	isShowDialog.value = false;
	// };


	// 取消
	const cancel = () => {
		isShowDialog.value = false;
	};


	const addItem = () => {
		addFormulaVersions()
		// form.value.list.push({
		// 	formulaVersion: "",
		// 	isEnable: ref(false),
		// });
	};
	const deleteItem = (item, index) => {
		// form.value.list.splice(index, 1);
		console.log(item.id)
		deleteProduceFormulas(item.id)
	};
	//获取配方版本
	const handleQuery = async () => {
		console.log(ruleForm.value.id)
		const tableParams = ref({
			Id: ruleForm.value.id
		});
		var res = await listVersions(Object.assign(tableParams.value));
		var produceList = res.data.result ?? []
		for (const p of produceList) {
			p.deviceTypeList = p.deviceTypes?.split(',') ?? [];
		}
		form.value.list = produceList;

	};
	//新增配方版本
	const addFormulaVersions = async () => {
		console.log(form.value.list[form.value.list.length - 1].formulaVersion)
		const trimmedString = ref(form.value.list[form.value.list.length - 1].formulaVersion.slice(1))
		const formulaVersions = ref('V' + (Number(trimmedString.value) + 1))
		console.log(formulaVersions.value)
		const tableParams = ref({
			Id: ruleForm.value.id,
			formulaVersion: formulaVersions.value,
			isEnable: false
		});
		var res = await addFormulaVersion(Object.assign(tableParams.value));
		handleQuery()

	};
	//更改配方版本状态
	const enableVersions = async (e) => {
		const tableParams = ref({
			id: e,
			isEnable: true
		});
		var res = await enableVersion(Object.assign(tableParams.value));
		handleQuery()

	};

	//删除配方版本
	const deleteProduceFormulas = async (e) => {
		const tableParams = ref({
			id: e,
		});
		var res = await deleteProduceFormula(Object.assign(tableParams.value));
		handleQuery()

	};


	const isEnableClick = (value) => {
		console.log(value.id)
		console.log(form.value.list)
		if (value.isEnable) {
			// 赋值给选中的数据
			form.value.curItem = value
			// 其他switch关闭
			form.value.list.map(item => {
				if (value.id !== item.id) item.isEnable = false
				return item
			})
		} else {
			form.value.curItem = ''
		}
		enableVersions(value.id)
	}

	// 提交

	// 在子组件中派发handleEditId自定义事件，用于触发父组件中的handleEditId事件
	// const emit = defineEmits(['handleEditId']);

	const submit = async () => {
		console.log(JSON.parse(JSON.stringify(form.value.list)))
		// let id = JSON.parse(JSON.stringify(multipleSelection.value))[0].name
		// isShowDialog.value = false;
		// emit('handleEditId', id);

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