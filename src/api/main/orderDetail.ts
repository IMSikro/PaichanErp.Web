import request from '/@/utils/request';
enum Api {
	AddOrderDetail = '/api/orderDetail/add',
	DeleteOrderDetail = '/api/orderDetail/delete',
	doneAndNext = '/api/orderDetail/doneAndNext',
	updateDone = '/api/orderDetail/done',
	UpdateOrderDetail = '/api/orderDetail/update',
	PageOrderDetail = '/api/orderDetail/page',
	GetOrderDetail = '/api/orderDetail/detail',
	listOrderDetailByDeviceId = '/api/orderDetail/listOrderDetailByDeviceId',
	GetOrderOrderIdDropdown = '/api/orderDetail/OrderOrderIdDropdown',
	GetDeviceDeviceIdDropdown = '/api/orderDetail/DeviceDeviceIdDropdown',
	GetSysUserOperatorUsersDropdown = '/api/orderDetail/SysUserOperatorUsersDropdown',
	listNotPaichanOrderByDeviceId = '/api/order/listNotPaichanOrderByDeviceId',
	setOrderDetailSort = '/api/orderDetail/setOrderDetailSort',
	deviceErrorTypeDropdown = '/api/orderDetail/deviceErrorTypeDropdown',
	tableColumnPage = '/api/tableColumn/page',
	tableColumnReset = '/api/tableColumn/reset',
	tableColumnUpdateList = '/api/tableColumn/updateList',
}

// 更新列表展示 - 表格列
export const tableColumnUpdateList = (params?: any) =>
	request({
		url: Api.tableColumnUpdateList,
		method: 'post',
		data: params,
	});

// 重置列表展示 - 表格列
export const tableColumnReset = (params?: any) =>
	request({
		url: Api.tableColumnReset,
		method: 'post',
		data: params,
	});

// 查询列表展示 - 表格列
export const tableColumnPage = (params?: any) =>
	request({
		url: Api.tableColumnPage,
		method: 'post',
		data: params,
	});

// 增加订单排产
export const addOrderDetail = (params?: any) =>
	request({
		url: Api.AddOrderDetail,
		method: 'post',
		data: params,
	});

// 小计完工
export const doneAndNext = (params?: any) =>
	request({
		url: Api.doneAndNext,
		method: 'post',
		data: params,
	});

// 终结完工
export const updateDone = (params?: any) =>
	request({
		url: Api.updateDone,
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

// 获取未排产订单
export const listNotPaichanOrderByDeviceId = (params?: any) =>
	request({
		url: Api.listNotPaichanOrderByDeviceId,
		method: 'post',
		data: params,
	});

// 排产排序
export const setOrderDetailSort = (params?: any) =>
	request({
		url: Api.setOrderDetailSort,
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
		method: 'get',
	});
export const getDeviceDeviceIdDropdown = () =>
	request({
		url: Api.GetDeviceDeviceIdDropdown,
		method: 'get',
	});
export const getSysUserOperatorUsersDropdown = () =>
	request({
		url: Api.GetSysUserOperatorUsersDropdown,
		method: 'get',
	});
// 获取设备未生产类型列表
export const deviceErrorTypeDropdown = () =>
	request({
		url: Api.deviceErrorTypeDropdown,
		method: 'get',
	});
