// import { check_recaptcha_params } from "@geode/opengeodeweb-front/app/utils/recaptcha.js"

exports.handler = async function (event) {
  const body = event.body
  console.log("handler", { body })
  const { name, email, launch } = JSON.parse(body)
  console.log("handler", { name, email, launch })
  return { statusCode: 200, body: JSON.stringify({ message: "OK" }) }
  // return check_recaptcha_params(name, email, launch)
}
