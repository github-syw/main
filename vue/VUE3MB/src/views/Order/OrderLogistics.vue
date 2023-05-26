<script setup lang="ts">
import { onMounted, ref } from 'vue'
import endImg from '@/assets/end.png'
import carImg from '@/assets/car.png'
import startImg from '@/assets/start.png'
import { getMedicalOrderLogisticsAPI } from '@/services/order'
import AMapLoader from '@amap/amap-jsapi-loader'
import type { Logistics } from '@/types/order'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 物流信息
const logistics = ref<Logistics>()
const getMedicalOrderLogistics = async () => {
  try {
    const { data } = await getMedicalOrderLogisticsAPI(
      route.params.id as string
    )
    logistics.value = data
  } catch (error) {
    //
  }
}
onMounted(() => {
  getMedicalOrderLogistics()
})

window._AMapSecurityConfig = {
  securityJsCode: '415e917da833efcf2d5b69f4d821784b'
}
onMounted(() => {
  AMapLoader.load({
    key: '4eed3d61125c8b9c168fc22414aaef7e',
    version: '2.0'
  })
    .then((AMap) => {
      const map = new AMap.Map('map', {
        mapStyle: 'amap://styles/normal',
        zoom: 12
      })
      // 查看: 路径规划
      AMap.plugin('AMap.Driving', function () {
        var driving = new AMap.Driving({
          map: map,
          showTraffic: false, // 关闭道路情况
          hideMarkers: true // 隐藏标记
        })
        // 起始坐标
        const start = logistics.value!.logisticsInfo.shift()
        // 终点坐标
        const end = logistics.value!.logisticsInfo.pop()
        // 点标记，起始图标
        const endMarker = new AMap.Marker({
          position: [end?.longitude, end?.latitude],
          icon: endImg
        })
        map.add(endMarker)
        // 点标记，结束图标
        const startMarker = new AMap.Marker({
          position: [start?.longitude, start?.latitude],
          icon: startImg
        })
        map.add(startMarker)
        // 开始规划
        driving.search(
          [start?.longitude, start?.latitude], // 起始坐标
          [end?.longitude, end?.latitude], // 终点坐标
          // 途经点
          {
            waypoints: logistics.value!.logisticsInfo.map((item) => [
              item.longitude,
              item.latitude
            ])
          },
          // 规划好之后的回调函数
          function () {
            // 点标记
            const marker = new AMap.Marker({
              icon: carImg,
              // 点标记在地图上显示的位置
              position: [
                logistics.value!.currentLocationInfo.longitude,
                logistics.value!.currentLocationInfo.latitude
              ],
              anchor: 'center' // 设置点标记锚点
            })
            map.add(marker)
            setTimeout(() => {
              map.setFitView([marker])
              map.setZoom(15)
            }, 3000)
          }
        )
      })
    })
    .catch(() => {})
})
</script>

<template>
  <div class="order-logistics-page" v-if="logistics">
    <!-- 物流状态 -->
    <div id="map">
      <div class="title">
        <van-icon name="arrow-left" @click="router.back()" />
        <span>{{ logistics.statusValue }}</span>
        <van-icon name="service" />
      </div>
      <div class="current">
        <p class="status">
          {{ logistics.statusValue }} 预计{{ logistics.estimatedTime }}送达
        </p>
        <p class="predict">
          <span>{{ logistics.name }}</span>
          <span>{{ logistics.awbNo }}</span>
        </p>
      </div>
    </div>

    <!-- 物流详情 -->
    <div class="logistics">
      <p class="title">物流详情</p>
      <!-- active激活的物流信息 -->
      <van-steps direction="vertical" :active="0">
        <van-step v-for="item in logistics.list" :key="item.id">
          <p class="status">{{ item.statusValue }}</p>
          <p class="content">{{ item.content }}</p>
          <p class="time">{{ item.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-logistics-page {
  --van-step-icon-size: 18px;
  --van-step-circle-size: 10px;
}

#map {
  height: 450px;
  background-color: var(--cp-bg);
  overflow: hidden;
  position: relative;

  .title {
    background-color: #fff;
    height: 46px;
    width: 355px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;
    position: absolute;
    left: 10px;
    top: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;

    > span {
      flex: 1;
      text-align: center;
    }

    .van-icon {
      font-size: 18px;
      color: #666;

      &:last-child {
        color: var(--cp-primary);
      }
    }
  }

  .current {
    height: 80px;
    border-radius: 4px;
    background-color: #fff;
    height: 80px;
    width: 355px;
    box-sizing: border-box;
    padding: 15px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;

    .status {
      font-size: 15px;
      line-height: 26px;
    }

    .predict {
      color: var(--cp-tip);
      font-size: 13px;
      margin-top: 5px;

      > span {
        padding-right: 10px;
      }
    }
  }
}

.logistics {
  padding: 0 10px 20px;

  .title {
    font-size: 16px;
    padding: 15px 5px 5px;
  }

  .van-steps {
    :deep(.van-step) {
      &::after {
        display: none;
      }
    }

    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }

    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }

    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>
