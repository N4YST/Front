<template>
    <div class="app-container">
        <!--查询表单-->
        <div class="search-div">
            <el-form label-width="70px" size="small">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="考试名称">
                            <el-input style="width: 100%" v-model="searchObj.courseName" placeholder="考试名称"></el-input>
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
            <el-table-column prop="start_time" label="开考时间" />
            <el-table-column prop="time" label="考试时间" />
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <!-- <el-button type="primary" size="mini" @click="getPaperList(scope.row)">模拟考试</el-button> -->
                    <el-button type="danger" size="mini" @click="getPaperList(scope.row)">开始考试</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination :current-page="page" :total="total" :page-size="limit" style="padding: 30px 0; text-align: center;"
            layout="total, prev, pager, next, jumper" @current-change="fetchData" />

        <!-- 试卷组件 -->
        <el-dialog :title="courseName" :visible.sync="dialogVisible" width="70%" :before-close="sendPaper">
            <h2>剩余时间：{{ time }}分钟</h2>
            <div v-for="(question, index) in questionList" v-show="choice == index">
                <h3>{{ index + 1 }}、{{ question.title }}</h3>
                <div v-if="question.type === 'xzt' || question.type === 'pdt'">
                    <el-radio v-model="question.choice" label="a">{{ question.a }}</el-radio>
                    <el-radio v-model="question.choice" label="b">{{ question.b }}</el-radio>
                    <el-radio v-model="question.choice" label="c" v-show="question.c">{{ question.c }}</el-radio>
                    <el-radio v-model="question.choice" label="d" v-show="question.d">{{ question.d }}</el-radio>
                </div>
                <div v-else>
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="question.choice"></el-input>
                </div>
            </div>
            <span slot="footer">
                <el-button type="primary" @click="choice--" :disabled="choice == 0">上一题</el-button>
                <el-button type="primary" @click="choice++" v-if="choice != 16">下一题</el-button>
                <el-button type="danger" @click="sendPaper()" v-else>交卷</el-button>
            </span>
        </el-dialog>
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
            page: 1,
            limit: 3,

            searchObj: {},
            dialogVisible: false,
            courseName: "Error",
            name: "Error",
            questionList: [],
            time: 0,
            timer: null,
            choice: 0,
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
            api.getExamList(this.page, this.limit, this.searchObj).then(res => {
                this.listLoading = false;
                this.course_list = res.data.classList;
                this.total = res.data.total;
            });
        },
        // 重置表单
        resetData() {
            this.searchObj = {}
            this.fetchData()
        },
        getPaperList(row) {
            this.courseName = row.courseName;
            this.name = row.name;
            this.time = parseInt(row.time);
            this.timer = setInterval(() => {
                this.time--;
            }, 1000);
            let course = { courseName: this.courseName, name: this.name };
            api.getPaperList(course).then(res => {
                console.log(res.data)
                this.questionList = res.data;
                if (res.data.length == 0) {
                    this.$message.error("该科目还未出卷！");
                } else {
                    this.dialogVisible = true;
                }
            });
        },
        last() {
            this.choice--;
        },
        next() {
            this.choice++;
        },
        sendPaper() {
            this.$confirm('确定要交卷吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                let data = {
                    questionList: this.questionList,
                    name: this.name,
                };
                api.sendPaper(data).then(res => {
                    this.$message({
                        type: 'success',
                        message: '交卷成功!',
                    })
                });
                clearInterval(this.timer);
                this.dialogVisible = false;
                this.questionList = [];
                this.fetchData();
            });
        }
    }
}
</script>