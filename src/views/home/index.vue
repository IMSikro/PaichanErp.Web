<template>
	<div class="home-container layout-pd">
		<el-row :gutter="15" class="home-card-one mb15">
			<el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" v-for="(v, k) in state.homeOne" :key="k"
				:class="{ 'home-media home-media-lg': k > 1, 'home-media-sm': k === 1 }" v-show="v.show">
				<div class="home-card-item flex">
					<div class="flex-margin flex w100" :class="` home-one-animation${k}`">
						<div class="flex-auto">
							<span class="font30">{{ v.num1 }}</span>
							<div class="font16" :style="{ color: v.color1 }">批数: {{ v.num2 }}</div>
							<div class="mt10">{{ v.num3 }}</div>
						</div>
						<div class="home-card-item-icon flex" :style="{ background: `var(${v.color2})` }">
							<i class="flex-margin font32" :class="v.num4" :style="{ color: `var(${v.color3})` }"></i>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>
		<div class="home-card-item-title" style="font-size: 15px;font-weight: bold;height: 30px;">数据仪表</div>
		<el-row :gutter="15" class="home-card-two mb15">
			<el-col :xs="24" :sm="7" :md="7" :lg="8" :xl="8">
				<div class="home-card-item">
					<div style="height: 100%" ref="homeBarRef"></div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="7" :md="7" :lg="8" :xl="8">
				<div class="home-card-item">
					<div style="height: 100%" ref="homeBar2Ref"></div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="7" :md="7" :lg="8" :xl="8" class="home-media">
				<div class="home-card-item">
					<div style="height: 100%" ref="homeBar3Ref"></div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="15" class="home-card-three mb15">
			<el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="8">
				<div class="home-card-item" v-auth="'deviceGroup:page'">
					<div class="home-card-item-title">大屏分组导航</div>
					<div class="home-monitor">
						<div class="flex-warp">
							<div class="flex-warp-item" v-for="(v, k) in state.homeMenu" :key="k" @click="openLink(v)">
								<div class="flex-warp-item-box" :class="`home-animation${k}`"
									:style="`background-color: ${v.bgColor}; color: ${v.iconColor}`">
									<div class="flex-margin">
										<i :class="v.icon" :style="{ color: v.iconColor }"></i>
										<span class="pl5">{{ v.label }}</span>
										<div class="mt10">设备: {{ v.deviceNum }}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="home">
import { reactive, onMounted, ref, watch, nextTick, onActivated, markRaw } from 'vue';
import * as echarts from 'echarts';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from "element-plus";
import { isMobile } from "/@/utils/other";

import { pageDeviceGroup } from '/@/api/main/deviceGroup';
import { homeIndex } from '/@/api/main/deviceType';

const router = useRouter();

// 定义变量内容
const homeLineRef = ref();
const homePieRef = ref();
const homeBarRef = ref();
const homeBar2Ref = ref();
const homeBar3Ref = ref();
const storesTagsViewRoutes = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);
const state = reactive({
	global: {
		homeChartOne: null,
		homeChartTwo: null,
		homeChartThree: null,
		dispose: [null, '', undefined],
	} as any,
	homeMenu: [
		{
			icon: 'iconfont icon-diannao1',
			label: '分组1',
			iconColor: '#FBD4A0',
			bgColor: '#FBD4A0',
			url: '/dashboard/bigScreen',
			groupId: 1,
			deviceNum: 0,
		},
	],
	homeOne: [
		{
			num1: '121.2',
			num2: '12',
			num3: '今日订单',
			num4: 'fa fa-meetup',
			// color1: '#FF6462',
			color1: '#6690F9',
			color2: '--next-color-primary-lighter',
			color3: '--el-color-primary',
			show: false,
		},
		{
			num1: '653.33',
			num2: '42',
			num3: '今日排程',
			num4: 'iconfont icon-ditu',
			color1: '#6690F9',
			color2: '--next-color-success-lighter',
			color3: '--el-color-success',
			show: false,
		},
		{
			num1: '',
			num2: '',
			num3: '今日完工',
			num4: 'iconfont icon-zaosheng',
			color1: '#6690F9',
			color2: '--next-color-warning-lighter',
			color3: '--el-color-warning',
			show: true,
		},
		// {
		// 	num1: '520,43',
		// 	num2: '-10.01',
		// 	num3: '访问统计信息',
		// 	num4: 'fa fa-github-alt',
		// 	color1: '#FF6462',
		// 	color2: '--next-color-danger-lighter',
		// 	color3: '--el-color-danger',
		// },
	],
	myCharts: [] as EmptyArrayType,
	charts: {
		theme: '',
		bgColor: '',
		color: '#303133',
		barWidth: isMobile() ? 15 : 25,
		barWidth3: '60%',
	},
});


