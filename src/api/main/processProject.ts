import request from '/@/utils/request';
enum Api {
  AddProcessProject = '/api/processProject/add',
  DeleteProcessProject = '/api/processProject/delete',
  UpdateProcessProject = '/api/processProject/update',
  PageProcessProject = '/api/processProject/page',
}

// 增加工艺标准项
export const addProcessProject = (params?: any) =>
	request({
		url: Api.AddProcessProject,
		method: 'post',
		data: params,
	});

// 删除工艺标准项
export const deleteProcessProject = (params?: any) => 
	request({
			url: Api.DeleteProcessProject,
			method: 'post',
			data: params,
		});

// 编辑工艺标准项
export const updateProcessProject = (params?: any) => 
	request({
			url: Api.UpdateProcessProject,
			method: 'post',
			data: params,
		});

// 分页查询工艺标准项
export const pageProcessProject = (params?: any) => 
	request({
			url: Api.PageProcessProject,
			method: 'post',
			data: params,
		});


