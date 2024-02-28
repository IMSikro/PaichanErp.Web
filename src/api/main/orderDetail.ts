import request from '/@/utils/request';
enum Api {
	AddOrderDetail = '/api/orderDetail/add',
	DeleteOrderDetail = '/api/orderDetail/delete',
	UpdateOrderDetail = '/api/orderDetail/update',
	PageOrderDetail = '/api/orderDetail/page',
	GetOrderDetail = '/api/orderDetail/detail',
	listOrderDetailByDeviceId = '/api/orderDetail/listOrderDetailByDeviceId',
	GetOrderOrderIdDropdown = '/api/orderDetail/OrderOrderIdDropdown',
	GetDeviceDeviceIdDropdown = '/api/orderDetail/DeviceDeviceIdDropdown',
	GetSysUserOperatorUsersDropdown = '/api/orderDetail/SysUserOperatorUsersDropdown',
}

// 增加订单排产
export const addOrderDetail = (params?: any) =>
	request({
		url: Api.AddOrderDetail,
		method: 'post',
		data: params,
	});

// 删除订单排产
export const deleteOrderDetail = (params?: any) =>
	request({
		url: Api.DeleteOrderDetail,
		method: 'post',
		data: params,
	});

// 编辑订单排产
export const updateOrderDetail = (params?: any) =>
	request({
		url: Api.UpdateOrderDetail,
		method: 'post',
		data: params,
	});

// 分页查询订单排产
export const pageOrderDetail = (params?: any) =>
	request({
		url: Api.PageOrderDetail,
		method: 'post',
		data: params,
	});

// 查询设备所有排产
export const listOrderDetailByDeviceId = (params?: any) =>
	request({
		url: Api.listOrderDetailByDeviceId,
		method: 'post',
		data: params,
	});

// 分页查询订单排产
export const getOrderDetail = (params?: any) =>
	request({
		url: Api.GetOrderDetail,
		method: 'get',
		data: params,
	});


export const getOrderOrderIdDropdown = () =>
	request({
		url: Api.GetOrderOrderIdDropdown,
		method: 'get'
	});
export const getDeviceDeviceIdDropdown = () =>
	request({
		url: Api.GetDeviceDeviceIdDropdown,
		method: 'get'
	});
export const getSysUserOperatorUsersDropdown = () =>
	request({
		url: Api.GetSysUserOperatorUsersDropdown,
		method: 'get'
	});

