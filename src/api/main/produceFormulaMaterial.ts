import request from '/@/utils/request';
enum Api {
  AddProduceFormulaMaterial = '/api/produceFormulaMaterial/add',
  DeleteProduceFormulaMaterial = '/api/produceFormulaMaterial/delete',
  UpdateProduceFormulaMaterial = '/api/produceFormulaMaterial/update',
  PageProduceFormulaMaterial = '/api/produceFormulaMaterial/page',
  GetProduceFormulaProduceFormulaIdDropdown = '/api/produceFormulaMaterial/ProduceFormulaProduceFormulaIdDropdown',
  GetMaterialMaterialIdDropdown = '/api/produceFormulaMaterial/MaterialMaterialIdDropdown',
}

// 增加配方物料
export const addProduceFormulaMaterial = (params?: any) =>
	request({
		url: Api.AddProduceFormulaMaterial,
		method: 'post',
		data: params,
	});

// 删除配方物料
export const deleteProduceFormulaMaterial = (params?: any) => 
	request({
			url: Api.DeleteProduceFormulaMaterial,
			method: 'post',
			data: params,
		});

// 编辑配方物料
export const updateProduceFormulaMaterial = (params?: any) => 
	request({
			url: Api.UpdateProduceFormulaMaterial,
			method: 'post',
			data: params,
		});

// 分页查询配方物料
export const pageProduceFormulaMaterial = (params?: any) => 
	request({
			url: Api.PageProduceFormulaMaterial,
			method: 'post',
			data: params,
		});

export const getProduceFormulaProduceFormulaIdDropdown = () =>
		request({
		url: Api.GetProduceFormulaProduceFormulaIdDropdown,
		method: 'get'
		});
export const getMaterialMaterialIdDropdown = () =>
		request({
		url: Api.GetMaterialMaterialIdDropdown,
		method: 'get'
		});

