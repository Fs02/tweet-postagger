var MultinomialHMM = require("multinomial-hmm")

function predicts(model, data) {
  let tag_accuracy = { 'right': 0, 'wrong': 0 }
  let twt_accuracy = { 'right': 0, 'wrong': 0 }

  let comparison = {
    truth: [],
    preds: []
  }

  for (let i = 0; i < data.length; ++i) {
    // console.log(data[i]["obs"]);
    // console.log(model.predict(data[i]["obs"]));
    let predicted = model.predict(data[i]["obs"])
    let right = 0
    let wrong = 0
    for (let j = 0; j < predicted.length; ++j) {
      if (predicted[j] == data[i]["tag"][j]) {
        right += 1
      } else {
        wrong += 1
      }
      comparison.truth.push(data[i]["tag"][j])
      comparison.preds.push(predicted[j])
    }
    tag_accuracy['right'] += right
    tag_accuracy['wrong'] += wrong
    if (right == predicted.length) {
      twt_accuracy['right'] += 1
    } else {
      twt_accuracy['wrong'] += 1
    }
    process.stdout.write(
      "[" + (i + 1) + "/" + data.length + "]" +
      " right: " + tag_accuracy['right'] +
      " wrong: " + tag_accuracy['wrong'] + "\r");
  }

  var fs = require("fs")
  fs.writeFile('comparison.json', JSON.stringify(comparison), 'utf8');

  console.log("");
  console.log("==> TAG Accuracy");
  console.log(tag_accuracy);
  total_tag = tag_accuracy['right'] + tag_accuracy['wrong'];
  console.log("Total: " + total_tag);
  console.log("Accuracy: " + tag_accuracy['right']/total_tag*100 + "%");
  console.log("");
  console.log("==> TWEET Accuracy");
  console.log(twt_accuracy);
  total_twt = twt_accuracy['right'] + twt_accuracy['wrong'];
  console.log("Total: " + total_twt);
  console.log("Accuracy: " + twt_accuracy['right']/total_twt*100 + "%");
}

var emission_probability = require('./dataEmissionProb.json')
var transition_probability = require('./dataTransitonProb.json')

let hmm = new MultinomialHMM({}, transition_probability, emission_probability)

// console.log('==> Predictiing on Training Data');
// let train = require('./state_observation_train.json')
// predicts(hmm, train);

console.log('==> Predictiing on Test Data');
let test = require('./state_observation_test.json')
predicts(hmm, test);
