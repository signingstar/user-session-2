import formValidator from "./form_validator"

const filterAndValidateFields = (bodyContent, cb) => {
  const { userid, fullname, password, telephone, confirmpassword } = bodyContent
  const {err, formData} = formValidator({ userid, fullname, password, telephone, confirmpassword })

  if(err) {
    return {err}
  }

  const name = fullname.split(" ")
  const last_name = name.pop()
  const first_name = name.join(' ')

  return { signupData: [first_name, last_name, userid, password] }
}

export default filterAndValidateFields
