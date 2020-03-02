<template>
  <div class="app-container">
    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="100px"
    >
      <el-form-item label="昵称" prop="nickname">
        <el-col :span="11">
          <el-input
            v-model="formData.nickname"
            placeholder="请输入昵称"
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="个人描述" prop="description">
        <el-col :span="11">
          <el-input
            v-model="formData.description"
            placeholder="请输入个人描述"
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="用户头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="123"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { modify_info, avatar_upload, getInfo } from "@/api/admin";

export default {
  name: "ModifyInfo",
  components: {},
  props: [],
  data() {
    return {
      //avatarUrl:undefined,
      formData: {
        nickname: undefined,
        description: undefined,
        avatar: undefined
      },

      oldData:{},

      rules: {
        nickname: [
          {
            required: true,
            message: "请输入昵称",
            trigger: "blur"
          }
        ],
        description: [
          {
            required: false,
            message: "请输入个人描述",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {},
  watch: {},
  async created() {
    this.getAdminInfo()
  },
  mounted() {
  },
  methods: {
    getAdminInfo() {
     
      getInfo().then(response => {
        if(response.status == "success"){
          this.formData = Object.assign({},response.data)
        }
      })
    },

    submitForm() {
      this.$refs["elForm"].validate(valid => {
        if (!valid) return;

        modify_info(this.formData).then(response => {
          if (response.status == "success") {
            this.$notify({
              title: "操作成功",
              message: response.message,
              type: "success",
              duration: 2000
            });
            // this.$refs["elForm"].resetFields();
          }
        });
      });
    },
    beforeAvatarUpload(file) {
      let fd = new FormData();
      fd.append("file", file); //传文件
      avatar_upload(fd).then(response => {
        if (response.status == "success") {
          this.$notify({
            title: "操作成功",
            message: response.message,
            type: "success",
            duration: 2000
          });
          console.log(response.data);
          this.formData.avatar = response.data.url;
          return true;
        }
        return false;
      });
    },
    handleAvatarSuccess() {},
    resetForm() {
      this.$refs["elForm"].resetFields();
    }
  }
};
</script>

<style>
/* 这里加上scoped会没有css效果 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
