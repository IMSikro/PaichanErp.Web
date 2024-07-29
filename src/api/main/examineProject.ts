import request from '/@/utils/request';
enum Api {
  AddExamineProject = '/api/examineProject/add',
  DeleteExamineProject = '/api/examineProject/delete',
  UpdateExamineProject = '/api/examineProject/update',
  PageExamineProject = '/api/examineProject/page',
}

// 增加检验标准项
export const addExamineProject = (params?: any) =>
	request({
		url: Api.AddExamineProject,
		method: 'post',
		data: params,
	});

// 删除检验标准项
export const deleteExamineProject = (params?: any) => 
	request({
			url: Api.DeleteExamineProject,
			method: 'post',
			data: params,
		});

// 编辑检验标准项
export const updateExamineProject = (params?: any) => 
	request({
			url: Api.UpdateExamineProject,
			method: 'post',
			data: params,
		});

// 分页查询检验标准项
export const pageExamineProject = (params?: any) => 
	request({
			url: Api.PageExamineProject,
			method: 'post',
			data: params,
		});


