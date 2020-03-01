<template>
  <div class="app-container">
    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="100px"
    >
      <el-form-item label="原始密码" prop="oldpassword">
        <el-col :span="11">
          <el-input
            v-model="formData.oldpassword"
            placeholder="请输入原始密码"
            clearable
            show-password
            :style="{ width: '100%' }"
          ></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="新密码" prop="password">
        <el-col :span="11">
          <el-input
            v-model="formData.password"
            placeholder="请输入新密码"
            clearable
            show-password
            :style="{ width: '100%' }"
          ></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="确认新密码" prop="password_confirmation">
        <el-col :span="11">
          <el-input
            v-model="formData.password_confirmation"
            placeholder="请再次输入新密码"
            clearable
            show-password
            :style="{ width: '100%' }"
          ></el-input>
        </el-col>
      </el-form-item>

      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { modify_password } from "@/api/admin";

export default {
  name: "ModifyPassword",
  components: {},
  props: [],
  data() {
    return {
      formData: {
        oldpassword: undefined,
        password: undefined,
        password_confirmation: undefined
      },
      rules: {
        oldpassword: [
          {
            required: true,
            message: "请输入原始密码",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur"
          }
        ],
        password_confirmation: [
          {
            required: true,
            message: "请再次输入新密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      this.$refs["elForm"].validate(valid => {
        if (!valid) return;

        modify_password(this.formData).then(response => {
          if (response.status == "success") {
            this.$notify({
              title: "操作成功",
              message: response.message,
              type: "success",
              duration: 2000
            });
            this.$refs["elForm"].resetFields();
          }
        });
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    }
  }
};
</script>
<style></style>
