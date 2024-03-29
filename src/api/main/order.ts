import request from '/@/utils/request';
enum Api {
	AddOrder = '/api/order/add',
	DeleteOrder = '/api/order/delete',
	UpdateOrder = '/api/order/update',
	PageOrder = '/api/order/page',
	GetProduceProduceIdDropdown = '/api/order/ProduceProduceIdDropdown',
	GetProduce = '/api/order/detail',
	GetOrderTempExcel = '/api/order/getOrderTempExcel',
	ImportOrderExcel = '/api/order/importOrderExcel',
}

// 增加订单列表
export const addOrder = (params?: any) =>
	request({
		url: Api.AddOrder,
		method: 'post',
		data: params,
	});

// 删除订单列表
export const deleteOrder = (params?: any) =>
	request({
		url: Api.DeleteOrder,
		method: 'post',
		data: params,
	});

// 编辑订单列表
export const updateOrder = (params?: any) =>
	request({
		url: Api.UpdateOrder,
		method: 'post',
		data: params,
	});

// 分页查询订单列表
export const pageOrder = (params?: any) =>
	request({
		url: Api.PageOrder,
		method: 'post',
		data: params,
	});
export const getProduce = (params?: any) =>
	request({
		url: Api.GetProduce,
		method: 'get',
		params
	});

export const getProduceProduceIdDropdown = () =>
	request({
		url: Api.GetProduceProduceIdDropdown,
		method: 'get'
	});


export const getOrderTempExcel = () =>
	request({
		url: Api.GetOrderTempExcel,
		method: 'get',
		responseType: 'blob',
	});

export const importOrderExcel = (params?: any) =>
	request({
		url: Api.ImportOrderExcel,
		method: 'post',
		data: params,
		headers: {
			"Content-Type": 'multipart/form-data'
		},
	});