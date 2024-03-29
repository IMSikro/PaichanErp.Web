import request from '/@/utils/request';
enum Api {
	GetUserTempExcel = '/api/sysUser/getUserTempExcel',
	ImportUserExcel = '/api/sysUser/importUserExcel',
}


export const getUserTempExcel = () =>
	request({
		url: Api.GetUserTempExcel,
		method: 'get',
		responseType: 'blob',
	});

export const importUserExcel = (params?: any) =>
	request({
		url: Api.ImportUserExcel,
		method: 'post',
		data: params,
		headers: {
			"Content-Type": 'multipart/form-data'
		},
	});
