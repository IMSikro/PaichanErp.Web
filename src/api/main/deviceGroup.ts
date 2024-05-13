import request from '/@/utils/request';
enum Api {
	AddDeviceGroup = '/api/deviceGroup/add',
	DeleteDeviceGroup = '/api/deviceGroup/delete',
	UpdateDeviceGroup = '/api/deviceGroup/update',
	PageDeviceGroup = '/api/deviceGroup/page',
}

// 增加设备分组
export const addDeviceGroup = (params?: any) =>
	request({
		url: Api.AddDeviceGroup,
		method: 'post',
		data: params,
	});

// 删除设备分组
export const deleteDeviceGroup = (params?: any) =>
	request({
		url: Api.DeleteDeviceGroup,
		method: 'post',
		data: params,
	});

// 编辑设备分组
export const updateDeviceGroup = (params?: any) =>
	request({
		url: Api.UpdateDeviceGroup,
		method: 'post',
		data: params,
	});

// 分页查询设备分组
export const pageDeviceGroup = (params?: any) =>
	request({
		url: Api.PageDeviceGroup,
		method: 'post',
		data: params,
	});

