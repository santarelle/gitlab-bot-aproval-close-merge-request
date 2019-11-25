const request = require('request-promise-native')
const Gitlab = require('../infra')

class MergeRequests extends Gitlab {

    async all(project_id) {
        const url = `${this.url}/projects/${project_id}/merge_requests`
        return await request.get(url, {
            headers: this.header
        })
    }

    async opened(project_id, order_by = 'created_at', sort = 'desc') {
        const url = `${this.url}/projects/${project_id}/merge_requests?state=opened&order_by=${order_by}&sort=${sort}`
        const data = await request.get(url, {
            headers: this.header
        })
        if (data) return JSON.parse(data)
        else throw new Error('Merge requests not found')
    }

    async close(project_id, merge_request_iid) {
        const url = `${this.url}/projects/${project_id}/merge_requests/${merge_request_iid}`
        const data = await request.put(url, {
            headers: this.header,
            formData: {
                state_event: 'close'
            }
        })
        return data
    }

    async accept(project_id, merge_request_iid) {
        const url = `${this.url}/projects/${project_id}/merge_requests/${merge_request_iid}/merge`
        const data = await request.put(url, {
            headers: this.header
        })
        return data
    }

    async pipelines(project_id, merge_request_iid) {
        const url = `${this.url}/projects/${project_id}/merge_requests/${merge_request_iid}/pipelines`
        return await request.get(url, {
            headers: this.header
        })
    }
}

module.exports = MergeRequests
