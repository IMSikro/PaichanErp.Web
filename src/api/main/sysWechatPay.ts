import request from '/@/utils/request';
enum Api {
	AddSysWechatPay = '/api/sysWechatPay/add',
	DeleteSysWechatPay = '/api/sysWechatPay/delete',
	UpdateSysWechatPay = '/api/sysWechatPay/update',
	PageSysWechatPay = '/api/sysWechatPay/PayInfoList',
}

// 增加充值中心
export const addSysWechatPay = (params?: any) =>
	request({
		url: Api.AddSysWechatPay,
		method: 'post',
		data: params,
	});

// 删除充值中心
export const deleteSysWechatPay = (params?: any) =>
	request({
		url: Api.DeleteSysWechatPay,
		method: 'post',
		data: params,
	});

// 编辑充值中心
export const updateSysWechatPay = (params?: any) =>
	request({
		url: Api.UpdateSysWechatPay,
		method: 'post',
		data: params,
	});

// 分页查询充值中心
export const pageSysWechatPay = (params?: any) =>
	request({
		url: Api.PageSysWechatPay,
		method: 'post',
		data: params,
	});


