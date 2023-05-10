<template>
    <div class="app-container">
        <!--查询表单-->
        <div class="search-div">
            <el-form :inline="true">
                <el-form-item label="试卷">
                    <el-select v-model="paperId" placeholder="请选择试卷" @change="choosePaper()">
                        <el-option v-for="item in paperList" :key="item.id" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="题型">
                    <el-select v-model="defaultQestionType" placeholder="请选择题型" @change="choose">
                        <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd()" size="medium">添加试卷</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleUpdate()" size="medium">修改试卷</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="deletePaper()" size="medium">删除试卷</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 表格 -->
        <el-table v-loading="listLoading" :data="chooseQuestionList" stripe border style="width: 100%;margin-top: 10px;">
            <el-table-column label="序号" width="70" align="center">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="id" label="题目id" />
            <el-table-column prop="title" label="题目" />
            <el-table-column prop="a" label="选项A" v-if="chooseQuestionType == 'xzt' || chooseQuestionType == 'pdt'" />
            <el-table-column prop="b" label="选项B" v-if="chooseQuestionType == 'xzt' || chooseQuestionType == 'pdt'" />
            <el-table-column prop="c" label="选项C" v-if="chooseQuestionType == 'xzt'" />
            <el-table-column prop="d" label="选项D" v-if="chooseQuestionType == 'xzt'" />
            <el-table-column prop="answer" label="答案" />
            <el-table-column prop="score" label="分值" />
        </el-table>


        <!-- 添加题目 -->
        <el-dialog :visible.sync="dialogVisible" width="50%">
            <el-form ref="form" :model="paperObj" label-width="80px">
                <el-form-item label="第一道选择题id" label-width="120px">
                    <el-input v-model="paperObj.xzt_id_1"></el-input>
                </el-form-item>
                <el-form-item label="第二道选择题id" label-width="120px">
                    <el-input v-model="paperObj.xzt_id_2"></el-input>
                </el-form-item>
                <el-form-item label="第三道选择题id" label-width="120px">
                    <el-input v-model="paperObj.xzt_id_3"></el-input>
                </el-form-item>
                <el-form-item label="第四道选择题id" label-width="120px">
                    <el-input v-model="paperObj.xzt_id_4"></el-input>
                </el-form-item>
                <el-form-item label="第五道选择题id" label-width="120px">
                    <el-input v-model="paperObj.xzt_id_5"></el-input>
                </el-form-item>
                <el-form-item label="第一道判断题id" label-width="120px">
                    <el-input v-model="paperObj.pdt_id_1"></el-input>
                </el-form-item>
                <el-form-item label="第二道判断题id" label-width="120px">
                    <el-input v-model="paperObj.pdt_id_2"></el-input>
                </el-form-item>
                <el-form-item label="第三道判断题id" label-width="120px">
                    <el-input v-model="paperObj.pdt_id_3"></el-input>
                </el-form-item>
                <el-form-item label="第四道判断题id" label-width="120px">
                    <el-input v-model="paperObj.pdt_id_4"></el-input>
                </el-form-item>
                <el-form-item label="第五道判断题id" label-width="120px">
                    <el-input v-model="paperObj.pdt_id_5"></el-input>
                </el-form-item>
                <el-form-item label="第一道填空题id" label-width="120px">
                    <el-input v-model="paperObj.tkt_id_1"></el-input>
                </el-form-item>
                <el-form-item label="第二道填空题id" label-width="120px">
                    <el-input v-model="paperObj.tkt_id_2"></el-input>
                </el-form-item>
                <el-form-item label="第三道填空题id" label-width="120px">
                    <el-input v-model="paperObj.tkt_id_3"></el-input>
                </el-form-item>
                <el-form-item label="第四道填空题id" label-width="120px">
                    <el-input v-model="paperObj.tkt_id_4"></el-input>
                </el-form-item>
                <el-form-item label="第五道填空题id" label-width="120px">
                    <el-input v-model="paperObj.tkt_id_5"></el-input>
                </el-form-item>
                <el-form-item label="第一道主观题id" label-width="120px">
                    <el-input v-model="paperObj.zgt_id_1"></el-input>
                </el-form-item>
                <el-form-item label="第二道主观题id" label-width="120px">
                    <el-input v-model="paperObj.zgt_id_2"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addPaper" v-if="type == 'add'">添加</el-button>
                    <el-button type="primary" @click="updatePaper" v-else>修改</el-button>
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
            paperList: [],
            paperObj:
            {
                xzt_id_1: null,
                xzt_id_2: null,
                xzt_id_3: null,
                xzt_id_4: null,
                xzt_id_5: null,

                pdt_id_1: null,
                pdt_id_2: null,
                pdt_id_3: null,
                pdt_id_4: null,
                pdt_id_5: null,

                tkt_id_1: null,
                tkt_id_2: null,
                tkt_id_3: null,
                tkt_id_4: null,
                tkt_id_5: null,

                zgt_id_1: null,
                zgt_id_2: null,
            },
            questionList: [],//paper question list
            chooseQuestionList: [],//type of all questions
            chooseQuestionType: 'xzt',
            type: '',
            defaultQestionType: 'xzt',
            paperId: null,

            questionObj: {
                questionName: null,
                questionType: 'xzt',
            },
            allQuestionList: [],
            allListLoading: false,
            total: 0,
            page: 1,
            limit: 10,

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
            api.getPaperList().then(res => {
                this.paperList = res.data;
                this.paperId = res.data[0].id;
                this.choosePaper();
                this.listLoading = false;
            });
        },

        getAllQuestionList(page = 1) {
            this.allListLoading = true;
            this.page = page;
            api.getQuestionList(this.page, this.limit, questionObj).then(res => {
                this.allQuestionList = res.data;
                this.allListLoading = false;
            });
        },

        // 切换试卷id
        choosePaper() {
            this.listLoading = true;
            api.getPaperQuestion(this.paperList.filter(paper => paper.id === this.paperId)[0]).then(res => {
                this.questionList = res.data;
                this.resetData();
                this.listLoading = false;
            });
        },
        // 切换类型
        choose(type) {
            this.chooseQuestionType = type;
            this.resetData();
        },
        // 根据类型过滤题目
        resetData() {
            this.listLoading = true;
            this.chooseQuestionList = this.questionList.filter(question => question.type === this.chooseQuestionType);
            this.listLoading = false;
        },

        handleAdd() {
            this.dialogVisible = true;
            this.type = 'add';
            Object.keys(this.paperObj).forEach(key => { this.paperObj[key] = null });
        },
        handleUpdate() {
            this.dialogVisible = true;
            this.type = 'update';
            for (var key in this.paperList.filter(paper => paper.id === this.paperId)[0]) this.paperObj[key] = this.paperList.filter(paper => paper.id === this.paperId)[0][key];
        },

        addPaper() {
            api.addPaper(this.paperObj).then(res => {
                if (res.code == 200) {
                    this.$message.success("添加成功！");
                    this.fetchData();
                    this.dialogVisible = false;
                }
            });
        },
        updatePaper() {
            api.updatePaper(this.paperObj).then(res => {
                if (res.code == 200) {
                    this.$message.success("添加成功！");
                    this.fetchData();
                    this.dialogVisible = false;
                }
            });
        },
        deletePaper() {
            this.$confirm('确定要删除该试卷吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                api.deletePaper(this.paperList.filter(paper => paper.id === this.paperId)[0]).then(res => {
                    if (res.code == 200) {
                        this.$message.success("删除成功！");
                        this.fetchData();
                        this.dialogVisible = false;
                    }
                });
            })
        },

        cancel() {
            this.allListLoading = false;
        }
    }
}
</script>