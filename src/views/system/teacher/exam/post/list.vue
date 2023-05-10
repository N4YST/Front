<template>
    <div class="app-container">
        <!--查询表单-->
        <div class="search-div">
            <el-form label-width="70px" size="small">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-button type="primary" @click="handleAdd" size="medium">添加考试</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <!-- 表格 -->
        <el-table v-loading="listLoading" :data="examList" stripe border style="width: 100%;margin-top: 10px;">
            <el-table-column label="序号" width="70" align="center">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="paper_id" label="试卷id" />
            <el-table-column prop="start_time" label="开始时间" />
            <el-table-column prop="end_time" label="结束时间" />
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
                    <el-button type="danger" size="mini" @click="deleteExam(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 修改试卷 -->
        <el-dialog :visible.sync="updateVisible" width="50%" title="请选择试卷">

        </el-dialog>

        <!-- 打开试卷 -->
        <el-dialog :visible.sync="dialogVisible" width="50%">
            <el-form ref="form" :model="examObj" label-width="80px">
                <el-form-item label="考试名称">
                    <el-input type="textarea" v-model="examObj.name"></el-input>
                </el-form-item>
                <el-form-item label="试卷id">
                    <el-select v-model="examObj.paper_id" placeholder="请选择试卷">
                        <el-option v-for="item in paperList" :key="item.id" :value="item.id" >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker v-model="examObj.start_time" type="datetime" placeholder="选择开始时间"
                        value-format="yyyy-MM-dd hh:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker v-model="examObj.end_time" type="datetime" placeholder="选择结束时间"
                        value-format="yyyy-MM-dd hh:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addExam" v-if="type == 'add'">添加</el-button>
                    <el-button type="primary" @click="updateExam" v-else>修改</el-button>
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
            updateVisible: false,
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
            questionList: [],
            examList: [],
            examObj: {
                name: null,
                paper_id: null,
                start_time: null,
                end_time: null,
            },
            type: 'add',
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
            api.getExamList().then(res => {
                this.listLoading = false;
                this.examList = res.data;
            });
        },
        // 重置表单
        resetData() {
            this.searchObj.questionName = '';
            this.fetchData()
        },
        handleAdd() {
            this.dialogVisible = true;
            Object.keys(this.examObj).forEach(key => { this.examObj[key] = null });
            this.type = 'add';
            this.getPaperList();
        },
        addExam() {
            
            api.addExam(this.examObj).then(res => {
                if (res.code == 200) this.$message.success("添加成功！");
                this.dialogVisible = false;
                this.fetchData();
            });
        },
        handleUpdate(data) {
            console.log(data)
            this.dialogVisible = true;
            this.type = 'update';
            for (var key in data) this.examObj[key] = data[key];
            this.getPaperList();
        },
        updateExam() {
            api.updateExam(this.examObj).then(res => {
                if (res.code == 200) this.$message.success("修改成功！");
                this.dialogVisible = false;
                this.fetchData();
            });
        },
        deleteExam(data) {
            this.$confirm('确定要删除该题吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                for (var key in data) this.examObj[key] = data[key];
                api.deleteExam(this.examObj).then(res => {
                    if (res.code == 200) {
                        this.$message.success("删除成功！");
                        this.fetchData();
                    }
                });
            })
        },
        cancel() {
            this.dialogVisible = false;
        },
        getPaperList() {
            api.getPaperList().then(res => {
                console.log(res)
                this.paperList = res.data;
            });
        }
    }
}
</script>