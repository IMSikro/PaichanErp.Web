import request from '/@/utils/request';
enum Api {
  AddDeviceType = '/api/deviceType/add',
  DeleteDeviceType = '/api/deviceType/delete',
  UpdateDeviceType = '/api/deviceType/update',
  PageDeviceType = '/api/deviceType/page',
}

// 增加设备类型
export const addDeviceType = (params?: any) =>
	request({
		url: Api.AddDeviceType,
		method: 'post',
		data: params,
	});

// 删除设备类型
export const deleteDeviceType = (params?: any) => 
	request({
			url: Api.DeleteDeviceType,
			method: 'post',
			data: params,
		});

// 编辑设备类型
export const updateDeviceType = (params?: any) => 
	request({
			url: Api.UpdateDeviceType,
			method: 'post',
			data: params,
		});

// 分页查询设备类型
export const pageDeviceType = (params?: any) => 
	request({
			url: Api.PageDeviceType,
			method: 'post',
			data: params,
		});


