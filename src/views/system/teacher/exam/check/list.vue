<template>
    <div class="app-container">
        <!--查询表单-->
        <div class="search-div">
            <el-form :inline="true">
                <el-form-item label="考试">
                    <el-select v-model="getAnswerListObj.paper_id" placeholder="请选择考试" @change="choose()">
                        <el-option v-for="item in examList" :key="item.id" :label="item.name" :value="item.paper_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学生">
                    <el-select v-model="getAnswerListObj.id" placeholder="请选择学生" @change="choose()">
                        <el-option v-for="item in stuList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="总分">
                    {{ grade }}
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="choice--" :disabled="choice == 0" size="medium">上一题</el-button>
                    <el-button type="primary" @click="choice++" :disabled="choice == questionList.length || choice == 16"
                        size="medium">下一题</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="save()" size="medium">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-if="questionList.length != 0">
            <div v-for="(question, index) in questionList" v-show="choice == index">
                <el-card shadow="never">
                    <h3>{{ index + 1 }}、{{ question.question.title }}</h3>
                    <div v-if="question.question_type === 'xzt' || question.question_type === 'pdt'">
                        <el-radio v-model="question.choice" label="a">{{ question.question.a }}</el-radio>
                        <el-radio v-model="question.choice" label="b">{{ question.question.b }}</el-radio>
                        <el-radio v-model="question.choice" label="c" v-show="question.question.c">{{ question.question.c
                        }}</el-radio>
                        <el-radio v-model="question.choice" label="d" v-show="question.question.d">{{ question.question.d
                        }}</el-radio>
                    </div>
                    <div v-else>
                        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="question.choice"></el-input>
                    </div>

                </el-card>
                <el-form>
                    <el-form-item label="参考答案">
                        <span> {{ question.answer }} </span>
                    </el-form-item>
                    <el-form-item label="学生答案">
                        <span> {{ question.choice }} </span>
                    </el-form-item>
                    <el-form-item label="分值">
                        <span> {{ question.score }} </span>
                    </el-form-item>
                    <el-form-item label="得分">
                        <el-input style="width: 150px;" placeholder="请输入分数" v-model="question.grade"
                            @blur="getGrade()"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div v-else>
            <h1>该学生未考试！</h1>
        </div>
    </div>
</template>
<script>
import api from '@/api/system/teacher'
export default {
    // 定义数据模型
    data() {
        return {
            examList: [],
            stuList: [],
            getAnswerListObj: {
                paper_id: null,
                id: null,
            },
            grade: 0,
            choice: 0,
            questionList: [],
        }
    },
    //页面渲染之前获取数据
    created() {
        this.fetchData()
    },
    // 定义方法
    methods: {
        fetchData() {
            api.getExamList().then(res => {
                this.examList = res.data;
                this.getAnswerListObj.paper_id = this.examList[0].paper_id;
                api.getStuList().then(res => {
                    this.stuList = res.data;
                    this.getAnswerListObj.id = this.stuList[0].id;
                    this.choose();
                });
            });
        },
        choose() {
            this.choice = 0;
            api.getAnswerList(this.getAnswerListObj).then(res => {
                this.questionList = res.data
                this.getGrade();
            });
        },
        save() {
            let checkObj = {
                questionList: this.questionList,
                name: null,
            };
            api.checkAnswer(checkObj).then(res => { if (res.code == 200) this.$message.success("保存成功！"); });
            this.fetchData();
        },
        getGrade() {
            let sum = 0;
            this.questionList.forEach(question => {
                if(typeof (question.grade) === 'string') sum += parseInt(question.grade)
            });
            this.grade = sum;
        }
    }
}
</script>