// 打开分组操作大屏
const openLink = (data: { deviceNum: number; url: string; groupId: number; label: string }) => {
	if (data.deviceNum > 0)
		router.push({
			path: data.url,
			query: { groupId: data.groupId, groupName: data.label },
		});
	else
		ElMessage.warning('当前分组没有设备,请先添加设备后打开');
};

const getDeviceGroup = async () => {
	var res = await pageDeviceGroup({});
	var groupList = res.data.result ?? [];
	state.homeMenu = groupList.map((g: { groupName: string; id: number; deviceIds: string }) => ({
		icon: 'iconfont icon-diannao1',
		label: g.groupName,
		iconColor: '#fff',
		bgColor: '#057748',
		url: '/dashboard/bigScreen',
		groupId: g.id,
		deviceNum: g.deviceIds?.split(',').length ?? 0,
	}));

	var res2 = await homeIndex({});
	var homeidx = res2.data.result ?? {};
	console.log(homeidx);

	// 设置今日数据
	state.homeOne[0].num1 = homeidx.unHome.number;
	state.homeOne[0].num2 = homeidx.unHome.batchNum;
	state.homeOne[1].num1 = homeidx.paiHome.number;
	state.homeOne[1].num2 = homeidx.paiHome.batchNum;
	state.homeOne[2].num1 = homeidx.endHome.number;
	state.homeOne[2].num2 = homeidx.endHome.batchNum;

	// 设置柱状图表1.2
	initBarChart(homeidx.dtList);
	initBarChart2(homeidx.dtList);
	initBarChart3(homeidx.sumHome);
}
// 柱状图
const initBarChart = (dtList: any) => {
	if (!state.global.dispose.some((b: any) => b === state.global.homeChartOne)) state.global.homeChartOne.dispose();
	state.global.homeChartOne = markRaw(echarts.init(homeBarRef.value, state.charts.theme));
	const option = {
		backgroundColor: state.charts.bgColor,
		title: {
			text: '排程概览',
			x: 'left',
			textStyle: { fontSize: '15', color: state.charts.color },
		},
		tooltip: { trigger: 'axis' },
		legend: { data: ['批次(B)', '数量'], right: 0 },
		grid: { top: 80, right: 60, bottom: 50, left: 50 },
		xAxis: [
			{
				name: '数量',
				nameLocation: 'end',
				nameTextStyle: { padding: [4, 5, 5, 6] },
				splitLine: { show: false },
				axisLine: { show: false },
				axisTick: { show: false },
				// max: dtList && dtList.map((x: any) => x.orderNumber).reduce((a: number, b: number) => Math.max(a, b), -Infinity) + 200, //刻度最大值
				axisLabel: {
					color: state.charts.color,
					formatter: '{value} ',
					interval: 0,
					rotate: 40
				},
			},
			{
				name: '批次(B)',
				nameLocation: 'end',
				nameTextStyle: { padding: [4, 5, 5, 6] },
				splitLine: { show: false },
				axisLine: { show: false },
				axisTick: { show: false },
				// max: dtList && dtList.map((x: any) => x.orderBatchNum).reduce((a: number, b: number) => Math.max(a, b), -Infinity) + 2, //刻度最大值
				axisLabel: { color: state.charts.color, formatter: '{value} ' },
			},
		],
		yAxis: [
			{
				type: 'category',
				data: dtList && dtList.map((x: any) => x.typeName),
				boundaryGap: true,
				axisTick: { show: false },
			},
		],
		series: [
			{
				name: '批次(B)',
				// type: 'line',
				// smooth: true,
				// showSymbol: true,
				// // 矢量画五角星
				// symbol: 'path://M150 0 L80 175 L250 75 L50 75 L220 175 Z',
				// symbolSize: 12,

				type: 'bar',
				barWidth: state.charts.barWidth,
				nameGap: 15, //坐标轴名称与轴线间距离
				xAxisIndex: 1,
				// areaStyle: {
				// 	color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				// 		{ offset: 0, color: 'rgba(250,180,101,0.3)' },
				// 		{ offset: 1, color: 'rgba(250,180,101,0)' },
				// 	]),
				// 	shadowColor: 'rgba(250,180,101,0.2)',
				// 	shadowBlur: 20,
				// },
				label: {
					show: true,
					formatter: (params: any) => {
						return params.value > 0 ? params.value : '';
					}
				},
				itemStyle: { color: '#4763A5' },
				// data中可以使用对象，value代表相应的值，另外可加入自定义的属性
				data: dtList && dtList.map((x: any) => ({ value: x.orderBatchNum })),
			},
			{
				name: '数量',
				type: 'bar',
				// barWidth: 30,
				barWidth: state.charts.barWidth,
				nameGap: 15, //坐标轴名称与轴线间距离
				xAxisIndex: 0,
				// itemStyle: {
				// 	color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				// 		{ offset: 0, color: 'rgba(108,80,243,0.3)' },
				// 		{ offset: 1, color: 'rgba(108,80,243,0)' },
				// 	]),
				// 	//柱状图圆角
				// 	// borderRadius: [30, 30, 0, 0],
				// },
				label: {
					show: true,
					formatter: (params: any) => {
						return params.value > 0 ? params.value : '';
					}
				},
				itemStyle: {
					color: '#35B4C1'
				},
				data: dtList && dtList.map((x: any) => ({ value: x.orderNumber })),
				// data: [
				// 	{ value: 11, stationName: 's1' },
				// 	{ value: 34, stationName: 's2' },
				// 	{ value: 54, stationName: 's3' },
				// 	{ value: 39, stationName: 's4' },
				// 	{ value: 63, stationName: 's5' },
				// 	{ value: 24, stationName: 's6' },
				// ],
			},
		],
	};
	state.global.homeChartOne.setOption(option);
	state.myCharts.push(state.global.homeChartOne);
};
// 柱状图
const initBarChart2 = (dtList: any) => {
	if (!state.global.dispose.some((b: any) => b === state.global.homeChartTwo)) state.global.homeChartTwo.dispose();
	state.global.homeChartTwo = markRaw(echarts.init(homeBar2Ref.value, state.charts.theme));
	const option = {
		backgroundColor: state.charts.bgColor,
		title: {
			text: '未排程概览',
			x: 'left',
			textStyle: { fontSize: '15', color: state.charts.color },
		},
		tooltip: { trigger: 'axis' },
		legend: { data: ['数量', '批次(B)'], right: 0 },
		grid: { top: 50, right: 60, bottom: 50, left: 50 },
		xAxis: [
			{
				name: '数量',
				nameLocation: 'end',
				nameTextStyle: { padding: [4, 5, 5, 6] },
				splitLine: { show: false },
				axisLine: { show: false },
				axisTick: { show: false },
				// max: dtList && dtList.map((x: any) => x.orderNumber).reduce((a: number, b: number) => Math.max(a, b), -Infinity) + 200, //刻度最大值
				axisLabel: {
					color: state.charts.color,
					formatter: '{value} ',
					interval: 0,
					rotate: 40
				},
			},
			{
				name: '批次(B)',
				nameLocation: 'end',
				nameTextStyle: { padding: [4, 5, 5, 6] },
				splitLine: { show: false },
				axisLine: { show: false },
				axisTick: { show: false },
				// max: dtList && dtList.map((x: any) => x.orderBatchNum).reduce((a: number, b: number) => Math.max(a, b), -Infinity) + 2, //刻度最大值
				axisLabel: { color: state.charts.color, formatter: '{value} ' },
			},
		],
		yAxis: [
			{
				type: 'category',
				data: dtList && dtList.map((x: any) => x.typeName),
				boundaryGap: true,
				axisTick: { show: false },
			},
		],
		series: [
			{
				name: '批次(B)',
				// type: 'line',
				// smooth: true,
				// showSymbol: true,
				// // 矢量画五角星
				// symbol: 'path://M150 0 L80 175 L250 75 L50 75 L220 175 Z',
				// symbolSize: 12,

				type: 'bar',
				barWidth: state.charts.barWidth,
				nameGap: 15, //坐标轴名称与轴线间距离
				xAxisIndex: 1,
				// areaStyle: {
				// 	color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				// 		{ offset: 0, color: 'rgba(250,180,101,0.3)' },
				// 		{ offset: 1, color: 'rgba(250,180,101,0)' },
				// 	]),
				// 	shadowColor: 'rgba(250,180,101,0.2)',
				// 	shadowBlur: 20,
				// },
				label: {
					show: true,
					formatter: (params: any) => {
						return params.value > 0 ? params.value : '';
					}
				},
				itemStyle: { color: '#4763A5' },
				// data中可以使用对象，value代表相应的值，另外可加入自定义的属性
				data: dtList && dtList.map((x: any) => ({ value: x.unOrderBatchNum })),
			},
			{
				name: '数量',
				type: 'bar',
				// barWidth: 30,
				barWidth: state.charts.barWidth,
				nameGap: 15, //坐标轴名称与轴线间距离
				xAxisIndex: 0,
				// itemStyle: {
				// 	color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				// 		{ offset: 0, color: 'rgba(108,80,243,0.3)' },
				// 		{ offset: 1, color: 'rgba(108,80,243,0)' },
				// 	]),
				// 	//柱状图圆角
				// 	// borderRadius: [30, 30, 0, 0],
				// },
				label: {
					show: true,
					formatter: (params: any) => {
						return params.value > 0 ? params.value : '';
					}
				},
				itemStyle: {
					color: '#35B4C1'
				},
				data: dtList && dtList.map((x: any) => ({ value: x.unOrderNumber })),
				// data: [
				// 	{ value: 11, stationName: 's1' },
				// 	{ value: 34, stationName: 's2' },
				// 	{ value: 54, stationName: 's3' },
				// 	{ value: 39, stationName: 's4' },
				// 	{ value: 63, stationName: 's5' },
				// 	{ value: 24, stationName: 's6' },
				// ],
			},
		],
	};
	state.global.homeChartTwo.setOption(option);
	state.myCharts.push(state.global.homeChartTwo);
};
// 柱状图
const initBarChart3 = (sumHome: any) => {
	if (!state.global.dispose.some((b: any) => b === state.global.homeChartThree)) state.global.homeChartThree.dispose();
	state.global.homeChartThree = markRaw(echarts.init(homeBar3Ref.value, state.charts.theme));

	let batchNum = sumHome && sumHome.batchNum;
	let num = sumHome && sumHome.number;
	let data = sumHome && [{ value: num }, { value: batchNum }];
	const option = {
		backgroundColor: state.charts.bgColor,
		title: {
			text: '未完订单总览',
			x: 'left',
			textStyle: { fontSize: '15', color: state.charts.color },
		},
		tooltip: { trigger: 'axis' },
		legend: { data: [''], right: 0 },
		grid: { top: 50, right: 60, bottom: 50, left: 50 },
		xAxis: [
			{
				name: '',
				nameLocation: 'end',
				nameTextStyle: { padding: [50, 4, 5, 6] },
				splitLine: { show: false },
				axisLine: { show: false },
				axisTick: { show: false },
				// max: dtList && dtList.map((x: any) => x.unOrderNumber).reduce((a: number, b: number) => Math.max(a, b), -Infinity) + 200, //刻度最大值
				axisLabel: {
					color: state.charts.color,
					formatter: '{value}',
					interval: 0,
					rotate: 40
				},
			},
		],
		yAxis: [
			{
				type: 'category',
				data: ['数量(T)', '批次(B)'],
				boundaryGap: true,
				axisTick: { show: false },
			},
		],
		series: [
			{
				name: '累计(T)',
				type: 'bar',
				barWidth: state.charts.barWidth3,
				xAxisIndex: 0,
				barMinHeight: batchNum > 0 ? 20 : 0,
				label: {
					show: true,
					formatter: (params: any) => {
						return params.value > 0 ? params.value : '';
					}
				},
				// itemStyle: {
				// 	color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				// 		{ offset: 0, color: 'rgba(108,80,243,0.3)' },
				// 		{ offset: 1, color: 'rgba(108,80,243,0)' },
				// 	]),
				// 	//柱状图圆角
				// 	// borderRadius: [30, 30, 0, 0],
				// },
				itemStyle: {
					color: function (params: any) {
						let colorList = ['#4763A5', '#E87C25'];
						return colorList[params.dataIndex];
					},
				},
				data: data,
				// data: [
				// 	{ value: 11, stationName: 's1' },
				// 	{ value: 34, stationName: 's2' },
				// 	{ value: 54, stationName: 's3' },
				// 	{ value: 39, stationName: 's4' },
				// 	{ value: 63, stationName: 's5' },
				// 	{ value: 24, stationName: 's6' },
				// ],
			},
		],
	};
	state.global.homeChartThree.setOption(option);
	state.myCharts.push(state.global.homeChartThree);
};
// 批量设置 echarts resize
const initEchartsResizeFun = () => {
	nextTick(() => {
		for (let i = 0; i < state.myCharts.length; i++) {
			setTimeout(() => {
				state.myCharts[i].resize();
			}, i * 1000);
		}
	});
};
// 批量设置 echarts resize
const initEchartsResize = () => {
	window.addEventListener('resize', initEchartsResizeFun);
};
// 页面加载时
onMounted(() => {
	initEchartsResize();
	getDeviceGroup();
});
// 由于页面缓存原因，keep-alive
onActivated(() => {
	initEchartsResizeFun();
});
// 监听 pinia 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
watch(
	() => isTagsViewCurrenFull.value,
	() => {
		initEchartsResizeFun();
	}
);
// 监听 pinia 中是否开启深色主题
watch(
	() => themeConfig.value.isIsDark,
	(isIsDark) => {
		nextTick(() => {
			state.charts.theme = isIsDark ? 'dark' : '';
			state.charts.bgColor = isIsDark ? 'transparent' : '';
			state.charts.color = isIsDark ? '#dadada' : '#303133';
			// setTimeout(() => {
			// 	initBarChart();
			// }, 500);
			// setTimeout(() => {
			// 	initBarChart2();
			// }, 700);
		});
	},
	{
		deep: true,
		immediate: true,
	}
);
</script>

