import request from '/@/utils/request';
enum Api {
  AddMaterialType = '/api/materialType/add',
  DeleteMaterialType = '/api/materialType/delete',
  UpdateMaterialType = '/api/materialType/update',
  PageMaterialType = '/api/materialType/page',
}

// 增加物料类别
export const addMaterialType = (params?: any) =>
	request({
		url: Api.AddMaterialType,
		method: 'post',
		data: params,
	});

// 删除物料类别
export const deleteMaterialType = (params?: any) => 
	request({
			url: Api.DeleteMaterialType,
			method: 'post',
			data: params,
		});

// 编辑物料类别
export const updateMaterialType = (params?: any) => 
	request({
			url: Api.UpdateMaterialType,
			method: 'post',
			data: params,
		});

// 分页查询物料类别
export const pageMaterialType = (params?: any) => 
	request({
			url: Api.PageMaterialType,
			method: 'post',
			data: params,
		});


