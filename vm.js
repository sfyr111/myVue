import Vue from './mvvm/mvvm'

let vm = new Vue({
  el: '#app',
  data: {
    testA: 'i am testA',
    testB: 'i am testB',
  },
})


button.addEventListener('click', () => {
  console.log('click')
  vm._data.testA = 'testA change' + Math.random()
})

// vm._data.testB = 'testB change'

