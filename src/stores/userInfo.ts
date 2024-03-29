import { defineStore } from 'pinia';
import { Local, Session } from '/@/utils/storage';
import Watermark from '/@/utils/watermark';
import { useThemeConfig } from '/@/stores/themeConfig';

import { getAPI } from '/@/utils/axios-utils';
import { SysAuthApi, SysConstApi, SysDictTypeApi } from '/@/api-services/api';
import { toNumber } from 'lodash-es';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		userInfos: {} as any,
		constList: [] as any,
		dictList: {} as any,
		dictListInt: {} as any,
	}),
	getters: {
		// // 获取系统常量列表
		// async getSysConstList(): Promise<any[]> {
		// 	var res = await getAPI(SysConstApi).apiSysConstListGet();
		// 	this.constList = res.data.result ?? [];
		// 	return this.constList;
		// },
	},
	actions: {
		async setUserInfos() {
			// 存储用户信息到浏览器缓存
			if (Session.get('userInfo')) {
				this.userInfos = Session.get('userInfo');
			} else {
				const userInfos = <UserInfos>await this.getApiUserInfo();
				this.userInfos = userInfos;
			}
		},
		async setConstList() {
			// 存储常量信息到浏览器缓存
			if (Session.get('constList')) {
				this.constList = Session.get('constList');
			} else {
				const constList = <any[]>await this.getSysConstList();
				Session.set('constList', constList);
				this.constList = constList;
			}
		},
		async setDictList() {
			// 存储字典信息到浏览器缓存
			if (Session.get('dictList')) {
				this.dictList = Session.get('dictList');
			} else {
				const dictList =  await getAPI(SysDictTypeApi)
					.apiSysDictTypeAllDictListGet();
				Session.set('dictList', dictList.data.result);
				this.dictList = dictList.data.result;
			}
		},
		// 获取当前用户信息
		getApiUserInfo() {
			return new Promise((resolve) => {
				getAPI(SysAuthApi)
					.apiSysAuthUserInfoGet()
					.then(async (res: any) => {
						if (res.data.result == null) return;
						var d = res.data.result;
						const userInfos = {
							id: d.id,
							account: d.account,
							realName: d.realName,
							accountType: d.accountType,
							avatar: d.avatar ? '/' + d.avatar : '/favicon.ico',
							address: d.address,
							signature: d.signature,
							orgId: d.orgId,
							orgName: d.orgName,
							posName: d.posName,
							roles: [],
							authBtnList: d.buttons,
							time: new Date().getTime(),
						};
						// vue-next-admin 提交Id：225bce7 提交消息：admin-23.03.26:发布v2.4.32版本
						// 增加了下面代码，引起当前会话的用户信息不会刷新，如：重新提交的头像不更新，需要新开一个页面才能正确显示
						// Session.set('userInfo', userInfos);

						// 水印配置
						const configRes: any = await getAPI(SysAuthApi).apiSysAuthWatermarkConfigGet();
						if (configRes.data.result == null) return;

						const configData = configRes.data.result;
						const storesThemeConfig = useThemeConfig();
						storesThemeConfig.themeConfig.isWatermark = configData.watermarkEnabled;
						storesThemeConfig.themeConfig.watermarkText = userInfos.realName;
						if (storesThemeConfig.themeConfig.isWatermark) Watermark.set(storesThemeConfig.themeConfig.watermarkText);
						else Watermark.del();

						Local.remove('themeConfig');
						Local.set('themeConfig', storesThemeConfig.themeConfig);

						resolve(userInfos);
					});
			});
		},
		// 获取常量集合
		getSysConstList() {
			return new Promise((resolve) => {
				getAPI(SysConstApi)
					.apiSysConstListGet()
					.then(async (res: any) => {
						resolve(res.data.result ?? []);
					});
			});
		},
		// 获取字典集合
		getAllDictList() {
			return new Promise((resolve) => {
				if (this.dictList) {
					resolve(this.dictList);
				} else {
					getAPI(SysDictTypeApi)
						.apiSysDictTypeAllDictListGet()
						.then((res: any) => {
							resolve(res.data.result ?? []);
						});
				}
			});
		},
		//根据字典类型和值取描述
		getDictLabelByVal( typePCode: string,val: string) {
			const _val= val;
			const ds = this.getDictDatasByCode(typePCode);
			for (let index = 0; index < ds.length; index++) {
				const element = ds[index];
				if (element.code == _val) {
					return element.value;
				}
			}
		},
		//根据字典类型和描述取值
		getDictValByLabel(typePCode: string,label: string) {
			const ds = this.getDictDatasByCode(typePCode);
			for (let index = 0; index < ds.length; index++) {
				const element = ds[index];
				if (element.value == label) {
					return element.code;
				}
			}
		},
		//根据字典类型字典数据
		getDictDatasByCode(dictTypeCode: string) {
			return this.dictList[dictTypeCode] || [];
		},
		
		//根据字典类型字典数据,值转为数字类型
		getDictIntDatasByCode(dictTypeCode: string) {
			var ds=this.dictListInt[dictTypeCode];
			if(ds){
				return ds;
			}else{
				ds=this.dictList[dictTypeCode]
				.map((element: { code: any; value:string;remark:string; }) => {
					element.code=toNumber(element.code);
					return element;
				});
				this.dictListInt[dictTypeCode]=ds;
				return ds ;
			}
		},
	},
});
