<template>
    <div class="app-container">
        <!--查询表单-->
        <div class="search-div">
            <el-form :inline="true">
                <el-form-item label="题目名称">
                    <el-input v-model="searchObj.questionName" placeholder="题目名称"></el-input>
                </el-form-item>
                <el-form-item label="题型">
                    <el-select v-model="searchObj.questionType" placeholder="请选择题型" @change="choose">
                        <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="fetchData()" size="medium">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetData" size="medium">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" size="medium">添加题目</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 表格 -->
        <el-table v-loading="listLoading" :data="questionList" stripe border style="width: 100%;margin-top: 10px;">

            <el-table-column label="序号" width="70" align="center">
                <template slot-scope="scope">
                    {{ (page - 1) * limit + scope.$index + 1 }}
                </template>
            </el-table-column>

            <el-table-column prop="id" label="题目id" />
            <el-table-column prop="title" label="题目" />
            <el-table-column prop="a" label="选项A"
                v-if="searchObj.questionType == 'xzt' || searchObj.questionType == 'pdt'" />
            <el-table-column prop="b" label="选项B"
                v-if="searchObj.questionType == 'xzt' || searchObj.questionType == 'pdt'" />
            <el-table-column prop="c" label="选项C" v-if="searchObj.questionType == 'xzt'" />
            <el-table-column prop="d" label="选项D" v-if="searchObj.questionType == 'xzt'" />
            <el-table-column prop="answer" label="答案" />
            <el-table-column prop="score" label="分值" />
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
                    <el-button type="danger" size="mini" @click="deleteQuestion(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination :current-page="page" :total="total" :page-size="limit" style="padding: 30px 0; text-align: center;"
            layout="total, prev, pager, next, jumper" @current-change="fetchData" />

        <!-- 添加题目 -->
        <el-dialog :visible.sync="dialogVisible" width="50%">
            <el-form ref="form" :model="questionObj" label-width="80px">
                <el-form-item label="题目">
                    <el-input type="textarea" v-model="questionObj.title"></el-input>
                </el-form-item>
                <el-form-item label="题型" v-if="type == 'add'">
                    <el-select v-model="questionObj.type" placeholder="请选择题型">
                        <el-option label="选择题" value="xzt"></el-option>
                        <el-option label="判断题" value="pdt"></el-option>
                        <el-option label="填空题" value="tkt"></el-option>
                        <el-option label="主观题" value="zgt"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选项A" v-show="questionObj.type == 'xzt' || questionObj.type == 'pdt'">
                    <el-input v-model="questionObj.a"></el-input>
                </el-form-item>
                <el-form-item label="选项B" v-show="questionObj.type == 'xzt' || questionObj.type == 'pdt'">
                    <el-input v-model="questionObj.b"></el-input>
                </el-form-item>
                <el-form-item label="选项C" v-show="questionObj.type == 'xzt'">
                    <el-input v-model="questionObj.c"></el-input>
                </el-form-item>
                <el-form-item label="选项D" v-show="questionObj.type == 'xzt'">
                    <el-input v-model="questionObj.d"></el-input>
                </el-form-item>
                <el-form-item label="答案">
                    <el-input v-model="questionObj.answer"></el-input>
                </el-form-item>
                <el-form-item label="分值">
                    <el-input v-model="questionObj.score"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addQuestion" v-if="type == 'add'">添加</el-button>
                    <el-button type="primary" @click="updateQuestion" v-else>修改</el-button>
                    <el-button @click="cancel">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import api from '@/api/system/teacher'
export default {
    // 定义数据模型
    data() {
        return {
            listLoading: true,
            total: 0,
            page: 1,
            limit: 5,

            dialogVisible: false,

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
            questionList: [],
            searchObj: {
                questionType: 'xzt',
                questionName: '',
            },
            questionObj: {
                type: 'xzt',
                id: null,
                a: null,
                b: null,
                c: null,
                d: null,
                title: null,
                course_id: null,
                score: null,
                answer: null,
            },
            type: '',
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
            api.getQuestionList(this.page, this.limit, this.searchObj).then(res => {
                this.listLoading = false;
                this.questionList = res.data.questionList;
                this.total = res.data.total;
            });
        },
        // 重置表单
        resetData() {
            this.searchObj.questionName = '';
            this.fetchData()
        },
        handleAdd() {
            this.dialogVisible = true;
            Object.keys(this.questionObj).forEach(key => { this.questionObj[key] = '' });
            this.questionObj.type = this.searchObj.questionType;
            this.type = 'add';
        },
        addQuestion() {
            api.addQuestion(this.questionObj).then(res => {
                if (res.code == 200) this.$message.success("添加成功！");
                this.dialogVisible = false;
                this.fetchData();
            });
        },
        choose() {
            this.questionObj.type = this.searchObj.questionType;
            this.fetchData();
        },
        handleUpdate(data) {
            this.dialogVisible = true;
            this.type = 'update';
            for (var key in data) this.questionObj[key] = data[key];
            this.questionObj.type = this.searchObj.questionType;
        },
        updateQuestion() {
            api.updateQuestion(this.questionObj).then(res => {
                this.listLoading = false;
                this.dialogVisible = false;
                this.fetchData();
                if (res.code == 200) this.$message.success("修改成功！");
            });
        },
        deleteQuestion(data) {
            this.$confirm('确定要删除该题吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                for (var key in data) this.questionObj[key] = data[key];
                api.deleteQuestion(this.questionObj).then(res => {
                    if (res.code == 200) {
                        this.$message.success("删除成功！");
                        this.fetchData();
                    }
                });
            })
        },
        cancel() {
            this.dialogVisible = false;
        }
    }
}
</script>