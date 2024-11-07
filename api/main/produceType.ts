import request from '/@/utils/request';
enum Api {
  AddProduceType = '/api/produceType/add',
  DeleteProduceType = '/api/produceType/delete',
  UpdateProduceType = '/api/produceType/update',
  PageProduceType = '/api/produceType/page',
}

// 增加产品类型
export const addProduceType = (params?: any) =>
	request({
		url: Api.AddProduceType,
		method: 'post',
		data: params,
	});

// 删除产品类型
export const deleteProduceType = (params?: any) => 
	request({
			url: Api.DeleteProduceType,
			method: 'post',
			data: params,
		});

// 编辑产品类型
export const updateProduceType = (params?: any) => 
	request({
			url: Api.UpdateProduceType,
			method: 'post',
			data: params,
		});

// 分页查询产品类型
export const pageProduceType = (params?: any) => 
	request({
			url: Api.PageProduceType,
			method: 'post',
			data: params,
		});


