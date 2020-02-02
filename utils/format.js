const libphone = require('libphonenumber-js')

exports.splitPhoneNumber = splitPhoneNumber
exports.textPlaceholder = textPlaceholder
exports.formatUserDetailName = formatUserDetailName
exports.formatUserDisplayName = formatUserDisplayName
exports.formatUserFullName = formatUserFullName

function textPlaceholder (format) {
  if (!format) return ''

  var args = Array.prototype.slice.call(arguments, 1)
  return format.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] !== 'undefined' ? args[number] : ''
  })
}

function splitPhoneNumber (value, country = 'VN') {
  const emptyValue = {
    phone: null,
    phoneCode: null,
    phoneNumber: null,
  }

  if (!value) return emptyValue

  const p = libphone.parsePhoneNumberFromString(value, country)

  if (!p) return emptyValue

  return {
    phone: p.nationalNumber,
    phoneCode: p.countryCallingCode,
    phoneNumber: p.number,
  }

  // if (value[0] === '+') value = value.substr(1)
  // if (value[0] === '0') value = value.substr(1)

  // const isLocal = value.startsWith(countryCode)

  // return {
  //   phone: value,
  //   phoneCode: countryCode,
  //   phoneNumber: isLocal ? value.substr(countryCode.length) : value
  // }
}

function formatUserDisplayName (userDetail) {
  return formatUserDetailName(userDetail, 'displayName')
}

function formatUserFullName (userDetail) {
  return formatUserDetailName(userDetail, 'fullName')
}

function formatUserDetailName (userDetail, field) {
  return textPlaceholder(userDetail[field], userDetail.firstName, userDetail.lastName)
}