<style scoped lang="scss">
$homeNavLengh: 8;

.home-container {
	overflow: hidden;

	.home-card-one,
	.home-card-two,
	.home-card-three {
		.home-card-item {
			width: 100%;
			// height: 130px;
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 20px;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);

			&:hover {
				box-shadow: 0 2px 12px var(--next-color-dark-hover);
				transition: all ease 0.3s;
			}

			&-icon {
				width: 70px;
				height: 70px;
				border-radius: 100%;
				flex-shrink: 1;

				i {
					color: var(--el-text-color-placeholder);
				}
			}

			&-title {
				font-size: 15px;
				font-weight: bold;
				height: 30px;
			}
		}
	}

	.home-card-one {
		@for $i from 0 through 3 {
			.home-one-animation#{$i} {
				opacity: 0;
				animation-name: error-num;
				animation-duration: 0.5s;
				animation-fill-mode: forwards;
				animation-delay: calc($i/4) + s;
			}
		}
	}

	.home-card-two {
		.home-card-item {
			height: 400px;
		}
	}

	.home-card-two,
	.home-card-three {
		.home-card-item {
			// height: 400px;
			// width: 100%;
			overflow: hidden;

			.home-monitor {
				height: 100%;

				.flex-warp-item {
					width: 25%;
					height: 111px;
					display: flex;

					.flex-warp-item-box {
						margin: auto;
						text-align: center;
						color: var(--el-text-color-primary);
						display: flex;
						border-radius: 5px;
						background: var(--next-bg-color);
						cursor: pointer;
						transition: all 0.3s ease;

						&:hover {
							background: var(--el-color-primary-light-9);
							transition: all 0.3s ease;
						}
					}

					@for $i from 0 through $homeNavLengh {
						.home-animation#{$i} {
							opacity: 0;
							animation-name: error-num;
							animation-duration: 0.5s;
							animation-fill-mode: forwards;
							animation-delay: calc($i/10) + s;
						}
					}
				}
			}
		}
	}
}
</style>
