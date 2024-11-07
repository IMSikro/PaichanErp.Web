import request from '/@/utils/request';
enum Api {
  AddStoreDeploy = '/api/storeDeploy/add',
  DeleteStoreDeploy = '/api/storeDeploy/delete',
  UpdateStoreDeploy = '/api/storeDeploy/update',
  PageStoreDeploy = '/api/storeDeploy/page',
  GetProduceProduceIdDropdown = '/api/storeDeploy/ProduceProduceIdDropdown',
  GetStoreOutStoreIdDropdown = '/api/storeDeploy/StoreOutStoreIdDropdown',
  GetStoreInStoreIdDropdown = '/api/storeDeploy/StoreInStoreIdDropdown',
}

// 增加库存调拨
export const addStoreDeploy = (params?: any) =>
	request({
		url: Api.AddStoreDeploy,
		method: 'post',
		data: params,
	});

// 删除库存调拨
export const deleteStoreDeploy = (params?: any) => 
	request({
			url: Api.DeleteStoreDeploy,
			method: 'post',
			data: params,
		});

// 编辑库存调拨
export const updateStoreDeploy = (params?: any) => 
	request({
			url: Api.UpdateStoreDeploy,
			method: 'post',
			data: params,
		});

// 分页查询库存调拨
export const pageStoreDeploy = (params?: any) => 
	request({
			url: Api.PageStoreDeploy,
			method: 'post',
			data: params,
		});

export const getProduceProduceIdDropdown = () =>
		request({
		url: Api.GetProduceProduceIdDropdown,
		method: 'get'
		});
export const getStoreOutStoreIdDropdown = () =>
		request({
		url: Api.GetStoreOutStoreIdDropdown,
		method: 'get'
		});
export const getStoreInStoreIdDropdown = () =>
		request({
		url: Api.GetStoreInStoreIdDropdown,
		method: 'get'
		});

