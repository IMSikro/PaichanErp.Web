<template>
    <div class="oprationScreen-container">
        <div
            style="width: 100%;  text-align: center; font-size: 3rem; background-color: cornflowerblue; color: aliceblue;">
            <h1>{{ state.orgData.name }} - 排产控制台</h1>
        </div>
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item v-for="dt in state.deviceTypes" :key="dt.id" :name="dt.id">
                <template #title>
                    <el-text tag="b" style="margin-left: 3rem;">{{ dt.typeName }}</el-text>
                </template>
                <DeviceList :ref="(e: any) => { if (e) setDeviceListRef(e, dt) }" :dt="dt" />
            </el-collapse-item>
            <!-- <el-collapse-item name="2">
                <template #title>
                    <el-text tag="b" style="margin-left: 3rem;">挤出</el-text>
                </template>
                <DeviceList ref="deviceListRef" />
            </el-collapse-item>
            <el-collapse-item name="3">
                <template #title>
                    <el-text tag="b" style="margin-left: 3rem;">破碎</el-text>
                </template>
                <DeviceList ref="deviceListRef" />
            </el-collapse-item>
            <el-collapse-item name="4">
                <template #title>
                    <el-text tag="b" style="margin-left: 3rem;">干混</el-text>
                </template>
                <DeviceList ref="deviceListRef" />
            </el-collapse-item> -->
        </el-collapse>
    </div>
</template>

<script lang="ts" setup="" name="oprationScreen">
import { defineAsyncComponent, onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import { useRoute } from 'vue-router';
import mittBus from '/@/utils/mitt';
import { auth } from '/@/utils/authFunction';
import { clearAccessTokens, getAPI } from '/@/utils/axios-utils';
import { SysFileApi, SysOrgApi, SysUserApi, SysTenantApi } from '/@/api-services/api';
import { pageDeviceType } from '/@/api/main/deviceType';
import { SysUser, SysTenant } from '/@/api-services/models';

import { storeToRefs } from 'pinia';
import { useUserInfo } from '/@/stores/userInfo';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';

// 定义变量内容
const stores1 = useTagsViewRoutes();
const { isTagsViewCurrenFull } = storeToRefs(stores1);

// 关闭当前全屏
const onCloseFullscreen = () => {
    stores1.setCurrenFullscreen(false);
};

import DeviceList from '/@/views/opration/sub/deviceList.vue';

// 定义变量内容
const route = useRoute();

// 0 刷新当前，1 关闭当前，2 关闭其它，3 关闭全部 4 当前页全屏
// 1、刷新当前 tagsView
const refreshCurrentTagsView = () => {
    mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 0, ...route }));
};
const openCurrenFullscreen = () => {
    mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 4, ...route }));
};

const stores = useUserInfo();
const { userInfos } = storeToRefs(stores);
const state = reactive({
    currentUser: {} as SysUser,
    currentTenant: {} as SysTenant,
    orgData: [] as any,
    deviceTypes: [] as any,
});
let deviceListRef = {};

const activeNames = ref<string[]>([])
const handleChange = (val: string[]) => {
    // console.log(val)
    // console.log(deviceListRef.value);

}
const handlePaigong = (val: string[]) => {
    console.log(val)
}

const setDeviceListRef = (e, dt) => {
    deviceListRef[dt.id] = e;
}


const loading = ref(true)
const handleKeyDown = (event: any) => {
    console.log(event.key);

    if (event.key.toLowerCase() == 'escape') {
        // 在这里执行要触发的逻辑
        console.log('Esc is pressed!')
        onCloseFullscreen();
    }
}

// 在组件卸载时移除事件监听
// 考虑到你想要的是在页面卸载前移除事件监听，因此这里使用了`beforeUnmount`
// 如果你希望在页面卸载后再移除事件监听，可以使用`onUnmounted`
onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyDown)
})

onMounted(async () => {
    loading.value = false
    // var res = await getAPI(SysUserApi).apiSysUserBaseInfoGet();
    // state.currentUser = res.data.result ?? { account: '' };
    // if (state.currentUser.tenantId && state.currentUser.tenantId > 0) {
    //     var tenant = await getAPI(SysTenantApi).apiSysTenantGetTenantByIdPost({ tenantId: state.currentUser.tenantId ?? 0 });
    //     state.currentTenant = tenant.data.result ?? { id: state.currentTenant.tenantId };
    // }
    var res = await getAPI(SysOrgApi).apiSysOrgListGet(0);
    var d = res.data.result ?? [];
    state.orgData = d[0] ?? []; // 默认第一个树分支

    var dtRes = await pageDeviceType({});
    state.deviceTypes = dtRes.data.result?.items ?? [];
    activeNames.value = state.deviceTypes.map(x => x.id);

    // console.log(deviceListRef);

    // for (const dt of state.deviceTypes) {
    //     await deviceListRef[dt.id].initDeviceList(dt.id);
    // }
    loading.value = false;
    openCurrenFullscreen();
    // 添加键盘事件监听
    document.addEventListener('keydown', handleKeyDown)
})
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
    width: 100%;
}
</style>