import request from '/@/utils/request';
enum Api {
  AddProcessStandard = '/api/processStandard/add',
  DeleteProcessStandard = '/api/processStandard/delete',
  UpdateProcessStandard = '/api/processStandard/update',
  PageProcessStandard = '/api/processStandard/page',
  GetProduceProduceIdDropdown = '/api/processStandard/ProduceProduceIdDropdown',
  GetDeviceTypeDeviceTypeIdDropdown = '/api/processStandard/DeviceTypeDeviceTypeIdDropdown',
  GetProcessProjectProcessProjectIdDropdown = '/api/processStandard/ProcessProjectProcessProjectIdDropdown',
}

// 增加工艺标准
export const addProcessStandard = (params?: any) =>
	request({
		url: Api.AddProcessStandard,
		method: 'post',
		data: params,
	});

// 删除工艺标准
export const deleteProcessStandard = (params?: any) => 
	request({
			url: Api.DeleteProcessStandard,
			method: 'post',
			data: params,
		});

// 编辑工艺标准
export const updateProcessStandard = (params?: any) => 
	request({
			url: Api.UpdateProcessStandard,
			method: 'post',
			data: params,
		});

// 分页查询工艺标准
export const pageProcessStandard = (params?: any) => 
	request({
			url: Api.PageProcessStandard,
			method: 'post',
			data: params,
		});

export const getProduceProduceIdDropdown = () =>
		request({
		url: Api.GetProduceProduceIdDropdown,
		method: 'get'
		});
export const getDeviceTypeDeviceTypeIdDropdown = () =>
		request({
		url: Api.GetDeviceTypeDeviceTypeIdDropdown,
		method: 'get'
		});
export const getProcessProjectProcessProjectIdDropdown = () =>
		request({
		url: Api.GetProcessProjectProcessProjectIdDropdown,
		method: 'get'
		});

