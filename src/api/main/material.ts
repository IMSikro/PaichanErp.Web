﻿import request from '/@/utils/request';
enum Api {
  AddMaterial = '/api/material/add',
  DeleteMaterial = '/api/material/delete',
  UpdateMaterial = '/api/material/update',
  PageMaterial = '/api/material/page',
  GetMaterialTypeMaterialTypeIdDropdown = '/api/material/MaterialTypeMaterialTypeIdDropdown',
  GetSupplierSupplierIdDropdown = '/api/material/SupplierSupplierIdDropdown',
}

// 增加物料
export const addMaterial = (params?: any) =>
	request({
		url: Api.AddMaterial,
		method: 'post',
		data: params,
	});

// 删除物料
export const deleteMaterial = (params?: any) => 
	request({
			url: Api.DeleteMaterial,
			method: 'post',
			data: params,
		});

// 编辑物料
export const updateMaterial = (params?: any) => 
	request({
			url: Api.UpdateMaterial,
			method: 'post',
			data: params,
		});

// 分页查询物料
export const pageMaterial = (params?: any) => 
	request({
			url: Api.PageMaterial,
			method: 'post',
			data: params,
		});

export const getMaterialTypeMaterialTypeIdDropdown = () =>
		request({
		url: Api.GetMaterialTypeMaterialTypeIdDropdown,
		method: 'get'
		});
export const getSupplierSupplierIdDropdown = () =>
		request({
		url: Api.GetSupplierSupplierIdDropdown,
		method: 'get'
		});
