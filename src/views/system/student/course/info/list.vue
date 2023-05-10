<template>
    <div class="app-container">
        <div class="app-container">
            <!--查询表单-->
            <div class="search-div">
                <el-form label-width="70px" size="small">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="课程名称">
                                <el-input style="width: 100%" v-model="searchObj.courseName" placeholder="课程名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="display:flex">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
                    </el-row>
                </el-form>
            </div>
            <!-- 表格 -->
            <el-table v-loading="listLoading" :data="course_list" stripe border style="width: 100%;margin-top: 10px;">

                <el-table-column label="序号" width="70" align="center">
                    <template slot-scope="scope">
                        {{ (page - 1) * limit + scope.$index + 1 }}
                    </template>
                </el-table-column>

                <el-table-column prop="courseName" label="课程名称" />
                <el-table-column prop="name" label="考试名称" />
                <el-table-column prop="teacherName" label="教师名称" />
                <el-table-column prop="examTime" label="考试时间" />
            </el-table>
            <!-- 分页组件 -->
            <el-pagination :current-page="page" :total="total" :page-size="limit"
                style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper"
                @current-change="fetchData" />
        </div>
    </div>
</template>
<script>
import api from '@/api/system/student'
export default {
    // 定义数据模型
    data() {
        return {
            course_list: [],
            listLoading: true,
            total: 0,
            page: 2,
            limit: 3,
            searchObj: {},
        }
    },
    //页面渲染之前获取数据
    created() {
        this.fetchData()
    },
    // 定义方法
    methods: {
        fetchData(page = 1) {
            this.listLoading = true;
            this.page = page;
            api.getCourseList(this.page, this.limit, this.searchObj).then(res => {
                this.listLoading = false;
                console.log(res.data)
                this.course_list = res.data.classList;
                this.total = res.data.total;
            });
        },
        // 重置表单
        resetData() {
            this.searchObj = {}
            this.fetchData()
        }
    }
}
</script>