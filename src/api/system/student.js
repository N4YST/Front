import request from '@/utils/request'

const api_name = '/admin/student'

export default {
    getCourseList(page, limit, searchObj) {
        return request({
            url: `${api_name}/getCourseList/${page}/${limit}`,
            method: 'get',
            params: searchObj
        })
    },
    getExamList(page, limit, searchObj) {
        return request({
            url: `${api_name}/getExamList/${page}/${limit}`,
            method: 'get',
            params: searchObj
        })
    },
    getPaperList(course) {
        return request({
            url: `${api_name}/startExam`,
            method: 'post',
            data: course
        })
    },
    sendPaper(data) {
        return request({
            url: `${api_name}/sendPaper`,
            method: 'post',
            data
        })
    },
    getPracticeQestion(data) {
        return request({
            url: `${api_name}/practice`,
            method: 'get',
            params: data
        })
    },
    addExp(data) {
        return request({
            url: `${api_name}/addExp`,
            method: 'post',
            data
        })
    },
    getExpList(data) {
        return request({
            url: `${api_name}/getExpList`,
            method: 'get',
            params: data
        })
    },
    deleteExp(data) {
        return request({
            url: `${api_name}/deleteExp`,
            method: 'post',
            data
        })
    },
}
