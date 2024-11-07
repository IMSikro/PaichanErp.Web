<template>
    <div>
        <el-text v-if="state.isBindWechat">您已成功绑定微信,请关注公众号以便接收通知!</el-text>
        <div v-if="state.isBindWechat">
            <img :src="qrcode1Ref" alt="">
        </div>
        <div v-if="!state.isBindWechat" ref="qrcode2Ref"></div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, nextTick } from 'vue';
import QRCode from 'qrcodejs2-fixes';

import { getAPI } from '/@/utils/axios-utils';
import { SysWechatUserApi } from '/@/api-services/api';

const state = reactive({
    loading: false,
    isBindWechat: false,
});

// 定义变量内容
const qrcode1Ref = ref<string>('');
const qrcode2Ref = ref<HTMLElement | null>(null);
// 初始化生成二维码
const initQrcode = () => {
    var href = location.href;
    var host = href.substring(0,href.indexOf('#'));
	// console.log();
	var hostname = location.hostname;
    qrcode1Ref.value = `http://${hostname}:5005/images/ljhb_gzh.jpg`
    nextTick(() => {
        (<HTMLElement>qrcode2Ref.value).innerHTML = '';
        new QRCode(qrcode2Ref.value, {
            text: `${host}#/system/wechatUserBind`,
            width: 260,
            height: 260,
            colorDark: '#000000',
            colorLight: '#ffffff',
        });
    });
};

onMounted(async () => {
    state.loading = true;
    var res = await getAPI(SysWechatUserApi).apiSysWechatUserOwner();
    console.log(res);
    
    var d = res.data.result ?? [];
    console.log(d);

    state.isBindWechat = d.length > 0 ? true:false;

    initQrcode();
    state.loading = false;
});

</script>

<style lang="scss" scoped></style>
