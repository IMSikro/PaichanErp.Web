import request from '/@/utils/request';
enum Api {
  AddProduceProcess = '/api/produceProcess/add',
  DeleteProduceProcess = '/api/produceProcess/delete',
  UpdateProduceProcess = '/api/produceProcess/update',
  PageProduceProcess = '/api/produceProcess/page',
  GetProduceProduceIdDropdown = '/api/produceProcess/ProduceProduceIdDropdown',
}

// 增加产品工艺
export const addProduceProcess = (params?: any) =>
	request({
		url: Api.AddProduceProcess,
		method: 'post',
		data: params,
	});

// 删除产品工艺
export const deleteProduceProcess = (params?: any) => 
	request({
			url: Api.DeleteProduceProcess,
			method: 'post',
			data: params,
		});

// 编辑产品工艺
export const updateProduceProcess = (params?: any) => 
	request({
			url: Api.UpdateProduceProcess,
			method: 'post',
			data: params,
		});

// 分页查询产品工艺
export const pageProduceProcess = (params?: any) => 
	request({
			url: Api.PageProduceProcess,
			method: 'post',
			data: params,
		});

export const getProduceProduceIdDropdown = () =>
		request({
		url: Api.GetProduceProduceIdDropdown,
		method: 'get'
		});

