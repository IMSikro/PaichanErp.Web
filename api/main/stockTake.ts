import request from '/@/utils/request';
enum Api {
  AddStockTake = '/api/stockTake/add',
  DeleteStockTake = '/api/stockTake/delete',
  UpdateStockTake = '/api/stockTake/update',
  PageStockTake = '/api/stockTake/page',
  GetProduceProduceIdDropdown = '/api/stockTake/ProduceProduceIdDropdown',
  GetStoreStoreIdDropdown = '/api/stockTake/StoreStoreIdDropdown',
}

// 增加库存盘点
export const addStockTake = (params?: any) =>
	request({
		url: Api.AddStockTake,
		method: 'post',
		data: params,
	});

// 删除库存盘点
export const deleteStockTake = (params?: any) => 
	request({
			url: Api.DeleteStockTake,
			method: 'post',
			data: params,
		});

// 编辑库存盘点
export const updateStockTake = (params?: any) => 
	request({
			url: Api.UpdateStockTake,
			method: 'post',
			data: params,
		});

// 分页查询库存盘点
export const pageStockTake = (params?: any) => 
	request({
			url: Api.PageStockTake,
			method: 'post',
			data: params,
		});

export const getProduceProduceIdDropdown = () =>
		request({
		url: Api.GetProduceProduceIdDropdown,
		method: 'get'
		});
export const getStoreStoreIdDropdown = () =>
		request({
		url: Api.GetStoreStoreIdDropdown,
		method: 'get'
		});

