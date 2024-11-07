import request from '/@/utils/request';
enum Api {
  AddExamineStandard = '/api/examineStandard/add',
  DeleteExamineStandard = '/api/examineStandard/delete',
  UpdateExamineStandard = '/api/examineStandard/update',
  PageExamineStandard = '/api/examineStandard/page',
  GetProduceProduceIdDropdown = '/api/examineStandard/ProduceProduceIdDropdown',
  GetDeviceTypeDeviceTypeIdDropdown = '/api/examineStandard/DeviceTypeDeviceTypeIdDropdown',
  GetExamineProjectExamineProjectIdDropdown = '/api/examineStandard/ExamineProjectExamineProjectIdDropdown',
}

// 增加检验标准
export const addExamineStandard = (params?: any) =>
	request({
		url: Api.AddExamineStandard,
		method: 'post',
		data: params,
	});

// 删除检验标准
export const deleteExamineStandard = (params?: any) => 
	request({
			url: Api.DeleteExamineStandard,
			method: 'post',
			data: params,
		});

// 编辑检验标准
export const updateExamineStandard = (params?: any) => 
	request({
			url: Api.UpdateExamineStandard,
			method: 'post',
			data: params,
		});

// 分页查询检验标准
export const pageExamineStandard = (params?: any) => 
	request({
			url: Api.PageExamineStandard,
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
export const getExamineProjectExamineProjectIdDropdown = () =>
		request({
		url: Api.GetExamineProjectExamineProjectIdDropdown,
		method: 'get'
		});

