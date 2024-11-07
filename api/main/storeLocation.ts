import request from '/@/utils/request';
enum Api {
	AddStoreLocation = '/api/storeLocation/add',
	DeleteStoreLocation = '/api/storeLocation/delete',
	UpdateStoreLocation = '/api/storeLocation/update',
	PageStoreLocation = '/api/storeLocation/page',
	GetStoreLocationTempExcel = '/api/storeLocation/getStoreLocationTempExcel',
	ImportStoreLocationExcel = '/api/storeLocation/importStoreLocationExcel',
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

export const getStoreLocationTempExcel = () =>
	request({
		url: Api.GetStoreLocationTempExcel,
		method: 'get',
		responseType: 'blob',
	});

export const importStoreLocationExcel = (params: any, storeId: number) =>
	request({
		url: Api.ImportStoreLocationExcel + `/${storeId}`,
		method: 'post',
		data: params,
		headers: {
			"Content-Type": 'multipart/form-data'
		},
	});
