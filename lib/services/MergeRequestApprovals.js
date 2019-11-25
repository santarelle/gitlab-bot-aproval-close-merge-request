const request = require('request-promise-native')
const Gitlab = require('../infra')

class MergeRequestAprovals extends Gitlab {
    
    async approvals(project_id, merge_request_iid) {
        const url = `${this.url}/projects/${project_id}/merge_requests/${merge_request_iid}/approvals`
        return await request.get(url, {
            headers: this.header
        });
    }

    async approve(project_id, merge_request_iid) {
        const url = `${this.url}/projects/${project_id}/merge_requests/${merge_request_iid}/approve`
        const data = await request.put(url, {
            headers: this.header
        })
    }
}

module.exports = MergeRequestAprovals
