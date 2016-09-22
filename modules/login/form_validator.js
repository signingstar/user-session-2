import validator from "validator"

const validateForm = (content) => {
  const { userid, password } = content

  return {loginData: [userid, password]}
}

export default validateForm
