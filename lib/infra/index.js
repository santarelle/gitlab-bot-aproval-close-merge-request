class Gitlab {
    constructor(url, private_token) {
        this.url = url + '/api/v4'
        this.header = { 'Private-Token': private_token }
    }
}

module.exports = Gitlab
