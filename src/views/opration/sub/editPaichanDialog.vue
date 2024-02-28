<template>
    <div class="edit-paichan-container">
        <el-dialog v-model="isShowDialog" :width="800" draggable="">
            <template #header>
                <div style="color: #fff">
                    <!--<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>-->
                    <span> 修改排产信息 </span>
                </div>
            </template>
            <div>
                <el-select clearable filterable v-model="orderDetailModel.deviceId" placeholder="请选择设备外键">
                    <el-option v-for="(item, index) in deviceDeviceIdDropdownList" :key="index" :label="item.label"
                        :value="item.value" />

                </el-select>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { addOrderDetail, updateOrderDetail } from "/@/api/main/orderDetail";
import { listDevice } from '/@/api/main/device';
import { getOrderOrderIdDropdown, getDeviceDeviceIdDropdown, getOrderDetail, getSysUserOperatorUsersDropdown } from '/@/api/main/orderDetail';


const isShowDialog = ref(false);
const deviceTypeId = ref<number>();
const orderDetailId = ref<number>();
const deviceId = ref<any>();

//父级传递来的函数，用于回调
const emit = defineEmits(["reloadDeviceList"]);

// 打开弹窗
const openDialog = async (data: any) => {
    orderDetailId.value = data.orderDetailId;
    deviceTypeId.value = data.deviceType;
    isShowDialog.value = true;
    await getDeviceDeviceIdDropdownList();
    await getOrderDetailModel();
};

// 关闭弹窗
const closeDialog = () => {
    emit("reloadDeviceList", { deviceTypeId: deviceTypeId.value });
    isShowDialog.value = false;
};

// 取消
const cancel = () => {
    isShowDialog.value = false;
};

// 提交
const submit = async () => {
    // todo 业务代码
    closeDialog();
};

// 页面加载时
onMounted(async () => {
});

const orderDetailModel = ref<any>({});
const getOrderDetailModel = async () => {
    let list = await getOrderDetail({ id: orderDetailId.value });
    orderDetailModel.value = list.data.result ?? {};

    console.log(orderDetailModel.value);

};



const orderOrderIdDropdownList = ref<any>([]);
const getOrderOrderIdDropdownList = async () => {
    let list = await getOrderOrderIdDropdown();
    orderOrderIdDropdownList.value = list.data.result ?? [];
};
getOrderOrderIdDropdownList();

const deviceDeviceIdDropdownList = ref<any>([]);
const getDeviceDeviceIdDropdownList = async () => {
    let list = await listDevice({});
    deviceDeviceIdDropdownList.value = list.data.result?.filter(x => x.deviceTypeId == deviceTypeId.value).map(v => {
        return {
            label: v.deviceCode,
            value: v.id
        }
    }) ?? [];
};

const sysUserOperatorUsersDropdownList = ref<any>([]);
const getSysUserOperatorUsersDropdownList = async () => {
    let list = await getSysUserOperatorUsersDropdown();
    sysUserOperatorUsersDropdownList.value = list.data.result ?? [];
};
getSysUserOperatorUsersDropdownList();


//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>