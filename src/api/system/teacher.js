import request from '@/utils/request'

const api_name = '/admin/teacher'

export default {
    getQuestionList(page, limit, question) {
        return request({
            url: `${api_name}/getQuestionList/${page}/${limit}`,
            method: 'get',
            params: question
        })
    },
    addQuestion(data) {
        return request({
            url: `${api_name}/addQuestion`,
            method: 'post',
            data
        })
    },
    updateQuestion(data) {
        return request({
            url: `${api_name}/updateQuestion`,
            method: 'post',
            data
        })
    },
    deleteQuestion(data) {
        return request({
            url: `${api_name}/deleteQuestion`,
            method: 'post',
            data
        })
    },

    getExamList() {
        return request({
            url: `${api_name}/getExamList`,
            method: 'get',
        })
    },
    addExam(data) {
        return request({
            url: `${api_name}/addExam`,
            method: 'post',
            data
        })
    },
    deleteExam(data) {
        return request({
            url: `${api_name}/deleteExam`,
            method: 'post',
            data
        })
    },
    updateExam(data) {
        return request({
            url: `${api_name}/updateExam`,
            method: 'post',
            data
        })
    },

    getPaperList() {
        return request({
            url: `${api_name}/getPaperList`,
            method: 'get',
        })
    },
    getPaperQuestion(data) {
        return request({
            url: `${api_name}/getPaperQuestion`,
            method: 'post',
            data
        })
    },
    addPaper(data) {
        return request({
            url: `${api_name}/addPaper`,
            method: 'post',
            data
        })
    },
    deletePaper(data) {
        return request({
            url: `${api_name}/deletePaper`,
            method: 'post',
            data
        })
    },
    updatePaper(data) {
        return request({
            url: `${api_name}/updatePaper`,
            method: 'post',
            data
        })
    },
    getStuList() {
        return request({
            url: `${api_name}/getStuList`,
            method: 'get',
        })
    },
    getAnswerList(data) {
        return request({
            url: `${api_name}/getAnswerList`,
            method: 'get',
            params: data
        })
    },
    checkAnswer(data) {
        return request({
            url: `${api_name}/checkAnswer`,
            method: 'post',
            data
        })
    },
    getFinalStuList(data) {
        return request({
            url: `${api_name}/getFinalStuList`,
            method: 'post',
            data
        })
    },
}