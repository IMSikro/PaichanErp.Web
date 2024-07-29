import request from '/@/utils/request';
enum Api {
  AddSupplier = '/api/supplier/add',
  DeleteSupplier = '/api/supplier/delete',
  UpdateSupplier = '/api/supplier/update',
  PageSupplier = '/api/supplier/page',
}

// 增加供应商
export const addSupplier = (params?: any) =>
	request({
		url: Api.AddSupplier,
		method: 'post',
		data: params,
	});

// 删除供应商
export const deleteSupplier = (params?: any) => 
	request({
			url: Api.DeleteSupplier,
			method: 'post',
			data: params,
		});

// 编辑供应商
export const updateSupplier = (params?: any) => 
	request({
			url: Api.UpdateSupplier,
			method: 'post',
			data: params,
		});

// 分页查询供应商
export const pageSupplier = (params?: any) => 
	request({
			url: Api.PageSupplier,
			method: 'post',
			data: params,
		});


