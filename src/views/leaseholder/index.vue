<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.name" type="text" :min="1" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter">
        <template slot="prepend">姓名</template>
      </el-input>
      <el-input v-model.number="listQuery.phone" type="number" :min="1" placeholder="手机号" style="width: 250px;" class="filter-item" @keyup.enter.native="handleFilter">
        <template slot="prepend">电话号码</template>
      </el-input>
      <el-input v-model.trim="listQuery.idNumber" :min="1" placeholder="证件号码" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter">
        <template slot="prepend">证件号码</template>
      </el-input>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button> -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
      @filter-change="filterHanderChange"
    >
      <el-table-column label="ID" type="index" align="center" width="70" />
      <el-table-column label="姓名" prop="name" column-key="name" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex" column-key="sex" width="100px" align="center" :filter-multiple="false" :filter-method="filterSex" :filters="sexList" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.sex === 1 ? 'success' : ''" close-transition>{{ scope.row.sex ===1 ? '男' : '女' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="电话号码" prop="phone" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="证件类型" prop="idType" column-key="idType" width="110px" align="center" :filter-method="filterIdType" :filters="idTypeList" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag type="success" close-transition>{{ scope.row.idType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="证件号码" prop="idNumber" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.idNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="isLive" column-key="isLive" width="110px" align="center" :filter-multiple="false" :filter-method="filterIsLive" :filters="isLiveList" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" :content="scope.row.isLive === 1 ? '已入住' : '未入住' " placement="right">
            <el-button :disabled="scope.row.isLive === 1" :type="scope.row.isLive === 1 ? 'success' : 'info'" size="mini" close-transition>{{ scope.row.isLive===0 ? '未入住' : '已入住' }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteDate(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页插件 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 添加与修改 -->
    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="公寓户型" prop="houseType">
          <el-select v-model="temp.houseType" placeholder="请选择或输入" filterable allow-create default-first-option clearable>
            <el-option v-for="item in houseTypeList" :key="item.text" :label="item.text" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="公寓面积" prop="roomArea">
          <el-input v-model="temp.roomArea" type="number" :min="1" placeholder="请输入面积(平方米)" />
        </el-form-item>
        <el-form-item label="公寓朝向" prop="face">
          <el-select v-model="temp.face" placeholder="请选择或输入" filterable allow-create default-first-option clearable>
            <el-option v-for="item in faceList" :key="item.text" :label="item.text" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="标价(￥)" prop="price">
          <el-input v-model="temp.price" type="number" :min="1" placeholder="请输入对外标价(元)" />
        </el-form-item>
        <el-form-item label="支付模式" prop="pattern">
          <el-select v-model="temp.pattern" placeholder="请选择或输入" filterable allow-create default-first-option clearable>
            <el-option v-for="item in patternList" :key="item.text" :label="item.text" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model.trim="temp.address" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入公寓地址" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ dialogStatus==='create'? '确认添加' : '确认修改' }}
        </el-button>
      </div>
    </el-dialog> -->
    <!-- 租户信息添加与修改 -->
    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogUserVisible">
      <el-form ref="userForm" :model="userinfo" label-position="center" label-width="37%" style="width: 100%;">
        <el-form-item label="请选择租户:" prop="name">
          <el-select v-model="userinfo" :remote="true" placeholder="请输入租户姓名" :remote-method="getUserList" :loading.sync="userListLoading" clearable filterable>
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">ID:{{ item.idNumber }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table v-if="userinfo!=null" :data="[userinfo]" border fit highlight-current-row style="width: 100%; margin-top:30px;">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="租户ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="租户姓名">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="租户性别">
                <span>{{ props.row.sex===0?'女':'男' }}</span>
              </el-form-item>
              <el-form-item label="证件类型">
                <span>{{ props.row.idType }}</span>
              </el-form-item>
              <el-form-item label="证件号码">
                <span>{{ props.row.idNumber }}</span>
              </el-form-item>
              <el-form-item label="租住状态">
                <span>{{ props.row.isLive===0?'未租住':'已租住' }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="租户ID" />
        <el-table-column prop="name" label="租户姓名" />
        <el-table-column prop="phone" label="租户手机号" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <el-button size="mini" type="danger" @click="userinfo=null">
            删除
          </el-button>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='usercreate'?insertUserData():updateUserData()">
          {{ dialogStatus === 'usercreate' ? '确认添加' : '确认修改' }}
        </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { patternList, createApartment, updateApartment, deleteApartment } from '@/api/apartment'
import { userInfoList, userInfoById, userList } from '@/api/apartmentuser'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      isLiveList: [
        { text: '已入住', value: 1 },
        { text: '未入住', value: 0 }
      ],
      sexList: [
        { text: '男', value: 1 },
        { text: '女', value: 2 }
      ],
      idTypeList: null,
      userList: null,
      userListLoading: false,
      userinfo: {
        id: null,
        name: null,
        sex: null,
        phone: '',
        idNumber: '',
        idType: '',
        isLive: null
      },
      tableKey: 0,
      list: null,
      total: 1,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        id: null,
        name: null,
        sex: 0,
        phone: null,
        idNumber: null,
        idType: null,
        isLive: null
      },
      temp: {
        id: null,
        name: null,
        sex: null,
        phone: null,
        idNumber: null,
        idType: null,
        isLive: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        usercreate: '添加公寓租户信息',
        userupdate: '修改公寓租户信息',
        update: '修改公寓信息',
        create: '添加公寓信息'
      },
      dialogUserVisible: false,
      rules: {
        roomArea: [{ required: true, message: '公寓面积必填', trigger: 'blur' }],
        houseType: [{ required: true, message: '公寓户型必填', trigger: 'change' }],
        type: [{ required: true, message: '公寓朝向必填', trigger: 'change' }],
        face: [{ required: true, message: '公寓朝向必填', trigger: 'change' }],
        pattern: [{ required: true, message: '公寓支付模式必填', trigger: 'change' }],
        address: [{ required: true, message: '公寓地址必填', trigger: 'blur' }],
        price: [{ required: true, message: '公寓对外标价必填', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getIdTypeList()
  },
  methods: {
    // 获取租户的数据
    getList() {
      this.listLoading = true
      userList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 判断是新增租户还是修改租户
    handleUserData(row) {
      if (row.status === 1) {
        this.dialogStatus = 'userupdate'
        this.dialogUserVisible = true
        this.temp = Object.assign({}, row) // copy obj
        userInfoById(this.temp.userid).then((response) => {
          this.userinfo = response.data
        })
      } else {
        this.userinfo = null
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'usercreate'
        this.dialogUserVisible = true
      }
    },
    // 获取所有租户
    getUserList(query) {
      this.userListLoading = true
      userInfoList(query).then((response) => {
        this.userList = response.data
        this.userListLoading = false
      })
    },
    // 为公寓添加租户
    insertUserData() {
      if (this.userinfo != null) {
        this.temp.userid = this.userinfo.id
        this.temp.status = 1
        updateApartment(this.temp).then((response) => {
          const result = response.data
          if (result) {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                // 替换数据
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogUserVisible = false
            this.$notify({
              title: '成功',
              message: '添加租户成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: '添加租户失败',
              type: 'error',
              duration: 2000
            })
          }
        })
      } else {
        this.$notify({
          title: '信息',
          message: '您未做添加',
          type: 'info',
          duration: 2000
        })
      }
    },
    // 为公寓修改或删除租户
    updateUserData() {
      if (this.userinfo === null) {
        this.temp.userid = null
        this.temp.status = 0
      } else {
        this.temp.userid = this.userinfo.id
      }
      updateApartment(this.temp).then((response) => {
        const result = response.data
        if (result) {
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.temp)
              break
            }
          }
          this.dialogUserVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '更新失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    // 获取证件类型所有类型
    getIdTypeList() {
      patternList().then(response => {
        this.idTypeList = response.data
      })
    },
    // 过滤公寓状态类型
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: null,
        name: null,
        sex: null,
        phone: null,
        idNumber: null,
        idType: null,
        isLive: null
      }
    },
    // 添加公寓信息
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加公寓信息
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createApartment(this.temp).then((response) => {
            const result = response.data
            if (result) {
              this.total++
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '添加失败',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 修改公寓信息
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改公寓信息
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateApartment(this.temp).then((response) => {
            const result = response.data
            if (result) {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '更新失败',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 删除公寓信息
    deleteDate(row) {
      deleteApartment(row.id).then((response) => {
        const result = response.data
        if (result) {
          for (const v of this.list) {
            if (v.id === row.id) {
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
              break
            }
          }
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const data = this.formatJson(filterVal, this.list)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: 'table-list'
    //     })
    //     this.downloadLoading = false
    //   })
    // },
    // 未使用
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    // 入住状态过滤
    filterIsLive(value, row) {
      return row.isLive === value
    },
    // 证件类型过滤
    filterIdType(value, row) {
      return row.idType === value
    },
    // 性别过滤
    filterSex(value, row) {
      return row.sex === value
    },
    // 户型过滤
    filterHouseType(value, row) {
      return row.houseType === value
    },
    // 过滤条件改变时触发
    filterHanderChange(filters) {
      if (filters.pattern !== undefined) {
        if (filters.pattern.length >= 1) {
          this.listQuery.patternSet = []
          for (var i in filters.pattern) {
            this.listQuery.patternSet.push(filters.pattern[i])
          }
        } else {
          this.listQuery.patternSet = null
        }
      } else if (filters.face !== undefined) {
        if (filters.face.length >= 1) {
          this.listQuery.faceSet = []
          for (var j in filters.face) {
            this.listQuery.faceSet.push(filters.face[j])
          }
        } else {
          this.listQuery.faceSet = null
        }
      } else if (filters.houseType !== undefined) {
        if (filters.houseType.length >= 1) {
          this.listQuery.houseTypeSet = []
          for (var m in filters.houseType) {
            this.listQuery.houseTypeSet.push(filters.houseType[m])
          }
        } else {
          this.listQuery.houseTypeSet = null
        }
      } else if (filters.status !== undefined) {
        if (filters.status.length >= 1) {
          this.listQuery.statusSet = []
          for (var n in filters.status) {
            this.listQuery.statusSet.push(filters.status[n])
          }
        } else {
          this.listQuery.statusSet = null
        }
      }
      this.getList()
    }
  }
}
</script>
<style scoped>
  .filter-container {
    padding-bottom: 20px;
  }
</style>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
