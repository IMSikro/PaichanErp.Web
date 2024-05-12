import request from '/@/utils/request';
enum Api {
  AddDeviceErrorType = '/api/deviceErrorType/add',
  DeleteDeviceErrorType = '/api/deviceErrorType/delete',
  UpdateDeviceErrorType = '/api/deviceErrorType/update',
  PageDeviceErrorType = '/api/deviceErrorType/page',
}

// 增加非生产类型
export const addDeviceErrorType = (params?: any) =>
	request({
		url: Api.AddDeviceErrorType,
		method: 'post',
		data: params,
	});

// 删除非生产类型
export const deleteDeviceErrorType = (params?: any) => 
	request({
			url: Api.DeleteDeviceErrorType,
			method: 'post',
			data: params,
		});

// 编辑非生产类型
export const updateDeviceErrorType = (params?: any) => 
	request({
			url: Api.UpdateDeviceErrorType,
			method: 'post',
			data: params,
		});

// 分页查询非生产类型
export const pageDeviceErrorType = (params?: any) => 
	request({
			url: Api.PageDeviceErrorType,
			method: 'post',
			data: params,
		});


