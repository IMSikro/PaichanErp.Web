<template>
	<div class="weChatUserBind-container">
		<div>
			<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit />
			</el-icon>
			<span> 扫码绑定微信用户 </span>
		</div>

	</div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

import { getAPI } from '/@/utils/axios-utils';
import { SysWechatApi } from '/@/api-services/api';
import { GenAuthUrlInput, WechatUserLogin } from '/@/api-services/models';

const message = ref();
const state = reactive({
	loading: false,
	genAuthUrl: {} as GenAuthUrlInput,
	message: '' as string,
});

onMounted(async () => {
	state.loading = true;
	state.message = "正在绑定微信用户.....";
	var href = location.href;
	var baseUrl = href.substring(0,href.indexOf('#'));
	const paramsStr = window.location.search
	const params = new URLSearchParams(paramsStr)
	var code = params.get('code')
	if(!code){
		// var href = location.href;
		// var host = href.substring(0,href.indexOf('#'));
		var host = `http://ljhb.iduilv.com/`
		state.genAuthUrl.redirectUrl = `${host}#/system/wechatUserBind`;
		state.genAuthUrl.scope = 'snsapi_userinfo';
		var res = await getAPI(SysWechatApi).apiSysWechatGenAuthUrlPost(state.genAuthUrl);
		var redirectUrl = res.data.result ?? '';
		console.log(redirectUrl);
		
		location.href = redirectUrl;
	}else{
		var res2 = await getAPI(SysWechatApi).apiSysWechatSnsOAuth2Post(code);
		console.log(res2);
		
		state.message = "绑定成功,请关闭页面!";
	}


	state.loading = false;
});

// 导出对象
</script>
