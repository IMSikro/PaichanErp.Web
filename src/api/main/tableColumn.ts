import request from '/@/utils/request';
enum Api {
	AddTableColumn = '/api/tableColumn/add',
	DeleteTableColumn = '/api/tableColumn/delete',
	UpdateTableColumn = '/api/tableColumn/update',
	PageTableColumn = '/api/tableColumn/page',
	tableColumnReset = '/api/tableColumn/reset',
	tableColumnUpdateList = '/api/tableColumn/updateList',
}

// 增加显示列
export const addTableColumn = (params?: any) =>
	request({
		url: Api.AddTableColumn,
		method: 'post',
		data: params,
	});

// 删除显示列
export const deleteTableColumn = (params?: any) =>
	request({
		url: Api.DeleteTableColumn,
		method: 'post',
		data: params,
	});

// 编辑显示列
export const updateTableColumn = (params?: any) =>
	request({
		url: Api.UpdateTableColumn,
		method: 'post',
		data: params,
	});

// 分页查询显示列
export const pageTableColumn = (params?: any) =>
	request({
		url: Api.PageTableColumn,
		method: 'post',
		data: params,
	});

// 分页查询显示列
export const resetTableColumn = (params?: any) =>
	request({
		url: Api.tableColumnReset,
		method: 'post',
	});

// 分页查询显示列
export const updateListTableColumn = (params?: any) =>
	request({
		url: Api.tableColumnUpdateList,
		method: 'post',
		data: params,
	});


