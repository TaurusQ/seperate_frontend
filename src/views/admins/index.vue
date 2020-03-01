<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="请输入用户名"
        style="width: 200px;"
        class="filter-item"
      />

      <el-input
        v-model="listQuery.remark"
        placeholder="请输入备注"
        style="width: 200px;"
        class="filter-item"
      />

      <el-select
        v-model="listQuery.status"
        placeholder="请选择用户状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in statusMap"
          :key="item.status_code"
          :label="item.status_description + '(' + item.status_code + ')'"
          :value="item.status_code"
        />
      </el-select>
    </div>

    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.created_at"
        align="right"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="创建开始日期"
        end-placeholder="创建结束日期"
        class="filter-item"
      >
      </el-date-picker>

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>

      <el-button class="filter-item" icon="el-icon-plus" @click="handleCreate">
        添加
      </el-button>

      <el-button
        class="filter-item"
        icon="el-icon-delete"
        type="danger"
        @click="handleBatchDelete"
      >
        删除选中
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :data="list"
      @selection-change="handleAllSelect"
    >
      <el-table-column type="selection" width="55"> </el-table-column>

      <!-- sortable="custom" :class-name="getSortClass('id')" -->
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <!-- username -->
      <el-table-column label="用户名" align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label="昵称" align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="描述" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" align="center" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>

      <!-- created-at -->
      <el-table-column label="创建时间" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新时间" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.updated_at }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <!-- <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button> -->
          <el-button
            v-if="row.id > 3"
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 创建/更新 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <!-- 这里的prop对应model的属性 -->
        <el-form-item label="用户名" prop="username" clearable>
          <el-input
            v-model="temp.username"
            :disabled="this.dialogStatus == 'update'"
          />
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
          clearable
          show-password
          v-show="this.dialogStatus == 'create'"
        >
          <el-input v-model="temp.password" />
        </el-form-item>

        <el-form-item label="昵称" prop="nickname" clearable>
          <el-input v-model="temp.nickname" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入描述"
            v-model="temp.description"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
            v-model="temp.textarea"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select
            v-model="temp.status"
            class="filter-item"
            placeholder="请选择状态"
          >
            <!-- 注意这里的value类型必须和list数据中的status数据类型保持一致 -->
            <el-option
              v-for="item in statusMap"
              :key="item.status_code"
              :label="item.status_description"
              :value="parseInt(item.status_code)"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  createAdmin,
  getDetail,
  updateAdmin,
  deleteAdmin,
  batchDeleteAdmin
} from "@/api/admin_list";
import { filterObjNullVal } from "@/utils/index";

import Pagination from "@/components/Pagination";

export default {
  name: "",
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        //title: undefined,
        type: undefined,
        // sort: "+id",

        // 筛选的属性
        username: undefined,
        status: undefined,
        created_at: undefined,
        updated_at: undefined
      },

      selectIds: [],

      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },

      temp: {
        id: undefined,
        username: undefined,
        password: undefined,
        nickname: undefined,
        avatar: undefined,
        description: undefined,
        remark: "",
        status: ""
      },

      statusMap: [],

      rules: {
        username: [
          { required: true, message: "用户名必须填写", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码必须填写", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      },

      /*** 日期选择器配置 */
      pickerOptions: {
        /*
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        */
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },

  components: {
    Pagination
  },
  created() {
    this.initDataMap();
    this.getList();
  },
  methods: {
    initDataMap() {
      const json = [
        { status_code: "1", status_description: "正常" },
        { status_code: "-1", status_description: "禁止" }
      ];

      // for(let i of json){
      //   console.log(i,json[i])
      //   this.statusMap[i.status_code] = i.status_description
      // }

      setTimeout(() => {
        this.statusMap = json;
      }, 2000);
    },

    // 获取列表数据
    getList() {
      this.listLoading = true;
      getList(this.listQuery).then(response => {
        this.list = response.data;
        console.log(this.list);
        this.total = response.meta.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    handleAllSelect(val) {
      this.selectIds = val;
      // 选中的id合集
      // console.log(this.selectIds.map(item => item.id))
    },

    // 重置缓存数据
    resetTemp() {
      this.temp = {
        id: undefined,
        username: undefined,
        password: undefined,
        nickname: undefined,
        avatar: undefined,
        description: undefined,
        remark: "",
        status: ""
      };

      this.rules.password[0].required = true;
    },

    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // 创建操作后，返回最新的数据，在数组中进行更新
          createAdmin(this.temp).then(response => {
            if (response.status == "success") {
              // this.list.push(this.temp);
              this.list.push(response.data);
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: response.message,
                type: "success",
                duration: 2000
              });
            }
          });
        }
      });
    },

    handleUpdate(data) {
      //console.log("update handle:"+JSON.stringify(data))
      this.temp = Object.assign({}, data);

      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          // 更新操作之后返回最新的数据
          updateAdmin(tempData.id, tempData).then(response => {
            //response
            const item = this.list.findIndex(v => v.id == this.temp.id);
            this.list.splice(item, 1, this.temp);
            this.$notify({
              title: "操作成功",
              message: response.message,
              type: "success",
              duration: 2000
            });
            this.dialogFormVisible = false;
          });
        }
      });
    },

    // 删除
    handleDelete(row, index) {
      // 进行删除操作
      //this.listLoading = true;

      this.$confirm("确认进行删除操作吗？")
        .then(_ => {
          deleteAdmin(row.id).then(response => {
            if (response.status == "success") {
              this.$notify({
                title: "操作成功",
                message: response.message,
                type: "success",
                duration: 2000
              });
              this.list.splice(index, 1);
            }
          });
        })
        .catch(_ => {});
    },

    handleBatchDelete() {
      this.$confirm("确认删除选中数据吗？").then(_ => {
        const ids = this.selectIds.map(item => item.id);
        batchDeleteAdmin({ ids: ids }).then(response => {
          if (response.status == "success") {
            this.$notify({
              title: "Success",
              message: response.message,
              type: "success",
              duration: 2000
            });
            this.list = this.list.filter(item => !ids.includes(item.id));
            // this.list =
            //this.list.splice(index, 1);
          }
        });
      });
    },

    // 进行数据筛选，重新请求数据
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    }
  },

  watch: {
    dialogStatus(val) {
      //console.log("dialogStatus的值是："+val);
      if (val == "create") {
        // 更新时不需要验证密码
        this.rules.password[0].required = true;
      } else if (val == "update") {
        // 更新时不需要验证密码
        this.rules.password[0].required = false;
      }
    }
  }
};
</script>
