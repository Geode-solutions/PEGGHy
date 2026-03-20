//oxlint-disable import/no-commonjs
//oxlint-disable oxc/func-names
//oxlint-disable unicorn/prefer-module

import { check_recaptcha_params } from "@geode/opengeodeweb-front/app/utils/recaptcha.js"
console.log("Module recaptcha chargé – top level log");

//exports.handler = async function (event, context) {
  //console.log("Handler démarré !");
  //console.log("Event:", JSON.stringify(event));
  //return {
    //statusCode: 200,
    //body: JSON.stringify({ message: "Test minimal OK – pas de 502" })
  //};
//};

exports.handler = async function (event) {
  console.log("body", event.body)
  const { name, email, launch } = JSON.parse(event.body)
  console.log(name, email, launch)
  //return check_recaptcha_params(name, email, launch)
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Test minimal OK – pas de 502" })
  };
}
