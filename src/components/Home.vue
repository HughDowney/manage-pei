<template>
  <div class="basic-layout">
    <!-- 左侧 -->
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- logo -->
      <div class="logo">
        <img src="../assets/logo.png" alt="" />
        <span>Manager</span>
      </div>

      <!-- menu -->
      <el-menu default-active="2" class="nav-menu" background-color="#001529" text-color="#fff" :collapse="isCollapse" router>
        <tree-menu :userMenu="userMenu"></tree-menu>
      </el-menu>
    </div>

    <!-- 右侧 -->
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <!-- 顶部 -->
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <i class="el-icon-s-fold"></i>
          </div>
          <div class="bread">面包屑</div>
        </div>
        <div class="user-info">
          <el-badge :is-dot="noticeCount > 0 ? true : false" class="notice" type="danger">
            <i class="el-icon-bell"></i>
          </el-badge>

          <!-- 下拉菜单 -->
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱：{{ userInfo.userEmail }}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <!-- 内容 -->
      <div class="wrapper">
        <div class="main-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TreeMenu from './TreeMenu.vue'

export default {
  name: 'home',
  data() {
    return {
      userInfo: this.$store.state.userInfo,
      isCollapse: false,
      noticeCount: 0,
      userMenu: []
    }
  },
  components: {
    TreeMenu
  },
  mounted() {
    this.getNoticeCount()
    this.getMenuList()
  },
  methods: {
    handleLogout(key) {
      if (key === 'email') return
      this.$store.commit('saveUserInfo', '')
      this.userInfo = null
      this.$router.push('/login')
    },
    toggle() {
      this.isCollapse = !this.isCollapse
    },
    // 获取待审批数量
    async getNoticeCount() {
      const res = await this.$api.noticeCount()
      this.noticeCount = res
    },
    // 获取菜单列表
    async getMenuList() {
      const res = await this.$api.menuList()
      this.userMenu = res
    }
  }
}
</script>

<style lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    // overflow-y: auto;
    transition: width 0.5s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
    // 合并
    &.fold {
      width: 64px;
    }
    // 展开
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    // 合并
    &.fold {
      margin-left: 64px;
    }
    // 展开
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
        }
        z-index: 10;
      }
      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 15px;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        background: #fff;
        height: 100%;
      }
    }
  }
}
</style>
