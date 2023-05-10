<template>
    <div class="app-container">
        <!--查询表单-->
        <div class="search-div">
            <el-form label-width="70px" size="small">
                <el-row :gutter="20">
                    <el-col :span="7">
                        <span>课程：</span>
                        <el-select v-model="data.courseName" placeholder="请选择课程" @change="fetchData">
                            <el-option v-for="item in courseList" :key="item.courseName" :value="item.courseName">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="7">
                        <span>题型：</span>
                        <el-select v-model="data.type" placeholder="请选择题型" @change="choose">
                            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="10">
                        <el-button type="primary" @click="last()" :disabled="choice == 0">上一题</el-button>
                        <el-button type="primary" @click="next()" :disabled="choice == size-1">下一题</el-button>
                        <el-button type="primary" @click="showAnswer = !showAnswer" :disabled="questionList.length === 0">查看答案</el-button>
                        <el-button type="primary" @click="deleteExp" :disabled="questionList.length == 0">删除错题</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- 题目区域 -->
        <el-card shadow="never" class="box-card" v-loading="loading">
            <div v-if="size == 0">
                <h2>无错题</h2>
            </div>
            <div v-else>
                <div v-for="(question, index) in questionList" v-show="choice == index">
                    <h2>{{ question.title }}</h2>
                    <div v-if="question.type === 'xzt' || question.type === 'pdt'">
                        <el-radio v-model="question.choice" label="a">{{ question.a }}</el-radio>
                        <el-radio v-model="question.choice" label="b">{{ question.b }}</el-radio>
                        <el-radio v-model="question.choice" label="c" v-show="question.c">{{ question.c }}</el-radio>
                        <el-radio v-model="question.choice" label="d" v-show="question.d">{{ question.d }}</el-radio>
                    </div>
                    <div v-else>
                        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="question.choice"></el-input>
                    </div>
                    <div v-show="showAnswer" class="box-card">
                        <el-tag type="success"><span>答案：</span>{{ question.answer }}</el-tag>
                    </div>
                </div>

            </div>
        </el-card>
    </div>
</template>
<script>
import api from '@/api/system/student'
export default {
    // 定义数据模型
    data() {
        return {
            loading: true,
            typeList: [{
                value: 'xzt',
                label: '选择题'
            }, {
                value: 'pdt',
                label: '判断题'
            }, {
                value: 'tkt',
                label: '填空题'
            }, {
                value: 'zgt',
                label: '主观题'
            }],
            courseList: [],
            data: {
                type: "xzt",
                courseName: "",
            },
            questionList: [],
            choice: 0,
            showAnswer: false,
            size: 0,
        }
    },
    created() {
        this.getCourseList();
    },
    methods: {
        getCourseList() {
            api.getCourseList(1, 100, null).then(res => {
                res.data.classList.forEach(course => {
                    let flag = false;
                    this.courseList.forEach(item => {
                        if (item.courseName === course.courseName) flag = true;
                    });
                    if (!flag) this.courseList.push(course);
                });
                // this.courseList = res.data.classList.filter(course => !this.courseList.find(item => item.courseName === course.courseName));
                this.data.courseName = res.data.classList[0].courseName;
                this.fetchData();
            });
        },
        fetchData() {
            this.loading = true;
            api.getExpList(this.data).then(res => {
                this.loading = false;
                this.size = res.data.length ;
                if (this.size < 0) this.size = 0;
                this.questionList = res.data.sort(function () { return Math.random() > 0.5 ? -1 : 1; });
            });
        },
        choose(data) {
            this.data.type = data;
            this.fetchData();
        },
        last() {
            this.choice--;
            this.showAnswer = false;
        },
        next() {
            this.choice++;
            this.showAnswer = false;
        },
        deleteExp() {
            this.$confirm('确定要删除错题吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                api.deleteExp(this.questionList[this.choice]).then(res => {
                    if (res.code == 200) {
                        this.$message.success("删除成功！");
                        this.fetchData();
                    }
                });

            })
        }
    }
}
</script>
<style>
.box-card {
    margin-top: 20px;
}
</style>
