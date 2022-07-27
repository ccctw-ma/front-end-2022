const Spinnies = require('spinnies')

const spinnies = new Spinnies()

spinnies.add('spinner', { text: "I'm a spinner" });
spinnies.add('spinner2', { text: "I'm another spinner" });
setTimeout(() => {
    spinnies.succeed('spinner', { text: "Success!" })
    spinnies.fail('spinner2', { text: 'Fail' })
}, 2000);