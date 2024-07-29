import request from '/@/utils/request';
enum Api {
  AddProduceStoreRecords = '/api/produceStoreRecords/add',
  DeleteProduceStoreRecords = '/api/produceStoreRecords/delete',
  UpdateProduceStoreRecords = '/api/produceStoreRecords/update',
  PageProduceStoreRecords = '/api/produceStoreRecords/page',
  GetOrderOrderIdDropdown = '/api/produceStoreRecords/OrderOrderIdDropdown',
  GetOrderProduceIdDropdown = '/api/produceStoreRecords/OrderProduceIdDropdown',
}

// 增加生产入库单
export const addProduceStoreRecords = (params?: any) =>
	request({
		url: Api.AddProduceStoreRecords,
		method: 'post',
		data: params,
	});

// 删除生产入库单
export const deleteProduceStoreRecords = (params?: any) => 
	request({
			url: Api.DeleteProduceStoreRecords,
			method: 'post',
			data: params,
		});

// 编辑生产入库单
export const updateProduceStoreRecords = (params?: any) => 
	request({
			url: Api.UpdateProduceStoreRecords,
			method: 'post',
			data: params,
		});

// 分页查询生产入库单
export const pageProduceStoreRecords = (params?: any) => 
	request({
			url: Api.PageProduceStoreRecords,
			method: 'post',
			data: params,
		});

export const getOrderOrderIdDropdown = () =>
		request({
		url: Api.GetOrderOrderIdDropdown,
		method: 'get'
		});
export const getOrderProduceIdDropdown = () =>
		request({
		url: Api.GetOrderProduceIdDropdown,
		method: 'get'
		});

