const Gitlab = require('./lib')
const Cron = require('cron')

const config = require('dotenv').config().parsed

const gitlab_api = config.GITLAB_API
if (!gitlab_api) throw new Error('.env GITLAB_API is required.')

const private_token = config.PRIVATE_TOKEN
if (!private_token) throw new Error('.env PRIVATE_TOKEN is required.')

const project_id = encodeURIComponent(config.PROJECT_ID)
if (!project_id) throw new Error('.env PROJECT_ID is required.')

const apiMergeRequests = new Gitlab.MergeRequests(gitlab_api, private_token)
const apiMergeRequestAprovals = new Gitlab.MergeRequestApprovals(gitlab_api, private_token)

const start = async () => {
    const merge_requests = await apiMergeRequests.opened(project_id, 'created_at', 'asc')
    const merge = merge_requests.filter(mr => !mr.title.startsWith('WIP'))[0]
    if (!merge) return false
    console.log('MR current:', merge.title)

    if (merge.downvotes > 0) {
        try {
            await apiMergeRequests.close(project_id, merge.iid)
            console.log('MR closed:', 'downvotes > 1:', merge.title)
            return false
        } catch (err) {
            console.error(err)
            return false
        }
    }

    const pipelines = JSON.parse(await apiMergeRequests.pipelines(project_id, merge.iid))
    const pipe = pipelines[0]
    console.log('Pipe current:', pipe.ref, pipe.status)
    if (pipe.status === 'failed' || pipe.status === 'running') {
        return false
    }

    const approval = JSON.parse(await apiMergeRequestAprovals.approvals(project_id, merge.iid))
    console.log('Approval left:', approval.approvals_left)
    if (approval.approvals_left === 0) {
        try {
            await apiMergeRequests.accept(project_id, merge.iid)
            console.log('MR approved:', merge.title)
            return true
        } catch (err) {
            console.error(err)
            return false
        }
    } else {
        console.log('MR pendent to approval')
        return false
    }
}

const job = new Cron.CronJob({
    cronTime: '*/5 * * * *',
    onTick: function () {
        console.log('Start...')
        while (await start()) { }
        console.log('End')
    },
    start: true,
    timeZone: 'America/Manaus'
})

console.log('job status', job.running);
