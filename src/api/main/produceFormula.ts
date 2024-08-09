import request from '/@/utils/request';
enum Api {
  AddProduceFormula = '/api/produceFormula/add',
  DeleteProduceFormula = '/api/produceFormula/delete',
  UpdateProduceFormula = '/api/produceFormula/update',
  PageProduceFormula = '/api/produceFormula/page',
  GetProduceProduceIdDropdown = '/api/produceFormula/ProduceProduceIdDropdown',
}

// 增加产品配方
export const addProduceFormula = (params?: any) =>
	request({
		url: Api.AddProduceFormula,
		method: 'post',
		data: params,
	});

// 删除产品配方
export const deleteProduceFormula = (params?: any) => 
	request({
			url: Api.DeleteProduceFormula,
			method: 'post',
			data: params,
		});

// 编辑产品配方
export const updateProduceFormula = (params?: any) => 
	request({
			url: Api.UpdateProduceFormula,
			method: 'post',
			data: params,
		});

// 分页查询产品配方
export const pageProduceFormula = (params?: any) => 
	request({
			url: Api.PageProduceFormula,
			method: 'post',
			data: params,
		});

export const getProduceProduceIdDropdown = () =>
		request({
		url: Api.GetProduceProduceIdDropdown,
		method: 'get'
		});

