import request from '/@/utils/request';
enum Api {
  AddMaterialStoreRecords = '/api/materialStoreRecords/add',
  DeleteMaterialStoreRecords = '/api/materialStoreRecords/delete',
  UpdateMaterialStoreRecords = '/api/materialStoreRecords/update',
  PageMaterialStoreRecords = '/api/materialStoreRecords/page',
}

// 增加物料入库单
export const addMaterialStoreRecords = (params?: any) =>
	request({
		url: Api.AddMaterialStoreRecords,
		method: 'post',
		data: params,
	});

// 删除物料入库单
export const deleteMaterialStoreRecords = (params?: any) => 
	request({
			url: Api.DeleteMaterialStoreRecords,
			method: 'post',
			data: params,
		});

// 编辑物料入库单
export const updateMaterialStoreRecords = (params?: any) => 
	request({
			url: Api.UpdateMaterialStoreRecords,
			method: 'post',
			data: params,
		});

// 分页查询物料入库单
export const pageMaterialStoreRecords = (params?: any) => 
	request({
			url: Api.PageMaterialStoreRecords,
			method: 'post',
			data: params,
		});


