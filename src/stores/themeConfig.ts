import { defineStore } from 'pinia';

/**
 * 布局配置
 * 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I567R1，感谢@lanbao123
 * 2020.05.28 by lyt 优化。开发时配置不生效问题
 * 修改配置时：
 * 1、需要每次都清理 `window.localStorage` 浏览器永久缓存
 * 2、或者点击布局配置最底部 `一键恢复默认` 按钮即可看到效果
 */
export const useThemeConfig = defineStore('themeConfig', {
	state: (): ThemeConfigState => ({
		themeConfig: { "isDrawer": false, "primary": "#095474", "isIsDark": false, "topBar": "#FFFFFF", "topBarColor": "#000000", "isTopBarColorGradual": false, "menuBar": "#FFFFFF", "menuBarColor": "#000000", "menuBarActiveColor": "var(--el-color-primary-light-7)", "isMenuBarColorGradual": true, "columnsMenuBar": "#2C3A49", "columnsMenuBarColor": "#F0F0F0", "isColumnsMenuBarColorGradual": false, "isColumnsMenuHoverPreload": false, "isCollapse": false, "isUniqueOpened": true, "isFixedHeader": true, "isFixedHeaderChange": false, "isClassicSplitMenu": false, "isLockScreen": false, "lockScreenTime": 300, "isShowLogo": true, "isShowLogoChange": false, "isBreadcrumb": true, "isTagsview": true, "isBreadcrumbIcon": true, "isTagsviewIcon": false, "isCacheTagsView": false, "isSortableTagsView": true, "isShareTagsView": false, "isFooter": true, "isGrayscale": false, "isInvert": false, "isWatermark": false, "watermarkText": "超级管理员", "tagsStyle": "tags-style-one", "animation": "fadeLeft", "columnsAsideStyle": "columns-round", "columnsAsideLayout": "columns-vertical", "layout": "defaults", "isRequestRoutes": true, "globalTitle": "云制库企业管理", "globalViceTitle": "云制库企业管理", "globalViceTitleMsg": "云制库企业管理", "globalI18n": "zh-cn", "globalComponentSize": "default" },
	}),
	actions: {
		setThemeConfig(data: ThemeConfigState) {
			this.themeConfig = data.themeConfig;
		},
	},
});
