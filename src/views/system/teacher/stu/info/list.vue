<template>
    <div class="app-container">
        <!-- 表格 -->
        <el-table v-loading="listLoading" :data="stuList" stripe border style="width: 100%;margin-top: 10px;">
            <el-table-column label="序号" width="70" align="center">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="className" label="班级" />
            <el-table-column prop="stuId" label="学号" />
            <el-table-column prop="exam" label="考试" />
            <el-table-column prop="grade" label="分数" />
        </el-table>
    </div>
</template>
<script>
import api from '@/api/system/teacher'
export default {
    // 定义数据模型
    data() {
        return {
            listLoading: false,
            stuList: [],
        }
    },
    //页面渲染之前获取数据
    created() {
        this.fetchData()
    },
    // 定义方法
    methods: {
        fetchData() {
            this.listLoading = true;
            api.getStuList().then(res => {
                let stuList = { stuList: res.data };
                api.getFinalStuList(stuList).then(res => {
                    this.stuList = res.data;
                    this.listLoading = false;
                    console.log(res.data);
                });
            });
        },
    }
}
</script>