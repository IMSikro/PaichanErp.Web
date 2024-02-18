import request from '/@/utils/request';
enum Api {
  AddDevice = '/api/device/add',
  DeleteDevice = '/api/device/delete',
  UpdateDevice = '/api/device/update',
  PageDevice = '/api/device/page',
  GetDeviceTypeDeviceTypeIdDropdown = '/api/device/DeviceTypeDeviceTypeIdDropdown',
}

// 增加设备列表
export const addDevice = (params?: any) =>
	request({
		url: Api.AddDevice,
		method: 'post',
		data: params,
	});

// 删除设备列表
export const deleteDevice = (params?: any) => 
	request({
			url: Api.DeleteDevice,
			method: 'post',
			data: params,
		});

// 编辑设备列表
export const updateDevice = (params?: any) => 
	request({
			url: Api.UpdateDevice,
			method: 'post',
			data: params,
		});

// 分页查询设备列表
export const pageDevice = (params?: any) => 
	request({
			url: Api.PageDevice,
			method: 'post',
			data: params,
		});

export const getDeviceTypeDeviceTypeIdDropdown = () =>
		request({
		url: Api.GetDeviceTypeDeviceTypeIdDropdown,
		method: 'get'
		});

