// import { check_recaptcha_params } from "@geode/opengeodeweb-front/app/utils/recaptcha.js"

exports.handler = async function (event) {
  return { statusCode: 200, body: JSON.stringify({ message: "OK" }) }
  // const body = event.body
  // console.log("handler", { body })
  // const { name, email, launch } = JSON.parse(body)
  // return check_recaptcha_params(name, email, launch)
}
