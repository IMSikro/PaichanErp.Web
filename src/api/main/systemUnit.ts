import request from '/@/utils/request';
enum Api {
  AddSystemUnit = '/api/systemUnit/add',
  DeleteSystemUnit = '/api/systemUnit/delete',
  UpdateSystemUnit = '/api/systemUnit/update',
  PageSystemUnit = '/api/systemUnit/page',
}

// 增加计量单位
export const addSystemUnit = (params?: any) =>
	request({
		url: Api.AddSystemUnit,
		method: 'post',
		data: params,
	});

// 删除计量单位
export const deleteSystemUnit = (params?: any) => 
	request({
			url: Api.DeleteSystemUnit,
			method: 'post',
			data: params,
		});

// 编辑计量单位
export const updateSystemUnit = (params?: any) => 
	request({
			url: Api.UpdateSystemUnit,
			method: 'post',
			data: params,
		});

// 分页查询计量单位
export const pageSystemUnit = (params?: any) => 
	request({
			url: Api.PageSystemUnit,
			method: 'post',
			data: params,
		});


