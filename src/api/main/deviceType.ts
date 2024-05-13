import request from '/@/utils/request';
enum Api {
	AddDeviceType = '/api/deviceType/add',
	DeleteDeviceType = '/api/deviceType/delete',
	UpdateDeviceType = '/api/deviceType/update',
	PageDeviceType = '/api/deviceType/page',
	ListDeviceTypeAndChild = '/api/deviceType/listDeviceTypeAndChild',
}

// 增加工艺设备
export const addDeviceType = (params?: any) =>
	request({
		url: Api.AddDeviceType,
		method: 'post',
		data: params,
	});

// 删除工艺设备
export const deleteDeviceType = (params?: any) =>
	request({
		url: Api.DeleteDeviceType,
		method: 'post',
		data: params,
	});

// 编辑工艺设备
export const updateDeviceType = (params?: any) =>
	request({
		url: Api.UpdateDeviceType,
		method: 'post',
		data: params,
	});

// 分页查询工艺设备
export const pageDeviceType = (params?: any) =>
	request({
		url: Api.PageDeviceType,
		method: 'post',
		data: params,
	});

// 分页查询工艺设备
export const listDeviceTypeAndChild = (params?: any) =>
	request({
		url: Api.ListDeviceTypeAndChild,
		method: 'get',
		params,
	});


