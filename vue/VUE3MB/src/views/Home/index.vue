<template>
  <div class="home-page">
    <div class="home-header">
      <div class="con">
        <h1>优医</h1>
        <div class="search">
          <cp-icon name="home-search" />
          搜一搜：疾病/症状/医生/健康知识
        </div>
      </div>
    </div>

    <div class="home-navs">
      <!-- 栅格系统vant分成24等份 -->
      <van-row>
        <van-col span="8">
          <a href="javascript:;" class="nav">
            <cp-icon name="home-doctor" />
            <p class="title">问医生</p>
            <p class="desc">按科室查问医生</p>
          </a>
        </van-col>
        <van-col span="8">
          <router-link
            to="/consult/fast"
            class="nav"
            @click="store.setType(ConsultType.Fast)"
          >
            <cp-icon name="home-graphic" />
            <p class="title">极速问诊</p>
            <p class="desc">20s医生极速回复</p>
          </router-link>
        </van-col>
        <van-col span="8">
          <a href="javascript:;" class="nav">
            <cp-icon name="home-prescribe" />
            <p class="title">开药门诊</p>
            <p class="desc">线上买药更方便</p>
          </a>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="6">
          <a href="javascript:;" class="nav min">
            <cp-icon name="home-order" />
            <p class="title">药品订单</p>
          </a>
        </van-col>
        <van-col span="6">
          <a href="javascript:;" class="nav min">
            <cp-icon name="home-docs" />
            <p class="title">健康档案</p>
          </a>
        </van-col>
        <van-col span="6">
          <a href="javascript:;" class="nav min">
            <cp-icon name="home-rp" />
            <p class="title">我的处方</p>
          </a>
        </van-col>
        <van-col span="6">
          <a href="javascript:;" class="nav min">
            <cp-icon name="home-find" />
            <p class="title">疾病查询</p>
          </a>
        </van-col>
      </van-row>
    </div>

    <div class="home-banner">
      <van-swipe indicator-color="#fff">
        <van-swipe-item>
          <img src="@/assets/ad.png" />
        </van-swipe-item>
        <van-swipe-item>
          <img src="@/assets/ad.png" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <van-tabs shrink sticky v-model:active="active">
      <van-tab title="关注" name="like">
        <follow-doctor />
        <knowledge-list type="like" />
      </van-tab>
      <van-tab title="推荐" name="recommend">
        <knowledge-list type="recommend" />
      </van-tab>
      <van-tab title="减脂" name="fatReduction">
        <knowledge-list type="fatReduction" />
      </van-tab>
      <van-tab title="饮食" name="food">
        <knowledge-list type="food" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import type { KnowledgeType } from '@/types/consult'
import KnowledgeList from './components/KnowledgeList.vue'
import FollowDoctor from './components/FollowDoctor.vue'
import { useConsultStore } from '@/stores'
import { ConsultType } from '@/enums'
import { ref } from 'vue'

const store = useConsultStore()

// 在标签指定name属性的情况下，v-model:active的值为当前标签的name（此时无法通过索引值来匹配标签）
const active = ref<KnowledgeType>('recommend')
</script>

<style scoped lang="scss">
.home-page {
  padding-bottom: 50px;
}

.home-header {
  height: 100px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 90px;
    background: linear-gradient(180deg, rgba(62, 206, 197, 0.85), #26bcc6);
    border-bottom-left-radius: 150px 20px;
    border-bottom-right-radius: 150px 20px;
  }

  .con {
    position: relative;
    padding: 0 15px;

    > h1 {
      font-size: 18px;
      color: #fff;
      font-weight: normal;
      padding: 20px 0;
      line-height: 1;
      padding-left: 5px;
    }

    .search {
      height: 40px;
      border-radius: 20px;
      box-shadow: 0px 15px 22px -7px rgba(224, 236, 250, 0.8);
      background-color: #fff;
      display: flex;
      align-items: center;
      padding: 0 20px;
      color: var(--cp-dark);
      font-size: 13px;

      .cp-icon {
        font-size: 16px;
        margin-right: 5px;
      }
    }
  }
}

.home-navs {
  padding: 10px 15px 0 15px;

  .nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 0;

    .cp-icon {
      font-size: 48px;
    }

    .title {
      font-weight: 500;
      margin-top: 5px;
      color: var(--cp-text1);
    }

    .desc {
      font-size: 11px;
      color: var(--cp-tag);
      margin-top: 2px;
    }

    &.min {
      .cp-icon {
        font-size: 31px;
      }

      .title {
        font-size: 13px;
        color: var(--cp-text2);
        font-weight: normal;
      }
    }
  }
}

.home-banner {
  padding: 10px 15px;
  height: 100px;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
