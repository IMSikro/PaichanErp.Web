<template>
	<div class="produceFormula-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" labelWidth="90">
				<el-row>
					<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
						<el-form-item label="配方编号">
							<el-input v-model="queryParams.produceFormulaCode" clearable="" placeholder="请输入配方编号" />

						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
						<el-form-item label="产品外键">
							<el-select clearable="" filterable="" v-model="queryParams.produceId" placeholder="请选择产品外键">
								<el-option v-for="(item, index) in  produceProduceIdDropdownList" :key="index"
									:value="item.value" :label="item.label" />

							</el-select>

						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
						<el-form-item label="配方名称">
							<el-input v-model="queryParams.produceFormulaName" clearable="" placeholder="请输入配方名称" />

						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
						<el-form-item label="配方版本">
							<el-input v-model="queryParams.formulaVersion" clearable="" placeholder="请输入配方版本" />

						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="16" :xl="6" class="mb10">
						<el-form-item>
							<el-button-group>
								<el-button icon="ele-Search" @click="handleQuery" v-auth="'produceFormula:page'"> 查询
								</el-button>
								<el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>

							</el-button-group>

							<el-button-group style="margin-left:20px">
								<el-button icon="ele-Plus" @click="openAddProduceFormula" v-auth="'produceFormula:add'">
									新增 </el-button>

							</el-button-group>

						</el-form-item>

					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px;margin-bottom: 8px;">
			<el-table key="formula" :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light"
				row-key="id" border="" @current-change="handleCurrentRowChange">
				<el-table-column type="index" label="序号" width="55" align="center" />
				<el-table-column prop="produceFormulaCode" label="配方编号" width="140" show-overflow-tooltip="" />
				<el-table-column prop="produceId" label="产品编号" width="120" show-overflow-tooltip="">
					<template #default="scope">
						<span>{{ scope.row.produceIdProduceCode }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="produceName" label="产品名称" width="120" show-overflow-tooltip="">
					<template #default="scope">
						<span>{{ scope.row.produceName }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="produceFormulaName" label="配方名称" width="140" show-overflow-tooltip="" />
				<el-table-column prop="formulaVersion" label="配方版本" width="140" show-overflow-tooltip="">
					<template #default="scope">
						<div @click="formulaVersionClick(scope.row)">
							<el-tag> {{ scope.row.formulaVersion }} </el-tag>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="isEnable" label="是否启用" width="120" show-overflow-tooltip="">
					<template #default="scope">
						<div @click="formulaVersionClick(scope.row)">
							<el-tag v-if="scope.row.isEnable"> 是 </el-tag>
							<el-tag type="danger" v-else> 否 </el-tag>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="formulaCosts" label="配方成本" width="140" show-overflow-tooltip="" />
				<el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
				<el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
				<el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
				<el-table-column label="操作" width="80" align="center" fixed="left" show-overflow-tooltip=""
					v-if="auth('produceFormula:edit') || auth('produceFormula:delete')">
					<template #default="scope">
						<el-button icon="ele-Edit" size="small" text="" type="primary"
							@click="openEditProduceFormula(scope.row)" v-auth="'produceFormula:edit'"></el-button>
						<el-button icon="ele-Delete" size="small" text="" type="primary"
							@click="delProduceFormula(scope.row)" v-auth="'produceFormula:delete'"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
		</el-card>
		<el-card class="full-table" shadow="hover" body-style="margin-top: -25px;"
			:style="{ 'overflow-y': 'auto' }">
			<el-tabs v-model="activeName">
				<el-tab-pane label="BOM表" name="produceFormula">
					<el-button-group style="margin-bottom:5px">
						<el-button icon="ele-Plus" size="small" @click="openAddMaterial" v-auth="'produceFormula:add'">
							新增 </el-button>
					</el-button-group>
					<el-table key="formulaMaterial" height="140" :data="tableDataMaterial" style="width: 100%"
						v-loading="loading" tooltip-effect="light" row-key="id" border="">
						<el-table-column type="index" label="序号" width="55" align="center" />
						<el-table-column prop="produceFormulaId" label="配方" width="120" show-overflow-tooltip="">
							<template #default="scope">
								<span>{{ scope.row.produceFormulaIdProduceFormulaCode }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="materialCode" label="物料编号" width="140" show-overflow-tooltip="" />
						<el-table-column prop="materialName" label="物料名称" width="140" show-overflow-tooltip="" />
						<el-table-column prop="materialNorm" label="物料规格" width="140" show-overflow-tooltip="" />
						<el-table-column prop="costPrice" label="采购单价" width="140" show-overflow-tooltip="" />
						<el-table-column prop="dutyRate" label="税率(%)" width="140" show-overflow-tooltip="" />
						<!-- <el-table-column prop="supplierId" label="供应商" width="120" show-overflow-tooltip="">
							<template #default="scope">
								<span>{{ scope.row.supplierIdSupplierName }}</span>
						
							</template>
						
						</el-table-column>
						<el-table-column prop="safetyStock" label="安全库存" width="140" show-overflow-tooltip="" /> -->
						<el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
						<el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
						<el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
						<el-table-column label="操作" width="80" align="center" fixed="left" show-overflow-tooltip=""
							v-if="auth('store:edit')">
							<template #default="scope">
								<el-button icon="ele-Edit" size="small" text="" type="primary"
									@click="openEditProduceFormulaMaterial(scope.row)" v-auth="'produceFormula:edit'">
								</el-button>
								<el-button icon="ele-Delete" size="small" text="" type="primary"
									@click="delProduceFormulaMaterial(scope.row)" v-auth="'produceFormula:delete'">
								</el-button>
							</template>
							<!-- <template #default="scope">
								<el-button icon="ele-Edit" size="small" text="" type="primary"
									@click="openEditProcessStandard(scope.row)" v-auth="'processStandard:edit'">
								</el-button>
								<el-button icon="ele-Delete" size="small" text="" type="primary"
									@click="delProcessStandard(scope.row)" v-auth="'processStandard:delete'">
								</el-button>
							</template> -->
						</el-table-column>
					</el-table>
					<el-pagination v-model:currentPage="tableParamsMaterial.page" 
						v-model:page-size="tableParamsMaterial.pageSize" :total="tableParamsMaterial.total"
						:page-sizes="[10, 20, 50, 100, 200, 500]" small="true" background=""
						@size-change="handleMaterialSizeChange" @current-change="handleMaterialCurrentChange"
						layout="total, sizes, prev, pager, next, jumper" />
				</el-tab-pane>
				<el-tab-pane label="工艺标准" name="processStandard">
					<el-button-group style="margin-bottom:5px">
						<el-button icon="ele-Plus" size="small" @click="openAddProcess" v-auth="'produceFormula:add'">
							新增 </el-button>
					</el-button-group>
					<el-table key="processStandard" height="140" :data="tableDataProcess" style="width: 100%"
						v-loading="loading" tooltip-effect="light" row-key="id" border="">
						<el-table-column type="index" label="序号" width="55" align="center" />
						<el-table-column prop="produceFormulaId" label="配方" width="120" show-overflow-tooltip="">
							<template #default="scope">
								<span>{{ scope.row.produceFormulaIdProduceFormulaCode }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="processStandardCode" label="工艺标准编号" width="90"
							show-overflow-tooltip="" />
						<el-table-column prop="processStandardName" label="工艺标准名称" width="90"
							show-overflow-tooltip="" />
						<el-table-column prop="produceCode" label="产品编号" width="140" show-overflow-tooltip="" />
						<el-table-column prop="produceName" label="产品名称" width="140" show-overflow-tooltip="" />
						<el-table-column prop="deviceTypeCode" label="工艺设备编号" width="90" show-overflow-tooltip="" />
						<el-table-column prop="deviceTypeName" label="工艺设备名称" width="90" show-overflow-tooltip="" />
						<el-table-column prop="processProjectName" label="工艺项目名称" width="90" show-overflow-tooltip="" />
						<el-table-column prop="standardValue" label="标准值" width="140" show-overflow-tooltip="" />
						<el-table-column prop="tolerance1" label="正公差" width="140" show-overflow-tooltip="" />
						<el-table-column prop="tolerance2" label="负公差" width="140" show-overflow-tooltip="" />
						<el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
						<el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
						<el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
						<el-table-column label="操作" width="80" align="center" fixed="left" show-overflow-tooltip=""
							v-if="auth('store:edit')">
							<template #default="scope">
								<el-button icon="ele-Edit" size="small" text="" type="primary"
									@click="openEditProcessStandard(scope.row)" v-auth="'processStandard:edit'">
								</el-button>
								<el-button icon="ele-Delete" size="small" text="" type="primary"
									@click="delProcessStandard(scope.row)" v-auth="'processStandard:delete'">
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination v-model:currentPage="tableParamsProcess.page"
						v-model:page-size="tableParamsProcess.pageSize" :total="tableParamsProcess.total"
						:page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
						@size-change="handleProcessSizeChange" @current-change="handleProcessCurrentChange"
						layout="total, sizes, prev, pager, next, jumper" />
				</el-tab-pane>
				<el-tab-pane label="检验标准" name="examineStandard">
					<el-button-group style="margin-bottom:5px;">
						<el-button icon="ele-Plus" size="small" @click="openAddExamine" v-auth="'produceFormula:add'">
							新增 </el-button>
					</el-button-group>
					<el-table key="examineStandard" height="140" :data="tableDataExamine" style="width: 100%"
						v-loading="loading" tooltip-effect="light" row-key="id" border="">
						<el-table-column type="index" label="序号" width="55" align="center" />
						<el-table-column prop="produceFormulaId" label="配方" width="120" show-overflow-tooltip="">
							<template #default="scope">
								<span>{{ scope.row.produceFormulaIdProduceFormulaCode }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="examineStandardCode" label="检验标准编号" width="90"
							show-overflow-tooltip="" />
						<el-table-column prop="examineStandardName" label="检验标准名称" width="90"
							show-overflow-tooltip="" />
						<el-table-column prop="produceCode" label="产品编号" width="140" show-overflow-tooltip="" />
						<el-table-column prop="produceName" label="产品名称" width="140" show-overflow-tooltip="" />
						<el-table-column prop="deviceTypeName" label="工艺设备名称" width="90" show-overflow-tooltip="" />
						<el-table-column prop="examineProjectCode" label="检验项目编号" width="90" show-overflow-tooltip="" />
						<el-table-column prop="examineProjectName" label="检验项目名称" width="90" show-overflow-tooltip="" />
						<el-table-column prop="standardValue" label="标准值" width="140" show-overflow-tooltip="" />
						<el-table-column prop="tolerance1" label="正公差" width="140" show-overflow-tooltip="" />
						<el-table-column prop="tolerance2" label="负公差" width="140" show-overflow-tooltip="" />
						<el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
						<el-table-column prop="createUserName" label="创建者姓名" width="140" show-overflow-tooltip="" />
						<el-table-column prop="updateUserName" label="修改者姓名" width="140" show-overflow-tooltip="" />
						<el-table-column label="操作" width="80" align="center" fixed="left" show-overflow-tooltip=""
							v-if="auth('store:edit')">
							<template #default="scope">
								<el-button icon="ele-Edit" size="small" text="" type="primary"
									@click="openEditExamineStandard(scope.row)" v-auth="'examineStandard:edit'">
								</el-button>
								<el-button icon="ele-Delete" size="small" text="" type="primary"
									@click="delExamineStandard(scope.row)" v-auth="'examineStandard:delete'">
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination v-model:currentPage="tableParamsExamine.page"
						v-model:page-size="tableParamsExamine.pageSize" :total="tableParamsExamine.total"
						:page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
						@size-change="handleExamineSizeChange" @current-change="handleExamineCurrentChange"
						layout="total, sizes, prev, pager, next, jumper" />
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<editDialog ref="editDialogRef" :title="editProduceFormulaTitle" @reloadTable="handleQuery" />
		<formulaVersionDialog ref="formulaVersionRef" :title="formulaVersionTitle" />
		<processStandardDialog ref="processStandardRef" :title="processStandardTitle" :id="processStandardId"
			:processProjectNameList="processProjectNameLists" />
		<examineStandardDialog ref="examineStandardRef" :title="examineStandardTitle" :id="examineStandardId"
			:examineNameList="examineNameLists" />
		<materialStandardDialog ref="materialStandardRef" :title="materialStandardTitle" :id="materialStandardId"
			:materialNameList="materialNameLists" />

	</div>
</template>

<script lang="ts" setup="" name="produceFormula">
	import { ref } from "vue";
	import { ElMessageBox, ElMessage } from "element-plus";
	import { auth } from '/@/utils/authFunction';
	import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
	//import { formatDate } from '/@/utils/formatTime';
	import { useRoute, useRouter } from 'vue-router';

	import editDialog from '/@/views/main/produceFormula/component/editDialog.vue'
	import formulaVersionDialog from '/@/views/main/produceFormula/component/formulaVersionDialog.vue'
	import processStandardDialog from '/@/views/main/produceFormula/component/processStandardDialog.vue'
	import examineStandardDialog from '/@/views/main/produceFormula/component/examineStandardDialog.vue'
	import materialStandardDialog from '/@/views/main/produceFormula/component/materialStandardDialog.vue'
	import { pageProduceFormula, deleteProduceFormula, pageProcessStandard, deleteProcessStandard, pageExamineStandard, deleteExamineStandard, pagematerial, pageProduceFormulaMaterial,deleteproduceFormulaMaterial } from '/@/api/main/produceFormula';
	import { getProduceProduceIdDropdown } from '/@/api/main/produceFormula';


	const router = useRoute();
	const showAdvanceQueryUI = ref(false);
	const editDialogRef = ref();
	const formulaVersionRef = ref();
	const processStandardRef = ref();
	const examineStandardRef = ref();
	const materialStandardRef = ref();
	const loading = ref(false);
	const tableData = ref<any>([]);
	const tableDataMaterial = ref<any>([]);
	const tableDataProcess = ref<any>([]);
	const tableDataExamine = ref<any>([]);
	const queryParams = ref<any>({});
	const tableParams = ref({
		page: 1,
		pageSize: 10,
		total: 0,
	});
	const tableParamsMaterial = ref({
		page: 1,
		pageSize: 10,
		total: 0,
	});
	const tableParamsProcess = ref({
		page: 1,
		pageSize: 10,
		total: 0,
	});
	const tableParamsExamine = ref({
		page: 1,
		pageSize: 10,
		total: 0,
	});
	const editProduceFormulaTitle = ref("");
	const formulaVersionTitle = ref("");
	const processStandardTitle = ref("")
	const examineStandardTitle = ref("")
	const materialStandardTitle = ref("")
	const processStandardId = ref({})
	const processProjectNameLists = ref([])
	const examineNameLists = ref([])
	const materialNameLists = ref([])
	const examineStandardId = ref([])
	const materialStandardId = ref("")
	const activeName = ref('produceFormula');

	// 改变高级查询的控件显示状态
	const changeAdvanceQueryUI = () => {
		showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
	}

	// 根据路由显示tab
	const showTabByRoute = () => {
		console.log(router.name);
		activeName.value = router.name?.toString() ?? 'produceFormula';
	}

	// 查询操作
	const handleQuery = async () => {
		loading.value = true;
		var res = await pageProduceFormula(Object.assign(queryParams.value, tableParams.value));
		tableData.value = res.data.result?.items ?? [];
		tableParams.value.total = res.data.result?.total;

		// tableDataMaterial.value = [];
		// tableParamsMaterial.value.total = 0;
		// tableDataProcess.value = [];
		// tableParamsProcess.value.total = 0;
		// tableDataExamine.value = [];
		// tableParamsExamine.value.total = 0;
		loading.value = false;
	};
	const arr = ref([])
	const examineArr = ref([])
	const materialArr = ref([])

	// 查询物料列表
	const handleQueryMaterial = async () => {
		loading.value = true;
		let id = { produceFormulaId: currentRowid.value }
		let valueItem = { ...tableParamsProcess.value, ...id }
		var res = await pageProduceFormulaMaterial(Object.assign(queryParams.value, valueItem));
		tableDataMaterial.value = res.data.result?.items ?? [];
		tableDataMaterial.value.total = res.data.result?.total;
		materialArr.value = tableDataMaterial.value.map((item) => { return item.materialId })
		console.log(materialArr.value,'2112121')
		loading.value = false;

	};


	// 查询工艺标准
	const handleQueryProcess = async () => {
		loading.value = true;
		let id = { produceFormulaId: currentRowid.value }
		let valueItem = { ...tableParamsProcess.value, ...id }
		var res = await pageProcessStandard(Object.assign(queryParams.value, valueItem));
		tableDataProcess.value = res.data.result?.items ?? [];
		tableParamsProcess.value.total = res.data.result?.total;
		console.log(tableDataProcess.value, '工艺标准')
		arr.value = tableDataProcess.value.map((item) => { return item.processProjectIdProcessProjectName })
		console.log(arr.value)
		loading.value = false;
	};

	// 查询检验标准
	const handleQueryExamine = async () => {
		loading.value = true;
		let id = { produceFormulaId: currentRowid.value }
		let valueItem = { ...tableParamsProcess.value, ...id }
		var res = await pageExamineStandard(Object.assign(queryParams.value, valueItem));
		tableDataExamine.value = res.data.result?.items ?? [];
		tableParamsExamine.value.total = res.data.result?.total;
		examineArr.value = tableDataExamine.value.map((item) => { return item.examineProjectIdExamineProjectName })
		console.log(examineArr.value)
		loading.value = false;
	};
	const currentRowid = ref()
	const produceId = ref({})
	// 改变选中行
	const handleCurrentRowChange = async (currentRow : any, oldCurrentRow : any) => {
		produceId.value = currentRow
		let formulaData = { produceFormulaId: currentRow.id };
		if (currentRowid.value == currentRow.id) {
			return
		}
		currentRowid.value = currentRow.id

		switch (activeName.value) {
			case 'produceFormula':
				handleQueryMaterial();
				break;
			case 'processStandard':
				handleQueryProcess();
				break;
			case 'examineStandard':
				handleQueryExamine();
				break;
			default:
				handleQueryMaterial();
				break;
		}
		loading.value = false;
	};
	//配方版本点击事件
	const formulaVersionClick = (row : any) => {
		console.log(row)
		formulaVersionTitle.value = '编辑配方版本';
		formulaVersionRef.value.openDialog(row);
	};

	// 打开新增页面
	const openAddProduceFormula = () => {
		editProduceFormulaTitle.value = '添加产品配方';
		editDialogRef.value.openDialog({});
	};

	// 打开编辑页面
	const openEditProduceFormula = (row : any) => {
		editProduceFormulaTitle.value = '编辑产品配方';
		editDialogRef.value.openDialog(row);
	};

	//打开工艺标准新增页面
	const openAddProcess = (row : any) => {
		console.log(produceId.value)
		processStandardTitle.value = '添加工艺标准'
		processStandardId.value = produceId.value
		processProjectNameLists.value = arr.value
		processStandardRef.value.openDialog(row);
	}
	const openEditProcessStandard = (row : any) => {
		console.log(produceId.value)
		processStandardTitle.value = '编辑工艺标准'
		processStandardId.value = produceId.value
		processProjectNameLists.value = arr.value
		processStandardRef.value.openDialog(row);
	}
	const delProcessStandard = (row : any) => {
		console.log(row.id)
		let id = { id: row.id }
		ElMessageBox.confirm(`确定要删除吗?`, "提示", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning",
		})
			.then(async () => {
				await deleteProcessStandard(id);
				handleQueryProcess();
				ElMessage.success("删除成功");
			})
			.catch(() => { });

	}
	//打开物料列表新增页面
	const openAddMaterial = (row : any) => {
		materialStandardTitle.value = '添加配方物料'
		materialStandardId.value = produceId.value
		materialNameLists.value = examineArr.value
		materialStandardRef.value.openDialog(row);
	}

	//打开检验标准新增页面
	const openAddExamine = (row : any) => {
		examineStandardTitle.value = '添加检验标准'
		examineStandardId.value = produceId.value
		examineNameLists.value = examineArr.value
		examineStandardRef.value.openDialog(row)

	}
	const openEditExamineStandard = (row : any) => {
		examineStandardTitle.value = '编辑检验标准'
		examineStandardId.value = produceId.value
		examineNameLists.value = examineArr.value
		examineStandardRef.value.openDialog(row)

	}
	const openEditProduceFormulaMaterial = (row : any) => {
		materialStandardTitle.value = '编辑配方物料'
		materialStandardId.value = produceId.value
		materialNameLists.value = materialArr.value
		materialStandardRef.value.openDialog(row);

	}
	const delProduceFormulaMaterial = (row : any) => {
		console.log(row.id)
		let id = { id: row.id }
		ElMessageBox.confirm(`确定要删除吗?`, "提示", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning",
		})
			.then(async () => {
				await deleteproduceFormulaMaterial(id);
				handleQueryMaterial();
				ElMessage.success("删除成功");
			})
			.catch(() => { });

	}
	const delExamineStandard = (row : any) => {
		console.log(row.id)
		let id = { id: row.id }
		ElMessageBox.confirm(`确定要删除吗?`, "提示", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning",
		})
			.then(async () => {
				await deleteExamineStandard(id);
				handleQueryExamine();
				ElMessage.success("删除成功");
			})
			.catch(() => { });

	}


	// 删除
	const delProduceFormula = (row : any) => {
		ElMessageBox.confirm(`确定要删除吗?`, "提示", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning",
		})
			.then(async () => {
				await deleteProduceFormula(row);
				handleQuery();
				ElMessage.success("删除成功");
			})
			.catch(() => { });
	};

	// 改变页面容量
	const handleSizeChange = (val : number) => {
		tableParams.value.pageSize = val;
		handleQuery();
	};

	// 改变页码序号
	const handleCurrentChange = (val : number) => {
		tableParams.value.page = val;
		handleQuery();
	};

	// 改变页面容量
	const handleMaterialSizeChange = (val : number) => {
		tableParamsMaterial.value.pageSize = val;
		handleQueryMaterial();
	};

	// 改变页码序号
	const handleMaterialCurrentChange = (val : number) => {
		tableParamsMaterial.value.page = val;
		handleQueryMaterial();
	};

	// 改变页面容量
	const handleProcessSizeChange = (val : number) => {
		tableParamsProcess.value.pageSize = val;
		handleQueryProcess();
	};

	// 改变页码序号
	const handleProcessCurrentChange = (val : number) => {
		tableParamsProcess.value.page = val;
		handleQueryProcess();
	};

	// 改变页面容量
	const handleExamineSizeChange = (val : number) => {
		tableParamsExamine.value.pageSize = val;
		handleQueryExamine();
	};

	// 改变页码序号
	const handleExamineCurrentChange = (val : number) => {
		tableParamsExamine.value.page = val;
		handleQueryExamine();
	};

	const produceProduceIdDropdownList = ref<any>([]);
	const getProduceProduceIdDropdownList = async () => {
		let list = await getProduceProduceIdDropdown();
		produceProduceIdDropdownList.value = list.data.result ?? [];
	};
	getProduceProduceIdDropdownList();

	handleQuery();
	showTabByRoute();
</script>
<style scoped>
	:deep(.el-ipnut),
	:deep(.el-select),
	:deep(.el-input-number) {
		width: 100%;
	}

	/* .el-tabs__content {
		overflow: initial !important;
		height: 150px
	} */
</style>