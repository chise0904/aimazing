

exports = module.exports = ErrorResp


function ErrorResp(code, message, details) {
    return {code: code, msg: message, details: details}
}
