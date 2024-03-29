import request from '/@/utils/request';
enum Api {
	AddProduce = '/api/produce/add',
	DeleteProduce = '/api/produce/delete',
	UpdateProduce = '/api/produce/update',
	PageProduce = '/api/produce/page',
	GetProduceTypeProduceTypeDropdown = '/api/produce/ProduceTypeProduceTypeDropdown',
	GetProduceTempExcel = '/api/produce/getProduceTempExcel',
	ImportProduceExcel = '/api/produce/importProduceExcel',
}

// 增加产品列表
export const addProduce = (params?: any) =>
	request({
		url: Api.AddProduce,
		method: 'post',
		data: params,
	});

// 删除产品列表
export const deleteProduce = (params?: any) =>
	request({
		url: Api.DeleteProduce,
		method: 'post',
		data: params,
	});

// 编辑产品列表
export const updateProduce = (params?: any) =>
	request({
		url: Api.UpdateProduce,
		method: 'post',
		data: params,
	});

// 分页查询产品列表
export const pageProduce = (params?: any) =>
	request({
		url: Api.PageProduce,
		method: 'post',
		data: params,
	});

export const getProduceTypeProduceTypeDropdown = () =>
	request({
		url: Api.GetProduceTypeProduceTypeDropdown,
		method: 'get'
	});

export const getProduceTempExcel = () =>
	request({
		url: Api.GetProduceTempExcel,
		method: 'get',
		responseType: 'blob',
	});

export const importProduceExcel = (params?: any) =>
	request({
		url: Api.ImportProduceExcel,
		method: 'post',
		data: params,
		headers: {
			"Content-Type": 'multipart/form-data'
		},
	});
