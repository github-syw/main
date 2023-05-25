<script setup lang="ts">
import { ref } from 'vue'
import {
  putMemberAddressAPI,
  postMemberAddressAPI,
  getMemberAddressByIdAPI,
} from '@/services/address'
import { onLoad } from '@dcloudio/uni-app'

// 动态设置导航标题
const query = defineProps<{ id?: string }>()
uni.setNavigationBarTitle({ title: query.id ? '修改地址' : '新建地址' })

// 地址表单数据
const form = ref({
  receiver: '', // 收货人
  contact: '', // 联系方式
  fullLocation: '', // 省市区(前端展示)
  provinceCode: '', // 省份编码(后端参数)
  cityCode: '', // 城市编码(后端参数)
  countyCode: '', // 区/县编码(后端参数)
  address: '', // 详细地址
  isDefault: 0, // 默认地址，1为是，0为否
})
// 地区
const onRegionChange: UniHelper.RegionPickerOnChange = (e) => {
  form.value.fullLocation = e.detail.value.join(' ') // 前端展示用省市区
  const [provinceCode, cityCode, countyCode] = e.detail.code! // 后端参数用code
  // form.value.provinceCode = provinceCode
  // form.value.cityCode = cityCode
  // form.value.countyCode = countyCode
  Object.assign(form.value, { provinceCode, cityCode, countyCode }) // 给form。value新增属性
}
// 默认地址
const onSwitchChange: UniHelper.SwitchOnChange = (e) => {
  form.value.isDefault = e.detail.value ? 1 : 0
}

// 表单组件实例
const formRef = ref<UniHelper.UniFormsInstance>()
// 校验规则
const rules: UniHelper.UniFormsRules = {
  receiver: { rules: [{ required: true, errorMessage: '请输入收货人姓名' }] },
  fullLocation: { rules: [{ required: true, errorMessage: '请选择所在地区' }] },
  address: { rules: [{ required: true, errorMessage: '请选择详细地址' }] },
  contact: {
    rules: [
      { required: true, errorMessage: '请输入联系方式' },
      { pattern: /^1[3-9]\d{9}$/, errorMessage: '手机号格式不正确' },
    ],
  },
}

// 提交表单
const onSubmit = async () => {
  try {
    await formRef.value?.validate!([''], () => {})
    if (query.id) await putMemberAddressAPI(query.id, form.value) // 有id -> 修改地址
    else await postMemberAddressAPI(form.value) // 没id -> 新增地址
    uni.showToast({ title: query.id ? '修改成功' : '添加成功', icon: 'success' }) // uni-ui轻提示
    setTimeout(() => {
      uni.navigateBack() // 返回上一页
    }, 400)
  } catch (error) {
    uni.showToast({ icon: 'error', title: '请填写完整信息' })
  }
}

// 数据回显。API - 获取收货地址详情
const getMemberAddressByIdData = async () => {
  if (query.id) {
    const res = await getMemberAddressByIdAPI(query.id)
    Object.assign(form.value, res.result) // Object.assign()把res.result拷贝给form.value
  }
}
onLoad(() => {
  getMemberAddressByIdData()
})
</script>

<template>
  <view class="content">
    <uni-forms :rules="rules" :model="form" ref="formRef">
      <uni-forms-item name="receiver" class="form-item">
        <text class="label">收货人</text>
        <input class="input" placeholder="请填写收货人姓名" v-model="form.receiver" />
      </uni-forms-item>

      <uni-forms-item name="contact" class="form-item">
        <text class="label">手机号码</text>
        <input class="input" placeholder="请填写收货人手机号码" v-model="form.contact" />
      </uni-forms-item>

      <uni-forms-item name="fullLocation" class="form-item">
        <text class="label">所在地区</text>
        <!-- value控制弹出的窗口默认展示，要求是一个数组 -->
        <picker
          mode="region"
          class="picker"
          @change="onRegionChange"
          :value="form.fullLocation.split(' ')"
        >
          <view v-if="form.fullLocation">{{ form.fullLocation }}</view>
          <view v-else class="placeholder">请选择省/市/区(县)</view>
        </picker>
      </uni-forms-item>

      <uni-forms-item name="address" class="form-item">
        <text class="label">详细地址</text>
        <input class="input" placeholder="街道、楼牌号等信息" v-model="form.address" />
      </uni-forms-item>

      <view class="form-item">
        <label class="label">设为默认地址</label>
        <switch
          :checked="form.isDefault === 1"
          @change="onSwitchChange"
          color="#27ba9b"
          class="switch"
        />
      </view>
    </uni-forms>
  </view>
  <button class="button" @tap="onSubmit">保存</button>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.content {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .form-item,
  .uni-forms-item {
    display: flex;
    align-items: center;
    min-height: 96rpx;
    padding: 25rpx 10rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;
    margin-bottom: 0;

    // 调整 uni-forms 样式
    .uni-forms-item__content {
      display: flex;
    }

    .uni-forms-item__error {
      margin-left: 200rpx;
    }

    &:last-child {
      border: none;
    }

    .label {
      width: 200rpx;
      color: #333;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .switch {
      position: absolute;
      right: -20rpx;
      transform: scale(0.8);
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }
}

.button {
  height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>
