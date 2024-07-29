import request from '/@/utils/request';
enum Api {
  AddStoreLocation = '/api/storeLocation/add',
  DeleteStoreLocation = '/api/storeLocation/delete',
  UpdateStoreLocation = '/api/storeLocation/update',
  PageStoreLocation = '/api/storeLocation/page',
}

// 增加库位管理
export const addStoreLocation = (params?: any) =>
	request({
		url: Api.AddStoreLocation,
		method: 'post',
		data: params,
	});

// 删除库位管理
export const deleteStoreLocation = (params?: any) => 
	request({
			url: Api.DeleteStoreLocation,
			method: 'post',
			data: params,
		});

// 编辑库位管理
export const updateStoreLocation = (params?: any) => 
	request({
			url: Api.UpdateStoreLocation,
			method: 'post',
			data: params,
		});

// 分页查询库位管理
export const pageStoreLocation = (params?: any) => 
	request({
			url: Api.PageStoreLocation,
			method: 'post',
			data: params,
		});


