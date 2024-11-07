import request from '/@/utils/request';
enum Api {
  AddStore = '/api/store/add',
  DeleteStore = '/api/store/delete',
  UpdateStore = '/api/store/update',
  PageStore = '/api/store/page',
}

// 增加仓库
export const addStore = (params?: any) =>
	request({
		url: Api.AddStore,
		method: 'post',
		data: params,
	});

// 删除仓库
export const deleteStore = (params?: any) => 
	request({
			url: Api.DeleteStore,
			method: 'post',
			data: params,
		});

// 编辑仓库
export const updateStore = (params?: any) => 
	request({
			url: Api.UpdateStore,
			method: 'post',
			data: params,
		});

// 分页查询仓库
export const pageStore = (params?: any) => 
	request({
			url: Api.PageStore,
			method: 'post',
			data: params,
		});


