<template>
    <el-scrollbar style="padding-bottom: 1rem;" ref="scrollbarRef" @wheel.prevent="handleScroll">
        <el-space>
            <el-card v-for="item in deviceList" :key="item.id"
                :body-style="{ padding: '0px', marginBottom: '1px', minHeight: '10rem', maxHeight: '24rem', }">
                <div>
                    <el-text style="margin-left: 1rem;">设备编号: {{ item.deviceName }}</el-text>
                    <div style="position: relative; display: flex; float: right; right: 0;"><el-button type="primary"
                            @click="handleSetPaichanInfo(item.id, $event)">添加未排产订单</el-button>
                    </div>
                </div>
                <el-table :data="orderDetails[item.id]" v-loading="loading" style="width: 100%" tooltip-effect="light"
                    row-key="id" border="" size="small">
                    <el-table-column prop="orderId" label="颜色" width="100" show-overflow-tooltip="">
                        <template #default="scope">
                            <div :style="{ 'background-color': `rgb(${scope.row.colorRgb})` }">&nbsp;</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="produceIdProduceName" label="产品编号" width="100" show-overflow-tooltip="" />
                    <el-table-column prop="operatorUsersRealName" label="操作人员" width="100" show-overflow-tooltip="" />
                    <el-table-column prop="qty" label="班次产量" width="70" show-overflow-tooltip="">
                        <template #default="scope">
                            <span>{{ (scope.row.qty ?? 0) + (scope.row.pUnit ?? "") }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="70" align="center" fixed="right" show-overflow-tooltip=""
                        v-if="auth('orderDetail:edit')">
                        <template #default="scope">
                            <el-button icon="ele-Edit" size="small" text="" type="primary"
                                @click="openEditOrderDetail(scope.row.id, $event)" v-auth="'orderDetail:edit'"> 操作
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="text-align: center; width: 100%;position: relative;bottom: 0;">
                    <el-text> 产量: {{ orderDetailSums[item.id] }} &nbsp;&nbsp;&nbsp;&nbsp;生产批次数: {{
                        orderDetailCounts[item.id] }}</el-text>
                </div>
                <!-- <img :src="item.imgUrl" class="image multi-content" />
                <div style="padding: 14px">
                    <span>{{ item.name }}</span>
                    <div class="bottom card-header">
                        <div class="time">{{ currentDate }}</div>
                        <el-button text bg type="primary">开始派工</el-button>
                    </div>
                </div> -->
            </el-card>
        </el-space>
    </el-scrollbar>

    <addPaichanDialog ref="addPaichanDialogRef" @reloadDeviceList="initDeviceList" />
    <editPaichanDialog ref="editPaichanDialogRef" @reloadDeviceList="initDeviceList" />
</template>


<script lang="ts" setup="" name="deviceList">
import { onMounted, reactive, ref } from 'vue'
import { auth } from '/@/utils/authFunction';
import { pageDevice } from '/@/api/main/device';
import { listOrderDetailByDeviceId } from '/@/api/main/orderDetail';
import editPaichanDialog from '/@/views/opration/sub/editPaichanDialog.vue';
import addPaichanDialog from '/@/views/opration/sub/addPaichanDialog.vue';

//父级传递来的参数
var props = defineProps({
    dt: {}
});

const loading = ref(true)
const scrollbarRef = ref();
const addPaichanDialogRef = ref();
const editPaichanDialogRef = ref();
const handleScroll = (e: any) => {
    const wheelDelta = e.wheelDelta || -e.deltaY * 40
    scrollbarRef.value.setScrollLeft(scrollbarRef.value.wrapRef.scrollLeft - wheelDelta)
}

const handleSetPaichanInfo = async (deviceId, e: any) => {
    await addPaichanDialogRef.value.openDialog({ deviceId, deviceType: deviceType.value.id });
}

const openEditOrderDetail = async (orderDetailId, e: any) => {
    await editPaichanDialogRef.value.openDialog({ orderDetailId, deviceType: deviceType.value.id });

}

const currentDate = new Date().toDateString()
let deviceList = ref<any>([]);
let deviceType = ref<any>({});
let orderDetails = ref<any>({});
let orderDetailCounts = ref<any>({});
let orderDetailSums = ref<any>({});
const initDeviceList = async (dtId) => {
    var res = await pageDevice({ deviceTypeId: dtId });
    deviceList.value = res.data.result?.items ?? [];
    await initOrderDetailList();
}

const initOrderDetailList = async () => {
    // console.log(deviceList.value);
    const deviceIds = deviceList.value.map(v => v.id);
    // console.log(deviceIds);
    for (const deviceId of deviceIds) {
        var orderDetailRes = await listOrderDetailByDeviceId({ deviceId });
        orderDetails.value[deviceId] = orderDetailRes.data.result ?? [];
        orderDetailCounts.value[deviceId] = orderDetailRes.data.result?.length ?? 0;
        orderDetailSums.value[deviceId] = getSumNumber(orderDetailRes.data.result?.map(v => v.qty) ?? []);
    }
}

const getSumNumber = (arr: number[]) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i] ?? 0;
    }
    return sum
}

onMounted(async () => {
    loading.value = false
    deviceType.value = props.dt;
    const dtid = deviceType.value.id;
    await initDeviceList(dtid);
    // console.log(deviceType.value.id);

    // lists.value = [
    //     {
    //         imgUrl:
    //             'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    //         name: 'Deer',
    //     },
    //     {
    //         imgUrl:
    //             'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    //         name: 'Horse',
    //     },
    //     {
    //         imgUrl:
    //             'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    //         name: 'Mountain Lion',
    //     }, {
    //         imgUrl:
    //             'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    //         name: 'Deer',
    //     },
    //     {
    //         imgUrl:
    //             'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    //         name: 'Horse',
    //     },
    //     {
    //         imgUrl:
    //             'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    //         name: 'Mountain Lion',
    //     }, {
    //         imgUrl:
    //             'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    //         name: 'Deer',
    //     },
    //     {
    //         imgUrl:
    //             'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    //         name: 'Horse',
    //     },
    //     {
    //         imgUrl:
    //             'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    //         name: 'Mountain Lion',
    //     }, {
    //         imgUrl:
    //             'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    //         name: 'Deer',
    //     },
    //     {
    //         imgUrl:
    //             'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    //         name: 'Horse',
    //     },
    //     {
    //         imgUrl:
    //             'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    //         name: 'Mountain Lion',
    //     }, {
    //         imgUrl:
    //             'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    //         name: 'Deer',
    //     },
    //     {
    //         imgUrl:
    //             'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    //         name: 'Horse',
    //     },
    //     {
    //         imgUrl:
    //             'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    //         name: 'Mountain Lion',
    //     },
    // ]

    loading.value = false;
})

</script>

<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
    width: 100%;
}

.image {
    width: 100%;
    display: block;
}

.scrollbar-flex-content {
    display: flex;
}

.scrollbar-demo-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
}
</style>