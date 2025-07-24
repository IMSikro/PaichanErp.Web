import request from '/@/utils/request';
enum Api {
  AddMaterialStoreDetails = '/api/materialStoreDetails/add',
  DeleteMaterialStoreDetails = '/api/materialStoreDetails/delete',
  UpdateMaterialStoreDetails = '/api/materialStoreDetails/update',
  PageMaterialStoreDetails = '/api/materialStoreDetails/page',
  GetMaterialMaterialIdDropdown = '/api/materialStoreDetails/MaterialMaterialIdDropdown',
  GetSupplierSupplierIdDropdown = '/api/materialStoreDetails/SupplierSupplierIdDropdown',
  GetStoreStoreIdDropdown = '/api/materialStoreDetails/StoreStoreIdDropdown',
  GetStoreLocationStoreLocationDropdown = '/api/materialStoreDetails/StoreLocationStoreLocationDropdown',
}

// 增加物料入库详情
export const addMaterialStoreDetails = (params?: any) =>
	request({
		url: Api.AddMaterialStoreDetails,
		method: 'post',
		data: params,
	});

// 删除物料入库详情
export const deleteMaterialStoreDetails = (params?: any) => 
	request({
			url: Api.DeleteMaterialStoreDetails,
			method: 'post',
			data: params,
		});

// 编辑物料入库详情
export const updateMaterialStoreDetails = (params?: any) => 
	request({
			url: Api.UpdateMaterialStoreDetails,
			method: 'post',
			data: params,
		});

// 分页查询物料入库详情
export const pageMaterialStoreDetails = (params?: any) => 
	request({
			url: Api.PageMaterialStoreDetails,
			method: 'post',
			data: params,
		});

export const getMaterialMaterialIdDropdown = () =>
		request({
		url: Api.GetMaterialMaterialIdDropdown,
		method: 'get'
		});
export const getSupplierSupplierIdDropdown = () =>
		request({
		url: Api.GetSupplierSupplierIdDropdown,
		method: 'get'
		});
export const getStoreStoreIdDropdown = () =>
		request({
		url: Api.GetStoreStoreIdDropdown,
		method: 'get'
		});
export const getStoreLocationStoreLocationDropdown = () =>
		request({
		url: Api.GetStoreLocationStoreLocationDropdown,
		method: 'get'
		});

