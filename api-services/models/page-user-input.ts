/* tslint:disable */
/* eslint-disable */
/**
 * Admin.NET
 * 让 .NET 开发更简单、更通用、更流行。前后端分离架构(.NET6/Vue3)，开箱即用紧随前沿技术。<br/><a href='https://gitee.com/zuohuaijun/Admin.NET/'>https://gitee.com/zuohuaijun/Admin.NET</a>
 *
 * OpenAPI spec version: 1.0.0
 * Contact: 515096995@qq.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/**
 * 
 * @export
 * @interface PageUserInput
 */
export interface PageUserInput {
    /**
     * 当前页码
     * @type {number}
     * @memberof PageUserInput
     */
    page?: number;
    /**
     * 页码容量
     * @type {number}
     * @memberof PageUserInput
     */
    pageSize?: number;
    /**
     * 排序字段
     * @type {string}
     * @memberof PageUserInput
     */
    field?: string | null;
    /**
     * 排序方向
     * @type {string}
     * @memberof PageUserInput
     */
    order?: string | null;
    /**
     * 降序排序
     * @type {string}
     * @memberof PageUserInput
     */
    descStr?: string | null;
    /**
     * 账号
     * @type {string}
     * @memberof PageUserInput
     */
    account?: string | null;
    /**
     * 姓名
     * @type {string}
     * @memberof PageUserInput
     */
    realName?: string | null;
    /**
     * 手机号
     * @type {string}
     * @memberof PageUserInput
     */
    phone?: string | null;
    /**
     * 查询时所选机构Id
     * @type {number}
     * @memberof PageUserInput
     */
    orgId?: number;
}
