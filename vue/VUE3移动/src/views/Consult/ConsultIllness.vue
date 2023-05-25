<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
    <div class="illness-tip van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">
          请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助
        </p>
        <p class="safe">
          <cp-icon name="consult-safe" /><span>内容仅医生可见</span>
        </p>
      </div>
    </div>
    <div class="illness-form">
      <van-field
        rows="3"
        type="textarea"
        v-model="form.illnessDesc"
        placeholder="请详细描述您的病情，病情描述不能为空"
      />
      <div class="item">
        <p>本次患病多久了？</p>
        <cp-radio-btn :options="timeOptions" v-model="form.illnessTime" />
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <cp-radio-btn :options="flagOptions" v-model="form.consultFlag" />
      </div>
      <div class="illness-img">
        <van-uploader
          max-count="9"
          v-model="fileList"
          upload-text="上传图片"
          upload-icon="photo-o"
          @delete="onDeleteImg"
          :after-read="onAfterRead"
          :max-size="5 * 1024 * 1024"
        />
        <p class="tip" v-if="!fileList.length">
          上传内容仅医生可见,最多9张图,最大5MB
        </p>
      </div>
      <van-button
        type="primary"
        block
        round
        @click="next"
        size="small"
        :class="{ disabled }"
      >
        下一步
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConsultStore } from '@/stores'
import { uploadImageAPI } from '@/services/consult'
import type { ConsultIllness, Image } from '@/types/consult'
import { timeOptions, flagOptions } from '@/services/constants'
import type {
  UploaderAfterRead,
  UploaderFileListItem
} from 'vant/lib/uploader/types'
import { showConfirmDialog, showToast } from 'vant'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const store = useConsultStore()
const router = useRouter()

// 上传图片
// 表单数据
const form = ref<ConsultIllness>({
  illnessDesc: '',
  illnessTime: undefined,
  consultFlag: undefined,
  pictures: []
})
const fileList = ref<Image[]>([])
const onAfterRead: UploaderAfterRead = (item) => {
  if (Array.isArray(item)) return
  if (!item.file) return
  item.status = 'uploading'
  item.message = '上传中...'
  uploadImageAPI(item.file)
    .then((res) => {
      item.status = 'done'
      item.message = undefined
      item.url = res.data.url
      // 上传成功同步数据
      form.value.pictures?.push(res.data)
    })
    .catch(() => {
      item.status = 'failed'
      item.message = '上传失败'
    })
}
// 删除图片
const onDeleteImg = (item: UploaderFileListItem) =>
  (form.value.pictures = form.value.pictures?.filter(
    (pic) => pic.url !== item.url
  ))

// 下一步按钮灰色样式
const disabled = computed(
  () =>
    form.value.illnessTime === undefined ||
    form.value.consultFlag === undefined ||
    form.value.illnessDesc === ''
)
// 下一步
const next = () => {
  if (form.value.illnessDesc === '') return showToast('请输入病情描述')
  if (form.value.illnessTime === undefined)
    return showToast('请选择症状持续时间')
  if (form.value.consultFlag === undefined) return showToast('请选择是否就诊')
  store.setIllness(form.value)
  router.push('/user/patient?isChange=1')
}
// 数据回显
onMounted(() => {
  if (store.consult.illnessDesc) {
    showConfirmDialog({
      title: '温馨提示',
      message: '是否恢复您之前填写的病情信息呢？',
      // 页面回退时自动关闭了提示，不开启
      closeOnPopstate: false
    })
      .then(() => {
        const { illnessDesc, illnessTime, consultFlag, pictures } =
          store.consult
        form.value = { illnessDesc, illnessTime, consultFlag, pictures }
        if (pictures) fileList.value = pictures
      })
      .catch(() => {})
  }
})
</script>

<style lang="scss" scoped>
.consult-illness-page {
  padding-top: 46px;
}

.illness-tip {
  display: flex;
  padding: 15px;

  .img {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
  }

  .info {
    flex: 1;
    padding-left: 12px;

    .tit {
      font-size: 16px;
      margin-bottom: 5px;
    }

    .tip {
      padding: 12px;
      background: var(--cp-bg);
      color: var(--cp-text3);
      font-size: 13px;
      margin-bottom: 10px;
    }

    .safe {
      font-size: 10px;
      color: var(--cp-text3);
      display: flex;
      align-items: center;

      .cp-icon {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
}

.illness-form {
  padding: 15px;

  .van-field {
    padding: 0;

    &::after {
      border-bottom: none;
    }
  }

  .item {
    > p {
      color: var(--cp-text3);
      padding: 15px 0;
    }
  }
}

.illness-img {
  padding-top: 16px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;

  .tip {
    font-size: 12px;
    color: var(--cp-tip);
  }

  ::v-deep() {
    .van-uploader {
      &__preview {
        &-delete {
          left: -6px;
          top: -6px;
          border-radius: 50%;
          background-color: var(--cp-primary);
          width: 20px;
          height: 20px;

          &-icon {
            transform: scale(0.9) translate(-22%, 22%);
          }
        }

        &-image {
          border-radius: 8px;
          overflow: hidden;
        }
      }

      &__upload {
        border-radius: 8px;
      }

      &__upload-icon {
        color: var(--cp-text3);
      }
    }
  }
}

.van-button {
  font-size: 16px;
  margin-bottom: 30px;

  &.disabled {
    opacity: 1;
    background: #fafafa;
    color: #d9dbde;
    border: #fafafa;
  }
}
</style>
