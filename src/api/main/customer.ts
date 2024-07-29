import request from '/@/utils/request';
enum Api {
  AddCustomer = '/api/customer/add',
  DeleteCustomer = '/api/customer/delete',
  UpdateCustomer = '/api/customer/update',
  PageCustomer = '/api/customer/page',
}

// 增加客户
export const addCustomer = (params?: any) =>
	request({
		url: Api.AddCustomer,
		method: 'post',
		data: params,
	});

// 删除客户
export const deleteCustomer = (params?: any) => 
	request({
			url: Api.DeleteCustomer,
			method: 'post',
			data: params,
		});

// 编辑客户
export const updateCustomer = (params?: any) => 
	request({
			url: Api.UpdateCustomer,
			method: 'post',
			data: params,
		});

// 分页查询客户
export const pageCustomer = (params?: any) => 
	request({
			url: Api.PageCustomer,
			method: 'post',
			data: params,
		});


