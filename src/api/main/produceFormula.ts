import request from '/@/utils/request';
enum Api {
	AddProduceFormula = '/api/produceFormula/add',
	DeleteProduceFormula = '/api/produceFormula/delete',
	UpdateProduceFormula = '/api/produceFormula/update',
	PageProduceFormula = '/api/produceFormula/page',
	PageProcessStandard = '/api/processStandard/page',
	PageExamineStandard = '/api/examineStandard/page',
	Pagematerial = '/api/material/page',
	PageProduceFormulaMaterial = '/api/produceFormulaMaterial/page',
	DeleteProcessStandard = '/api/processStandard/delete',

	DeleteExamineStandard = '/api/examineStandard/delete',
	DeleteproduceFormulaMaterial = '/api/produceFormulaMaterial/delete',
	GetProduceProduceIdDropdown = '/api/produceFormula/ProduceProduceIdDropdown',
	ProduceForProduceFormulaTableList = '/api/produce/produceForProduceFormulaTableList',
	ListVersions = '/api/produceFormula/listVersions',
	AddFormulaVersion = '/api/produceFormula/addFormulaVersion',
	EnableVersion = '/api/produceFormula/enableVersion',
}

//启用当前配方版本
export const enableVersion = (params ?: any) =>
	request({
		url: Api.EnableVersion,
		method: 'post',
		data: params,
	});

//新增配方版本
export const addFormulaVersion = (params ?: any) =>
	request({
		url: Api.AddFormulaVersion,
		method: 'post',
		data: params,
	});

//获取配方版本列表
export const listVersions = (params ?: any) =>
	request({
		url: Api.ListVersions,
		method: 'get',
		data: params,
	});


//产品外键列表
export const produceForProduceFormulaTableList = (params ?: any) =>
	request({
		url: Api.ProduceForProduceFormulaTableList,
		method: 'post',
		data: params,
	});

// 增加产品配方
export const addProduceFormula = (params ?: any) =>
	request({
		url: Api.AddProduceFormula,
		method: 'post',
		data: params,
	});

// 删除产品配方
export const deleteProduceFormula = (params ?: any) =>
	request({
		url: Api.DeleteProduceFormula,
		method: 'post',
		data: params,
	});

// 编辑产品配方
export const updateProduceFormula = (params ?: any) =>
	request({
		url: Api.UpdateProduceFormula,
		method: 'post',
		data: params,
	});

// 分页查询产品配方
export const pageProduceFormula = (params ?: any) =>
	request({
		url: Api.PageProduceFormula,
		method: 'post',
		data: params,
	});
// 分页查询工艺标准
export const pageProcessStandard = (params ?: any) =>
	request({
		url: Api.PageProcessStandard,
		method: 'post',
		data: params,
	});
// 删除工艺标准
export const deleteProcessStandard = (params ?: any) =>
	request({
		url: Api.DeleteProcessStandard,
		method: 'post',
		data: params,
	});

// 分页查询检验标准
export const pageExamineStandard = (params ?: any) =>
	request({
		url: Api.PageExamineStandard,
		method: 'post',
		data: params,
	});
//删除检验标准
export const deleteExamineStandard = (params ?: any) =>
	request({
		url: Api.DeleteExamineStandard,
		method: 'post',
		data: params,
	});
//删除配方物料
export const deleteproduceFormulaMaterial = (params ?: any) =>
	request({
		url: Api.DeleteproduceFormulaMaterial,
		method: 'post',
		data: params,
	});




// 分页查询物料列表
export const pagematerial = (params ?: any) =>
	request({
		url: Api.Pagematerial,
		method: 'post',
		data: params,
	});
// 分页查询物料配方列表
export const pageProduceFormulaMaterial = (params ?: any) =>
	request({
		url: Api.PageProduceFormulaMaterial,
		method: 'post',
		data: params,
	});



export const getProduceProduceIdDropdown = () =>
	request({
		url: Api.GetProduceProduceIdDropdown,
		method: 'get'
	});